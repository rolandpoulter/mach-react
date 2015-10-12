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

    // reporters: ['progress', 'coverage'],

    coverageReporter: {
      instrumenters: {isparta: require('isparta')},
      instrumenter: {'**/*.js': 'isparta'},
      instrumenterOptions: {isparta: {babel: {stage: 0}}}
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
      // require('karma-coverage'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher')
    ],

    browsers: ['Chrome', 'Firefox']
  });
};
