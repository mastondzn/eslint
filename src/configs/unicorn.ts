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
        ...pluginUnicorn.configs.recommended.rules,

        'unicorn/no-array-reduce': 'off',
        'unicorn/no-await-expression-member': 'off',
        'unicorn/no-nested-ternary': 'off',
        'unicorn/no-null': 'off',
        'unicorn/no-object-as-default-parameter': 'off',
        'unicorn/no-process-exit': 'off',
        // this one conflicts with prettier
        'unicorn/number-literal-case': 'off',
        'unicorn/prefer-module': 'off',
        'unicorn/prefer-spread': 'off',
        'unicorn/prefer-top-level-await': 'off',
        'unicorn/prevent-abbreviations': 'off',
        'unicorn/template-indent': 'off',

        ...overrides,
      },
    },
  ];
}
