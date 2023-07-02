const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/interface.ts', // path to your main TypeScript file
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.ts'],
  },
  output: {
    filename: 'bundle.js', // output bundled file
    path: path.resolve(__dirname, 'dist'),
  },
};
