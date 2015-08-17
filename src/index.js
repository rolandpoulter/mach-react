'use strict';
import * as machReact from './machReact';
import machRadium from './machRadium';

export * as machReact from './machReact';
let React = machReact;
export default React;
export let Component = React.Component;

if (!global.React) global.React = machReact;
global.machReact = machReact;
