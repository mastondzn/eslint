import type { OptionsOverrides, TypedFlatConfigItem } from '../types';
import { ensurePackages, interopDefault, renameRules } from '../utils';

export async function turbo(
  options: OptionsOverrides = {},
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {} } = options;

  await ensurePackages(['eslint-plugin-turbo']);

  const pluginTurbo = await interopDefault(import('eslint-plugin-turbo'));

  const recommended: TypedFlatConfigItem['rules'] = renameRules(
    {
      ...pluginTurbo.configs.recommended.rules,
    },
    { turbo: 'turbo' },
  );

  return [
    {
      name: 'maston/turbo',
      plugins: {
        turbo: pluginTurbo,
      },
      rules: {
        ...recommended,
        ...overrides,
      },
    },
  ];
}
