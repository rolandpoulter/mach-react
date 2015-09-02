/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { 'default': obj };
	}

	function _interopRequireWildcard(obj) {
	  if (obj && obj.__esModule) {
	    return obj;
	  } else {
	    var newObj = {};if (obj != null) {
	      for (var key in obj) {
	        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
	      }
	    }newObj['default'] = obj;return newObj;
	  }
	}

	var _machReact2 = __webpack_require__(45);

	var machReact = _interopRequireWildcard(_machReact2);

	var _machRadium = __webpack_require__(48);

	var _machRadium2 = _interopRequireDefault(_machRadium);

	var _machReact = _interopRequireWildcard(_machReact2);

	exports.machReact = _machReact;

	var React = machReact;
	exports['default'] = React;
	var Component = React.Component;

	exports.Component = Component;
	if (!global.React) global.React = machReact;
	global.machReact = machReact;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      }
	      throw TypeError('Uncaught, unspecified "error" event.');
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        len = arguments.length;
	        args = new Array(len - 1);
	        for (i = 1; i < len; i++)
	          args[i - 1] = arguments[i];
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    len = arguments.length;
	    args = new Array(len - 1);
	    for (i = 1; i < len; i++)
	      args[i - 1] = arguments[i];

	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    var m;
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  var ret;
	  if (!emitter._events || !emitter._events[type])
	    ret = 0;
	  else if (isFunction(emitter._events[type]))
	    ret = 1;
	  else
	    ret = emitter._events[type].length;
	  return ret;
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var diff = __webpack_require__(7)
	var patch = __webpack_require__(20)
	var h = __webpack_require__(29)
	var create = __webpack_require__(40)
	var VNode = __webpack_require__(31)
	var VText = __webpack_require__(32)

	module.exports = {
	    diff: diff,
	    patch: patch,
	    h: h,
	    create: create,
	    VNode: VNode,
	    VText: VText
	}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var diff = __webpack_require__(8)

	module.exports = diff


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(9)

	var VPatch = __webpack_require__(10)
	var isVNode = __webpack_require__(12)
	var isVText = __webpack_require__(13)
	var isWidget = __webpack_require__(14)
	var isThunk = __webpack_require__(15)
	var handleThunk = __webpack_require__(16)

	var diffProps = __webpack_require__(17)

	module.exports = diff

	function diff(a, b) {
	    var patch = { a: a }
	    walk(a, b, patch, 0)
	    return patch
	}

	function walk(a, b, patch, index) {
	    if (a === b) {
	        return
	    }

	    var apply = patch[index]
	    var applyClear = false

	    if (isThunk(a) || isThunk(b)) {
	        thunks(a, b, patch, index)
	    } else if (b == null) {

	        // If a is a widget we will add a remove patch for it
	        // Otherwise any child widgets/hooks must be destroyed.
	        // This prevents adding two remove patches for a widget.
	        if (!isWidget(a)) {
	            clearState(a, patch, index)
	            apply = patch[index]
	        }

	        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
	    } else if (isVNode(b)) {
	        if (isVNode(a)) {
	            if (a.tagName === b.tagName &&
	                a.namespace === b.namespace &&
	                a.key === b.key) {
	                var propsPatch = diffProps(a.properties, b.properties)
	                if (propsPatch) {
	                    apply = appendPatch(apply,
	                        new VPatch(VPatch.PROPS, a, propsPatch))
	                }
	                apply = diffChildren(a, b, patch, apply, index)
	            } else {
	                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
	                applyClear = true
	            }
	        } else {
	            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
	            applyClear = true
	        }
	    } else if (isVText(b)) {
	        if (!isVText(a)) {
	            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
	            applyClear = true
	        } else if (a.text !== b.text) {
	            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
	        }
	    } else if (isWidget(b)) {
	        if (!isWidget(a)) {
	            applyClear = true
	        }

	        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
	    }

	    if (apply) {
	        patch[index] = apply
	    }

	    if (applyClear) {
	        clearState(a, patch, index)
	    }
	}

	function diffChildren(a, b, patch, apply, index) {
	    var aChildren = a.children
	    var orderedSet = reorder(aChildren, b.children)
	    var bChildren = orderedSet.children

	    var aLen = aChildren.length
	    var bLen = bChildren.length
	    var len = aLen > bLen ? aLen : bLen

	    for (var i = 0; i < len; i++) {
	        var leftNode = aChildren[i]
	        var rightNode = bChildren[i]
	        index += 1

	        if (!leftNode) {
	            if (rightNode) {
	                // Excess nodes in b need to be added
	                apply = appendPatch(apply,
	                    new VPatch(VPatch.INSERT, null, rightNode))
	            }
	        } else {
	            walk(leftNode, rightNode, patch, index)
	        }

	        if (isVNode(leftNode) && leftNode.count) {
	            index += leftNode.count
	        }
	    }

	    if (orderedSet.moves) {
	        // Reorder nodes last
	        apply = appendPatch(apply, new VPatch(
	            VPatch.ORDER,
	            a,
	            orderedSet.moves
	        ))
	    }

	    return apply
	}

	function clearState(vNode, patch, index) {
	    // TODO: Make this a single walk, not two
	    unhook(vNode, patch, index)
	    destroyWidgets(vNode, patch, index)
	}

	// Patch records for all destroyed widgets must be added because we need
	// a DOM node reference for the destroy function
	function destroyWidgets(vNode, patch, index) {
	    if (isWidget(vNode)) {
	        if (typeof vNode.destroy === "function") {
	            patch[index] = appendPatch(
	                patch[index],
	                new VPatch(VPatch.REMOVE, vNode, null)
	            )
	        }
	    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
	        var children = vNode.children
	        var len = children.length
	        for (var i = 0; i < len; i++) {
	            var child = children[i]
	            index += 1

	            destroyWidgets(child, patch, index)

	            if (isVNode(child) && child.count) {
	                index += child.count
	            }
	        }
	    } else if (isThunk(vNode)) {
	        thunks(vNode, null, patch, index)
	    }
	}

	// Create a sub-patch for thunks
	function thunks(a, b, patch, index) {
	    var nodes = handleThunk(a, b)
	    var thunkPatch = diff(nodes.a, nodes.b)
	    if (hasPatches(thunkPatch)) {
	        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
	    }
	}

	function hasPatches(patch) {
	    for (var index in patch) {
	        if (index !== "a") {
	            return true
	        }
	    }

	    return false
	}

	// Execute hooks when two nodes are identical
	function unhook(vNode, patch, index) {
	    if (isVNode(vNode)) {
	        if (vNode.hooks) {
	            patch[index] = appendPatch(
	                patch[index],
	                new VPatch(
	                    VPatch.PROPS,
	                    vNode,
	                    undefinedKeys(vNode.hooks)
	                )
	            )
	        }

	        if (vNode.descendantHooks || vNode.hasThunks) {
	            var children = vNode.children
	            var len = children.length
	            for (var i = 0; i < len; i++) {
	                var child = children[i]
	                index += 1

	                unhook(child, patch, index)

	                if (isVNode(child) && child.count) {
	                    index += child.count
	                }
	            }
	        }
	    } else if (isThunk(vNode)) {
	        thunks(vNode, null, patch, index)
	    }
	}

	function undefinedKeys(obj) {
	    var result = {}

	    for (var key in obj) {
	        result[key] = undefined
	    }

	    return result
	}

	// List diff, naive left to right reordering
	function reorder(aChildren, bChildren) {
	    // O(M) time, O(M) memory
	    var bChildIndex = keyIndex(bChildren)
	    var bKeys = bChildIndex.keys
	    var bFree = bChildIndex.free

	    if (bFree.length === bChildren.length) {
	        return {
	            children: bChildren,
	            moves: null
	        }
	    }

	    // O(N) time, O(N) memory
	    var aChildIndex = keyIndex(aChildren)
	    var aKeys = aChildIndex.keys
	    var aFree = aChildIndex.free

	    if (aFree.length === aChildren.length) {
	        return {
	            children: bChildren,
	            moves: null
	        }
	    }

	    // O(MAX(N, M)) memory
	    var newChildren = []

	    var freeIndex = 0
	    var freeCount = bFree.length
	    var deletedItems = 0

	    // Iterate through a and match a node in b
	    // O(N) time,
	    for (var i = 0 ; i < aChildren.length; i++) {
	        var aItem = aChildren[i]
	        var itemIndex

	        if (aItem.key) {
	            if (bKeys.hasOwnProperty(aItem.key)) {
	                // Match up the old keys
	                itemIndex = bKeys[aItem.key]
	                newChildren.push(bChildren[itemIndex])

	            } else {
	                // Remove old keyed items
	                itemIndex = i - deletedItems++
	                newChildren.push(null)
	            }
	        } else {
	            // Match the item in a with the next free item in b
	            if (freeIndex < freeCount) {
	                itemIndex = bFree[freeIndex++]
	                newChildren.push(bChildren[itemIndex])
	            } else {
	                // There are no free items in b to match with
	                // the free items in a, so the extra free nodes
	                // are deleted.
	                itemIndex = i - deletedItems++
	                newChildren.push(null)
	            }
	        }
	    }

	    var lastFreeIndex = freeIndex >= bFree.length ?
	        bChildren.length :
	        bFree[freeIndex]

	    // Iterate through b and append any new keys
	    // O(M) time
	    for (var j = 0; j < bChildren.length; j++) {
	        var newItem = bChildren[j]

	        if (newItem.key) {
	            if (!aKeys.hasOwnProperty(newItem.key)) {
	                // Add any new keyed items
	                // We are adding new items to the end and then sorting them
	                // in place. In future we should insert new items in place.
	                newChildren.push(newItem)
	            }
	        } else if (j >= lastFreeIndex) {
	            // Add any leftover non-keyed items
	            newChildren.push(newItem)
	        }
	    }

	    var simulate = newChildren.slice()
	    var simulateIndex = 0
	    var removes = []
	    var inserts = []
	    var simulateItem

	    for (var k = 0; k < bChildren.length;) {
	        var wantedItem = bChildren[k]
	        simulateItem = simulate[simulateIndex]

	        // remove items
	        while (simulateItem === null && simulate.length) {
	            removes.push(remove(simulate, simulateIndex, null))
	            simulateItem = simulate[simulateIndex]
	        }

	        if (!simulateItem || simulateItem.key !== wantedItem.key) {
	            // if we need a key in this position...
	            if (wantedItem.key) {
	                if (simulateItem && simulateItem.key) {
	                    // if an insert doesn't put this key in place, it needs to move
	                    if (bKeys[simulateItem.key] !== k + 1) {
	                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
	                        simulateItem = simulate[simulateIndex]
	                        // if the remove didn't put the wanted item in place, we need to insert it
	                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
	                            inserts.push({key: wantedItem.key, to: k})
	                        }
	                        // items are matching, so skip ahead
	                        else {
	                            simulateIndex++
	                        }
	                    }
	                    else {
	                        inserts.push({key: wantedItem.key, to: k})
	                    }
	                }
	                else {
	                    inserts.push({key: wantedItem.key, to: k})
	                }
	                k++
	            }
	            // a key in simulate has no matching wanted key, remove it
	            else if (simulateItem && simulateItem.key) {
	                removes.push(remove(simulate, simulateIndex, simulateItem.key))
	            }
	        }
	        else {
	            simulateIndex++
	            k++
	        }
	    }

	    // remove all the remaining nodes from simulate
	    while(simulateIndex < simulate.length) {
	        simulateItem = simulate[simulateIndex]
	        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
	    }

	    // If the only moves we have are deletes then we can just
	    // let the delete patch remove these items.
	    if (removes.length === deletedItems && !inserts.length) {
	        return {
	            children: newChildren,
	            moves: null
	        }
	    }

	    return {
	        children: newChildren,
	        moves: {
	            removes: removes,
	            inserts: inserts
	        }
	    }
	}

	function remove(arr, index, key) {
	    arr.splice(index, 1)

	    return {
	        from: index,
	        key: key
	    }
	}

	function keyIndex(children) {
	    var keys = {}
	    var free = []
	    var length = children.length

	    for (var i = 0; i < length; i++) {
	        var child = children[i]

	        if (child.key) {
	            keys[child.key] = i
	        } else {
	            free.push(i)
	        }
	    }

	    return {
	        keys: keys,     // A hash of key name to index
	        free: free      // An array of unkeyed item indices
	    }
	}

	function appendPatch(apply, patch) {
	    if (apply) {
	        if (isArray(apply)) {
	            apply.push(patch)
	        } else {
	            apply = [apply, patch]
	        }

	        return apply
	    } else {
	        return patch
	    }
	}


/***/ },
/* 9 */
/***/ function(module, exports) {

	var nativeIsArray = Array.isArray
	var toString = Object.prototype.toString

	module.exports = nativeIsArray || isArray

	function isArray(obj) {
	    return toString.call(obj) === "[object Array]"
	}


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var version = __webpack_require__(11)

	VirtualPatch.NONE = 0
	VirtualPatch.VTEXT = 1
	VirtualPatch.VNODE = 2
	VirtualPatch.WIDGET = 3
	VirtualPatch.PROPS = 4
	VirtualPatch.ORDER = 5
	VirtualPatch.INSERT = 6
	VirtualPatch.REMOVE = 7
	VirtualPatch.THUNK = 8

	module.exports = VirtualPatch

	function VirtualPatch(type, vNode, patch) {
	    this.type = Number(type)
	    this.vNode = vNode
	    this.patch = patch
	}

	VirtualPatch.prototype.version = version
	VirtualPatch.prototype.type = "VirtualPatch"


/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = "2"


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var version = __webpack_require__(11)

	module.exports = isVirtualNode

	function isVirtualNode(x) {
	    return x && x.type === "VirtualNode" && x.version === version
	}


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var version = __webpack_require__(11)

	module.exports = isVirtualText

	function isVirtualText(x) {
	    return x && x.type === "VirtualText" && x.version === version
	}


/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = isWidget

	function isWidget(w) {
	    return w && w.type === "Widget"
	}


/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = isThunk

	function isThunk(t) {
	    return t && t.type === "Thunk"
	}


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var isVNode = __webpack_require__(12)
	var isVText = __webpack_require__(13)
	var isWidget = __webpack_require__(14)
	var isThunk = __webpack_require__(15)

	module.exports = handleThunk

	function handleThunk(a, b) {
	    var renderedA = a
	    var renderedB = b

	    if (isThunk(b)) {
	        renderedB = renderThunk(b, a)
	    }

	    if (isThunk(a)) {
	        renderedA = renderThunk(a, null)
	    }

	    return {
	        a: renderedA,
	        b: renderedB
	    }
	}

	function renderThunk(thunk, previous) {
	    var renderedThunk = thunk.vnode

	    if (!renderedThunk) {
	        renderedThunk = thunk.vnode = thunk.render(previous)
	    }

	    if (!(isVNode(renderedThunk) ||
	            isVText(renderedThunk) ||
	            isWidget(renderedThunk))) {
	        throw new Error("thunk did not return a valid node");
	    }

	    return renderedThunk
	}


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(18)
	var isHook = __webpack_require__(19)

	module.exports = diffProps

	function diffProps(a, b) {
	    var diff

	    for (var aKey in a) {
	        if (!(aKey in b)) {
	            diff = diff || {}
	            diff[aKey] = undefined
	        }

	        var aValue = a[aKey]
	        var bValue = b[aKey]

	        if (aValue === bValue) {
	            continue
	        } else if (isObject(aValue) && isObject(bValue)) {
	            if (getPrototype(bValue) !== getPrototype(aValue)) {
	                diff = diff || {}
	                diff[aKey] = bValue
	            } else if (isHook(bValue)) {
	                 diff = diff || {}
	                 diff[aKey] = bValue
	            } else {
	                var objectDiff = diffProps(aValue, bValue)
	                if (objectDiff) {
	                    diff = diff || {}
	                    diff[aKey] = objectDiff
	                }
	            }
	        } else {
	            diff = diff || {}
	            diff[aKey] = bValue
	        }
	    }

	    for (var bKey in b) {
	        if (!(bKey in a)) {
	            diff = diff || {}
	            diff[bKey] = b[bKey]
	        }
	    }

	    return diff
	}

	function getPrototype(value) {
	  if (Object.getPrototypeOf) {
	    return Object.getPrototypeOf(value)
	  } else if (value.__proto__) {
	    return value.__proto__
	  } else if (value.constructor) {
	    return value.constructor.prototype
	  }
	}


/***/ },
/* 18 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function isObject(x) {
		return typeof x === "object" && x !== null;
	};


/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = isHook

	function isHook(hook) {
	    return hook &&
	      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
	       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
	}


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var patch = __webpack_require__(21)

	module.exports = patch


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var document = __webpack_require__(22)
	var isArray = __webpack_require__(9)

	var render = __webpack_require__(24)
	var domIndex = __webpack_require__(26)
	var patchOp = __webpack_require__(27)
	module.exports = patch

	function patch(rootNode, patches, renderOptions) {
	    renderOptions = renderOptions || {}
	    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch
	        ? renderOptions.patch
	        : patchRecursive
	    renderOptions.render = renderOptions.render || render

	    return renderOptions.patch(rootNode, patches, renderOptions)
	}

	function patchRecursive(rootNode, patches, renderOptions) {
	    var indices = patchIndices(patches)

	    if (indices.length === 0) {
	        return rootNode
	    }

	    var index = domIndex(rootNode, patches.a, indices)
	    var ownerDocument = rootNode.ownerDocument

	    if (!renderOptions.document && ownerDocument !== document) {
	        renderOptions.document = ownerDocument
	    }

	    for (var i = 0; i < indices.length; i++) {
	        var nodeIndex = indices[i]
	        rootNode = applyPatch(rootNode,
	            index[nodeIndex],
	            patches[nodeIndex],
	            renderOptions)
	    }

	    return rootNode
	}

	function applyPatch(rootNode, domNode, patchList, renderOptions) {
	    if (!domNode) {
	        return rootNode
	    }

	    var newNode

	    if (isArray(patchList)) {
	        for (var i = 0; i < patchList.length; i++) {
	            newNode = patchOp(patchList[i], domNode, renderOptions)

	            if (domNode === rootNode) {
	                rootNode = newNode
	            }
	        }
	    } else {
	        newNode = patchOp(patchList, domNode, renderOptions)

	        if (domNode === rootNode) {
	            rootNode = newNode
	        }
	    }

	    return rootNode
	}

	function patchIndices(patches) {
	    var indices = []

	    for (var key in patches) {
	        if (key !== "a") {
	            indices.push(Number(key))
	        }
	    }

	    return indices
	}


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var topLevel = typeof global !== 'undefined' ? global :
	    typeof window !== 'undefined' ? window : {}
	var minDoc = __webpack_require__(23);

	if (typeof document !== 'undefined') {
	    module.exports = document;
	} else {
	    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

	    if (!doccy) {
	        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
	    }

	    module.exports = doccy;
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 23 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var document = __webpack_require__(22)

	var applyProperties = __webpack_require__(25)

	var isVNode = __webpack_require__(12)
	var isVText = __webpack_require__(13)
	var isWidget = __webpack_require__(14)
	var handleThunk = __webpack_require__(16)

	module.exports = createElement

	function createElement(vnode, opts) {
	    var doc = opts ? opts.document || document : document
	    var warn = opts ? opts.warn : null

	    vnode = handleThunk(vnode).a

	    if (isWidget(vnode)) {
	        return vnode.init()
	    } else if (isVText(vnode)) {
	        return doc.createTextNode(vnode.text)
	    } else if (!isVNode(vnode)) {
	        if (warn) {
	            warn("Item is not a valid virtual dom node", vnode)
	        }
	        return null
	    }

	    var node = (vnode.namespace === null) ?
	        doc.createElement(vnode.tagName) :
	        doc.createElementNS(vnode.namespace, vnode.tagName)

	    var props = vnode.properties
	    applyProperties(node, props)

	    var children = vnode.children

	    for (var i = 0; i < children.length; i++) {
	        var childNode = createElement(children[i], opts)
	        if (childNode) {
	            node.appendChild(childNode)
	        }
	    }

	    return node
	}


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(18)
	var isHook = __webpack_require__(19)

	module.exports = applyProperties

	function applyProperties(node, props, previous) {
	    for (var propName in props) {
	        var propValue = props[propName]

	        if (propValue === undefined) {
	            removeProperty(node, propName, propValue, previous);
	        } else if (isHook(propValue)) {
	            removeProperty(node, propName, propValue, previous)
	            if (propValue.hook) {
	                propValue.hook(node,
	                    propName,
	                    previous ? previous[propName] : undefined)
	            }
	        } else {
	            if (isObject(propValue)) {
	                patchObject(node, props, previous, propName, propValue);
	            } else {
	                node[propName] = propValue
	            }
	        }
	    }
	}

	function removeProperty(node, propName, propValue, previous) {
	    if (previous) {
	        var previousValue = previous[propName]

	        if (!isHook(previousValue)) {
	            if (propName === "attributes") {
	                for (var attrName in previousValue) {
	                    node.removeAttribute(attrName)
	                }
	            } else if (propName === "style") {
	                for (var i in previousValue) {
	                    node.style[i] = ""
	                }
	            } else if (typeof previousValue === "string") {
	                node[propName] = ""
	            } else {
	                node[propName] = null
	            }
	        } else if (previousValue.unhook) {
	            previousValue.unhook(node, propName, propValue)
	        }
	    }
	}

	function patchObject(node, props, previous, propName, propValue) {
	    var previousValue = previous ? previous[propName] : undefined

	    // Set attributes
	    if (propName === "attributes") {
	        for (var attrName in propValue) {
	            var attrValue = propValue[attrName]

	            if (attrValue === undefined) {
	                node.removeAttribute(attrName)
	            } else {
	                node.setAttribute(attrName, attrValue)
	            }
	        }

	        return
	    }

	    if(previousValue && isObject(previousValue) &&
	        getPrototype(previousValue) !== getPrototype(propValue)) {
	        node[propName] = propValue
	        return
	    }

	    if (!isObject(node[propName])) {
	        node[propName] = {}
	    }

	    var replacer = propName === "style" ? "" : undefined

	    for (var k in propValue) {
	        var value = propValue[k]
	        node[propName][k] = (value === undefined) ? replacer : value
	    }
	}

	function getPrototype(value) {
	    if (Object.getPrototypeOf) {
	        return Object.getPrototypeOf(value)
	    } else if (value.__proto__) {
	        return value.__proto__
	    } else if (value.constructor) {
	        return value.constructor.prototype
	    }
	}


/***/ },
/* 26 */
/***/ function(module, exports) {

	// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
	// We don't want to read all of the DOM nodes in the tree so we use
	// the in-order tree indexing to eliminate recursion down certain branches.
	// We only recurse into a DOM node if we know that it contains a child of
	// interest.

	var noChild = {}

	module.exports = domIndex

	function domIndex(rootNode, tree, indices, nodes) {
	    if (!indices || indices.length === 0) {
	        return {}
	    } else {
	        indices.sort(ascending)
	        return recurse(rootNode, tree, indices, nodes, 0)
	    }
	}

	function recurse(rootNode, tree, indices, nodes, rootIndex) {
	    nodes = nodes || {}


	    if (rootNode) {
	        if (indexInRange(indices, rootIndex, rootIndex)) {
	            nodes[rootIndex] = rootNode
	        }

	        var vChildren = tree.children

	        if (vChildren) {

	            var childNodes = rootNode.childNodes

	            for (var i = 0; i < tree.children.length; i++) {
	                rootIndex += 1

	                var vChild = vChildren[i] || noChild
	                var nextIndex = rootIndex + (vChild.count || 0)

	                // skip recursion down the tree if there are no nodes down here
	                if (indexInRange(indices, rootIndex, nextIndex)) {
	                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
	                }

	                rootIndex = nextIndex
	            }
	        }
	    }

	    return nodes
	}

	// Binary search for an index in the interval [left, right]
	function indexInRange(indices, left, right) {
	    if (indices.length === 0) {
	        return false
	    }

	    var minIndex = 0
	    var maxIndex = indices.length - 1
	    var currentIndex
	    var currentItem

	    while (minIndex <= maxIndex) {
	        currentIndex = ((maxIndex + minIndex) / 2) >> 0
	        currentItem = indices[currentIndex]

	        if (minIndex === maxIndex) {
	            return currentItem >= left && currentItem <= right
	        } else if (currentItem < left) {
	            minIndex = currentIndex + 1
	        } else  if (currentItem > right) {
	            maxIndex = currentIndex - 1
	        } else {
	            return true
	        }
	    }

	    return false;
	}

	function ascending(a, b) {
	    return a > b ? 1 : -1
	}


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var applyProperties = __webpack_require__(25)

	var isWidget = __webpack_require__(14)
	var VPatch = __webpack_require__(10)

	var updateWidget = __webpack_require__(28)

	module.exports = applyPatch

	function applyPatch(vpatch, domNode, renderOptions) {
	    var type = vpatch.type
	    var vNode = vpatch.vNode
	    var patch = vpatch.patch

	    switch (type) {
	        case VPatch.REMOVE:
	            return removeNode(domNode, vNode)
	        case VPatch.INSERT:
	            return insertNode(domNode, patch, renderOptions)
	        case VPatch.VTEXT:
	            return stringPatch(domNode, vNode, patch, renderOptions)
	        case VPatch.WIDGET:
	            return widgetPatch(domNode, vNode, patch, renderOptions)
	        case VPatch.VNODE:
	            return vNodePatch(domNode, vNode, patch, renderOptions)
	        case VPatch.ORDER:
	            reorderChildren(domNode, patch)
	            return domNode
	        case VPatch.PROPS:
	            applyProperties(domNode, patch, vNode.properties)
	            return domNode
	        case VPatch.THUNK:
	            return replaceRoot(domNode,
	                renderOptions.patch(domNode, patch, renderOptions))
	        default:
	            return domNode
	    }
	}

	function removeNode(domNode, vNode) {
	    var parentNode = domNode.parentNode

	    if (parentNode) {
	        parentNode.removeChild(domNode)
	    }

	    destroyWidget(domNode, vNode);

	    return null
	}

	function insertNode(parentNode, vNode, renderOptions) {
	    var newNode = renderOptions.render(vNode, renderOptions)

	    if (parentNode) {
	        parentNode.appendChild(newNode)
	    }

	    return parentNode
	}

	function stringPatch(domNode, leftVNode, vText, renderOptions) {
	    var newNode

	    if (domNode.nodeType === 3) {
	        domNode.replaceData(0, domNode.length, vText.text)
	        newNode = domNode
	    } else {
	        var parentNode = domNode.parentNode
	        newNode = renderOptions.render(vText, renderOptions)

	        if (parentNode && newNode !== domNode) {
	            parentNode.replaceChild(newNode, domNode)
	        }
	    }

	    return newNode
	}

	function widgetPatch(domNode, leftVNode, widget, renderOptions) {
	    var updating = updateWidget(leftVNode, widget)
	    var newNode

	    if (updating) {
	        newNode = widget.update(leftVNode, domNode) || domNode
	    } else {
	        newNode = renderOptions.render(widget, renderOptions)
	    }

	    var parentNode = domNode.parentNode

	    if (parentNode && newNode !== domNode) {
	        parentNode.replaceChild(newNode, domNode)
	    }

	    if (!updating) {
	        destroyWidget(domNode, leftVNode)
	    }

	    return newNode
	}

	function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
	    var parentNode = domNode.parentNode
	    var newNode = renderOptions.render(vNode, renderOptions)

	    if (parentNode && newNode !== domNode) {
	        parentNode.replaceChild(newNode, domNode)
	    }

	    return newNode
	}

	function destroyWidget(domNode, w) {
	    if (typeof w.destroy === "function" && isWidget(w)) {
	        w.destroy(domNode)
	    }
	}

	function reorderChildren(domNode, moves) {
	    var childNodes = domNode.childNodes
	    var keyMap = {}
	    var node
	    var remove
	    var insert

	    for (var i = 0; i < moves.removes.length; i++) {
	        remove = moves.removes[i]
	        node = childNodes[remove.from]
	        if (remove.key) {
	            keyMap[remove.key] = node
	        }
	        domNode.removeChild(node)
	    }

	    var length = childNodes.length
	    for (var j = 0; j < moves.inserts.length; j++) {
	        insert = moves.inserts[j]
	        node = keyMap[insert.key]
	        // this is the weirdest bug i've ever seen in webkit
	        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
	    }
	}

	function replaceRoot(oldRoot, newRoot) {
	    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
	        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
	    }

	    return newRoot;
	}


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var isWidget = __webpack_require__(14)

	module.exports = updateWidget

	function updateWidget(a, b) {
	    if (isWidget(a) && isWidget(b)) {
	        if ("name" in a && "name" in b) {
	            return a.id === b.id
	        } else {
	            return a.init === b.init
	        }
	    }

	    return false
	}


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var h = __webpack_require__(30)

	module.exports = h


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isArray = __webpack_require__(9);

	var VNode = __webpack_require__(31);
	var VText = __webpack_require__(32);
	var isVNode = __webpack_require__(12);
	var isVText = __webpack_require__(13);
	var isWidget = __webpack_require__(14);
	var isHook = __webpack_require__(19);
	var isVThunk = __webpack_require__(15);

	var parseTag = __webpack_require__(33);
	var softSetHook = __webpack_require__(35);
	var evHook = __webpack_require__(36);

	module.exports = h;

	function h(tagName, properties, children) {
	    var childNodes = [];
	    var tag, props, key, namespace;

	    if (!children && isChildren(properties)) {
	        children = properties;
	        props = {};
	    }

	    props = props || properties || {};
	    tag = parseTag(tagName, props);

	    // support keys
	    if (props.hasOwnProperty('key')) {
	        key = props.key;
	        props.key = undefined;
	    }

	    // support namespace
	    if (props.hasOwnProperty('namespace')) {
	        namespace = props.namespace;
	        props.namespace = undefined;
	    }

	    // fix cursor bug
	    if (tag === 'INPUT' &&
	        !namespace &&
	        props.hasOwnProperty('value') &&
	        props.value !== undefined &&
	        !isHook(props.value)
	    ) {
	        props.value = softSetHook(props.value);
	    }

	    transformProperties(props);

	    if (children !== undefined && children !== null) {
	        addChild(children, childNodes, tag, props);
	    }


	    return new VNode(tag, props, childNodes, key, namespace);
	}

	function addChild(c, childNodes, tag, props) {
	    if (typeof c === 'string') {
	        childNodes.push(new VText(c));
	    } else if (typeof c === 'number') {
	        childNodes.push(new VText(String(c)));
	    } else if (isChild(c)) {
	        childNodes.push(c);
	    } else if (isArray(c)) {
	        for (var i = 0; i < c.length; i++) {
	            addChild(c[i], childNodes, tag, props);
	        }
	    } else if (c === null || c === undefined) {
	        return;
	    } else {
	        throw UnexpectedVirtualElement({
	            foreignObject: c,
	            parentVnode: {
	                tagName: tag,
	                properties: props
	            }
	        });
	    }
	}

	function transformProperties(props) {
	    for (var propName in props) {
	        if (props.hasOwnProperty(propName)) {
	            var value = props[propName];

	            if (isHook(value)) {
	                continue;
	            }

	            if (propName.substr(0, 3) === 'ev-') {
	                // add ev-foo support
	                props[propName] = evHook(value);
	            }
	        }
	    }
	}

	function isChild(x) {
	    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
	}

	function isChildren(x) {
	    return typeof x === 'string' || isArray(x) || isChild(x);
	}

	function UnexpectedVirtualElement(data) {
	    var err = new Error();

	    err.type = 'virtual-hyperscript.unexpected.virtual-element';
	    err.message = 'Unexpected virtual child passed to h().\n' +
	        'Expected a VNode / Vthunk / VWidget / string but:\n' +
	        'got:\n' +
	        errorString(data.foreignObject) +
	        '.\n' +
	        'The parent vnode is:\n' +
	        errorString(data.parentVnode)
	        '\n' +
	        'Suggested fix: change your `h(..., [ ... ])` callsite.';
	    err.foreignObject = data.foreignObject;
	    err.parentVnode = data.parentVnode;

	    return err;
	}

	function errorString(obj) {
	    try {
	        return JSON.stringify(obj, null, '    ');
	    } catch (e) {
	        return String(obj);
	    }
	}


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var version = __webpack_require__(11)
	var isVNode = __webpack_require__(12)
	var isWidget = __webpack_require__(14)
	var isThunk = __webpack_require__(15)
	var isVHook = __webpack_require__(19)

	module.exports = VirtualNode

	var noProperties = {}
	var noChildren = []

	function VirtualNode(tagName, properties, children, key, namespace) {
	    this.tagName = tagName
	    this.properties = properties || noProperties
	    this.children = children || noChildren
	    this.key = key != null ? String(key) : undefined
	    this.namespace = (typeof namespace === "string") ? namespace : null

	    var count = (children && children.length) || 0
	    var descendants = 0
	    var hasWidgets = false
	    var hasThunks = false
	    var descendantHooks = false
	    var hooks

	    for (var propName in properties) {
	        if (properties.hasOwnProperty(propName)) {
	            var property = properties[propName]
	            if (isVHook(property) && property.unhook) {
	                if (!hooks) {
	                    hooks = {}
	                }

	                hooks[propName] = property
	            }
	        }
	    }

	    for (var i = 0; i < count; i++) {
	        var child = children[i]
	        if (isVNode(child)) {
	            descendants += child.count || 0

	            if (!hasWidgets && child.hasWidgets) {
	                hasWidgets = true
	            }

	            if (!hasThunks && child.hasThunks) {
	                hasThunks = true
	            }

	            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
	                descendantHooks = true
	            }
	        } else if (!hasWidgets && isWidget(child)) {
	            if (typeof child.destroy === "function") {
	                hasWidgets = true
	            }
	        } else if (!hasThunks && isThunk(child)) {
	            hasThunks = true;
	        }
	    }

	    this.count = count + descendants
	    this.hasWidgets = hasWidgets
	    this.hasThunks = hasThunks
	    this.hooks = hooks
	    this.descendantHooks = descendantHooks
	}

	VirtualNode.prototype.version = version
	VirtualNode.prototype.type = "VirtualNode"


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var version = __webpack_require__(11)

	module.exports = VirtualText

	function VirtualText(text) {
	    this.text = String(text)
	}

	VirtualText.prototype.version = version
	VirtualText.prototype.type = "VirtualText"


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var split = __webpack_require__(34);

	var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
	var notClassId = /^\.|#/;

	module.exports = parseTag;

	function parseTag(tag, props) {
	    if (!tag) {
	        return 'DIV';
	    }

	    var noId = !(props.hasOwnProperty('id'));

	    var tagParts = split(tag, classIdSplit);
	    var tagName = null;

	    if (notClassId.test(tagParts[1])) {
	        tagName = 'DIV';
	    }

	    var classes, part, type, i;

	    for (i = 0; i < tagParts.length; i++) {
	        part = tagParts[i];

	        if (!part) {
	            continue;
	        }

	        type = part.charAt(0);

	        if (!tagName) {
	            tagName = part;
	        } else if (type === '.') {
	            classes = classes || [];
	            classes.push(part.substring(1, part.length));
	        } else if (type === '#' && noId) {
	            props.id = part.substring(1, part.length);
	        }
	    }

	    if (classes) {
	        if (props.className) {
	            classes.push(props.className);
	        }

	        props.className = classes.join(' ');
	    }

	    return props.namespace ? tagName : tagName.toUpperCase();
	}


/***/ },
/* 34 */
/***/ function(module, exports) {

	/*!
	 * Cross-Browser Split 1.1.1
	 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
	 * Available under the MIT License
	 * ECMAScript compliant, uniform cross-browser split method
	 */

	/**
	 * Splits a string into an array of strings using a regex or string separator. Matches of the
	 * separator are not included in the result array. However, if `separator` is a regex that contains
	 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
	 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
	 * cross-browser.
	 * @param {String} str String to split.
	 * @param {RegExp|String} separator Regex or string to use for separating the string.
	 * @param {Number} [limit] Maximum number of items to include in the result array.
	 * @returns {Array} Array of substrings.
	 * @example
	 *
	 * // Basic use
	 * split('a b c d', ' ');
	 * // -> ['a', 'b', 'c', 'd']
	 *
	 * // With limit
	 * split('a b c d', ' ', 2);
	 * // -> ['a', 'b']
	 *
	 * // Backreferences in result array
	 * split('..word1 word2..', /([a-z]+)(\d+)/i);
	 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
	 */
	module.exports = (function split(undef) {

	  var nativeSplit = String.prototype.split,
	    compliantExecNpcg = /()??/.exec("")[1] === undef,
	    // NPCG: nonparticipating capturing group
	    self;

	  self = function(str, separator, limit) {
	    // If `separator` is not a regex, use `nativeSplit`
	    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
	      return nativeSplit.call(str, separator, limit);
	    }
	    var output = [],
	      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
	      (separator.sticky ? "y" : ""),
	      // Firefox 3+
	      lastLastIndex = 0,
	      // Make `global` and avoid `lastIndex` issues by working with a copy
	      separator = new RegExp(separator.source, flags + "g"),
	      separator2, match, lastIndex, lastLength;
	    str += ""; // Type-convert
	    if (!compliantExecNpcg) {
	      // Doesn't need flags gy, but they don't hurt
	      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
	    }
	    /* Values for `limit`, per the spec:
	     * If undefined: 4294967295 // Math.pow(2, 32) - 1
	     * If 0, Infinity, or NaN: 0
	     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
	     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
	     * If other: Type-convert, then use the above rules
	     */
	    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
	    limit >>> 0; // ToUint32(limit)
	    while (match = separator.exec(str)) {
	      // `separator.lastIndex` is not reliable cross-browser
	      lastIndex = match.index + match[0].length;
	      if (lastIndex > lastLastIndex) {
	        output.push(str.slice(lastLastIndex, match.index));
	        // Fix browsers whose `exec` methods don't consistently return `undefined` for
	        // nonparticipating capturing groups
	        if (!compliantExecNpcg && match.length > 1) {
	          match[0].replace(separator2, function() {
	            for (var i = 1; i < arguments.length - 2; i++) {
	              if (arguments[i] === undef) {
	                match[i] = undef;
	              }
	            }
	          });
	        }
	        if (match.length > 1 && match.index < str.length) {
	          Array.prototype.push.apply(output, match.slice(1));
	        }
	        lastLength = match[0].length;
	        lastLastIndex = lastIndex;
	        if (output.length >= limit) {
	          break;
	        }
	      }
	      if (separator.lastIndex === match.index) {
	        separator.lastIndex++; // Avoid an infinite loop
	      }
	    }
	    if (lastLastIndex === str.length) {
	      if (lastLength || !separator.test("")) {
	        output.push("");
	      }
	    } else {
	      output.push(str.slice(lastLastIndex));
	    }
	    return output.length > limit ? output.slice(0, limit) : output;
	  };

	  return self;
	})();


/***/ },
/* 35 */
/***/ function(module, exports) {

	'use strict';

	module.exports = SoftSetHook;

	function SoftSetHook(value) {
	    if (!(this instanceof SoftSetHook)) {
	        return new SoftSetHook(value);
	    }

	    this.value = value;
	}

	SoftSetHook.prototype.hook = function (node, propertyName) {
	    if (node[propertyName] !== this.value) {
	        node[propertyName] = this.value;
	    }
	};


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var EvStore = __webpack_require__(37);

	module.exports = EvHook;

	function EvHook(value) {
	    if (!(this instanceof EvHook)) {
	        return new EvHook(value);
	    }

	    this.value = value;
	}

	EvHook.prototype.hook = function (node, propertyName) {
	    var es = EvStore(node);
	    var propName = propertyName.substr(3);

	    es[propName] = this.value;
	};

	EvHook.prototype.unhook = function(node, propertyName) {
	    var es = EvStore(node);
	    var propName = propertyName.substr(3);

	    es[propName] = undefined;
	};


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var OneVersionConstraint = __webpack_require__(38);

	var MY_VERSION = '7';
	OneVersionConstraint('ev-store', MY_VERSION);

	var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

	module.exports = EvStore;

	function EvStore(elem) {
	    var hash = elem[hashKey];

	    if (!hash) {
	        hash = elem[hashKey] = {};
	    }

	    return hash;
	}


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Individual = __webpack_require__(39);

	module.exports = OneVersion;

	function OneVersion(moduleName, version, defaultValue) {
	    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
	    var enforceKey = key + '_ENFORCE_SINGLETON';

	    var versionValue = Individual(enforceKey, version);

	    if (versionValue !== version) {
	        throw new Error('Can only have one copy of ' +
	            moduleName + '.\n' +
	            'You already have version ' + versionValue +
	            ' installed.\n' +
	            'This means you cannot install version ' + version);
	    }

	    return Individual(key, defaultValue);
	}


/***/ },
/* 39 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	/*global window, global*/

	var root = typeof window !== 'undefined' ?
	    window : typeof global !== 'undefined' ?
	    global : {};

	module.exports = Individual;

	function Individual(key, value) {
	    if (key in root) {
	        return root[key];
	    }

	    root[key] = value;

	    return value;
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var createElement = __webpack_require__(24)

	module.exports = createElement


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isArray = __webpack_require__(9);

	var h = __webpack_require__(30);


	var SVGAttributeNamespace = __webpack_require__(42);
	var attributeHook = __webpack_require__(43);

	var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

	module.exports = svg;

	function svg(tagName, properties, children) {
	    if (!children && isChildren(properties)) {
	        children = properties;
	        properties = {};
	    }

	    properties = properties || {};

	    // set namespace for svg
	    properties.namespace = SVG_NAMESPACE;

	    var attributes = properties.attributes || (properties.attributes = {});

	    for (var key in properties) {
	        if (!properties.hasOwnProperty(key)) {
	            continue;
	        }

	        var namespace = SVGAttributeNamespace(key);

	        if (namespace === undefined) { // not a svg attribute
	            continue;
	        }

	        var value = properties[key];

	        if (typeof value !== 'string' &&
	            typeof value !== 'number' &&
	            typeof value !== 'boolean'
	        ) {
	            continue;
	        }

	        if (namespace !== null) { // namespaced attribute
	            properties[key] = attributeHook(namespace, value);
	            continue;
	        }

	        attributes[key] = value
	        properties[key] = undefined
	    }

	    return h(tagName, properties, children);
	}

	function isChildren(x) {
	    return typeof x === 'string' || isArray(x);
	}


/***/ },
/* 42 */
/***/ function(module, exports) {

	'use strict';

	var DEFAULT_NAMESPACE = null;
	var EV_NAMESPACE = 'http://www.w3.org/2001/xml-events';
	var XLINK_NAMESPACE = 'http://www.w3.org/1999/xlink';
	var XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace';

	// http://www.w3.org/TR/SVGTiny12/attributeTable.html
	// http://www.w3.org/TR/SVG/attindex.html
	var SVG_PROPERTIES = {
	    'about': DEFAULT_NAMESPACE,
	    'accent-height': DEFAULT_NAMESPACE,
	    'accumulate': DEFAULT_NAMESPACE,
	    'additive': DEFAULT_NAMESPACE,
	    'alignment-baseline': DEFAULT_NAMESPACE,
	    'alphabetic': DEFAULT_NAMESPACE,
	    'amplitude': DEFAULT_NAMESPACE,
	    'arabic-form': DEFAULT_NAMESPACE,
	    'ascent': DEFAULT_NAMESPACE,
	    'attributeName': DEFAULT_NAMESPACE,
	    'attributeType': DEFAULT_NAMESPACE,
	    'azimuth': DEFAULT_NAMESPACE,
	    'bandwidth': DEFAULT_NAMESPACE,
	    'baseFrequency': DEFAULT_NAMESPACE,
	    'baseProfile': DEFAULT_NAMESPACE,
	    'baseline-shift': DEFAULT_NAMESPACE,
	    'bbox': DEFAULT_NAMESPACE,
	    'begin': DEFAULT_NAMESPACE,
	    'bias': DEFAULT_NAMESPACE,
	    'by': DEFAULT_NAMESPACE,
	    'calcMode': DEFAULT_NAMESPACE,
	    'cap-height': DEFAULT_NAMESPACE,
	    'class': DEFAULT_NAMESPACE,
	    'clip': DEFAULT_NAMESPACE,
	    'clip-path': DEFAULT_NAMESPACE,
	    'clip-rule': DEFAULT_NAMESPACE,
	    'clipPathUnits': DEFAULT_NAMESPACE,
	    'color': DEFAULT_NAMESPACE,
	    'color-interpolation': DEFAULT_NAMESPACE,
	    'color-interpolation-filters': DEFAULT_NAMESPACE,
	    'color-profile': DEFAULT_NAMESPACE,
	    'color-rendering': DEFAULT_NAMESPACE,
	    'content': DEFAULT_NAMESPACE,
	    'contentScriptType': DEFAULT_NAMESPACE,
	    'contentStyleType': DEFAULT_NAMESPACE,
	    'cursor': DEFAULT_NAMESPACE,
	    'cx': DEFAULT_NAMESPACE,
	    'cy': DEFAULT_NAMESPACE,
	    'd': DEFAULT_NAMESPACE,
	    'datatype': DEFAULT_NAMESPACE,
	    'defaultAction': DEFAULT_NAMESPACE,
	    'descent': DEFAULT_NAMESPACE,
	    'diffuseConstant': DEFAULT_NAMESPACE,
	    'direction': DEFAULT_NAMESPACE,
	    'display': DEFAULT_NAMESPACE,
	    'divisor': DEFAULT_NAMESPACE,
	    'dominant-baseline': DEFAULT_NAMESPACE,
	    'dur': DEFAULT_NAMESPACE,
	    'dx': DEFAULT_NAMESPACE,
	    'dy': DEFAULT_NAMESPACE,
	    'edgeMode': DEFAULT_NAMESPACE,
	    'editable': DEFAULT_NAMESPACE,
	    'elevation': DEFAULT_NAMESPACE,
	    'enable-background': DEFAULT_NAMESPACE,
	    'end': DEFAULT_NAMESPACE,
	    'ev:event': EV_NAMESPACE,
	    'event': DEFAULT_NAMESPACE,
	    'exponent': DEFAULT_NAMESPACE,
	    'externalResourcesRequired': DEFAULT_NAMESPACE,
	    'fill': DEFAULT_NAMESPACE,
	    'fill-opacity': DEFAULT_NAMESPACE,
	    'fill-rule': DEFAULT_NAMESPACE,
	    'filter': DEFAULT_NAMESPACE,
	    'filterRes': DEFAULT_NAMESPACE,
	    'filterUnits': DEFAULT_NAMESPACE,
	    'flood-color': DEFAULT_NAMESPACE,
	    'flood-opacity': DEFAULT_NAMESPACE,
	    'focusHighlight': DEFAULT_NAMESPACE,
	    'focusable': DEFAULT_NAMESPACE,
	    'font-family': DEFAULT_NAMESPACE,
	    'font-size': DEFAULT_NAMESPACE,
	    'font-size-adjust': DEFAULT_NAMESPACE,
	    'font-stretch': DEFAULT_NAMESPACE,
	    'font-style': DEFAULT_NAMESPACE,
	    'font-variant': DEFAULT_NAMESPACE,
	    'font-weight': DEFAULT_NAMESPACE,
	    'format': DEFAULT_NAMESPACE,
	    'from': DEFAULT_NAMESPACE,
	    'fx': DEFAULT_NAMESPACE,
	    'fy': DEFAULT_NAMESPACE,
	    'g1': DEFAULT_NAMESPACE,
	    'g2': DEFAULT_NAMESPACE,
	    'glyph-name': DEFAULT_NAMESPACE,
	    'glyph-orientation-horizontal': DEFAULT_NAMESPACE,
	    'glyph-orientation-vertical': DEFAULT_NAMESPACE,
	    'glyphRef': DEFAULT_NAMESPACE,
	    'gradientTransform': DEFAULT_NAMESPACE,
	    'gradientUnits': DEFAULT_NAMESPACE,
	    'handler': DEFAULT_NAMESPACE,
	    'hanging': DEFAULT_NAMESPACE,
	    'height': DEFAULT_NAMESPACE,
	    'horiz-adv-x': DEFAULT_NAMESPACE,
	    'horiz-origin-x': DEFAULT_NAMESPACE,
	    'horiz-origin-y': DEFAULT_NAMESPACE,
	    'id': DEFAULT_NAMESPACE,
	    'ideographic': DEFAULT_NAMESPACE,
	    'image-rendering': DEFAULT_NAMESPACE,
	    'in': DEFAULT_NAMESPACE,
	    'in2': DEFAULT_NAMESPACE,
	    'initialVisibility': DEFAULT_NAMESPACE,
	    'intercept': DEFAULT_NAMESPACE,
	    'k': DEFAULT_NAMESPACE,
	    'k1': DEFAULT_NAMESPACE,
	    'k2': DEFAULT_NAMESPACE,
	    'k3': DEFAULT_NAMESPACE,
	    'k4': DEFAULT_NAMESPACE,
	    'kernelMatrix': DEFAULT_NAMESPACE,
	    'kernelUnitLength': DEFAULT_NAMESPACE,
	    'kerning': DEFAULT_NAMESPACE,
	    'keyPoints': DEFAULT_NAMESPACE,
	    'keySplines': DEFAULT_NAMESPACE,
	    'keyTimes': DEFAULT_NAMESPACE,
	    'lang': DEFAULT_NAMESPACE,
	    'lengthAdjust': DEFAULT_NAMESPACE,
	    'letter-spacing': DEFAULT_NAMESPACE,
	    'lighting-color': DEFAULT_NAMESPACE,
	    'limitingConeAngle': DEFAULT_NAMESPACE,
	    'local': DEFAULT_NAMESPACE,
	    'marker-end': DEFAULT_NAMESPACE,
	    'marker-mid': DEFAULT_NAMESPACE,
	    'marker-start': DEFAULT_NAMESPACE,
	    'markerHeight': DEFAULT_NAMESPACE,
	    'markerUnits': DEFAULT_NAMESPACE,
	    'markerWidth': DEFAULT_NAMESPACE,
	    'mask': DEFAULT_NAMESPACE,
	    'maskContentUnits': DEFAULT_NAMESPACE,
	    'maskUnits': DEFAULT_NAMESPACE,
	    'mathematical': DEFAULT_NAMESPACE,
	    'max': DEFAULT_NAMESPACE,
	    'media': DEFAULT_NAMESPACE,
	    'mediaCharacterEncoding': DEFAULT_NAMESPACE,
	    'mediaContentEncodings': DEFAULT_NAMESPACE,
	    'mediaSize': DEFAULT_NAMESPACE,
	    'mediaTime': DEFAULT_NAMESPACE,
	    'method': DEFAULT_NAMESPACE,
	    'min': DEFAULT_NAMESPACE,
	    'mode': DEFAULT_NAMESPACE,
	    'name': DEFAULT_NAMESPACE,
	    'nav-down': DEFAULT_NAMESPACE,
	    'nav-down-left': DEFAULT_NAMESPACE,
	    'nav-down-right': DEFAULT_NAMESPACE,
	    'nav-left': DEFAULT_NAMESPACE,
	    'nav-next': DEFAULT_NAMESPACE,
	    'nav-prev': DEFAULT_NAMESPACE,
	    'nav-right': DEFAULT_NAMESPACE,
	    'nav-up': DEFAULT_NAMESPACE,
	    'nav-up-left': DEFAULT_NAMESPACE,
	    'nav-up-right': DEFAULT_NAMESPACE,
	    'numOctaves': DEFAULT_NAMESPACE,
	    'observer': DEFAULT_NAMESPACE,
	    'offset': DEFAULT_NAMESPACE,
	    'opacity': DEFAULT_NAMESPACE,
	    'operator': DEFAULT_NAMESPACE,
	    'order': DEFAULT_NAMESPACE,
	    'orient': DEFAULT_NAMESPACE,
	    'orientation': DEFAULT_NAMESPACE,
	    'origin': DEFAULT_NAMESPACE,
	    'overflow': DEFAULT_NAMESPACE,
	    'overlay': DEFAULT_NAMESPACE,
	    'overline-position': DEFAULT_NAMESPACE,
	    'overline-thickness': DEFAULT_NAMESPACE,
	    'panose-1': DEFAULT_NAMESPACE,
	    'path': DEFAULT_NAMESPACE,
	    'pathLength': DEFAULT_NAMESPACE,
	    'patternContentUnits': DEFAULT_NAMESPACE,
	    'patternTransform': DEFAULT_NAMESPACE,
	    'patternUnits': DEFAULT_NAMESPACE,
	    'phase': DEFAULT_NAMESPACE,
	    'playbackOrder': DEFAULT_NAMESPACE,
	    'pointer-events': DEFAULT_NAMESPACE,
	    'points': DEFAULT_NAMESPACE,
	    'pointsAtX': DEFAULT_NAMESPACE,
	    'pointsAtY': DEFAULT_NAMESPACE,
	    'pointsAtZ': DEFAULT_NAMESPACE,
	    'preserveAlpha': DEFAULT_NAMESPACE,
	    'preserveAspectRatio': DEFAULT_NAMESPACE,
	    'primitiveUnits': DEFAULT_NAMESPACE,
	    'propagate': DEFAULT_NAMESPACE,
	    'property': DEFAULT_NAMESPACE,
	    'r': DEFAULT_NAMESPACE,
	    'radius': DEFAULT_NAMESPACE,
	    'refX': DEFAULT_NAMESPACE,
	    'refY': DEFAULT_NAMESPACE,
	    'rel': DEFAULT_NAMESPACE,
	    'rendering-intent': DEFAULT_NAMESPACE,
	    'repeatCount': DEFAULT_NAMESPACE,
	    'repeatDur': DEFAULT_NAMESPACE,
	    'requiredExtensions': DEFAULT_NAMESPACE,
	    'requiredFeatures': DEFAULT_NAMESPACE,
	    'requiredFonts': DEFAULT_NAMESPACE,
	    'requiredFormats': DEFAULT_NAMESPACE,
	    'resource': DEFAULT_NAMESPACE,
	    'restart': DEFAULT_NAMESPACE,
	    'result': DEFAULT_NAMESPACE,
	    'rev': DEFAULT_NAMESPACE,
	    'role': DEFAULT_NAMESPACE,
	    'rotate': DEFAULT_NAMESPACE,
	    'rx': DEFAULT_NAMESPACE,
	    'ry': DEFAULT_NAMESPACE,
	    'scale': DEFAULT_NAMESPACE,
	    'seed': DEFAULT_NAMESPACE,
	    'shape-rendering': DEFAULT_NAMESPACE,
	    'slope': DEFAULT_NAMESPACE,
	    'snapshotTime': DEFAULT_NAMESPACE,
	    'spacing': DEFAULT_NAMESPACE,
	    'specularConstant': DEFAULT_NAMESPACE,
	    'specularExponent': DEFAULT_NAMESPACE,
	    'spreadMethod': DEFAULT_NAMESPACE,
	    'startOffset': DEFAULT_NAMESPACE,
	    'stdDeviation': DEFAULT_NAMESPACE,
	    'stemh': DEFAULT_NAMESPACE,
	    'stemv': DEFAULT_NAMESPACE,
	    'stitchTiles': DEFAULT_NAMESPACE,
	    'stop-color': DEFAULT_NAMESPACE,
	    'stop-opacity': DEFAULT_NAMESPACE,
	    'strikethrough-position': DEFAULT_NAMESPACE,
	    'strikethrough-thickness': DEFAULT_NAMESPACE,
	    'string': DEFAULT_NAMESPACE,
	    'stroke': DEFAULT_NAMESPACE,
	    'stroke-dasharray': DEFAULT_NAMESPACE,
	    'stroke-dashoffset': DEFAULT_NAMESPACE,
	    'stroke-linecap': DEFAULT_NAMESPACE,
	    'stroke-linejoin': DEFAULT_NAMESPACE,
	    'stroke-miterlimit': DEFAULT_NAMESPACE,
	    'stroke-opacity': DEFAULT_NAMESPACE,
	    'stroke-width': DEFAULT_NAMESPACE,
	    'surfaceScale': DEFAULT_NAMESPACE,
	    'syncBehavior': DEFAULT_NAMESPACE,
	    'syncBehaviorDefault': DEFAULT_NAMESPACE,
	    'syncMaster': DEFAULT_NAMESPACE,
	    'syncTolerance': DEFAULT_NAMESPACE,
	    'syncToleranceDefault': DEFAULT_NAMESPACE,
	    'systemLanguage': DEFAULT_NAMESPACE,
	    'tableValues': DEFAULT_NAMESPACE,
	    'target': DEFAULT_NAMESPACE,
	    'targetX': DEFAULT_NAMESPACE,
	    'targetY': DEFAULT_NAMESPACE,
	    'text-anchor': DEFAULT_NAMESPACE,
	    'text-decoration': DEFAULT_NAMESPACE,
	    'text-rendering': DEFAULT_NAMESPACE,
	    'textLength': DEFAULT_NAMESPACE,
	    'timelineBegin': DEFAULT_NAMESPACE,
	    'title': DEFAULT_NAMESPACE,
	    'to': DEFAULT_NAMESPACE,
	    'transform': DEFAULT_NAMESPACE,
	    'transformBehavior': DEFAULT_NAMESPACE,
	    'type': DEFAULT_NAMESPACE,
	    'typeof': DEFAULT_NAMESPACE,
	    'u1': DEFAULT_NAMESPACE,
	    'u2': DEFAULT_NAMESPACE,
	    'underline-position': DEFAULT_NAMESPACE,
	    'underline-thickness': DEFAULT_NAMESPACE,
	    'unicode': DEFAULT_NAMESPACE,
	    'unicode-bidi': DEFAULT_NAMESPACE,
	    'unicode-range': DEFAULT_NAMESPACE,
	    'units-per-em': DEFAULT_NAMESPACE,
	    'v-alphabetic': DEFAULT_NAMESPACE,
	    'v-hanging': DEFAULT_NAMESPACE,
	    'v-ideographic': DEFAULT_NAMESPACE,
	    'v-mathematical': DEFAULT_NAMESPACE,
	    'values': DEFAULT_NAMESPACE,
	    'version': DEFAULT_NAMESPACE,
	    'vert-adv-y': DEFAULT_NAMESPACE,
	    'vert-origin-x': DEFAULT_NAMESPACE,
	    'vert-origin-y': DEFAULT_NAMESPACE,
	    'viewBox': DEFAULT_NAMESPACE,
	    'viewTarget': DEFAULT_NAMESPACE,
	    'visibility': DEFAULT_NAMESPACE,
	    'width': DEFAULT_NAMESPACE,
	    'widths': DEFAULT_NAMESPACE,
	    'word-spacing': DEFAULT_NAMESPACE,
	    'writing-mode': DEFAULT_NAMESPACE,
	    'x': DEFAULT_NAMESPACE,
	    'x-height': DEFAULT_NAMESPACE,
	    'x1': DEFAULT_NAMESPACE,
	    'x2': DEFAULT_NAMESPACE,
	    'xChannelSelector': DEFAULT_NAMESPACE,
	    'xlink:actuate': XLINK_NAMESPACE,
	    'xlink:arcrole': XLINK_NAMESPACE,
	    'xlink:href': XLINK_NAMESPACE,
	    'xlink:role': XLINK_NAMESPACE,
	    'xlink:show': XLINK_NAMESPACE,
	    'xlink:title': XLINK_NAMESPACE,
	    'xlink:type': XLINK_NAMESPACE,
	    'xml:base': XML_NAMESPACE,
	    'xml:id': XML_NAMESPACE,
	    'xml:lang': XML_NAMESPACE,
	    'xml:space': XML_NAMESPACE,
	    'y': DEFAULT_NAMESPACE,
	    'y1': DEFAULT_NAMESPACE,
	    'y2': DEFAULT_NAMESPACE,
	    'yChannelSelector': DEFAULT_NAMESPACE,
	    'z': DEFAULT_NAMESPACE,
	    'zoomAndPan': DEFAULT_NAMESPACE
	};

	module.exports = SVGAttributeNamespace;

	function SVGAttributeNamespace(value) {
	  if (SVG_PROPERTIES.hasOwnProperty(value)) {
	    return SVG_PROPERTIES[value];
	  }
	}


/***/ },
/* 43 */
/***/ function(module, exports) {

	'use strict';

	module.exports = AttributeHook;

	function AttributeHook(namespace, value) {
	    if (!(this instanceof AttributeHook)) {
	        return new AttributeHook(namespace, value);
	    }

	    this.namespace = namespace;
	    this.value = value;
	}

	AttributeHook.prototype.hook = function (node, prop, prev) {
	    if (prev && prev.type === 'AttributeHook' &&
	        prev.value === this.value &&
	        prev.namespace === this.namespace) {
	        return;
	    }

	    node.setAttributeNS(this.namespace, prop, this.value);
	};

	AttributeHook.prototype.unhook = function (node, prop, next) {
	    if (next && next.type === 'AttributeHook' &&
	        next.namespace === this.namespace) {
	        return;
	    }

	    var colonPosition = prop.indexOf(':');
	    var localName = colonPosition > -1 ? prop.substr(colonPosition + 1) : prop;
	    node.removeAttributeNS(this.namespace, localName);
	};

	AttributeHook.prototype.type = 'AttributeHook';


/***/ },
/* 44 */,
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	})();

	var _get = function get(_x, _x2, _x3) {
	  var _again = true;_function: while (_again) {
	    var object = _x,
	        property = _x2,
	        receiver = _x3;desc = parent = getter = undefined;_again = false;if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
	      var parent = Object.getPrototypeOf(object);if (parent === null) {
	        return undefined;
	      } else {
	        _x = parent;_x2 = property;_x3 = receiver;_again = true;continue _function;
	      }
	    } else if ('value' in desc) {
	      return desc.value;
	    } else {
	      var getter = desc.get;if (getter === undefined) {
	        return undefined;
	      }return getter.call(receiver);
	    }
	  }
	};

	exports.createElement = createElement;
	exports.addEvent = addEvent;
	exports.removeEvent = removeEvent;
	exports.attach = attach;
	exports.detach = detach;
	exports.create = create;
	exports.fixProps = fixProps;
	exports.render = render;
	exports.resolve = resolve;
	exports.walkVirtual = walkVirtual;

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { 'default': obj };
	}

	function _toConsumableArray(arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;
	  } else {
	    return Array.from(arr);
	  }
	}

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError('Cannot call a class as a function');
	  }
	}

	function _inherits(subClass, superClass) {
	  if (typeof superClass !== 'function' && superClass !== null) {
	    throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
	  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}

	var _assignObject = __webpack_require__(46);

	var _assignObject2 = _interopRequireDefault(_assignObject);

	var _setZeroTimeout2 = __webpack_require__(47);

	var _setZeroTimeout3 = _interopRequireDefault(_setZeroTimeout2);

	var _events = __webpack_require__(5);

	var _virtualDom = __webpack_require__(6);

	var _virtualDomVirtualHyperscriptSvg = __webpack_require__(41);

	var _virtualDomVirtualHyperscriptSvg2 = _interopRequireDefault(_virtualDomVirtualHyperscriptSvg);

	var _setZeroTimeout4 = _interopRequireDefault(_setZeroTimeout2);

	exports.setZeroTimeout = _setZeroTimeout4['default'];
	Object.defineProperty(exports, 'EventEmitter', {
	  enumerable: true,
	  get: function get() {
	    return _events.EventEmitter;
	  }
	});

	function createElement(type, props) {
	  for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	    children[_key - 2] = arguments[_key];
	  }

	  return create(type, props, children);
	}

	var BaseComponent = (function (_EventEmitter) {
	  _inherits(BaseComponent, _EventEmitter);

	  _createClass(BaseComponent, null, [{
	    key: 'mixin',
	    value: function mixin(constructor) {
	      var prototype = constructor.prototype;
	      if (prototype && constructor.mixins && !constructor.mixins.done) {
	        constructor.assignObject.apply(constructor, [prototype].concat(_toConsumableArray(constructor.mixins)));
	        constructor.mixins.done = true;
	      }
	    }
	  }, {
	    key: 'appendDOM',
	    value: attach,
	    enumerable: true
	  }, {
	    key: 'assignObject',
	    value: _assignObject2['default'],
	    enumerable: true
	  }, {
	    key: 'createElement',
	    value: createElement,
	    enumerable: true
	  }, {
	    key: 'removeDOM',
	    value: detach,
	    enumerable: true
	  }, {
	    key: 'resolveDOM',
	    value: resolve,
	    enumerable: true
	  }]);

	  function BaseComponent() {
	    _classCallCheck(this, BaseComponent);

	    _get(Object.getPrototypeOf(BaseComponent.prototype), 'constructor', this).call(this);
	    this.assignObject = this.constructor.assignObject;
	    this.resolveDOM = this.constructor.resolveDOM;
	    this.isUpdating = false;
	    this.props = this.assignObject({}, this.constructor.defaultProps, this.props);
	    this.state = {};
	    this.context = {};
	    this.next = {};
	    this.constructor.mixin && this.constructor.mixin(this.constructor);
	  }

	  _createClass(BaseComponent, [{
	    key: 'cancelUpdate',
	    value: function cancelUpdate() {
	      if (this.boundUpdate) {
	        unsetZeroTimeout(this.boundUpdate);
	        this.boundUpdate = null;
	      }
	      return this;
	    }
	  }, {
	    key: 'mergeObjectProperty',
	    value: function mergeObjectProperty(property, value) {
	      var changes = this.next[property] = this.next[property] || [];
	      changes.push(value);
	    }
	  }, {
	    key: 'mount',
	    value: function mount(parent) {
	      var _this = this;

	      this.refs = {};
	      this.componentWillMount && this.componentWillMount();
	      this.update(true);
	      var finishMount = function finishMount() {
	        _this.componentDidMount && _this.componentDidMount();
	        _this.emit('mount');
	      };
	      if (parent) {
	        this.constructor.appendDOM(this.domNode, parent);
	        return finishMount();
	      }
	      return finishMount;
	    }
	  }, {
	    key: 'replaceObjectProperty',
	    value: function replaceObjectProperty(property, value) {
	      var changes = this.next[property] = this.next[property] || [];
	      changes.push(null);
	      changes.push(value);
	    }
	  }, {
	    key: 'safeRender',
	    value: function safeRender() {
	      return this.render(this.constructor);
	    }
	  }, {
	    key: 'safeUpdate',
	    value: function safeUpdate(force) {
	      (force || this.boundUpdate) && this.cancelUpdate().update(force);
	    }
	  }, {
	    key: 'setupContext',
	    value: function setupContext(parentComponent, rootComponent) {
	      this.rootComponent = rootComponent;
	      this.parentComponent = parentComponent;
	      this.context = this.assignObject({}, rootComponent.context, rootComponent && rootComponent.getChildContext());
	      if (parentComponent && parentComponent !== rootComponent) {
	        this.assignObject(this.context, parentComponent.getChildContext());
	      }
	    }
	  }, {
	    key: 'unmount',
	    value: function unmount() {
	      this.componentWillUnmount && his.componentWillUnmount();
	      this.lastVirtualElement = this.virtualElement;
	      this.virtualElement = null;
	      this.domNode = this.resolveDOM(this);
	      this.lastVirtualElement = null;
	      var parent = this.domNode && this.domNode.parentNode;
	      if (parent) this.constructor.removeDOM(this.domNode);
	      this.componentDidUnmount && this.componentDidUnmount();
	      this.emit('unmount');
	      if (this.domNode) {
	        this.domNode.component = null;
	        this.domNode = null;
	      }
	    }
	  }, {
	    key: 'queueUpdate',
	    value: function queueUpdate(callback) {
	      if (callback) this.once('update', callback);
	      if (this.boundUpdate) return;
	      this.boundUpdate = this.update.bind(this);
	      (0, _setZeroTimeout3['default'])(this.boundUpdate);
	    }
	  }, {
	    key: 'update',
	    value: function update(force) {
	      var _this2 = this;

	      this.boundUpdate = null;
	      this.isUpdating = true;
	      var next = this.next,
	          temp = {
	        props: this.assignObject({}, this.props),
	        state: this.assignObject({}, this.state)
	      };
	      this.next = {};
	      ['props', 'state'].forEach(function (property) {
	        var changes = next[property] || [],
	            lastNull = changes.lastIndexOf(null);
	        if (lastNull !== -1) {
	          changes = changes.slice(lastNull + 1);
	          temp[property] = {};
	        }
	        changes.forEach(function (change) {
	          if (property === 'state' && typeof change === 'function') {
	            change = change.call(_this2, temp.state, temp.props);
	          }
	          _this2.assignObject(temp[property], change);
	        });
	      });
	      if (!force && this.shouldComponentUpdate && !this.shouldComponentUpdate(temp.props, temp.state)) return;
	      this.assignObject(this, temp);
	      !force && this.componentWillUpdate && this.componentWillUpdate(this.props, this.state);
	      this.refs = {};
	      this.lastVirtualElement = this.virtualElement;
	      this.virtualElement = this.safeRender();
	      // this.virtualElement.properties.key = this.virtualElement.properties.key || this.props.key;
	      // this.virtualElement.key = this.virtualElement.key || this.props.key;
	      this.domNode = this.resolveDOM(this);
	      var finishUpdate = function finishUpdate() {
	        !force && _this2.componentDidUpdate && _this2.componentDidUpdate();
	        _this2.emit('update');
	        _this2.isUpdating = false;
	        _this2.lastComponent = null;
	      };
	      (0, _setZeroTimeout3['default'])(finishUpdate);
	    }
	  }]);

	  return BaseComponent;
	})(_events.EventEmitter);

	exports.BaseComponent = BaseComponent;

	var ReactComponent = (function (_BaseComponent) {
	  _inherits(ReactComponent, _BaseComponent);

	  _createClass(ReactComponent, null, [{
	    key: 'Component',
	    value: ReactComponent,

	    // componentDidMount() {}
	    // componentDidUnmount() {}
	    // componentDidUpdate(prevProps, prevState) {}
	    // componentWillMount() {}
	    // componentWillReceiveProps(nextProps) {}
	    // componentWillReceiveState(nextState) {}
	    // componentWillUnmount() {}
	    // componentWillUpdate(nextProps, nextState) {}
	    // render(React) { return null; }
	    // shouldComponentUpdate(nextProps, nextState) { return true; }
	    enumerable: true
	  }]);

	  function ReactComponent(props, context) {
	    _classCallCheck(this, ReactComponent);

	    _get(Object.getPrototypeOf(ReactComponent.prototype), 'constructor', this).call(this);
	    this.autoUpdateWhenPropsChange = true;
	    props && this.assignObject(this.props, props);
	    context && this.assignObject(this.context, context);
	  }

	  _createClass(ReactComponent, [{
	    key: 'forceUpdate',
	    value: function forceUpdate() {
	      this.update(true);
	    }
	  }, {
	    key: 'getChildContext',
	    value: function getChildContext() {
	      return this.childContext || {};
	    }
	  }, {
	    key: 'getDOMNode',
	    value: function getDOMNode() {
	      return this.domNode;
	    }
	  }, {
	    key: 'isMounted',
	    value: function isMounted() {
	      return this.domNode && this.domNode.parentNode;
	    }
	  }, {
	    key: 'replaceProps',
	    value: function replaceProps(newProps, callback) {
	      this.replaceObjectProperty('props', newProps);
	      this.autoUpdateWhenPropsChange && this.queueUpdate(callback);
	    }
	  }, {
	    key: 'replaceState',
	    value: function replaceState(newState, callback) {
	      this.replaceObjectProperty('state', newState);
	      this.queueUpdate(callback);
	    }
	  }, {
	    key: 'setProps',
	    value: function setProps(nextProps, callback) {
	      this.componentWillReceiveProps && this.componentWillReceiveProps(nextProps);
	      this.mergeObjectProperty('props', nextProps);
	      this.autoUpdateWhenPropsChange && this.queueUpdate(callback);
	    }
	  }, {
	    key: 'setState',
	    value: function setState(nextState, callback) {
	      this.componentWillReceiveState && this.componentWillReceiveState(nextState);
	      this.mergeObjectProperty('state', nextState);
	      this.queueUpdate(callback);
	    }
	  }, {
	    key: 'displayName',
	    get: function get() {
	      return this.constructor.name;
	    }
	  }]);

	  return ReactComponent;
	})(BaseComponent);

	exports['default'] = ReactComponent;
	var Component = ReactComponent;

	exports.Component = Component;

	var ComponentWidget = (function () {
	  function ComponentWidget(Component, props, children, context) {
	    _classCallCheck(this, ComponentWidget);

	    this.type = 'Widget';

	    props = props || {};
	    props.children = props.children ? props.children.concat(children) : children;
	    this.component = new Component(props, context);
	    this.name = this.component.displayName;
	    this.id = this.name;
	  }

	  _createClass(ComponentWidget, [{
	    key: 'init',
	    value: function init() {
	      var componentDidMount = this.component.mount();
	      if (!this.component.domNode) return;
	      (0, _setZeroTimeout3['default'])(componentDidMount);
	      this.component.domNode.component = this.component;
	      this.refHook();
	      return this.component.domNode;
	    }
	  }, {
	    key: 'update',
	    value: function update(previous, domNode) {
	      this.component.lastComponent = domNode.component || previous.component;
	      this.component.virtualElement = this.component.lastComponent.virtualElement;
	      this.component.update();
	      if (this.component.domNode) {
	        this.component.domNode.component = this.component;
	        this.refHook();
	      }
	      return this.component.domNode;
	    }
	  }, {
	    key: 'destroy',
	    value: function destroy(domNode) {
	      this.component.unmount();
	    }
	  }, {
	    key: 'refHook',
	    value: function refHook() {
	      if (this.component.props.ref) {
	        RefHook.prototype.hook.call({ component: this.component.rootComponent, name: this.component.props.ref }, this.component.domNode);
	      }
	    }
	  }]);

	  return ComponentWidget;
	})();

	exports.ComponentWidget = ComponentWidget;

	var RefHook = (function () {
	  function RefHook(name, component) {
	    _classCallCheck(this, RefHook);

	    this.name = name;
	    this.component = component;
	  }

	  _createClass(RefHook, [{
	    key: 'hook',
	    value: function hook(domNode, propName, previousValue) {
	      var refs = this.component.refs;
	      if (this.name.charAt(0) === '$') {
	        refs[this.name] = refs[this.name] || [];
	        if (domNode) refs[this.name].push(domNode.component || domNode);
	      } else refs[this.name] = domNode.component || domNode || refs[this.name];
	    }
	  }]);

	  return RefHook;
	})();

	exports.RefHook = RefHook;

	var HtmlHook = (function () {
	  function HtmlHook(value) {
	    _classCallCheck(this, HtmlHook);

	    this.value = value;
	  }

	  _createClass(HtmlHook, [{
	    key: 'hook',
	    value: function hook(domNode, propName) {
	      var html = this.value && this.value.__html || this.value;
	      if (typeof html === 'string') domNode.innerHTML = html;
	    }
	  }]);

	  return HtmlHook;
	})();

	exports.HtmlHook = HtmlHook;

	var OnChangeHook = (function () {
	  function OnChangeHook(handler) {
	    _classCallCheck(this, OnChangeHook);

	    this.onFocusHandler = this.onFocus.bind(this);
	    this.onBlurHandler = this.onBlur.bind(this);
	    this.handler = handler;
	  }

	  _createClass(OnChangeHook, [{
	    key: 'onFocus',
	    value: function onFocus(event) {
	      this.changeInterval = setInterval(this.detectChange.bind(this, event), 100);
	    }
	  }, {
	    key: 'onBlur',
	    value: function onBlur(event) {
	      this.detectChange(event);
	      this.cancelInterval();
	    }
	  }, {
	    key: 'detectChange',
	    value: function detectChange(event) {
	      if (event.target.value !== this.lastValue) {
	        this.lastValue = event.target.value;
	        this.handler(event);
	      }
	    }
	  }, {
	    key: 'cancelInterval',
	    value: function cancelInterval() {
	      clearInterval(this.changeInterval);
	    }
	  }, {
	    key: 'hook',
	    value: function hook(domNode, propName, previousValue) {
	      this.lastValue = domNode.value;
	      addEvent(domNode, 'focus', this.onFocusHandler);
	      addEvent(domNode, 'blur', this.onBlurHandler);
	    }
	  }, {
	    key: 'unhook',
	    value: function unhook(domNode, propName) {
	      this.cancelInterval();
	      removeEvent(domNode, 'focus', this.onFocusHandler);
	      removeEvent(domNode, 'blur', this.onBlurHandler);
	    }
	  }]);

	  return OnChangeHook;
	})();

	exports.OnChangeHook = OnChangeHook;

	function addEvent(elem, event, fn) {
	  if (elem.addEventListener) elem.addEventListener(event, fn, false);else elem.attachEvent('on' + event, function () {
	    return fn.call(elem, window.event);
	  });
	}

	function removeEvent(elem, event, fn) {
	  if (elem.addEventListener) elem.removeEventListener(event, fn, false);else elem.detachEvent('on' + event, function () {
	    return fn.call(elem, window.event);
	  });
	}

	function attach(element, parent) {
	  if (element && parent && parent.appendChild) return parent.appendChild(element);
	  if (element) throw new Error('Failed to attach element.');
	}

	function detach(element) {
	  if (element && element.parentNode) return element.parentNode.removeChild(element);
	  if (element) throw new Error('Failed to detach element.');
	}

	function create(type, props, children, context) {
	  var definition = undefined;
	  props = fixProps(props || {});
	  if (typeof type === 'string') {
	    if (props.cssSelector) type += cssSelector;
	    // TODO: you have to make sure to add svg={true} to every svg element or else it wont work
	    definition = (props.svg ? _virtualDomVirtualHyperscriptSvg2['default'] : _virtualDom.h)(type, props, children);
	  } else {
	    definition = new ComponentWidget(type, props, children, context);
	  }
	  return definition;
	}

	function fixProps(props) {
	  var newProps = {};
	  Object.keys(props).forEach(function (prop) {
	    if (prop === 'dangerouslySetInnerHTML') {
	      newProps.htmlHook = new HtmlHook(props[prop]);
	    }
	    if (prop === 'defaultValue') {
	      newProps.value = props.value || props.defaultValue;
	    }
	    if (prop === 'defaultChecked') {
	      newProps.checked = typeof props.checked === 'boolean' ? props.checked : props.defaultChecked;
	    }
	    if (prop === 'style') {
	      var styles = props[prop];
	      if (Array.isArray(styles)) styles = Object.assign.apply(Object, [{}].concat(_toConsumableArray(styles)));
	      newProps[prop] = typeof styles === 'string' ? styles : fixProps.fixStyles(styles);
	      return;
	    }
	    if (prop === 'onChange') {
	      newProps.onChangeHook = new OnChangeHook(props.onChange);
	      return;
	    }
	    if (prop.indexOf('on') === 0) {
	      var handler = props[prop];
	      prop = prop.toLowerCase();
	      newProps[prop] = handler;
	      return;
	    }
	    newProps[prop] = props[prop];
	  });
	  return newProps;
	}

	fixProps.fixStyles = function fixStyles(styles) {
	  if (styles) Object.keys(styles).forEach(function (key) {
	    if (typeof styles[key] === 'number') styles[key] += 'px';
	  });
	  return styles;
	};

	function render(virtualElement, parentDomNode, callback, delay) {
	  var detacher = undefined;
	  if (virtualElement.isComponent) {
	    virtualElement.component.mount(parentDomNode);
	    detacher = virtualElement.component.unmount.bind(virtualElement.component);
	  } else {
	    (function () {
	      var domNode = (0, _virtualDom.create)(virtualElement);
	      attach(domNode, parentDomNode);
	      detacher = function () {
	        (0, _virtualDom.diff)(virtualElement, null);
	        domNode = (0, _virtualDom.patch)(domNode, changes);
	        detach(domNode, parentDomNode);
	      };
	    })();
	  }
	  if (callback) setTimeout(callback, delay || 0);
	  return detacher;
	}

	function resolve(component) {
	  // TODO: keep track of component keys, and figure out how to determine if a new component should have an old key
	  // TODO: refs are not being declared correctly, they work on the parent component,
	  //       and not the component where they were defined in render()
	  walkVirtual(component.virtualElement, function (def, parent, root, parentComponent) {
	    if (def) {
	      if (def.component) {
	        def.component.setupContext(parentComponent, component);
	      } else if (def.props && def.props.ref) {
	        def.props.refHook = new RefHook(def.props.ref, component);
	      }
	    }
	  });
	  var domNode = component.domNode || component.lastComponent && component.lastComponent.domNode;
	  var lastDomNode = domNode;
	  if (!domNode) {
	    domNode = (0, _virtualDom.create)(component.virtualElement);
	    if (domNode) domNode.component = component;
	  } else {
	    var _changes = (0, _virtualDom.diff)(component.lastVirtualElement, component.virtualElement);
	    domNode.component = component;
	    domNode = (0, _virtualDom.patch)(domNode, _changes);
	    if (domNode) domNode.component = component;
	  }
	  if (lastDomNode && lastDomNode !== domNode) {
	    if (lastDomNode.component && lastDomNode.component.domNode === lastDomNode) {
	      lastDomNode.component.domNode = null;
	    }
	    lastDomNode.component = null;
	  }
	  return domNode;
	}

	function walkVirtual(definition, iterator, parent, root, parentComponent) {
	  root = root || definition;
	  var children = null;
	  if (!definition || typeof definition !== 'object') return;
	  if (definition.constructor.name === 'VirtualText') return;
	  iterator(definition, parent, root);
	  if (Array.isArray(definition)) children = definition;else if (definition.isComponent) {
	    parentComponent = definition;
	    children = definition.component.props.children;
	    // TODO: getting children from props here might be dangerous
	    // console.log(children, definition.component.next.props);
	  } else children = definition.children;
	  if (Array.isArray(children)) {
	    children.forEach(function (child) {
	      return walkVirtual(child, iterator, definition, root, parentComponent);
	    });
	  }
	}

/***/ },
/* 46 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = assignObject;

	function assignObject(target) {
	  for (var i = 1, l = arguments.length; i < l; i++) {
	    var source = arguments[i];
	    if (!source) continue;
	    for (var key in source) {
	      var desc = Object.getOwnPropertyDescriptor(source, key);
	      if (desc) Object.defineProperty(target, key, desc);
	    }
	  }
	  return target;
	}

	module.exports = exports['default'];

/***/ },
/* 47 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

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
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _machReact = __webpack_require__(45);

	var fixStyles = _machReact.fixProps.fixStyles;

	_machReact.fixProps.fixStyles = function machRadium(styles) {
	  return autoPrefix.all(fixStyles(styles));
	};

	// NOTE: The following code was lifted from material-ui.
	var isBrowser = typeof window !== 'undefined';
	//Keep track of already prefixed keys so we can skip Modernizr prefixing
	var prefixedKeys = {};

	var autoPrefix = {
	  all: function all(styles) {
	    if (!styles) return styles;
	    var prefixedStyle = {};
	    for (var key in styles) {
	      prefixedStyle[this.single(key)] = styles[key];
	    }
	    return prefixedStyle;
	  },
	  set: function set(style, key, value) {
	    style[this.single(key)] = value;
	  },
	  single: function single(key) {
	    //If a browser doesn't exist, we can't prefix with Modernizr so
	    //just return the key
	    if (!isBrowser) return key;
	    //Check if we've prefixed this key before, just return it
	    if (prefixedKeys.hasOwnProperty(key)) return prefixedKeys[key];
	    //Key hasn't been prefixed yet, prefix with Modernizr
	    var prefKey = Modernizr.prefixed(key);
	    // Windows 7 Firefox has an issue with the implementation of Modernizr.prefixed
	    // and is capturing 'false' as the CSS property name instead of the non-prefixed version.
	    if (prefKey === false) return key;
	    //Save the key off for the future and return the prefixed key
	    prefixedKeys[key] = prefKey;
	    return prefKey;
	  },
	  singleHyphened: function singleHyphened(key) {
	    var str = this.single(key);
	    return !str ? key : str.replace(/([A-Z])/g, function (str, m1) {
	      return '-' + m1.toLowerCase();
	    }).replace(/^ms-/, '-ms-');
	  }
	};

	var Modernizr = (function (window, document, undefined) {
	  var version = '2.8.3',
	      Modernizr = {},
	      docElement = document.documentElement,
	      mod = 'modernizr',
	      modElem = document.createElement(mod),
	      mStyle = modElem.style,
	      prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),
	      omPrefixes = 'Webkit Moz O ms',
	      cssomPrefixes = omPrefixes.split(' '),
	      domPrefixes = omPrefixes.toLowerCase().split(' '),
	      tests = {},
	      classes = [],
	      slice = classes.slice,
	      featureName = undefined,
	      injectElementWithStyles = function injectElementWithStyles(rule, callback, nodes, testnames) {
	    var style = undefined,
	        ret = undefined,
	        node = undefined,
	        docOverflow = undefined,
	        div = document.createElement('div'),
	        body = document.body,
	        fakeBody = body || document.createElement('body');
	    if (parseInt(nodes, 10)) {
	      while (nodes--) {
	        node = document.createElement('div');
	        node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
	        div.appendChild(node);
	      }
	    }
	    style = ['&#173;', '<style id="s', mod, '">', rule, '</style>'].join('');
	    div.id = mod;
	    (body ? div : fakeBody).innerHTML += style;
	    fakeBody.appendChild(div);
	    if (!body) {
	      fakeBody.style.background = '';
	      fakeBody.style.overflow = 'hidden';
	      docOverflow = docElement.style.overflow;
	      docElement.style.overflow = 'hidden';
	      docElement.appendChild(fakeBody);
	    }
	    ret = callback(div, rule);
	    if (!body) {
	      fakeBody.parentNode.removeChild(fakeBody);
	      docElement.style.overflow = docOverflow;
	    } else {
	      div.parentNode.removeChild(div);
	    }
	    return !!ret;
	  },
	      _hasOwnProperty = ({}).hasOwnProperty,
	      hasOwnProp = undefined;
	  function is(obj, type) {
	    return typeof obj === type;
	  }
	  if (!is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined')) {
	    hasOwnProp = function (object, property) {
	      return _hasOwnProperty.call(object, property);
	    };
	  } else {
	    hasOwnProp = function (object, property) {
	      return property in object && is(object.constructor.prototype[property], 'undefined');
	    };
	  }
	  function setCss(str) {
	    mStyle.cssText = str;
	  }
	  function setCssAll(str1, str2) {
	    return setCss(prefixes.join(str1 + ';') + (str2 || ''));
	  }
	  function contains(str, substr) {
	    return !! ~('' + str).indexOf(substr);
	  }
	  function testProps(props, prefixed) {
	    for (var i in props) {
	      var prop = props[i];
	      if (!contains(prop, '-') && mStyle[prop] !== undefined) {
	        return prefixed === 'pfx' ? prop : true;
	      }
	    }
	    return false;
	  }
	  function testDOMProps(props, obj, elem) {
	    for (var i in props) {
	      var item = obj[props[i]];
	      if (item !== undefined) {
	        if (elem === false) return props[i];
	        if (is(item, 'function')) {
	          return item.bind(elem || obj);
	        }
	        return item;
	      }
	    }
	    return false;
	  }
	  function testPropsAll(prop, prefixed, elem) {
	    var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1),
	        props = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');
	    if (is(prefixed, 'string') || is(prefixed, 'undefined')) {
	      return testProps(props, prefixed);
	    } else {
	      props = (prop + ' ' + domPrefixes.join(ucProp + ' ') + ucProp).split(' ');
	      return testDOMProps(props, prefixed, elem);
	    }
	  }
	  tests.borderradius = function () {
	    return testPropsAll('borderRadius');
	  };
	  tests.boxshadow = function () {
	    return testPropsAll('boxShadow');
	  };
	  tests.opacity = function () {
	    setCssAll('opacity:.55');
	    return (/^0.55$/.test(mStyle.opacity)
	    );
	  };
	  tests.csstransforms = function () {
	    return !!testPropsAll('transform');
	  };
	  tests.csstransforms3d = function () {
	    var ret = !!testPropsAll('perspective');
	    if (ret && 'webkitPerspective' in docElement.style) {
	      injectElementWithStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', function (node) {
	        ret = node.offsetLeft === 9 && node.offsetHeight === 3;
	      });
	    }
	    return ret;
	  };
	  tests.csstransitions = function () {
	    return testPropsAll('transition');
	  };
	  for (var feature in tests) {
	    if (hasOwnProp(tests, feature)) {
	      featureName = feature.toLowerCase();
	      Modernizr[featureName] = tests[feature]();
	      classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
	    }
	  }
	  Modernizr.addTest = function (feature, test) {
	    if (typeof feature === 'object') {
	      for (var key in feature) {
	        if (hasOwnProp(feature, key)) {
	          Modernizr.addTest(key, feature[key]);
	        }
	      }
	    } else {
	      feature = feature.toLowerCase();
	      if (Modernizr[feature] !== undefined) {
	        return Modernizr;
	      }
	      test = typeof test === 'function' ? test() : test;
	      if (typeof enableClasses !== 'undefined' && enableClasses) {
	        docElement.className += ' ' + (test ? '' : 'no-') + feature;
	      }
	      Modernizr[feature] = test;
	    }
	    return Modernizr;
	  };
	  setCss('');
	  Modernizr._version = version;
	  Modernizr._prefixes = prefixes;
	  Modernizr._domPrefixes = domPrefixes;
	  Modernizr._cssomPrefixes = cssomPrefixes;
	  Modernizr.testProp = function (prop) {
	    return testProps([prop]);
	  };
	  Modernizr.testAllProps = testPropsAll;
	  Modernizr.testStyles = injectElementWithStyles;
	  Modernizr.prefixed = function (prop, obj, elem) {
	    if (!obj) {
	      return testPropsAll(prop, 'pfx');
	    } else {
	      return testPropsAll(prop, obj, elem);
	    }
	  };
	  return Modernizr;
	})(window, window.document);

/***/ }
/******/ ]);