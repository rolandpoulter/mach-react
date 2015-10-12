'use strict';

module.exports = function(config) {
  require('./karma.conf')(config);

  config.set({
    autoWatch: false,
    singleRun: true,

    reporters: ['progress', 'coverage', 'coveralls'],

    coverageReporter: {
      type: 'lcov', // lcov or lcovonly are required for generating lcov.info files
      dir: 'coverage/'
    },

    browsers: ['Chrome', 'Firefox']
  });
};
