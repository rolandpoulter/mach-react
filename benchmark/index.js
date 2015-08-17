'use strict';
import 'babel/polyfill';
import NewReact, { Component as NewComponent } from '../src/index';
import OldReact, { Component as OldComponent } from 'react';
import TestComponentFactory from './views/TestComponent';
window.onload = function () {
  let newDiv = document.createElement('div'),
      oldDiv = document.createElement('div'),
      React;
  document.body.appendChild(newDiv);
  document.body.appendChild(oldDiv);
  console.log('OLD');
  React = OldReact;
  let OldTestComponent = TestComponentFactory(OldComponent, OldReact);
  OldReact.render(<OldTestComponent>OLD</OldTestComponent>, oldDiv, () => console.log('OLD LOADED'));
  setTimeout(() => {
    console.log('NEW');
    React = NewReact;
    let NewTestComponent = TestComponentFactory(NewComponent, NewReact);
    NewReact.render(<NewTestComponent>NEW</NewTestComponent>, newDiv, () => console.log('NEW LOADED'));
  }, 6000);
}
