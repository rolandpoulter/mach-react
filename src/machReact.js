'use strict';
import { create } from './virtualDOM';
export { render } from './virtualDOM';
export * as VirtualDOM from './virtualDOM';
export Component from './Component';
export function createElement(type, props, ...children) {
  return create(type, props, children);
}
