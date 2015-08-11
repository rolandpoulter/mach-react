'use strict';

export default function mixin(...mixins) {
  return function decorator(Class) {
    Object.assign(Class.prototype, ...mixins);
  };
}
