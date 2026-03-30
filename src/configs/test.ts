import type {
  OptionsFiles,
  OptionsOverrides,
  TypedFlatConfigItem,
} from '../types';
import { GLOB_TESTS } from '../globs';
import { interopDefault } from '../utils';

export async function test(
  options: OptionsFiles & OptionsOverrides = {},
): Promise<TypedFlatConfigItem[]> {
  const { files = GLOB_TESTS, overrides = {} } = options;

  const pluginVitest = await interopDefault(import('@vitest/eslint-plugin'));

  return [
    {
      name: 'maston/test/setup',
      plugins: {
        test: pluginVitest,
      },
    },
    {
      files,
      name: 'maston/test/rules',
      rules: {
        'test/consistent-test-it': [
          'error',
          { fn: 'it', withinDescribe: 'it' },
        ],
        'test/no-identical-title': 'error',
        'test/no-import-node-test': 'error',
        'test/prefer-hooks-in-order': 'error',
        'test/prefer-lowercase-title': 'error',

        // Disables
        // eslint-disable-next-line unicorn/no-useless-spread
        ...{
          'antfu/no-top-level-await': 'off',
          'no-unused-expressions': 'off',
          'node/prefer-global/process': 'off',
          'ts/explicit-function-return-type': 'off',
        },

        ...overrides,
      },
    },
  ];
}
