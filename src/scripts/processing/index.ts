import fs from 'fs/promises';
import path from 'path';

import colors from 'ansi-colors';
import { SingleBar, Presets } from 'cli-progress';

import { type FilePath, type Configuration } from '@/types';
import { getAllFilesAndFoldersInside } from '@/scripts/processing/utils';
import { optimizeImage } from '@/scripts/sharp';

const validExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif']);

const processFolderProgress = async (
    config: Configuration,
    entries: string[],
) => {
    const progressBar = new SingleBar(
        {
            format: `Creating/Checking folders ${colors.cyan('{bar}')} {percentage}% | {value}/{total} folders`,
            clearOnComplete: false,
        },
        Presets.rect,
    );

    progressBar.start(entries.length + 1, 0);

    const promises = [
        fs
            .mkdir(config.OUTPUT_PATH, { recursive: true })
            .then(() => progressBar.update(1)),
        ...entries.map((dir) =>
            fs
                .mkdir(dir, { recursive: true })
                .then(() => progressBar.increment()),
        ),
    ];

    await Promise.all(promises);
    progressBar.stop();
};

const processFilesProgress = async (
    config: Configuration,
    entries: FilePath[],
) => {
    let skippedFiles = 0;
    const progressBar = new SingleBar(
        {
            format: `Processing files ${colors.cyan('{bar}')} {percentage}% | {value}/{total} files`,
            clearOnComplete: false,
        },
        Presets.rect,
    );

    progressBar.start(entries.length, 0);

    const promises = entries.map(async (absPath) => {
        const ext = path.extname(absPath.src).toLowerCase();

        if (validExtensions.has(ext)) {
            await optimizeImage(absPath.src, absPath.dest, config);
        } else {
            await fs.copyFile(absPath.src, absPath.dest);
            skippedFiles++;
        }

        progressBar.increment();
    });

    await Promise.all(promises);
    progressBar.stop();

    return skippedFiles;
};

export const processFolder = async (config: Configuration) => {
    const { files, folders } = await getAllFilesAndFoldersInside(
        config.INPUT_PATH,
        config.OUTPUT_PATH,
    );

    await processFolderProgress(config, folders);
    const skippedFiles = await processFilesProgress(config, files);
    return files.length - skippedFiles;
};

export const processImage = async (config: Configuration) => {
    const ext = path.extname(config.INPUT_PATH).toLowerCase();

    if (validExtensions.has(ext)) {
        await optimizeImage(config.INPUT_PATH, config.OUTPUT_PATH, config);
        return 1;
    } else {
        console.log(`Unsupported file type: ${config.INPUT_PATH}`);
        return 0;
    }
};
