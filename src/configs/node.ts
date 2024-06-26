import { pluginNode } from '../plugins';
import type { FlatConfigItem } from '../types';

export async function node(): Promise<FlatConfigItem[]> {
  return [
    {
      name: 'antfu:node',
      plugins: {
        node: pluginNode,
      },
      rules: {
        'node/handle-callback-err': ['error', '^(err|error)$'],
        'node/no-deprecated-api': 'error',
        'node/no-exports-assign': 'error',
        'node/no-new-require': 'error',
        'node/no-path-concat': 'error',
        'node/prefer-global/buffer': ['error', 'never'],
        'node/prefer-global/process': ['error', 'always'],
        'node/process-exit-as-throw': 'error',
      },
    },
  ];
}
