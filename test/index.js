'use strict';

global.chai = require('chai');
global.spies = require('chai-spies');
global.chai.use(global.spies);
global.should = global.chai.should();
global.expect = global.chai.expect;

/* eslint-disable quotes */
let testsContext = require.context(".", true, /_test$/);
testsContext.keys().forEach(testsContext);
