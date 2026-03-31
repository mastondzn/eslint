import pluginJsonc from 'eslint-plugin-jsonc';

import type { OptionsFiles, OptionsOverrides, TypedFlatConfigItem } from '../types';
import { GLOB_JSON, GLOB_JSON5, GLOB_JSONC } from '../globs';

export function jsonc(options: OptionsFiles & OptionsOverrides = {}): TypedFlatConfigItem[] {
  const { files = [GLOB_JSON, GLOB_JSON5, GLOB_JSONC], overrides = {} } = options;

  return [
    {
      name: 'maston/jsonc/setup',
      plugins: {
        jsonc: pluginJsonc,
      },
    },
    {
      files,
      language: 'jsonc/x',
      name: 'maston/jsonc/rules',
      rules: {
        'jsonc/no-bigint-literals': 'error',
        'jsonc/no-binary-expression': 'error',
        'jsonc/no-binary-numeric-literals': 'error',
        'jsonc/no-dupe-keys': 'error',
        'jsonc/no-escape-sequence-in-identifier': 'error',
        'jsonc/no-floating-decimal': 'error',
        'jsonc/no-hexadecimal-numeric-literals': 'error',
        'jsonc/no-infinity': 'error',
        'jsonc/no-multi-str': 'error',
        'jsonc/no-nan': 'error',
        'jsonc/no-number-props': 'error',
        'jsonc/no-numeric-separators': 'error',
        'jsonc/no-octal': 'error',
        'jsonc/no-octal-escape': 'error',
        'jsonc/no-octal-numeric-literals': 'error',
        'jsonc/no-parenthesized': 'error',
        'jsonc/no-plus-sign': 'error',
        'jsonc/no-regexp-literals': 'error',
        'jsonc/no-sparse-arrays': 'error',
        'jsonc/no-template-literals': 'error',
        'jsonc/no-undefined-value': 'error',
        'jsonc/no-unicode-codepoint-escapes': 'error',
        'jsonc/no-useless-escape': 'error',
        'jsonc/space-unary-ops': 'error',
        'jsonc/valid-json-number': 'error',
        ...overrides,
      },
    },
  ];
}
