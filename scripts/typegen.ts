import { writeFile } from 'node:fs/promises';

import { flatConfigsToRulesDTS } from 'eslint-typegen/core';
import { builtinRules } from 'eslint/use-at-your-own-risk';

import {
  combine,
  comments,
  imports,
  javascript,
  jsdoc,
  jsonc,
  jsx,
  markdown,
  node,
  perfectionist,
  react,
  regexp,
  sortPackageJson,
  tailwindcss,
  test,
  toml,
  typescript,
  unicorn,
  yaml,
} from '../src';

const configs = await combine(
  {
    plugins: {
      '': {
        // eslint-disable-next-line ts/no-deprecated
        rules: Object.fromEntries(builtinRules.entries()),
      },
    },
  },
  comments(),
  imports(),
  javascript(),
  jsx(),
  jsdoc(),
  jsonc(),
  markdown(),
  node(),
  perfectionist(),
  react(),
  sortPackageJson(),
  test(),
  toml(),
  regexp(),
  typescript(),
  unicorn(),
  tailwindcss(),
  yaml(),
);

const configNames = configs.map((i) => i.name).filter(Boolean) as string[];

let dts = await flatConfigsToRulesDTS(configs, {
  includeAugmentation: false,
});

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map((i) => `'${i}'`).join(' | ')}
`;

await writeFile('src/typegen.d.ts', dts);
