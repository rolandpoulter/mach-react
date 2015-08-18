'use strict';

export default function assignObject(target) {
  for (let i = 1, l = arguments.length; i < l; i++) {
    let source = arguments[i];
    if (!source) continue;
    for (let key in source) {
      let desc = Object.getOwnPropertyDescriptor(source, key);
      if (desc) Object.defineProperty(target, key, desc);
    }
  }
  return target;
}
