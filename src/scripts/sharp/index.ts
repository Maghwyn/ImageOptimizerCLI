import sharp from 'sharp';

import { type Configuration } from '@/types';

export const optimizeImage = async (
    src: string,
    dest: string,
    config: Configuration,
) => {
    const newDest = dest.replace(
        /\.(png|jpe?g|webp|avif)$/,
        `.${config.FORMAT}`,
    );

    await sharp(src)
        .toFormat(config.FORMAT!, {
            quality: config.QUALITY,
            lossless: config.ISLOSSLESS,
        })
        .toFile(newDest);
};
