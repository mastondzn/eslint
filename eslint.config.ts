// @ts-expect-error missing types
import styleMigrate from '@stylistic/eslint-plugin-migrate';
import antfu from './src';

export default antfu(
  {
    vue: true,
    // react: true,
    typescript: true,
    ignores: [
      'fixtures',
      '_fixtures',
    ],

    formatters: true,
    stylistic: {
      semi: true,
    },
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      'perfectionist/sort-objects': 'error',
    },
  },
  {
    files: ['src/configs/*.ts'],
    plugins: {
      'style-migrate': styleMigrate,
    },
    rules: {
      'style-migrate/migrate': ['error', { namespaceTo: 'style' }],
    },
  },
);
