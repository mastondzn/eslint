import { writeFile } from 'node:fs/promises';

import { flatConfigsToRulesDTS } from 'eslint-typegen/core';
import { builtinRules } from 'eslint/use-at-your-own-risk';

import {
  astro,
  combine,
  comments,
  imports,
  javascript,
  jsdoc,
  jsonc,
  jsx,
  markdown,
  next,
  node,
  perfectionist,
  react,
  regexp,
  solid,
  sortPackageJson,
  svelte,
  tailwindcss,
  test,
  toml,
  typescript,
  unicorn,
  unocss,
  vue,
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
  astro(),
  comments(),
  imports(),
  javascript(),
  jsx(),
  jsdoc(),
  jsonc(),
  markdown(),
  next(),
  node(),
  perfectionist(),
  react(),
  solid(),
  sortPackageJson(),
  svelte(),
  test(),
  toml(),
  regexp(),
  typescript(),
  unicorn(),
  unocss(),
  tailwindcss(),
  vue(),
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
