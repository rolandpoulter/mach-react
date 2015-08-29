'use strict';

var webpack = require('webpack');

module.exports = function(config) {
  config.set({

    files: ['test/index.js'],

    frameworks: ['mocha'],

    preprocessors: {
      'test/index.js': ['webpack']
    },

    reporters: ['html'],

    webpack: {
      module: require('./webpack.config').module,
      resolve: {
        modulesDirectories: [
          '',
          'src',
          'node_modules'
        ]
      }
    },

    webpackMiddleware: {
      noInfo: true
    },

    plugins: [
      require('karma-webpack'),
      require('karma-mocha'),
      require('karma-chrome-launcher')
    ],

    browsers: ['Chrome']
  });
};
