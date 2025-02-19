import { EOL } from 'os'; // \n compatible for macOS and Window

import config from '@/scripts/config';
import { runningOptimisation } from '@/scripts/processing/run';
import { ACTION_OPTIONS } from '@/types/enum';

(async () => {
    console.log(`Current configuration : ${EOL}`, config, EOL);
    await runningOptimisation(config, ACTION_OPTIONS.IMAGE)
        .then(() => console.log('Optimization complete!'))
        .catch((err) => console.error(err));
})();
