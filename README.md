# Mach React
[![build status][1]][2]
[![NPM version][3]][4]
[![Coverage Status][5]][6]
[![Davis Dependency status][7]][8]
[![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges)

#### Pros
 * Only ~12.5KB when minified and gzipped. Read through the code in a day.
 * Works like React with Radium, does css auto-prefixing and merging.
 * Runs much faster than production React, less code === faster.
 * Unstrict, and immutability is optional.

##### Cons
 * Experiment and unstabled. Expect bugs and memory leaks.
 * Created by an insane web developer.
 * Unstrict, and immutability is optional.

##### Benchmark
Based on Todo example from React docs. This benchmark adds about 200 todos with very long strings and random numbers in them. It removes and re-adds the todos as much as possible for about 5 seconds. First it runs against React, then Mach React. On my machine Mach React runs about twice as fast as standard React in production mode.

![image](https://raw.githubusercontent.com/rolandpoulter/mach-react/master/benchmark.gif)

#### Credits
 * React Facebook -- Copied Component design.
 * Radium -- Copied css auto-prefixing and css mixins for Components.
 * virtual-dom -- Main dependency, provides virtual dom implementation.
 * material-ui -- Copied project build process.

[1]: https://secure.travis-ci.org/rolandpoulter/mach-react.svg
[2]: https://travis-ci.org/rolandpoulter/mach-react
[3]: https://badge.fury.io/js/mach-react.svg
[4]: https://badge.fury.io/js/mach-react
[5]: http://img.shields.io/coveralls/rolandpoulter/mach-react.svg
[6]: https://coveralls.io/r/rolandpoulter/mach-react
[7]: https://david-dm.org/rolandpoulter/mach-react.svg
[8]: https://david-dm.org/rolandpoulter/mach-react
