import eslint from '@eslint/js';
import functionalPlugin from 'eslint-plugin-functional';
import importPlugin from 'eslint-plugin-import';
import jestPlugin from 'eslint-plugin-jest';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import sonarjsPlugin from 'eslint-plugin-sonarjs';
import unicornPlugin from 'eslint-plugin-unicorn';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import zodPlugin from 'eslint-plugin-zod';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      '**/build/**',
      '**/dist/**',
      '**/node_modules/**',
      '*.config.*',
      '.dependency-cruiser.*',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  sonarjsPlugin.configs.recommended,
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'simple-import-sort': simpleImportSortPlugin,
      import: importPlugin,
      'unused-imports': unusedImportsPlugin,
      unicorn: unicornPlugin,
      zod: zodPlugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Regras globais
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],
      'unicorn/prefer-node-protocol': 'error',
      'unicorn/no-array-for-each': 'warn',

      // Complexidade (mantido ativamente pelo typescript-eslint)
      complexity: ['error', { max: 10 }],
      '@typescript-eslint/max-params': ['error', { max: 4 }],
    },
  },
  // ============================================
  // CORE: Programação Funcional ESTRITA
  // ============================================
  {
    files: ['src/core/**/*.ts'],
    plugins: {
      functional: functionalPlugin,
    },
    rules: {
      // Proibir Classes
      '@typescript-eslint/no-extraneous-class': 'error',
      'no-class-assign': 'error',

      // Funcional Plugin - Strict Mode
      'functional/no-class': 'error',
      'functional/no-this-expression': 'error',
      'functional/no-loop-statement': 'error',
      'functional/immutable-data': 'error',
      'functional/no-let': 'error',
      'functional/prefer-readonly-type': 'error',
      'functional/no-method-signature': 'error',
      'functional/functional-parameters': 'error',

      // TypeScript Strict
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',

      // Proibir mutações
      'no-param-reassign': 'error',
      'prefer-const': 'error',

      // Zod específico
      'zod/require-strict': 'warn',
    },
  },
  // ============================================
  // INFRASTRUCTURE: OOP permitido (NestJS)
  // ============================================
  {
    files: ['src/infrastructure/**/*.ts'],
    rules: {
      // Permitir classes e decorators do NestJS
      'functional/no-class': 'off',
      'functional/no-this-expression': 'off',
      'functional/no-method-signature': 'off',

      // Manter boas práticas OOP
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        { accessibility: 'explicit' },
      ],
    },
  },
  // ============================================
  // APPLICATION: Meio termo (Use Cases)
  // ============================================
  {
    files: ['src/application/**/*.ts'],
    rules: {
      'functional/no-class': 'warn', // Preferir funções, mas permitir classes
      'functional/immutable-data': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'error',
    },
  },
  // ============================================
  // TESTES
  // ============================================
  {
    files: ['test/**', '**/*.spec.ts', '**/*.test.ts'],
    plugins: {
      jest: jestPlugin,
    },
    rules: {
      ...jestPlugin.configs['flat/recommended'].rules,
      'functional/immutable-data': 'off', // Permitir mutações em testes
      'functional/no-let': 'off',
    },
  },
];
