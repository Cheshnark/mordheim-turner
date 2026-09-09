import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'

export default defineConfig([
  globalIgnores(['dist', 'coverage', '.claude']),

  js.configs.recommended,
  tseslint.configs.recommended,

  // Código de la aplicación (navegador).
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    rules: {
      ...reactHooks.configs['recommended-latest'].rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },

  // Ficheros de configuración (Node).
  {
    files: ['*.{js,mjs,ts}'],
    languageOptions: {
      globals: globals.node,
    },
  },

  // Desactiva las reglas de formato que gestiona Prettier. Debe ir al final.
  prettier,
])
