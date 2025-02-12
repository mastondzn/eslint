import type { ParserOptions } from '@typescript-eslint/parser';
import type { Linter } from 'eslint';
import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore';
import type { Options as VueBlocksOptions } from 'eslint-processor-vue-blocks';

import type { RuleOptions } from './typegen';

export type Awaitable<T> = T | Promise<T>;

export type Rules = RuleOptions;

export type TypedFlatConfigItem = Omit<
  Linter.Config<Linter.RulesRecord & Rules>,
  'plugins'
> & {
  // Relax plugins type limitation, as most of the plugins did not have correct type info yet.
  /**
   * An object containing a name-value mapping of plugin names to plugin objects. When `files` is specified, these plugins are only available to the matching files.
   *
   * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
   */
  plugins?: Record<string, any>;
};

export interface OptionsFiles {
  /**
   * Override the `files` option to provide custom globs.
   */
  files?: string[];
}

export interface OptionsVue extends OptionsOverrides {
  /**
   * Create virtual files for Vue SFC blocks to enable linting.
   *
   * @see https://github.com/antfu/eslint-processor-vue-blocks
   * @default true
   */
  sfcBlocks?: boolean | VueBlocksOptions;

  /**
   * Vue version. Apply different rules set from `eslint-plugin-vue`.
   *
   * @default 3
   */
  vueVersion?: 2 | 3;
}

export interface OptionsComponentExts {
  /**
   * Additional extensions for components.
   *
   * @example ['vue']
   * @default []
   */
  componentExts?: string[];
}

export interface OptionsTypeScript extends OptionsOverrides {
  /**
   * Additional parser options for TypeScript.
   */
  parserOptions?: Partial<
    Omit<ParserOptions, 'projectService' | 'tsconfigRootDir'>
  >;

  /**
   * When this is provided, type aware rules will be enabled.
   * @default undefined (not type aware)
   * @see https://typescript-eslint.io/linting/typed-linting/
   */
  projectService?: ParserOptions['projectService'];

  /**
   *  Tells the parser the absolute path of your project's root directory.
   *  Usually using `import.meta.dirname` is good.
   */
  tsconfigRootDir?: string | undefined;

  /**
   * Glob patterns for files that should be type aware.
   * @default ['**\/*.{ts,tsx}']
   */
  filesTypeAware?: string[];

  /**
   * Glob patterns for files that should not be type aware.
   * @default ['**\/*.md\/**', '**\/*.astro/*.ts']
   */
  ignoresTypeAware?: string[];

  /**
   * Override type aware rules.
   */
  overridesTypeAware?: TypedFlatConfigItem['rules'];
}

export interface OptionsHasTypeScript {
  typescript?: boolean;
}

export interface OptionsOverrides {
  overrides?: TypedFlatConfigItem['rules'];
}

export interface OptionsRegExp {
  /**
   * Override rulelevels
   */
  level?: 'error' | 'warn';
}

export interface OptionsIsInEditor {
  isInEditor?: boolean;
}

export interface OptionsUnicorn extends OptionsOverrides {
  /**
   * Include all rules recommended by `eslint-plugin-unicorn`.
   * @default true
   */
  allRecommended?: boolean;
}

export interface OptionsUnoCSS extends OptionsOverrides {
  /**
   * Enable attributify support.
   * @default true
   */
  attributify?: boolean;
  /**
   * Enable strict mode by throwing errors about blocklisted classes.
   * @default false
   */
  strict?: boolean;
}

/**
 * @see https://www.npmjs.com/package/eslint-plugin-tailwindcss#more-settings
 */
export interface OptionsTailwindCSS extends OptionsOverrides {
  /**
   * Object/functions that use tailwindcss classes.
   *
   * @default ["classnames", "clsx", "ctl"]
   */
  callees?: string[];
  /**
   * Path to the tailwind config file.
   *
   * @default "tailwind.config.js"
   */
  config?: string;
  cssFiles?: string[];
  cssFilesRefreshRate?: number;
  removeDuplicates?: boolean;
  skipClassAttribute?: boolean;
  whitelist?: string[];
  tags?: string[];
  classRegex?: string;
}

export interface OptionsConfig extends OptionsComponentExts {
  /**
   * Enable gitignore support.
   *
   * Passing an object to configure the options.
   *
   * @see https://github.com/antfu/eslint-config-flat-gitignore
   * @default true
   */
  gitignore?: boolean | FlatGitignoreOptions;

  /**
   * Core rules. Can't be disabled.
   */
  javascript?: OptionsOverrides;

  /**
   * Enable TypeScript support.
   *
   * Passing an object to enable TypeScript Language Server support.
   *
   * @default auto-detect based on the dependencies
   */
  typescript?: boolean | OptionsTypeScript;

  /**
   * Enable JSX related rules.
   *
   * Currently only stylistic rules are included.
   *
   * @default true
   */
  jsx?: boolean;

  /**
   * Customize rules for plugin-perfectionist (mostly import/export sorting).
   *
   * @default true
   */
  perfectionist?: boolean | OptionsOverrides;

  /**
   * Options for eslint-plugin-unicorn.
   *
   * @default true
   */
  unicorn?: boolean | OptionsUnicorn;

  /**
   * Enable test support.
   *
   * @default true
   */
  test?: boolean | OptionsOverrides;

  /**
   * Enable Vue support.
   *
   * @default auto-detect based on the dependencies
   *
   * Requires installing:
   * - `eslint-plugin-vue`
   * - `eslint-processor-vue-blocks`
   * - `vue-eslint-parser`
   */
  vue?: boolean | OptionsVue;

  /**
   * Enable JSONC support.
   *
   * @default true
   */
  jsonc?: boolean | OptionsOverrides;

  /**
   * Enable YAML support.
   *
   * @default true
   */
  yaml?: boolean | OptionsOverrides;

  /**
   * Enable TOML support.
   *
   * @default true
   */
  toml?: boolean | OptionsOverrides;

  /**
   * Enable ASTRO support.
   *
   * Requires installing:
   * - `eslint-plugin-astro`
   *
   * Requires installing for formatting .astro:
   * - `prettier-plugin-astro`
   *
   * @default auto-detect based on the dependencies
   */
  astro?: boolean | OptionsOverrides;

  /**
   * Enable linting for **code snippets** in Markdown.
   *
   * For formatting Markdown content, enable also `formatters.markdown`.
   *
   * @default true
   */
  markdown?: boolean | OptionsOverrides;

  /**
   * Enable regexp rules.
   *
   * @see https://ota-meshi.github.io/eslint-plugin-regexp/
   * @default true
   */
  regexp?: boolean | (OptionsRegExp & OptionsOverrides);

  /**
   * Enable react rules.
   *
   * Requires installing:
   * - `@eslint-react/eslint-plugin`
   * - `eslint-plugin-react-hooks`
   * - `eslint-plugin-react-refresh`
   *
   * @default auto-detect based on the dependencies
   */
  react?: boolean | OptionsOverrides;

  /**
   * Enable Next.js rules.
   *
   * Requires installing:
   * - `@next/eslint-plugin-next`
   *
   * @default auto-detect based on the dependencies
   */
  next?: boolean | OptionsOverrides;

  /**
   * Enable solid rules.
   *
   * Requires installing:
   * - `eslint-plugin-solid`
   *
   * @default auto-detect based on the dependencies
   */
  solid?: boolean | OptionsOverrides;

  /**
   * Enable svelte rules.
   *
   * Requires installing:
   * - `eslint-plugin-svelte`
   *
   * @default auto-detect based on the dependencies
   */
  svelte?: boolean | OptionsOverrides;

  /**
   * Enable unocss rules.
   *
   * Requires installing:
   * - `@unocss/eslint-plugin`
   *
   * @default auto-detect based on the dependencies
   */
  unocss?: boolean | OptionsUnoCSS;

  /**
   * Enable tailwindcss rules.
   *
   * Requires installing:
   * - `eslint-plugin-tailwindcss`
   *
   * @default auto-detect based on the dependencies
   */
  tailwindcss?: boolean | OptionsTailwindCSS;

  /**
   * Control to disable some rules in editors.
   * @default auto-detect based on the process.env
   */
  isInEditor?: boolean;

  /**
   * Automatically rename plugins in the config.
   *
   * @default true
   */
  autoRenamePlugins?: boolean;
}

export type { ConfigNames } from './typegen';
