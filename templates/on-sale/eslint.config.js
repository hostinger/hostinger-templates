import js from '@eslint/js'
import svelte from 'eslint-plugin-svelte'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import svelteConfig from './svelte.config.js'

export default tseslint.config(
  { ignores: ['build/', '.svelte-kit/', 'node_modules/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...svelte.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.svelte'],
        svelteConfig,
      },
    },
  },
)
