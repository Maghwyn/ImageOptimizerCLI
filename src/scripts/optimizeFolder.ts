import { EOL } from 'os'; // \n compatible for macOS and Window

import pc from 'picocolors';

import config from '@/scripts/config';
import { runningOptimisation } from '@/scripts/processing/run';
import { getVisualConfig } from '@/scripts/utils';
import { ACTION_OPTIONS } from '@/types/enum';

(async () => {
    if (config.INPUT_PATH === config.OUTPUT_PATH) {
        console.error(
            pc.red(
                'OUTPUT_PATH value must be different than INPUT_PATH value.',
            ),
        );
        return;
    }

    console.log(
        pc.green(`Configuration loaded! Starting optimization... ${EOL}`),
    );
    console.log(`Current configuration :`, getVisualConfig(config));
    await runningOptimisation(config, ACTION_OPTIONS.FOLDER)
        .then(() => console.log(pc.green('Optimization complete!')))
        .catch((err) => console.error(pc.red(err)));
})();
