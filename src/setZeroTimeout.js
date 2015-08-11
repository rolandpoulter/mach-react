'use strict';
/* global window */

let timeouts = [];
let messageName = 'zero-timeout-message';

export default function setZeroTimeout(fn) {
  if (global.postMessage) {
    if (timeouts.indexOf(fn) === -1) timeouts.push(fn);
    global.postMessage(messageName, '*');
  }
  else setTimeout(fn, 0);
}

export function unsetZeroTimeout(fn) {
  let index = timeouts.indexOf(fn);
  if (index === -1) timeouts[index] = null;
}

function handleMessage(event) {
  if (event.source === window && event.data === messageName) {
    event.stopPropagation();
    if (timeouts.length > 0) {
      let fn = timeouts.shift();
      if (fn) fn();
    }
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('message', handleMessage, true);
}
