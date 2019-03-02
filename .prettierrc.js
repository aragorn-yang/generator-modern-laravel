/* eslint-env node */
module.exports = {
  trailingComma: 'es5',
  tabWidth: 2,
  singleQuote: true,
  overrides: [
    {
      files: '*.test.js',
      options: {
        singleQuote: true,
      },
    },
  ],
};
