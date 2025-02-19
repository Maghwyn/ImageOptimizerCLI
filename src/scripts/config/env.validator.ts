import { EOL } from 'os'; // \n compatible for macOS and Window
import dotenv from 'dotenv';

dotenv.config();

const envsToCheck = ['INPUT_PATH', 'FORMAT'];

const missing = [];
for (const checked of envsToCheck) {
    if (!process.env[checked])
        missing.push(`unset variable in .env : ${checked}`);
}

if (missing.length > 0) {
    throw new Error(`${EOL}${missing.join(EOL)}${EOL}${EOL}Trace:`);
}
