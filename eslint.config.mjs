import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'artifacts/**',
      '.local/**',
      'coverage/**',
      'test-results/**',
      'playwright-report/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        Hooks: 'readonly',
        CONFIG: 'readonly',
        foundry: 'readonly',
        game: 'readonly',
        Actor: 'readonly',
        User: 'readonly',
        CONST: 'readonly',
      },
    },
  },
  {
    files: ['src/rules/**/*.ts'],
    rules: {
      'no-restricted-globals': [
        'error',
        'game',
        'foundry',
        'CONFIG',
        'Hooks',
        'Actor',
        'User',
        'document',
        'window',
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/foundry/**', '**/sheets/**'],
              message: 'Rules must not depend on the Foundry adapter or UI.',
            },
          ],
        },
      ],
      'no-restricted-properties': [
        'error',
        { object: 'Math', property: 'random', message: 'Pass random results as explicit inputs.' },
      ],
    },
  },
);
