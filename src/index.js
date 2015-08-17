'use strict';
import './assignPolyfill';
import machRadium from './machRadium';
import * as machReact from './machReact';
export Component from './Component';
let React = machReact;
export default React;
if (!global.React) global.React = machReact;
global.machReact = machReact;
