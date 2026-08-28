import eslint from '@eslint/js';
import typescriptParser from '@typescript-eslint/parser';
import astro from 'eslint-plugin-astro';

export default [
  eslint.configs.recommended,
  ...astro.configs['flat/recommended'],
  {
    files: ['**/*.astro'],
    languageOptions: {
      parserOptions: {
        parser: typescriptParser,
      },
    },
  },
  {
    ignores: ['dist/', '.astro/'],
  },
];
