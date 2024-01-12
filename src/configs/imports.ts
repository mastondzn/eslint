import { GLOB_SRC_EXT } from '../globs';
import { pluginAntfu, pluginImport } from '../plugins';
import type { FlatConfigItem, OptionsStylistic } from '../types';

export async function imports(options: OptionsStylistic = {}): Promise<FlatConfigItem[]> {
  const {
    stylistic = true,
  } = options;

  return [
    {
      name: 'antfu:imports',
      plugins: {
        antfu: pluginAntfu,
        import: pluginImport,
      },
      rules: {
        'antfu/import-dedupe': 'error',
        'antfu/no-import-dist': 'error',
        'antfu/no-import-node-modules-by-path': 'error',

        'import/first': 'error',
        'import/no-duplicates': 'error',
        'import/no-mutable-exports': 'error',
        'import/no-named-default': 'error',
        'import/no-self-import': 'error',
        'import/no-webpack-loader-syntax': 'error',
        'import/order': ['error', {
          'alphabetize': {
            caseInsensitive: true,
            order: 'asc',
          },
          'groups': [
            'builtin',
            'external',
            ['internal', 'parent', 'sibling', 'index'],
          ],
          'newlines-between': 'always',
          'pathGroups': [
            {
              group: 'internal',
              pattern: '~/**',
            },
          ],
        }],

        ...stylistic
          ? {
              'import/newline-after-import': ['error', { considerComments: true, count: 1 }],
            }
          : {},
      },
    },
    {
      files: ['**/bin/**/*', `**/bin.${GLOB_SRC_EXT}`],
      name: 'antfu:imports:bin',
      rules: {
        'antfu/no-import-dist': 'off',
        'antfu/no-import-node-modules-by-path': 'off',
      },
    },
  ];
}
