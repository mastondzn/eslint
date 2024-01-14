import { GLOB_EXCLUDE } from '../globs';
import type { FlatConfigItem } from '../types';

export async function ignores(): Promise<FlatConfigItem[]> {
  return [
    {
      ignores: GLOB_EXCLUDE,
    },
  ];
}
