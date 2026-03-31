import type { OptionsTailwindCSS, TypedFlatConfigItem } from '../types';
import { ensurePackages, interopDefault, renameRules } from '../utils';

export async function tailwindcss(
  options: OptionsTailwindCSS = {},
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {}, ...pluginOptions } = options;

  await ensurePackages(['eslint-plugin-better-tailwindcss']);

  const pluginTailwind = await interopDefault(
    import('eslint-plugin-better-tailwindcss'),
  );

  return [
    {
      name: 'maston/tailwindcss',
      plugins: {
        tailwindcss: pluginTailwind,
      },
      rules: {
        ...renameRules(pluginTailwind.configs.recommended.rules, {
          'better-tailwindcss': 'tailwindcss',
        }),

        // this breaks prettier
        'tailwindcss/enforce-consistent-line-wrapping': 'off',

        ...overrides,
      },
      settings: {
        tailwindcss: pluginOptions,
      },
    },
  ];
}
