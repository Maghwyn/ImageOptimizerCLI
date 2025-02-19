import { EOL } from 'os'; // \n compatible for macOS and Window

import pc from 'picocolors';

import { type Configuration } from '@/types';

export const getVisualConfig = (config: Configuration) => {
    return (
        `${EOL}${EOL}Paths :` +
        `${EOL}${pc.cyan(`Input: ${config.INPUT_PATH}`)}` +
        `${EOL}${pc.green(`Output: ${config.OUTPUT_PATH}`)}` +
        `${EOL}${EOL}Optimisation :` +
        `${EOL}${pc.magenta(`Format: ${config.FORMAT}`)}` +
        `${EOL}${pc.magenta(`Lossless: ${config.ISLOSSLESS ? 'Yes' : 'No'}`)}` +
        `${EOL}${pc.magenta(`Quality: ${config.QUALITY}`)}` +
        `${EOL}`
    );
};
