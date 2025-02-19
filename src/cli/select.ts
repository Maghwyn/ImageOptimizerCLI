import { select, isCancel } from '@clack/prompts';

import { type FormatType } from '@/types';
import { ACTION_OPTIONS, FORMAT_OPTIONS } from '@/types/enum';
import { CLIKill } from '@/cli/utils';

export const CLIActionPick = async () => {
    const action = (await select({
        message: 'What do you want to convert?',
        options: [
            { value: ACTION_OPTIONS.FOLDER, label: 'A folder' },
            { value: ACTION_OPTIONS.IMAGE, label: 'A file' },
        ],
    })) as ACTION_OPTIONS;

    if (isCancel(action)) CLIKill();

    return action;
};

export const CLIImageFormatPick = async () => {
    const action = (await select({
        message: 'Which format do you want to optimize to?',
        options: [
            { value: FORMAT_OPTIONS.PNG, label: 'PNG' },
            { value: FORMAT_OPTIONS.JPEG, label: 'JPEG' },
            { value: FORMAT_OPTIONS.WEBP, label: 'WebP' },
            { value: FORMAT_OPTIONS.AVIF, label: 'AVIF' },
        ],
    })) as FormatType;

    if (isCancel(action)) CLIKill();

    return action;
};
