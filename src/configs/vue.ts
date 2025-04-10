import type { Linter } from 'eslint';
import { mergeProcessors } from 'eslint-merge-processors';

import type {
  OptionsFiles,
  OptionsHasTypeScript,
  OptionsOverrides,
  OptionsVue,
  TypedFlatConfigItem,
} from '../types';
import { GLOB_VUE } from '../globs';
import { ensurePackages, interopDefault } from '../utils';

export async function vue(
  options: OptionsVue &
    OptionsHasTypeScript &
    OptionsOverrides &
    OptionsFiles = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    a11y = false,
    files = [GLOB_VUE],
    overrides = {},
    vueVersion = 3,
  } = options;

  const sfcBlocks = options.sfcBlocks === true ? {} : (options.sfcBlocks ?? {});

  if (a11y) {
    await ensurePackages(['eslint-plugin-vuejs-accessibility']);
  }

  const [pluginVue, parserVue, processorVueBlocks, pluginVueA11y] =
    await Promise.all([
      interopDefault(import('eslint-plugin-vue')),
      interopDefault(import('vue-eslint-parser')),
      interopDefault(import('eslint-processor-vue-blocks')),
      ...(a11y
        ? [interopDefault(import('eslint-plugin-vuejs-accessibility'))]
        : []),
    ] as const);

  function getRulesFromFlatConfig(
    config: Extract<keyof typeof pluginVue.configs, `flat/${string}`>,
  ) {
    return pluginVue.configs[config]
      .map((c) => c.rules)
      .reduce((acc, c) => ({ ...acc, ...c }), {});
  }

  return [
    {
      // This allows Vue plugin to work with auto imports
      // https://github.com/vuejs/eslint-plugin-vue/pull/2422
      languageOptions: {
        globals: {
          computed: 'readonly',
          defineEmits: 'readonly',
          defineExpose: 'readonly',
          defineProps: 'readonly',
          onMounted: 'readonly',
          onUnmounted: 'readonly',
          reactive: 'readonly',
          ref: 'readonly',
          shallowReactive: 'readonly',
          shallowRef: 'readonly',
          toRef: 'readonly',
          toRefs: 'readonly',
          watch: 'readonly',
          watchEffect: 'readonly',
        },
      },
      name: 'maston/vue/setup',
      plugins: {
        vue: pluginVue,
        ...(a11y ? { 'vue-a11y': pluginVueA11y } : {}),
      },
    },
    {
      files,
      languageOptions: {
        parser: parserVue,
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          extraFileExtensions: ['.vue'],
          parser: options.typescript
            ? await interopDefault(import('@typescript-eslint/parser'))
            : null,
          sourceType: 'module',
        },
      },
      name: 'maston/vue/rules',
      processor:
        sfcBlocks === false
          ? (pluginVue.processors['.vue'] as Linter.Processor)
          : mergeProcessors([
              pluginVue.processors['.vue'] as Linter.Processor,
              processorVueBlocks({
                ...sfcBlocks,
                blocks: {
                  styles: true,
                  ...sfcBlocks.blocks,
                },
              }),
            ]),
      rules: {
        ...pluginVue.configs.base.rules,

        ...(vueVersion === 2
          ? {
              ...getRulesFromFlatConfig('flat/vue2-essential'),
              ...getRulesFromFlatConfig('flat/vue2-strongly-recommended'),
              ...getRulesFromFlatConfig('flat/vue2-recommended'),
            }
          : {
              ...getRulesFromFlatConfig('flat/essential'),
              ...getRulesFromFlatConfig('flat/strongly-recommended'),
              ...getRulesFromFlatConfig('flat/recommended'),
            }),

        'antfu/no-top-level-await': 'off',
        'node/prefer-global/process': 'off',
        'ts/explicit-function-return-type': 'off',

        'vue/block-order': [
          'error',
          {
            order: ['script', 'template', 'style'],
          },
        ],
        'vue/component-name-in-template-casing': ['error', 'PascalCase'],
        'vue/component-options-name-casing': ['error', 'PascalCase'],
        // this is deprecated
        'vue/component-tags-order': 'off',
        'vue/custom-event-name-casing': ['error', 'camelCase'],
        'vue/define-macros-order': [
          'error',
          {
            order: [
              'defineOptions',
              'defineProps',
              'defineEmits',
              'defineSlots',
            ],
          },
        ],
        'vue/dot-location': ['error', 'property'],
        'vue/dot-notation': ['error', { allowKeywords: true }],
        'vue/eqeqeq': ['error', 'smart'],
        'vue/html-quotes': ['error', 'double'],
        'vue/max-attributes-per-line': 'off',
        'vue/multi-word-component-names': 'off',
        'vue/no-dupe-keys': 'off',
        'vue/no-empty-pattern': 'error',
        'vue/no-irregular-whitespace': 'error',
        'vue/no-loss-of-precision': 'error',
        'vue/no-restricted-syntax': [
          'error',
          'DebuggerStatement',
          'LabeledStatement',
          'WithStatement',
        ],
        'vue/no-restricted-v-bind': ['error', '/^v-/'],
        'vue/no-setup-props-reactivity-loss': 'off',
        'vue/no-sparse-arrays': 'error',
        'vue/no-unused-refs': 'error',
        'vue/no-useless-v-bind': 'error',
        'vue/no-v-html': 'off',
        'vue/object-shorthand': [
          'error',
          'always',
          {
            avoidQuotes: true,
            ignoreConstructors: false,
          },
        ],
        'vue/prefer-separate-static-class': 'error',
        'vue/prefer-template': 'error',
        'vue/prop-name-casing': ['error', 'camelCase'],
        'vue/require-default-prop': 'off',
        'vue/require-prop-types': 'off',
        'vue/space-infix-ops': 'error',
        'vue/space-unary-ops': ['error', { nonwords: false, words: true }],

        ...overrides,
      },
    },
  ];
}
