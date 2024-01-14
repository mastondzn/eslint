import type { FlatConfigItem, OptionsOverrides } from '../types';
import { ensurePackages, interopDefault, renameRules } from '../utils';

export async function next(
  options: OptionsOverrides = {},
): Promise<FlatConfigItem[]> {
  const {
    overrides = {},
  } = options;

  await ensurePackages([
    '@next/eslint-plugin-next',
  ]);

  // @ts-expect-error no types
  const pluginNext = await interopDefault(import('@next/eslint-plugin-next'));

  return [{
    name: 'mastondzn:next',
    plugins: {
      next: pluginNext,
    },
    rules: {
      ...renameRules({
        ...pluginNext.configs.recommended.rules,
        ...pluginNext.configs['core-web-vitals'].rules,
      }, '@next/next/', 'next/'),
      ...overrides,
    },
  }];
}
