import createCommand from 'eslint-plugin-command/config';

import type { TypedFlatConfigItem } from '../types';

export function command(): TypedFlatConfigItem[] {
  return [
    {
      ...createCommand(),
      name: 'maston/command/rules',
    },
  ];
}
