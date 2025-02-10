import type { OptionsOverrides, TypedFlatConfigItem } from '../types';
import { ensurePackages, interopDefault, renameRules } from '../utils';

export async function next(
  options: OptionsOverrides = {},
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {} } = options;

  await ensurePackages(['@next/eslint-plugin-next']);

  const pluginNext = await interopDefault(import('@next/eslint-plugin-next'));

  const recommended = renameRules(
    {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules,
    },
    { '@next/next': 'next' },
  ) as TypedFlatConfigItem['rules'];

  return [
    {
      name: 'maston/next',
      plugins: {
        next: pluginNext,
      },
      rules: {
        ...recommended,
        ...overrides,
      },
    },
  ];
}
