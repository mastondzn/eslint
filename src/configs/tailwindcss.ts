import type { OptionsTailwindCSS, TypedFlatConfigItem } from '../types';
import { ensurePackages, interopDefault } from '../utils';

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
        'better-tailwindcss': pluginTailwind,
      },
      rules: {
        ...pluginTailwind.configs.recommended.rules,

        // this breaks prettier
        'better-tailwindcss/enforce-consistent-line-wrapping': 'off',

        ...overrides,
      },
      settings: {
        'better-tailwindcss': pluginOptions,
      },
    },
  ];
}
