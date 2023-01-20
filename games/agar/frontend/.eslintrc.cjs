module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'standard-with-typescript',
    'plugin:react/recommended'
  ],
  overrides: [
  ],
  parserOptions: {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json',
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: [
    'react'
  ],
  rules: {
    'react/jsx-indent': [2, 2, { checkAttributes: true, indentLogicalExpressions: true }]
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
