'use strict';

module.exports = function(config) {
  config.set({
    autoWatch: true,

    singleRun: false,

    files: ['test/index.js'],

    frameworks: ['mocha'],

    preprocessors: {
      'test/index.js': ['webpack']
    },

    client: {
      mocha: {
        reporter: 'html'
      }
    },

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

    webpackServer: {
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
