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
    'react/jsx-indent': [2, 2, { checkAttributes: true, indentLogicalExpressions: true }],
    'react/jsx-indent-props': [2, 2],
    'react/self-closing-comp': ['error', {
      component: true,
      html: true
    }],
    'react/jsx-closing-bracket-location': 2
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
