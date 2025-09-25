/* eslint-env node */
const ts = require('@typescript-eslint/eslint-plugin')
const tsParser = require('@typescript-eslint/parser')
const js = require('@eslint/js')
const vue = require('eslint-plugin-vue')
const vueParser = require('vue-eslint-parser')

module.exports = [
  // global ignores
  {
    ignores: ['node_modules', '.nuxt', '.output', 'dist']
  },

  // base JS/TS rules
  {
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 2022,
        sourceType: 'module',
        extraFileExtensions: ['.vue']
      }
    },
    plugins: { '@typescript-eslint': ts, vue },
    rules: {
      ...js.configs.recommended.rules,
      ...ts.configs.recommended.rules,
      ...vue.configs['vue3-recommended'].rules,
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
]
