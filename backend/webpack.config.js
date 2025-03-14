const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { resolve } = require('path');

module.exports = {
  entry: './src/main.ts',
  output: {
    path: resolve(__dirname, '../dist/backend'),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
    }),
  ],
};
