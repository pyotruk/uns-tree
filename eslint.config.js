import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import prettierEslintRecommended from 'eslint-plugin-prettier/recommended';

export default tsEslint.config(
  eslint.configs.recommended,
  tsEslint.configs.recommended,
  prettierEslintRecommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
);
