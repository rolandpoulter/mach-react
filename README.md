# Mach React
React without the training wheels. Only ~12KB when gzipped. In worst case scenarios can be as much as 10x faster than React.

![image](https://raw.githubusercontent.com/rolandpoulter/mach-react/master/benchmark.gif)

### Supports
 * props
 * context
 * setState
 * onChange

### Known Differences
 * cssSelector (untested)
 * render detacher (untested)
 * automatic style merging (untested)
 * automatic css auto prefixing (untested)
 * simplified props, context, and state
 * simplified onChange
 * no PropTypes checks
 * Component.defaultProps is not supported
 * No validation

### Known Issues
 * onChange listeners are leaking, seems to be a bug with virtual-dom not calling unhook
 * Nodes are not being garbage collected during stressTest, but afterwards they cleanup.

### Performance Improvement Ideas
 * http://dbaron.org/log/20100309-faster-timeouts

#### Credits
 * React Facebook
 * Radium
 * virtual-dom
 * material-ui
