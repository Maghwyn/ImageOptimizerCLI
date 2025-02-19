import pc from 'picocolors';
import { outro } from '@clack/prompts';

export const CLIKill = () => {
    outro(pc.bgBlue('See ya !'));
    process.exit(0);
};
