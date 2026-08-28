import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import react from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    ignores: ['public/', '.cache/', 'node_modules/'],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
);
