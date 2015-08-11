'use strict';
/* global window */

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = setZeroTimeout;
exports.unsetZeroTimeout = unsetZeroTimeout;
var timeouts = [];
var messageName = 'zero-timeout-message';

function setZeroTimeout(fn) {
  if (global.postMessage) {
    if (timeouts.indexOf(fn) === -1) timeouts.push(fn);
    global.postMessage(messageName, '*');
  } else setTimeout(fn, 0);
}

function unsetZeroTimeout(fn) {
  var index = timeouts.indexOf(fn);
  if (index === -1) timeouts[index] = null;
}

function handleMessage(event) {
  if (event.source === window && event.data === messageName) {
    event.stopPropagation();
    if (timeouts.length > 0) {
      var fn = timeouts.shift();
      if (fn) fn();
    }
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('message', handleMessage, true);
}