import pluginYaml from 'eslint-plugin-yml';
import * as parserYaml from 'yaml-eslint-parser';

import type { OptionsFiles, OptionsOverrides, TypedFlatConfigItem } from '../types';
import { GLOB_YAML } from '../globs';

export function yaml(options: OptionsOverrides & OptionsFiles = {}): TypedFlatConfigItem[] {
  const { files = [GLOB_YAML], overrides = {} } = options;

  return [
    {
      name: 'maston/yaml/setup',
      plugins: {
        yaml: pluginYaml,
      },
    },
    {
      files,
      languageOptions: {
        parser: parserYaml,
      },
      name: 'maston/yaml/rules',
      rules: {
        'style/spaced-comment': 'off',

        'yaml/block-mapping': 'error',
        'yaml/block-sequence': 'error',
        'yaml/no-empty-key': 'error',
        'yaml/no-empty-sequence-entry': 'error',
        'yaml/no-irregular-whitespace': 'error',
        'yaml/plain-scalar': 'error',

        ...overrides,
      },
    },
  ];
}
