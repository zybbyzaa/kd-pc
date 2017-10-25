'use strict';

process.env.BABEL_ENV = 'renderer';

const path = require('path');
const pkg = require('./app/package.json');
const settings = require('./config.js');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

let rendererConfig = {
  entry: {
    renderer: path.join(__dirname, 'app/renderer/index.js'),
    vendor: [
      'babel-polyfill',
      'react',
      'react-dom',
      'react-router',
      'mobx',
      'mobx-react',
      'axios'
    ]
  },
  output: {
    filename: 'js/[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, 'app/dist')
  },
  resolve: {
    alias: {
      components: path.join(__dirname, 'app/renderer/components'),
      pages: path.join(__dirname, 'app/renderer/pages'),
      renderer: path.join(__dirname, 'app/renderer')
    },
    extensions: ['.js', '.node']
  },
  resolveLoader: {
    moduleExtensions: ['-loader']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel?cacheDirectory',
        include: [path.resolve(__dirname, 'app/renderer')],
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        use: 'json'
      },
      {
        test: /\.node$/,
        use: 'node'
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style',
          use: [{ loader: 'css', options: { importLoaders: 1 } }, 'sass']
        })
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style',
          use: [{ loader: 'css', options: { importLoaders: 1 } }]
        })
      },
      {
        test: /.*\.(gif|png|jpe?g)$/i,
        use: [
          {
            loader: 'url',
            options: {
              name: 'images/[name].[ext]',
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: ['svg-inline-loader']
      },
      {
        test: /\.(woff|eot|ttf)([?]?.*)$/i,
        use: [
          {
            loader: 'url',
            options: {
              name: 'fonts/[name].[ext]',
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url',
            options: {
              mimetype: 'image/svg+xml',
              name: 'fonts/[name].[ext]',
              limit: 8192
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),
    new ExtractTextPlugin('css/styles.css'),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './app/index.html'
    }),
    new FriendlyErrorsPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  target: 'electron-renderer'
};

/**
 * Adjust rendererConfig for production settings
 */
if (process.env.NODE_ENV === 'production') {
  rendererConfig.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  );
}

module.exports = rendererConfig;
