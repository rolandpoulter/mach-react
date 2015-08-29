'use strict';
import 'babel/polyfill';
import NewReact, { Component as NewComponent } from '../src/index';
import OldReact, { Component as OldComponent } from 'react';
import BenchmarkFactory from '../components/legacy/Benchmark';
window.onload = function () {
  let newDiv = document.createElement('div'),
      // oldDiv = document.createElement('div'),
      React;
  document.body.appendChild(newDiv);
  // document.body.appendChild(oldDiv);
  // console.log('OLD');
  // React = OldReact;
  // let OldBenchmark = BenchmarkFactory(OldComponent, OldReact);
  // OldReact.render(<OldBenchmark>OLD</OldBenchmark>, oldDiv, () => console.log('OLD LOADED'));
  // setTimeout(() => {
  console.log('NEW');
  React = NewReact;
  let NewBenchmark = BenchmarkFactory(NewComponent, NewReact);
  NewReact.render(<NewBenchmark>NEW</NewBenchmark>, newDiv, () => console.log('NEW LOADED'));
  // }, 6000);
}
