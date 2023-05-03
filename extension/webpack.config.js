const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    popup: path.join(__dirname, 'src', 'index.tsx'),
    contentScript: path.join(__dirname, 'src', 'contentScript.tsx'),
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      chunks: ['popup'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './public/manifest.json', to: './' },
      ],
    }),
  ],
};