import { antfu } from './src';

export default antfu(
  {
    vue: true,
    react: true,
    solid: true,
    svelte: true,
    astro: true,
    typescript: true,
    next: true,
    type: 'lib',
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      'perfectionist/sort-objects': 'error',
    },
  },
);
