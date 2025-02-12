import { maston } from './src';

export default maston(
  {
    typescript: {
      overridesTypeAware: {
        'ts/no-explicit-any': 'warn',
        'ts/no-unsafe-argument': 'warn',
        'ts/no-unsafe-assignment': 'warn',
        'ts/no-unsafe-member-access': 'warn',
        'ts/require-await': 'warn',
        'ts/no-non-null-assertion': 'warn',
      },
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      'perfectionist/sort-objects': 'error',
    },
  },
);
