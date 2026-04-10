import pluginUnicorn from 'eslint-plugin-unicorn';

import type { OptionsOverrides, TypedFlatConfigItem } from '../types';

export function unicorn(options: OptionsOverrides = {}): TypedFlatConfigItem[] {
  const { overrides = {} } = options;

  return [
    {
      name: 'maston/unicorn/setup',
      plugins: { unicorn: pluginUnicorn },
    },
    {
      name: 'maston/unicorn/rules',
      rules: {
        ...pluginUnicorn.configs.unopinionated.rules,

        'unicorn/filename-case': ['error', { case: 'kebabCase', ignore: [/\.md$/] }],
        'unicorn/no-object-as-default-parameter': 'off',
        // this one conflicts with prettier
        'unicorn/number-literal-case': 'off',

        ...overrides,
      },
    },
  ];
}
