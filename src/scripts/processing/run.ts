import { type Configuration } from '@/types';
import { ACTION_OPTIONS } from '@/types/enum';
import { processFolder, processImage } from '@/scripts/processing';

export const runningOptimisation = async (
    config: Configuration,
    action: ACTION_OPTIONS,
) => {
    switch (action) {
        case ACTION_OPTIONS.FOLDER: {
            return await processFolder(config);
        }
        case ACTION_OPTIONS.IMAGE: {
            return await processImage(config);
        }
    }
};
