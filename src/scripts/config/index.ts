import path from 'path';

import '@/scripts/config/env.validator';
import { type FormatType, type Configuration } from '@/types';

export default {
    INPUT_PATH: process.env.INPUT_PATH ?? '',
    OUTPUT_PATH: process.env.OUTPUT_PATH ?? path.join(process.cwd(), 'output'),
    FORMAT: (process.env.FORMAT as FormatType) ?? 'jpeg',
    ISLOSSLESS: process.env.ISLOSSLESS == 'true', // default resolve to false
    QUALITY: parseInt(process.env.QUALITY ?? '80'),
} satisfies Configuration;
