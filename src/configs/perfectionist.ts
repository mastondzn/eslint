import pluginPerfectionist from 'eslint-plugin-perfectionist';

import type { OptionsOverrides, TypedFlatConfigItem } from '../types';

/**
 * Perfectionist plugin for props and items sorting.
 *
 * @see https://github.com/azat-io/eslint-plugin-perfectionist
 */
export function perfectionist(
  options: OptionsOverrides = {},
): TypedFlatConfigItem[] {
  // console.log(Object.keys(pluginPerfectionist.configs));
  return [
    {
      name: 'maston/perfectionist/setup',
      plugins: {
        perfectionist: pluginPerfectionist,
      },
      rules: {
        'perfectionist/sort-exports': [
          'error',
          { groups: [['type-export'], ['value-export']], type: 'unsorted' },
        ],
        'perfectionist/sort-imports': [
          'error',
          {
            groups: [
              ['type-builtin'],
              { newlinesBetween: 0 },
              ['builtin'],

              ['type-external'],
              { newlinesBetween: 0 },
              ['external'],

              ['type-internal', 'type-parent', 'type-sibling', 'type-index'],
              { newlinesBetween: 0 },
              ['internal', 'parent', 'sibling', 'index'],

              'ts-equals-import',
              'side-effect',
              'unknown',
            ],
            newlinesBetween: 1,
          },
        ],

        ...options.overrides,
      },
    },
  ];
}
