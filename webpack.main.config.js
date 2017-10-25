'use strict';

process.env.BABEL_ENV = 'main';

const path = require('path');
const pkg = require('./app/package.json');
const settings = require('./config.js');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

let mainConfig = {
  entry: {
    main: path.join(__dirname, 'app/main/index.js')
  },
  output: {
    filename: 'js/[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.js', '.json', '.node'],
    modules: [path.join(__dirname, 'node_modules')]
  },
  resolveLoader: {
    moduleExtensions: ['-loader']
  },
  node: {
    __dirname: false,
    __filename: false
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel?cacheDirectory',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.node$/,
        loader: 'node'
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([{ from: 'app/main/assets', to: 'assets' }]),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],
  target: 'electron-main'
};

module.exports = mainConfig;
