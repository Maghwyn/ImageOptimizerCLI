import path from 'path';
import { EOL } from 'os'; // \n compatible for macOS and Window

import dotenv from 'dotenv';
import pc from 'picocolors';
import { intro, confirm, isCancel, log } from '@clack/prompts';

import { type Configuration } from '@/types';
import type { ACTION_OPTIONS } from '@/types/enum';
import {
    setupInputPath,
    setupIsLossless,
    setupOutputPath,
    setupQuality,
} from '@/cli/configuration';
import { CLIActionPick, CLIImageFormatPick } from '@/cli/select';
import { CLIKill } from '@/cli/utils';
import { runningOptimisation } from '@/scripts/processing/run';

dotenv.config();

let storedConfig: Configuration | null = null;

const CLIPrepare = async () => {
    intro(pc.bgBlue('Image Optimizer CLI'));
    await CLISetupProcess(true);
};

const CLISetupProcess = async (defaultEnv: boolean) => {
    while (true) {
        //! Step 1 - Pick Action & Format
        const action = await CLIActionPick();
        const format = await CLIImageFormatPick();

        //! Step 2 - Load Config
        storedConfig = defaultEnv
            ? await CLIConfigPreparation(action)
            : await CLIConfigurationSetup(false, action);
        storedConfig.FORMAT = format;
        defaultEnv = false;

        //! Step 3 - Confirm Config
        const confirmed = await CLIPreOptiConfirm(storedConfig);

        //! Optional - If rejected, restart setup
        if (!confirmed) {
            log.info('Restarting configuration...');
            continue;
        }

        //! Step 4 - Running optimisation
        log.success(
            pc.green('Configuration confirmed! Starting optimization...'),
        );
        const length = await runningOptimisation(storedConfig, action);

        //! Step 5 - Loop
        const willContinue = (await confirm({
            message: pc.green(
                `${length} files optimized to ${storedConfig.FORMAT}! Would you like to continue ?`,
            ),
        })) as boolean;

        if (isCancel(willContinue) || !willContinue) CLIKill();
    }
};

const CLIConfigPreparation = async (action: ACTION_OPTIONS) => {
    const useEnv = (await confirm({
        message: 'Do you want to use the .env configuration?',
    })) as boolean;

    if (isCancel(useEnv)) CLIKill();

    return CLIConfigurationSetup(useEnv, action);
};

const CLIConfigurationSetup = async (
    useEnv: boolean,
    action: ACTION_OPTIONS,
) => {
    let INPUT_PATH = useEnv
        ? process.env.INPUT_PATH?.trim()
        : (storedConfig?.INPUT_PATH ?? '');
    let OUTPUT_PATH = useEnv
        ? process.env.OUTPUT_PATH?.trim()
        : (storedConfig?.OUTPUT_PATH ?? path.join(process.cwd(), 'output'));
    let ISLOSSLESS = useEnv
        ? process.env.ISLOSSLESS?.trim()
        : (storedConfig?.ISLOSSLESS ?? false);
    let QUALITY = useEnv
        ? process.env.QUALITY?.trim()
        : (storedConfig?.QUALITY ?? 80);

    INPUT_PATH = await setupInputPath(useEnv, action, INPUT_PATH);
    OUTPUT_PATH = await setupOutputPath(useEnv, OUTPUT_PATH);
    ISLOSSLESS = await setupIsLossless(useEnv, ISLOSSLESS);
    QUALITY = await setupQuality(useEnv, QUALITY);

    return { INPUT_PATH, OUTPUT_PATH, ISLOSSLESS, QUALITY };
};

const CLIPreOptiConfirm = async (config: Configuration) => {
    const confirmed = await confirm({
        message:
            'Confirm configuration:' +
            `${EOL}${EOL}Paths :` +
            `${EOL}${pc.cyan(`Input: ${config.INPUT_PATH}`)}` +
            `${EOL}${pc.green(`Output: ${config.OUTPUT_PATH}`)}` +
            `${EOL}${EOL}Optimisation :` +
            `${EOL}${pc.magenta(`Format: ${config.FORMAT}`)}` +
            `${EOL}${pc.magenta(`Lossless: ${config.ISLOSSLESS ? 'Yes' : 'No'}`)}` +
            `${EOL}${pc.magenta(`Quality: ${config.QUALITY}`)}` +
            `${EOL}`,
    });

    if (isCancel(confirmed)) CLIKill();

    return confirmed;
};

CLIPrepare().catch((err) => console.error(err));
