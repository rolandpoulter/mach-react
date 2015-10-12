'use strict';

module.exports = function(config) {
  require('./karma.conf')(config);

  config.set({
    autoWatch: false,
    singleRun: true,

    browsers: ['Chrome', 'Firefox']
  });
};
