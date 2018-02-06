var webpack = require('webpack');
var path = require('path');
var MinifyPlugin = require("babel-minify-webpack-plugin");

var BUILD_DIR = path.resolve(__dirname, 'dist');
var APP_DIR = path.resolve(__dirname, 'src');

var config = {
  entry: APP_DIR + '/index.js',
  output: {
    path: BUILD_DIR,
    filename: 'app.js'
  },
  plugins: [
  ],
  module : {
    rules: [
      {
        test : /\.js?/,
        include : APP_DIR,
        loader: 'babel-loader',
        query: {
          plugins: ['transform-class-properties']
        },
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  externals: {
    jquery: 'jQuery',
    drupal: 'Drupal',
  }
};

module.exports = config;
