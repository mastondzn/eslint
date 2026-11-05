import { writeFile } from 'node:fs/promises';

import { flatConfigsToRulesDTS } from 'eslint-typegen/core';
import { builtinRules } from 'eslint/use-at-your-own-risk';

import { combine } from '../src';

const configs = await combine(
  {
    plugins: {
      // eslint-disable-next-line ts/no-deprecated
      '': { rules: Object.fromEntries(builtinRules) },
    },
  },
  ...(await (async () => {
    const mod = await import('../src/configs');
    return Object.values(mod).map(async (fn) => fn());
  })()),
);

const configNames = configs.map((i) => i.name).filter(Boolean) as string[];

let dts = await flatConfigsToRulesDTS(configs, { includeAugmentation: false });

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map((i) => `'${i}'`).join(' | ')}
`;

await writeFile('src/typegen.d.ts', dts);
