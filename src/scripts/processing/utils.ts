import fs from 'fs/promises';
import path from 'path';

import { type FilePath } from '@/types';

export const getAllFilesAndFoldersInside = async (
    srcDir: string,
    destDir: string,
) => {
    const items = await fs.readdir(srcDir, { withFileTypes: true });
    const folders: string[] = [];
    const files: FilePath[] = [];

    for (const item of items) {
        const srcPath = path.join(srcDir, item.name);
        const destPath = path.join(destDir, item.name);

        if (item.isDirectory()) {
            folders.push(destPath);

            const nested = await getAllFilesAndFoldersInside(srcPath, destPath);
            folders.push(...nested.folders);
            files.push(...nested.files);
        } else {
            files.push({ src: srcPath, dest: destPath });
        }
    }

    return { folders, files };
};
