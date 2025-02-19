import path from 'path';

import '@/scripts/config/env.validator';
import { type FormatType, type Configuration } from '@/types';

export default {
    INPUT_PATH: process.env.INPUT_PATH?.trim() ?? '',
    OUTPUT_PATH:
        process.env.OUTPUT_PATH?.trim() ?? path.join(process.cwd(), 'output'),
    FORMAT: (process.env.FORMAT?.trim() as FormatType) ?? 'jpeg',
    ISLOSSLESS: process.env.ISLOSSLESS?.trim() == 'true', // default resolve to false
    QUALITY: parseInt(process.env.QUALITY?.trim() ?? '80'),
} satisfies Configuration;
