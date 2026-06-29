import js from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist/**', 'node_modules/**'] },
  js.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        window: 'readonly', document: 'readonly', localStorage: 'readonly', crypto: 'readonly',
        File: 'readonly', Blob: 'readonly', FileReader: 'readonly', HTMLInputElement: 'readonly',
        HTMLCanvasElement: 'readonly', HTMLDivElement: 'readonly', URL: 'readonly', atob: 'readonly', btoa: 'readonly',
        ResizeObserver: 'readonly', requestAnimationFrame: 'readonly', cancelAnimationFrame: 'readonly', console: 'readonly',
        setTimeout: 'readonly', clearTimeout: 'readonly', alert: 'readonly', fetch: 'readonly', React: 'readonly', TextEncoder: 'readonly', TextDecoder: 'readonly', ArrayBuffer: 'readonly', CryptoKey: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
]
