import type { FORMAT_OPTIONS } from './enum';

export type FormatType = `${FORMAT_OPTIONS}`;

export interface Configuration {
    INPUT_PATH: string;
    OUTPUT_PATH: string;
    FORMAT?: FormatType;
    ISLOSSLESS: boolean;
    QUALITY: number;
}

export interface FilePath {
    src: string;
    dest: string;
}
