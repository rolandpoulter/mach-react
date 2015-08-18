'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = setZeroTimeout;
exports.unsetZeroTimeout = unsetZeroTimeout;
var timeouts = [];
var messageName = 'zero-timeout-message';

// let cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
// let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
//                             window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var ids = {};

// TODO: try MutationObserver

function setZeroTimeout(fn) {
  // if (requestAnimationFrame && cancelAnimationFrame) {
  //   return ids[requestAnimationFrame.call(window, fn)] = fn;
  // }
  // if (global.setImmediate) return ids[global.setImmediate(fn)] = fn;
  if (global.postMessage) {
    if (timeouts.indexOf(fn) === -1) timeouts.push(fn);
    return global.postMessage(messageName, '*');
  }
  ids[setTimeout(fn, 0)] = fn;
}

function unsetZeroTimeout(fn) {
  // if (requestAnimationFrame && cancelAnimationFrame) {
  //   return cancelAnimationFrame.call(window, findId(fn));
  // }
  // if (global.clearImmediate) return global.clearImmediate(findId(fn));
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

if (typeof window !== 'undefined') window.addEventListener('message', handleMessage, true);
function handleMessage(event) {
  if (event.source === window && event.data === messageName) {
    event.stopPropagation();
    if (timeouts.length > 0) {
      var fn = timeouts.shift();
      if (fn) fn();
    }
  }
}