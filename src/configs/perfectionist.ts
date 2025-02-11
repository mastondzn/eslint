import type { OptionsOverrides, TypedFlatConfigItem } from '../types';
import { pluginPerfectionist } from '../plugins';

/**
 * Perfectionist plugin for props and items sorting.
 *
 * @see https://github.com/azat-io/eslint-plugin-perfectionist
 */
export function perfectionist(
  options: OptionsOverrides = {},
): TypedFlatConfigItem[] {
  return [
    {
      name: 'maston/perfectionist/setup',
      plugins: {
        perfectionist: pluginPerfectionist,
      },
      rules: {
        'perfectionist/sort-exports': ['error', { groupKind: 'types-first' }],
        'perfectionist/sort-imports': [
          'error',
          {
            groups: [
              ['builtin-type'],
              { newlinesBetween: 'never' },
              ['builtin'],

              ['external-type'],
              { newlinesBetween: 'never' },
              ['external'],

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
        ...options.overrides,
      },
    },
  ];
}
