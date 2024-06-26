import { pluginAntfu } from '../plugins';
import type { FlatConfigItem, OptionsOverrides, StylisticConfig } from '../types';
import { interopDefault } from '../utils';

export const StylisticConfigDefaults: Required<StylisticConfig> = {
  indent: 4,
  jsx: true,
  quotes: 'single',
  semi: true,
};

export async function stylistic(
  options: StylisticConfig & OptionsOverrides = {},
): Promise<FlatConfigItem[]> {
  const {
    indent,
    jsx,
    overrides = {},
    quotes,
    semi,
  } = {
    ...StylisticConfigDefaults,
    ...options,
  };

  const pluginStylistic = await interopDefault(import('@stylistic/eslint-plugin'));

  const config = pluginStylistic.configs.customize({
    flat: true,
    indent,
    jsx,
    pluginName: 'style',
    quotes,
    semi,
  });

  return [
    {
      name: 'antfu:stylistic',
      plugins: {
        antfu: pluginAntfu,
        style: pluginStylistic,
      },
      rules: {
        ...config.rules,

        'antfu/consistent-list-newline': 'error',

        'curly': ['error', 'multi-line', 'consistent'],
        'style/brace-style': ['error', '1tbs', {
          allowSingleLine: true,
        }],
        'style/member-delimiter-style': ['error', {
          multiline: {
            delimiter: 'semi',
            requireLast: true,
          },
          multilineDetection: 'brackets',
          singleline: {
            delimiter: 'semi',
            requireLast: true,
          },
        }],

        ...overrides,
      },
    },
  ];
}
