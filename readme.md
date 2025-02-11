# @mastondzn/eslint

[![npm](https://img.shields.io/npm/v/@mastondzn/eslint?color=444&label=)](https://npmjs.com/package/@mastondzn/eslint)

Fork of [@antfu/eslint-config](https://github.com/antfu/eslint-config) without formatting, with more configs (tailwindcss, next), and stricter rules aswell.

- Designed to work with TypeScript, JSX, JSON, YAML, Toml, Markdown, etc. Out-of-box.
- Auto-detects and includes plugins and rules for: Typescript, React, Svelte, TailwindCSS, UnoCSS, Astro, Solid, Next.js, Vue
- Pretty strict by default, uses typescript-eslint's strict and stylistic recommended rules in both type aware and non type aware files.
- Opinionated, but [very customizable](#customization)
- [ESLint v9 Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new), compose easily with included utils!
- Sorted imports by group (internal, external, parent, index, builtin)
- Respects `.gitignore` by default
- Requires ESLint v9.5.0+

> [!WARNING]
> Please keep in mind that this is still **_a personal config_** with a lot opinions and rules. Changes might not always be liked by everyone and please every use cases. Conflicts may appear aswell.
>
> If you are using this config directly, I'd suggest you **review the changes everytime you update**. Or if you want more control over the rules, always feel free to fork it. Thanks!

## Installation

Install as dev dependency:

```bash
pnpm i -D eslint @mastondzn/eslint
```

And create `eslint.config.mjs` in your project root:

```js
// eslint.config.mjs
import { maston } from '@mastondzn/eslint';

export default maston({
  // include this typescript setting to enable powerful type aware rules!
  // (at the cost of some performance)
  typescript: { tsconfigPath: './tsconfig.json' },
});
```

### Add script for package.json

For example:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

Run lint once to check if you need to install any dependencies:

```bash
pnpm run lint
```

## IDE Support (auto fix on save)

<details>
<summary>🟦 VS Code support</summary>

<br>

Install [VS Code ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

Add the following settings to your `.vscode/settings.json`:

```jsonc
{
  // format on save
  "editor.formatOnSave": true,

  // we use prettier for our formatter but you can try something else!
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "prettier.prettierPath": "./node_modules/prettier",
  "prettier.enable": true,

  "editor.codeActionsOnSave": {
    // attempt to fix auto-fixable problems when saving
    "source.fixAll.eslint": "explicit",
    // do not organize imports on save, it is handled by eslint
    "source.organizeImports": "never",
  },
  "eslint.runtime": "node",

  // Enable eslint for all supported languages
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue",
    "html",
    "markdown",
    "json",
    "jsonc",
    "yaml",
    "github-actions-workflow",
    "toml",
    "xml",
    "gql",
    "graphql",
    "astro",
    "svelte",
    "css",
    "less",
    "scss",
    "pcss",
    "postcss",
  ],
}
```

</details>

<details>
<summary>🟩 Neovim Support</summary>

<br>

Update your configuration to use the following:

```lua
local lspconfig = require('lspconfig')
-- Enable eslint for all supported languages
lspconfig.eslint.setup(
  {
    filetypes = {
      "javascript",
      "javascriptreact",
      "javascript.jsx",
      "typescript",
      "typescriptreact",
      "typescript.tsx",
      "vue",
      "html",
      "markdown",
      "json",
      "jsonc",
      "yaml",
      "toml",
      "xml",
      "gql",
      "graphql",
      "astro",
      "svelte",
      "css",
      "less",
      "scss",
      "pcss",
      "postcss"
    },
  }
)
```

### Neovim format on save

There's few ways you can achieve format on save in neovim:

- `nvim-lspconfig` has a `EslintFixAll` command predefined, you can create a autocmd to call this command after saving file.

```lua
lspconfig.eslint.setup({
  --- ...
  on_attach = function(client, bufnr)
    vim.api.nvim_create_autocmd("BufWritePre", {
      buffer = bufnr,
      command = "EslintFixAll",
    })
  end,
})
```

- Use [conform.nvim](https://github.com/stevearc/conform.nvim).
- Use [none-ls](https://github.com/nvimtools/none-ls.nvim)
- Use [nvim-lint](https://github.com/mfussenegger/nvim-lint)

</details>

## Customization

It uses [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new). It provides good organization and composition.

Normally you only need to import the `maston` preset:

```js
// eslint.config.mjs
import { maston } from '@mastondzn/eslint';

export default maston();
```

And that's it! Or you can configure each integration individually, for example:

```js
// eslint.config.js
import { maston } from '@antfu/eslint-config';

export default antfu({
  // TypeScript, Vue and others are autodetected, you can also explicitly enable them:
  typescript: true,
  vue: true,

  // Disable jsonc and yaml support
  jsonc: false,
  yaml: false,

  // `.eslintignore` is no longer supported in Flat config, use `ignores` instead
  ignores: [
    '**/fixtures',
    // ...globs
  ],

  // override rules (such as for unicorn plugin)
  unicorn: {
    overrides: {
      'unicorn/prevent-abbreviations': 'error',
      'unicorn/prefer-string-raw': 'off',
    },
  },
});
```

The `maston` factory function also accepts any number of arbitrary custom config overrides:

```js
// eslint.config.js
import { maston } from '@antfu/eslint-config';

export default maston(
  {
    // Configures for main config
  },

  // From the second arguments they are regular ESLint Flat Configs
  // you can have multiple configs
  {
    files: ['**/*.ts'],
    rules: {},
  },
  {
    rules: {},
  },
);
```

Going more advanced, you can also import fine-grained configs and compose them as you wish:

<details>
<summary>Advanced Example</summary>

We wouldn't recommend using this style in general unless you know exactly what they are doing, as there are shared options between configs and might need extra care to make them consistent.

```js
// eslint.config.js
import {
  combine,
  comments,
  ignores,
  imports,
  javascript,
  jsdoc,
  jsonc,
  markdown,
  next,
  node,
  sortPackageJson,
  sortTsconfig,
  stylistic,
  tailwindcss,
  toml,
  typescript,
  unicorn,
  vue,
  yaml,
} from '@mastondzn/eslint';

export default combine(
  ignores(),
  javascript(/* Options */),
  comments(),
  node(),
  jsdoc(),
  imports(),
  unicorn(),
  typescript(/* Options */),
  next(),
  tailwindcss(),
  vue(),
  jsonc(),
  yaml(),
  toml(),
  markdown(),
);
```

</details>

Check out the [configs](https://github.com/mastondzn/eslint/blob/main/src/configs) and [factory](https://github.com/mastondzn/eslint/blob/main/src/factory.ts) for more details.

> Thanks to [sxzz/eslint-config](https://github.com/sxzz/eslint-config) for the inspiration and reference.

### Plugins Renaming

Since flat config requires us to explicitly provide the plugin names (instead of the mandatory convention from npm package name), we renamed some plugins to make the overall scope more consistent and easier to write.

| New Prefix | Original Prefix        | Source Plugin                                                                              |
| ---------- | ---------------------- | ------------------------------------------------------------------------------------------ |
| `import/*` | `import-x/*`           | [eslint-plugin-import-x](https://github.com/un-es/eslint-plugin-import-x)                  |
| `node/*`   | `n/*`                  | [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n)                     |
| `yaml/*`   | `yml/*`                | [eslint-plugin-yml](https://github.com/ota-meshi/eslint-plugin-yml)                        |
| `ts/*`     | `@typescript-eslint/*` | [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint) |
| `style/*`  | `@/*`                  | [@/eslint-plugin](https://github.com/eslint-/eslint-)                                      |
| `test/*`   | `vitest/*`             | [@vitest/eslint-plugin](https://github.com/vitest-dev/eslint-plugin-vitest)                |
| `test/*`   | `no-only-tests/*`      | [eslint-plugin-no-only-tests](https://github.com/levibuzolic/eslint-plugin-no-only-tests)  |
| `next/*`   | `@next/next/*`         | [@next/eslint-plugin-next](https://nextjs.org/docs/app/api-reference/config/eslint)        |

When you want to override rules, or disable them inline, you need to update to the new prefix:

```diff
-// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
+// eslint-disable-next-line ts/consistent-type-definitions
type foo = { bar: 2 }
```

> [!NOTE]
> About plugin renaming - it is actually rather a dangrous move that might leading to potential naming collisions, pointed out [here](https://github.com/eslint/eslint/discussions/17766) and [here](https://github.com/prettier/eslint-config-prettier#eslintconfigjs-flat-config-plugin-caveat). As this config also very **personal** and **opinionated**, I ambitiously position this config as the only **"top-level"** config per project, that might pivots the taste of how rules are named.
>
> This config cares more about the user-facings DX, and try to ease out the implementation details. For example, users could keep using the semantic `import/order` without ever knowing the underlying plugin has migrated twice to `eslint-plugin-i` and then to `eslint-plugin-import-x`. User are also not forced to migrate to the implicit `i/order` halfway only because we swapped the implementation to a fork.
>
> That said, it's probably still not a good idea. You might not want to doing this if you are maintaining your own eslint config.
>
> Feel free to open issues if you want to combine this config with some other config presets but faced naming collisions. I am happy to figure out a way to make them work. But at this moment I have no plan to revert the renaming.

Since v2.9.0, this preset will automatically rename the plugins also for your custom configs. You can use the original prefix to override the rules directly.

<details>
<summary>Change back to original prefix</summary>

If you really want to use the original prefix, you can revert the plugin renaming by:

```ts
import { maston } from '@antfu/eslint-config';

export default maston().renamePlugins({
  ts: '@typescript-eslint',
  yaml: 'yml',
  node: 'n',
  // ...
});
```

</details>

### Rules Overrides

Certain rules would only be enabled in specific files, for example, `ts/*` rules would only be enabled in `.ts` files and `vue/*` rules would only be enabled in `.vue` files. If you want to override the rules, you need to specify the file extension:

```js
// eslint.config.js
import { maston } from '@antfu/eslint-config';

export default maston(
  {
    vue: true,
    typescript: true,
  },
  {
    // Remember to specify the file glob here, otherwise it might cause the vue plugin to handle non-vue files
    files: ['**/*.vue'],
    rules: {
      'vue/operator-linebreak': ['error', 'before'],
    },
  },
  {
    // Without `files`, they are general rules for all files
    rules: {
      'style/semi': ['error', 'never'],
    },
  },
);
```

We also provided the `overrides` options in each integration to make it easier:

```js
// eslint.config.js
import antfu from '@antfu/eslint-config';

export default antfu({
  vue: {
    overrides: {
      'vue/operator-linebreak': ['error', 'before'],
    },
  },
  typescript: {
    overrides: {
      'ts/consistent-type-definitions': ['error', 'interface'],
    },
  },
  yaml: {
    overrides: {
      // ...
    },
  },
});
```

### Config Composer

The factory function `maston()` returns a [`FlatConfigComposer` object from `eslint-flat-config-utils`](https://github.com/antfu/eslint-flat-config-utils#composer) where you can chain the methods to compose the config even more flexibly.

```js
// eslint.config.js
import { maston } from '@antfu/eslint-config';

export default maston()
  // some configs before the main config
  .prepend()
  // overrides any named configs
  .override('maston/imports', {
    rules: {
      'import/order': ['error', { 'newlines-between': 'always' }],
    },
  })
  // rename plugin prefixes
  .renamePlugins({
    'old-prefix': 'new-prefix',
    // ...
  });
// ...
```

### Optional Configs

We provide some optional configs for specific use cases, that we don't include their dependencies by default.

### Optional Rules

This config also provides some optional plugins/rules for extended usage.

#### `command`

Powered by [`eslint-plugin-command`](https://github.com/antfu/eslint-plugin-command). It is not a typical rule for linting, but an on-demand micro-codemod tool that triggers by specific comments.

For a few triggers, for example:

- `/// to-function` - converts an arrow function to a normal function
- `/// to-arrow` - converts a normal function to an arrow function
- `/// to-for-each` - converts a for-in/for-of loop to `.forEach()`
- `/// to-for-of` - converts a `.forEach()` to a for-of loop
- `/// keep-sorted` - sorts an object/array/interface
- ... etc. - refer to the [documentation](https://github.com/antfu/eslint-plugin-command#built-in-commands)

You can add the trigger comment one line above the code you want to transform, for example (note the triple slash):

<!-- eslint-skip -->

```ts
/// to-function
const foo = async (msg: string): void => {
  console.log(msg);
};
```

Will be transformed to this when you hit save with your editor or run `eslint . --fix`:

```ts
async function foo(msg: string): void {
  console.log(msg);
}
```

The command comments are usually one-off and will be removed along with the transformation.

### Type Aware Rules

You can optionally enable the [type aware rules](https://typescript-eslint.io/linting/typed-linting/) by passing the options object to the `typescript` config (recommended):

```js
// eslint.config.js
import { maston } from '@antfu/eslint-config';

export default maston({
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
});
```

### Editor Specific Disables

Auto-fixing for the following rules are disabled when ESLint is running in a code editor:

- [`prefer-const`](https://eslint.org/docs/rules/prefer-const)
- [`test/no-only-tests`](https://github.com/levibuzolic/eslint-plugin-no-only-tests)
- [`unused-imports/no-unused-imports`](https://www.npmjs.com/package/eslint-plugin-unused-imports)

They are not disabled, but made non-fixable using [this helper](https://github.com/antfu/eslint-flat-config-utils#composerdisablerulesfix).

This is to prevent unused imports from getting removed by the editor during refactoring to get a better developer experience. Those rules will be applied when you run ESLint in the terminal or [Lint Staged](#lint-staged). If you don't want this behavior, you can disable them:

```js
// eslint.config.js
import { maston } from '@antfu/eslint-config';

export default maston({
  isInEditor: false,
});
```

## View what rules are enabled

Antfu built a visual tool to help you view what rules are enabled in your project and apply them to what files, [@eslint/config-inspector](https://github.com/eslint/config-inspector)

Go to your project root that contains `eslint.config.js` and run:

```bash
pnpx @eslint/config-inspector
```

## Versioning Policy

This project follows [Semantic Versioning](https://semver.org/) for releases. However, since this is just a config and involves opinions and many moving parts, we don't treat rules changes as breaking changes.

### Changes Considered as Breaking Changes

- Node.js version requirement changes
- Huge refactors that might break the config
- Plugins made major changes that might break the config
- Changes that might affect most of the codebases

### Changes Considered as Non-breaking Changes

- Enable/disable rules and plugins (that might become stricter)
- Rules options changes
- Version bumps of dependencies

## FAQ

### I prefer XXX...

Sure, you can configure and override rules locally in your project to fit your needs. If that still does not work for you, you can always fork this repo and maintain your own.

## License

[MIT](./LICENSE) License &copy; 2019-PRESENT [Maston](https://github.com/mastondzn)
