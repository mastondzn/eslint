import pluginComments from '@eslint-community/eslint-plugin-eslint-comments';

import type { TypedFlatConfigItem } from '../types';

export function comments(): TypedFlatConfigItem[] {
  return [
    {
      name: 'maston/eslint-comments/setup',
      plugins: { 'eslint-comments': pluginComments },
    },
    {
      name: 'maston/eslint-comments/rules',
      rules: {
        'eslint-comments/no-aggregating-enable': 'error',
        'eslint-comments/no-duplicate-disable': 'error',
        'eslint-comments/no-unlimited-disable': 'error',
        'eslint-comments/no-unused-enable': 'error',
      },
    },
  ];
}
