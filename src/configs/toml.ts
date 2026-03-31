import pluginToml from 'eslint-plugin-toml';
import * as parserToml from 'toml-eslint-parser';

import type { OptionsFiles, OptionsOverrides, TypedFlatConfigItem } from '../types';
import { GLOB_TOML } from '../globs';

export function toml(options: OptionsOverrides & OptionsFiles = {}): TypedFlatConfigItem[] {
  const { files = [GLOB_TOML], overrides = {} } = options;

  return [
    {
      name: 'maston/toml/setup',
      plugins: {
        toml: pluginToml,
      },
    },
    {
      files,
      languageOptions: {
        parser: parserToml,
      },
      name: 'maston/toml/rules',
      rules: {
        'style/spaced-comment': 'off',

        'toml/comma-style': 'error',
        'toml/keys-order': 'error',
        'toml/no-space-dots': 'error',
        'toml/no-unreadable-number-separator': 'error',
        'toml/precision-of-fractional-seconds': 'error',
        'toml/precision-of-integer': 'error',
        'toml/tables-order': 'error',
        ...overrides,
      },
    },
  ];
}
