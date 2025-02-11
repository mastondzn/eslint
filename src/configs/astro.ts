import type {
  OptionsFiles,
  OptionsOverrides,
  TypedFlatConfigItem,
} from '../types';
import { GLOB_ASTRO } from '../globs';
import { ensurePackages, interopDefault } from '../utils';

export async function astro(
  options: OptionsOverrides & OptionsFiles = {},
): Promise<TypedFlatConfigItem[]> {
  const { files = [GLOB_ASTRO], overrides = {} } = options;

  await ensurePackages(['eslint-plugin-astro', 'astro-eslint-parser']);

  const [pluginAstro, parserAstro, parserTs] = await Promise.all([
    interopDefault(import('eslint-plugin-astro')),
    interopDefault(import('astro-eslint-parser')),
    interopDefault(import('@typescript-eslint/parser')),
  ] as const);

  return [
    {
      name: 'maston/astro/setup',
      plugins: {
        astro: pluginAstro,
      },
    },
    {
      files,
      languageOptions: {
        globals: pluginAstro.environments.astro.globals,
        parser: parserAstro,
        parserOptions: {
          extraFileExtensions: ['.astro'],
          parser: parserTs,
        },
        sourceType: 'module',
      },
      name: 'maston/astro/rules',
      processor: 'astro/client-side-ts',
      rules: {
        // Astro uses top level await for e.g. data fetching
        // https://docs.astro.build/en/guides/data-fetching/#fetch-in-astro
        'antfu/no-top-level-await': 'off',

        // use recommended rules
        'astro/missing-client-only-directive-value': 'error',
        'astro/no-conflict-set-directives': 'error',
        'astro/no-deprecated-astro-canonicalurl': 'error',
        'astro/no-deprecated-astro-fetchcontent': 'error',
        'astro/no-deprecated-astro-resolve': 'error',
        'astro/no-deprecated-getentrybyslug': 'error',
        'astro/no-set-html-directive': 'off',
        'astro/no-unused-define-vars-in-style': 'error',
        'astro/semi': 'off',
        'astro/valid-compile': 'error',

        ...overrides,
      },
    },
  ];
}
