import type { OptionsOverrides, TypedFlatConfigItem } from '../types';
import { pluginPerfectionist } from '../plugins';

/**
 * Perfectionist plugin for props and items sorting.
 *
 * @see https://github.com/azat-io/eslint-plugin-perfectionist
 */
export async function perfectionist(
  options: OptionsOverrides,
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {} } = options;

  return [
    {
      name: 'antfu/perfectionist/setup',
      plugins: {
        perfectionist: pluginPerfectionist,
      },
      rules: {
        'perfectionist/sort-exports': ['error', { groupKind: 'types-first' }],
        'perfectionist/sort-imports': [
          'error',
          {
            groups: [
              'type',
              'builtin',
              'external',
              ['internal-type', 'parent-type', 'sibling-type', 'index-type'],
              { newlinesBetween: 'never' },
              ['internal', 'parent', 'sibling', 'index'],
              'object',
              'side-effect',
              'unknown',
            ],
            newlinesBetween: 'always',
          },
        ],
        'perfectionist/sort-named-exports': [
          'error',
          { groupKind: 'types-first' },
        ],
        'perfectionist/sort-named-imports': [
          'error',
          { groupKind: 'types-first' },
        ],
        ...overrides,
      },
    },
  ];
}
