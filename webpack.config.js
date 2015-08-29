'use strict';

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
  }
};
