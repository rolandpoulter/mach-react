'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = setZeroTimeout;
exports.unsetZeroTimeout = unsetZeroTimeout;
var timeouts = [];
var messageName = 'zero-timeout-message';

var ids = {};

function setZeroTimeout(fn) {
  // TODO: add MutationObserver

  if (global.postMessage) {
    if (timeouts.indexOf(fn) === -1) timeouts.push(fn);
    return global.postMessage(messageName, '*');
  }

  ids[setTimeout(fn, 0)] = fn;
}

function unsetZeroTimeout(fn) {
  // TODO: remove MutationObserver

  if (global.postMessage) {
    var index = timeouts.indexOf(fn);
    if (index === -1) timeouts[index] = null;
    return;
  }

  clearTimeout(findId(fn));
}

function findId(fn) {
  for (var id in ids) {
    if (ids[id] === fn) return id;
  }return null;
}

if (typeof window !== 'undefined') {
  window.addEventListener('message', handleMessage, true);
} else {
  console.error(new Error('setZeroTimeout unavailable.'));
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