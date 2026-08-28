import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    ignores: ['dist/'],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['public/js/**/*.js'],
    languageOptions: {
      globals: {
        document: 'readonly',
        window: 'readonly',
        history: 'readonly',
        location: 'readonly',
        navigator: 'readonly',
        URLSearchParams: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
      },
    },
  },
);
