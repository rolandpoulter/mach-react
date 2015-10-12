'use strict';

var webpack = require('webpack');

module.exports = {
  entry: {
    app: ['./src/index.js']
  },
  module: {
    loaders: [
      { test: /\.jsx?/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  },
  output: {
    filename: './dist/mach-react.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })
  ]
};
