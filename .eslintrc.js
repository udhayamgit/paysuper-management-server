module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  settings: {
    webpack: {
      config: require.resolve('@vue/cli-service/webpack.config.js'),
    },
    'import/resolver': {
      alias: {
        map: [
          ['@', './src/'],
        ],
        extensions: ['.vue', '.js'],
      },
    },
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-param-reassign': ['error', { ignorePropertyModificationsFor: ['state'] }],
    'no-nested-ternary': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    allowImportExportEverywhere: true,
  },
};
