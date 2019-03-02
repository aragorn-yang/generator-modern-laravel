/* eslint-env node */
module.exports = {
  root: true, // 只在项目根配置中使用
  extends: [
    //'airbnb-base', // airbnb non-react
    //'airbnb', // airbnb react
    'eslint:recommended',
    'plugin:prettier/recommended', // Use Prettier with ESLint
  ],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      // jsx: true, // for react
    },
  },
  env: {
    es6: true,
    // browser: true, // for browser env
    node: true, // for node env
    // mocha: true, // for `test/.eslintrc.js`
    // jest: true, // for `test/.eslintrc.js`
  },
  rules: {
    'capitalized-comments': [
      'warn',
      'never',
      {
        line: {
          ignorePattern: 'todo|fixme',
          ignoreInlineComments: true,
        },
        block: {
          ignorePattern: 'todo|fixme',
          ignoreInlineComments: true,
          ignoreConsecutiveComments: true,
        },
      },
    ],
  },
};
