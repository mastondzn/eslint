import { ensurePackages, interopDefault } from '../utils';
import type { FlatConfigItem, OptionsOverrides, OptionsStylistic } from '../types';
import { StylisticConfigDefaults } from '.';

export async function unicorn(
  options: OptionsOverrides & OptionsStylistic = {},
): Promise<FlatConfigItem[]> {
  const {
    overrides = {},
    stylistic,
  } = options;

  const { indent = 4 } = typeof stylistic === 'boolean'
    ? StylisticConfigDefaults
    : {
        ...StylisticConfigDefaults,
        ...stylistic,
      };

  await ensurePackages([
    'eslint-plugin-unicorn',
  ]);

  // @ts-expect-error no types
  const pluginUnicorn = await interopDefault(import('eslint-plugin-unicorn'));

  return [
    {
      name: 'antfu:unicorn',
      plugins: {
        unicorn: pluginUnicorn,
      },
      rules: {
        ...pluginUnicorn.configs.recommended.rules as object,

        // Pass error message when throwing errors
        'unicorn/error-message': 'error',
        // Uppercase regex escapes
        'unicorn/escape-case': 'error',
        // Array reduce is allowed
        'unicorn/no-array-reduce': 'off',
        'unicorn/no-await-expression-member': 'off',
        // Array.isArray instead of instanceof
        'unicorn/no-instanceof-array': 'error',
        // Ban `new Array` as `Array` constructor's params are ambiguous
        'unicorn/no-new-array': 'error',
        // Prevent deprecated `new Buffer()`
        'unicorn/no-new-buffer': 'error',
        // Allow null
        'unicorn/no-null': 'off',
        'unicorn/no-object-as-default-parameter': 'off',
        'unicorn/no-process-exit': 'off',
        // Lowercase number formatting for octal, hex, binary (0x1'error' instead of 0X1'error')
        'unicorn/number-literal-case': 'error',
        // textContent instead of innerText
        'unicorn/prefer-dom-node-text-content': 'error',
        // includes over indexOf when checking for existence
        'unicorn/prefer-includes': 'error',
        'unicorn/prefer-module': 'off',
        // Prefer using the node: protocol
        'unicorn/prefer-node-protocol': 'error',
        // Prefer using number properties like `Number.isNaN` rather than `isNaN`
        'unicorn/prefer-number-properties': 'error',
        // String methods startsWith/endsWith instead of more complicated stuff
        'unicorn/prefer-string-starts-ends-with': 'error',
        // Allow top level await
        'unicorn/prefer-top-level-await': 'off',
        // Enforce throwing type error when throwing error while checking typeof
        'unicorn/prefer-type-error': 'error',
        'unicorn/prevent-abbreviations': 'warn',
        'unicorn/template-indent': ['warn', {
          indent: indent === 'tab' ? '\t' : indent,
        }],
        // Use new when throwing error
        'unicorn/throw-new-error': 'error',

        ...overrides,
      },
    },
  ];
}
