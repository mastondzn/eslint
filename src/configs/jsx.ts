import type { TypedFlatConfigItem } from '../types';
import { GLOB_JSX, GLOB_TSX } from '../globs';

export function jsx(): TypedFlatConfigItem[] {
  return [
    {
      files: [GLOB_JSX, GLOB_TSX],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
      name: 'maston/jsx/setup',
    },
  ];
}
