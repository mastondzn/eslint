/* eslint-disable perfectionist/sort-objects */

import type { ESLint } from 'eslint';
import { isPackageExists } from 'local-pkg';

import type { OptionsFiles, OptionsOverrides, TypedFlatConfigItem } from '../types';
import { GLOB_SRC } from '../globs';
import { ensurePackages, interopDefault, renameRules } from '../utils';

const ReactRefreshAllowConstantExportPackages = ['vite'];
const RemixPackages = ['@remix-run/node', '@remix-run/react', '@remix-run/serve', '@remix-run/dev'];
const ReactRouterPackages = ['@react-router/node', '@react-router/react', '@react-router/serve', '@react-router/dev'];
const NextJsPackages = ['next'];

export async function react(options: OptionsOverrides & OptionsFiles = {}): Promise<TypedFlatConfigItem[]> {
  const { files = [GLOB_SRC], overrides = {} } = options;

  await ensurePackages(['@eslint-react/eslint-plugin', 'eslint-plugin-react-refresh']);

  const [pluginReact, pluginReactRefresh] = await Promise.all([
    interopDefault(import('@eslint-react/eslint-plugin')),
    interopDefault(import('eslint-plugin-react-refresh')),
  ] as const);

  const isAllowConstantExport = ReactRefreshAllowConstantExportPackages.some((i) => isPackageExists(i));
  const isUsingRemix = RemixPackages.some((i) => isPackageExists(i));
  const isUsingReactRouter = ReactRouterPackages.some((i) => isPackageExists(i));
  const isUsingNext = NextJsPackages.some((i) => isPackageExists(i));

  const plugins = pluginReact.configs.all.plugins!;

  return [
    {
      name: 'maston/react/setup',
      plugins: {
        react: plugins['@eslint-react'],
        'react-dom': plugins['@eslint-react/dom'],
        'react-naming-convention': plugins['@eslint-react/naming-convention'],
        'react-web-api': plugins['@eslint-react/web-api'],
        'react-refresh': pluginReactRefresh,
      },
    },
    {
      name: 'maston/react/rules',
      files,
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
        sourceType: 'module',
      },
      rules: {
        ...renameRules(
          {
            ...(plugins['@eslint-react'].configs!.recommended as ESLint.ConfigData).rules,
            ...(plugins['@eslint-react/dom'].configs!.recommended as ESLint.ConfigData).rules,
            ...(plugins['@eslint-react/naming-convention'].configs!.recommended as ESLint.ConfigData).rules,
          },
          {
            'react-x': 'react',
            '@eslint-react/dom': 'react-dom',
            '@eslint-react/naming-convention': 'react-naming-convention',
          },
        ),

        // preconfigured rules from eslint-plugin-react-refresh https://github.com/ArnaudBarre/eslint-plugin-react-refresh/tree/main/src
        'react-refresh/only-export-components': [
          'warn',
          {
            allowConstantExport: isAllowConstantExport,
            allowExportNames: [
              ...(isUsingNext
                ? [
                    'dynamic',
                    'dynamicParams',
                    'revalidate',
                    'fetchCache',
                    'runtime',
                    'preferredRegion',
                    'maxDuration',
                    'config',
                    'generateStaticParams',
                    'metadata',
                    'generateMetadata',
                    'viewport',
                    'generateViewport',
                  ]
                : []),
              ...(isUsingRemix || isUsingReactRouter
                ? [
                    'meta',
                    'links',
                    'headers',
                    'loader',
                    'action',
                    'clientLoader',
                    'clientAction',
                    'handle',
                    'shouldRevalidate',
                  ]
                : []),
            ],
          },
        ],

        // overrides
        ...overrides,
      },
    },
  ];
}
