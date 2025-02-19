import path from 'path';
import fs from 'fs';

import { confirm, isCancel, log, text } from '@clack/prompts';

import { CLIKill } from '@/cli/utils';
import { ACTION_OPTIONS } from '@/types/enum';

const isWindows = process.platform === 'win32';
const defaultPlaceholder = isWindows ? 'C:\\path\\to\\input' : '/path/to/input';

export const setupInputPath = async (
    useEnv: boolean,
    action: ACTION_OPTIONS,
    absPath: string | undefined,
) => {
    const message = absPath
        ? 'Confirm the input path:'
        : 'Enter the input path:';
    if (!absPath && useEnv) log.warn('Could not find INPUT_PATH in .env');

    const data = (await text({
        message,
        placeholder: defaultPlaceholder,
        initialValue: absPath,
        validate: (value) => {
            const trimmedValue = value.trim();
            if (trimmedValue === '') return 'Input path is required';

            try {
                const stat = fs.statSync(trimmedValue);
                if (action === ACTION_OPTIONS.FOLDER && !stat.isDirectory())
                    return 'Path must be a folder';
                if (action === ACTION_OPTIONS.IMAGE && !stat.isFile())
                    return 'Path must be a file';
            } catch {
                return 'Invalid path: does not exist';
            }
        },
    })) as string;

    if (isCancel(data)) CLIKill();

    return data;
};

export const setupOutputPath = async (
    useEnv: boolean,
    absPath: string | undefined,
) => {
    const newAbsPath = absPath ?? path.join(process.cwd(), 'output');

    if (useEnv) {
        if (!absPath) {
            log.warn('Could not find OUTPUT_PATH in .env, using default');
        }

        return newAbsPath;
    }

    const data = (await text({
        message: 'Enter the output path:',
        placeholder: defaultPlaceholder,
        initialValue: newAbsPath,
        validate: (value) =>
            value.trim() === '' ? 'Ouput path is required' : undefined,
    })) as string;

    if (isCancel(data)) CLIKill();

    return data;
};

export const setupIsLossless = async (
    useEnv: boolean,
    value: string | boolean | undefined,
) => {
    if (useEnv) {
        if (value === undefined || value === '') {
            log.warn('Could not find ISLOSSLESS in .env, using default');
        }

        return value === 'true'; // default to false
    }

    const data = (await confirm({
        message: 'Use lossless optimization?',
        initialValue: value as boolean,
    })) as boolean;

    if (isCancel(data)) CLIKill();

    return data;
};

export const setupQuality = async (
    useEnv: boolean,
    value: string | number | undefined,
) => {
    if (useEnv) {
        if (value === undefined || value === '') {
            log.warn('Could not find QUALITY in .env, using default');
        }

        const data = parseInt((value as string) ?? '80'); // default to 80

        if (data < 0) {
            log.warn('Quality was under 0, defaulted to 80');
            return 80;
        }

        if (data > 100) {
            log.warn('Quality was above 100, defaulted to 100');
            return 100;
        }

        return data;
    }

    const data = parseInt(
        (await text({
            message: 'Enter image quality (0-100):',
            placeholder: '80',
            initialValue: value!.toString(),
            validate: (value) => {
                const num = parseInt(value);
                if (isNaN(num)) return 'Quality must be a number';
                if (num < 0 || num > 100)
                    return 'Quality must be between 0 and 100';
            },
        })) as string,
    );

    if (isCancel(data)) CLIKill();

    return data;
};
