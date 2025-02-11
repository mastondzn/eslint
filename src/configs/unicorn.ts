import type { OptionsUnicorn, TypedFlatConfigItem } from '../types';
import { pluginUnicorn } from '../plugins';

export function unicorn(options: OptionsUnicorn = {}): TypedFlatConfigItem[] {
  const { allRecommended = true, overrides = {} } = options;

  return [
    {
      name: 'maston/unicorn/rules',
      plugins: {
        unicorn: pluginUnicorn,
      },
      rules: {
        ...(allRecommended
          ? pluginUnicorn.configs['flat/recommended'].rules
          : {}),

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
