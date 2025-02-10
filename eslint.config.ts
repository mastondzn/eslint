import { maston } from './src';

export default maston(
  {
    vue: true,
    react: true,
    solid: true,
    svelte: true,
    astro: true,
    next: true,
    tailwindcss: true,
    typescript: {
      tsconfigPath: './tsconfig.json',
      overridesTypeAware: {
        'ts/no-explicit-any': 'warn',
        'ts/no-unsafe-argument': 'warn',
        'ts/no-unsafe-assignment': 'warn',
        'ts/no-unsafe-member-access': 'warn',
        'ts/require-await': 'warn',
      },
    },
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      'perfectionist/sort-objects': 'error',
    },
  },
);
