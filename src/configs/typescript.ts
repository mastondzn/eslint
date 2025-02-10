import type {
  OptionsComponentExts,
  OptionsFiles,
  OptionsOverrides,
  OptionsTypeScriptParserOptions,
  OptionsTypeScriptWithTypes,
  TypedFlatConfigItem,
} from '../types';
import { existsSync } from 'node:fs';
import process from 'node:process';
import { GLOB_ASTRO_TS, GLOB_MARKDOWN, GLOB_TS, GLOB_TSX } from '../globs';
import { pluginAntfu } from '../plugins';
import { interopDefault, renameRules } from '../utils';

export async function typescript(
  options: OptionsFiles &
    OptionsComponentExts &
    OptionsOverrides &
    OptionsTypeScriptWithTypes &
    OptionsTypeScriptParserOptions = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    componentExts = [],
    overrides = {},
    overridesTypeAware = {},
    parserOptions = {},
  } = options;

  const files = options.files ?? [
    GLOB_TS,
    GLOB_TSX,
    ...componentExts.map((ext) => `**/*.${ext}`),
  ];

  const filesTypeAware = options.filesTypeAware ?? [GLOB_TS, GLOB_TSX];
  const ignoresTypeAware = options.ignoresTypeAware ?? [
    `${GLOB_MARKDOWN}/**`,
    GLOB_ASTRO_TS,
  ];

  const tsconfigExists = existsSync(`${process.cwd()}/tsconfig.json`);

  const tsconfigPath =
    'tsconfigPath' in options
      ? options.tsconfigPath
      : tsconfigExists
        ? './tsconfig.json'
        : undefined;

  const isTypeAware = Boolean(tsconfigPath);

  const [pluginTs, parserTs] = await Promise.all([
    interopDefault(import('@typescript-eslint/eslint-plugin')),
    interopDefault(import('@typescript-eslint/parser')),
  ] as const);

  const rules: TypedFlatConfigItem['rules'] = {
    ...renameRules(
      // eslint-disable-next-line ts/no-non-null-assertion
      pluginTs.configs['eslint-recommended'].overrides![0].rules!,
      { '@typescript-eslint': 'ts' },
    ),
    // eslint-disable-next-line ts/no-non-null-assertion
    ...renameRules(pluginTs.configs.strict.rules!, {
      '@typescript-eslint': 'ts',
    }),
    // eslint-disable-next-line ts/no-non-null-assertion
    ...renameRules(pluginTs.configs.stylistic.rules!, {
      '@typescript-eslint': 'ts',
    }),

    'no-dupe-class-members': 'off',
    'no-redeclare': 'off',
    'no-use-before-define': 'off',
    'no-useless-constructor': 'off',
    'ts/ban-ts-comment': [
      'error',
      { 'ts-expect-error': 'allow-with-description' },
    ],
    'ts/consistent-type-definitions': ['error', 'interface'],
    'ts/consistent-type-imports': [
      'error',
      {
        disallowTypeAnnotations: false,
        fixStyle: 'separate-type-imports',
        prefer: 'type-imports',
      },
    ],

    'ts/method-signature-style': ['error', 'property'], // https://www.totaltypescript.com/method-shorthand-syntax-considered-harmful
    'ts/no-dupe-class-members': 'error',
    'ts/no-dynamic-delete': 'off',
    'ts/no-empty-object-type': ['error', { allowInterfaces: 'always' }],
    'ts/no-explicit-any': 'off',
    'ts/no-extraneous-class': 'off',
    'ts/no-import-type-side-effects': 'error',
    'ts/no-invalid-void-type': 'off',
    'ts/no-non-null-assertion': 'off',
    'ts/no-redeclare': ['error', { builtinGlobals: false }],
    'ts/no-require-imports': 'error',
    'ts/no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTaggedTemplates: true,
        allowTernary: true,
      },
    ],
    'ts/no-unused-vars': 'off',
    'ts/no-use-before-define': [
      'error',
      { classes: false, functions: false, variables: true },
    ],
    'ts/no-useless-constructor': 'off',
    'ts/no-wrapper-object-types': 'error',
    'ts/triple-slash-reference': 'off',
    'ts/unified-signatures': 'off',
  };

  const typeAwareRules: TypedFlatConfigItem['rules'] = {
    ...renameRules(
      // eslint-disable-next-line ts/no-non-null-assertion
      pluginTs.configs['eslint-recommended'].overrides![0].rules!,
      { '@typescript-eslint': 'ts' },
    ),
    // eslint-disable-next-line ts/no-non-null-assertion
    ...renameRules(pluginTs.configs['strict-type-checked'].rules!, {
      '@typescript-eslint': 'ts',
    }),
    // eslint-disable-next-line ts/no-non-null-assertion
    ...renameRules(pluginTs.configs['stylistic-type-checked'].rules!, {
      '@typescript-eslint': 'ts',
    }),

    'dot-notation': 'off',
    'no-implied-eval': 'off',
    'ts/await-thenable': 'error',
    'ts/dot-notation': ['error', { allowKeywords: true }],
    'ts/no-floating-promises': 'error',
    'ts/no-for-in-array': 'error',
    'ts/no-implied-eval': 'error',
    'ts/no-misused-promises': 'error',
    'ts/no-unnecessary-type-assertion': 'error',
    'ts/no-unsafe-argument': 'error',
    'ts/no-unsafe-assignment': 'error',
    'ts/no-unsafe-call': 'error',
    'ts/no-unsafe-member-access': 'error',
    'ts/no-unsafe-return': 'error',
    'ts/promise-function-async': 'error',
    'ts/restrict-plus-operands': 'error',
    'ts/restrict-template-expressions': 'error',
    'ts/return-await': ['error', 'in-try-catch'],
    'ts/switch-exhaustiveness-check': 'error',
    'ts/unbound-method': 'error',
  };

  function makeParser(
    typeAware: boolean,
    files: string[],
    ignores?: string[],
  ): TypedFlatConfigItem {
    return {
      files,
      ...(ignores ? { ignores } : {}),
      languageOptions: {
        parser: parserTs,
        parserOptions: {
          extraFileExtensions: componentExts.map((ext) => `.${ext}`),
          sourceType: 'module',
          ...(typeAware
            ? {
                projectService: {
                  allowDefaultProject: ['./*.js'],
                  defaultProject: tsconfigPath,
                },
                tsconfigRootDir: process.cwd(),
              }
            : {}),
          ...parserOptions,
        },
      },
      name: `antfu/typescript/${typeAware ? 'type-aware-parser' : 'parser'}`,
    };
  }

  return [
    {
      // Install the plugins without globs, so they can be configured separately.
      name: 'antfu/typescript/setup',
      plugins: {
        antfu: pluginAntfu,
        ts: pluginTs,
      },
    },
    // assign type-aware parser for type-aware files and type-unaware parser for the rest
    ...(isTypeAware
      ? [
          makeParser(false, files),
          makeParser(true, filesTypeAware, ignoresTypeAware),
        ]
      : [makeParser(false, files)]),
    {
      files,
      name: 'antfu/typescript/rules',
      rules: {
        ...rules,
        ...overrides,
      },
    },
    ...(isTypeAware
      ? [
          {
            files: filesTypeAware,
            ignores: ignoresTypeAware,
            name: 'antfu/typescript/rules-type-aware',
            rules: {
              ...typeAwareRules,
              ...overridesTypeAware,
            },
          },
        ]
      : []),
  ];
}
