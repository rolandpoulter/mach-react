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

    reporters: ['progress', 'coverage'],

    coverageReporter: {
      type: 'text'
    },

    webpack: {
      module: {
        loaders: require('./webpack.config').module.loaders,
        preLoaders: [
          {
            test: /\.js$/,
            include: require('path').resolve('src/'),
            loader: 'isparta'
          }
        ]
      },
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
      require('karma-coverage'),
      require('karma-coveralls'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher')
    ],

    browsers: ['Chrome']
  });
};
