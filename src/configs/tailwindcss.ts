import type { FlatConfigItem, OptionsTailwindCSS } from '../types';
import { ensurePackages, interopDefault } from '../utils';

export async function tailwindcss(
  options: OptionsTailwindCSS = {},
): Promise<FlatConfigItem[]> {
  const {
    overrides = {},
    ...pluginOptions
  } = options;

  await ensurePackages([
    'eslint-plugin-tailwindcss',
  ]);

  // @ts-expect-error no types
  const pluginTailwind = await interopDefault(import('eslint-plugin-tailwindcss'));

  return [{
    name: 'mastondzn:tailwindcss',
    plugins: {
      tailwindcss: pluginTailwind,
    },
    rules: {
      ...pluginTailwind.configs.recommended.rules,
      ...overrides,
    },
    settings: {
      tailwindcss: pluginOptions,
    },
  }];
}
