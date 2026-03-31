import type { ParserOptions } from '@typescript-eslint/parser';
import type { Linter } from 'eslint';
import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore';

import type { RuleOptions } from './typegen';

export type Awaitable<T> = T | Promise<T>;

export type Rules = RuleOptions;

export type TypedFlatConfigItem = Omit<Linter.Config, 'plugins'> & {
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
   * @default ['**\/*.md\/**']
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

interface AttributeSelector {
  kind: 'attribute';
  name: string;
  callTarget?: 'all' | 'first' | 'last' | number;
  match?: {
    type: 'objectKeys' | 'objectValues' | 'strings';
    path?: string;
  }[];
}

interface VariableSelector {
  kind: 'variable';
  name: string;
  match?: {
    type: 'objectKeys' | 'objectValues' | 'strings';
    path?: string;
  }[];
}

interface TagSelector {
  kind: 'tag';
  name: string;
  match?: {
    type: 'objectKeys' | 'objectValues' | 'strings';
    path?: string;
  }[];
}

interface CalleeSelector {
  kind: 'callee';
  callTarget?: 'all' | 'first' | 'last' | number;
  match?: {
    type: 'objectKeys' | 'objectValues' | 'strings';
    path?: string;
  }[];
  name?: string;
  path?: string;
}

/**
 * @see https://github.com/schoero/eslint-plugin-better-tailwindcss/blob/HEAD/docs/settings/settings.md
 */
export interface OptionsTailwindCSS extends OptionsOverrides {
  /**
   * The path to the entry file of the css based tailwind config (eg: src/global.css).
   * If not specified, the plugin will fall back to the default configuration.
   */
  entryPoint?: string;
  /**
   * The path to the tailwind.config.js file.
   * If not specified, the plugin will try to find it automatically or falls back to the default configuration.
   * The tailwind config is used to determine the sorting order.
   */
  tailwindConfig?: string;
  tsconfig?: string;
  detectComponentClasses?: boolean;
  rootFontSize?: number;
  messageStyle?: 'string' | 'object';
  selectors?: (
    | AttributeSelector
    | VariableSelector
    | TagSelector
    | CalleeSelector
  )[];
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
   * - `eslint-plugin-react-refresh`
   *
   * @default auto-detect based on the dependencies
   */
  react?: boolean | OptionsOverrides;

  /**
   * Enable tailwindcss rules.
   *
   * Requires installing:
   * - `eslint-plugin-better-tailwindcss`
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
