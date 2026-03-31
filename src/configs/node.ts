import pluginNode from 'eslint-plugin-n';

import type { OptionsOverrides, TypedFlatConfigItem } from '../types';

export function node(options: OptionsOverrides = {}): TypedFlatConfigItem[] {
  const { overrides = {} } = options;

  return [
    {
      name: 'maston/node/setup',
      plugins: { node: pluginNode },
    },
    {
      name: 'maston/node/rules',
      rules: {
        'node/handle-callback-err': ['error', '^(err|error)$'],
        'node/no-deprecated-api': 'error',
        'node/no-exports-assign': 'error',
        'node/no-new-require': 'error',
        'node/no-path-concat': 'error',
        'node/prefer-global/buffer': ['error', 'never'],
        'node/process-exit-as-throw': 'error',

        ...overrides,
      },
    },
  ];
}
