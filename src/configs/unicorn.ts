import type { OptionsUnicorn, TypedFlatConfigItem } from '../types';
import { pluginUnicorn } from '../plugins';

export async function unicorn(
  options: OptionsUnicorn = {},
): Promise<TypedFlatConfigItem[]> {
  const { allRecommended = true, overrides = {} } = options;

  return [
    {
      name: 'antfu/unicorn/rules',
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
        'unicorn/prefer-top-level-await': 'off',
        'unicorn/prevent-abbreviations': 'off',
        'unicorn/template-indent': 'off',

        ...overrides,
      },
    },
  ];
}
