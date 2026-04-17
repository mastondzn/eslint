import { builtinCommands } from 'eslint-plugin-command/commands';
import createConfig from 'eslint-plugin-command/config';

import type { TypedFlatConfigItem } from '../types';
import * as commands from '../commands';

export function command(): TypedFlatConfigItem[] {
  const config = createConfig({
    commands: [...builtinCommands, ...Object.values(commands)],
  });

  return [
    {
      ...config,
      name: 'maston/command/rules',
    },
  ];
}
