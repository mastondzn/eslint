import { GLOB_SRC_EXT } from '../globs';
import { pluginAntfu, pluginImport } from '../plugins';
import type { FlatConfigItem } from '../types';

export async function imports(): Promise<FlatConfigItem[]> {
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
        'import/newline-after-import': ['error', { considerComments: true, count: 1 }],
        'import/no-duplicates': ['error', { 'prefer-inline': true }],
        'import/no-mutable-exports': 'error',
        'import/no-named-default': 'error',
        'import/no-self-import': 'error',
        'import/no-useless-path-segments': 'error',
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
      },
      settings: {
        'import/resolver': {
          typescript: true,
        },
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
