'use strict';

import { fixProps } from './virtualDOM';

let { fixStyles } = fixProps;

fixProps.fixStyles = function machRadium(styles) {
  return autoPrefix.all(fixStyles(styles));
}

// NOTE: The following code was lifted from material-ui.

const isBrowser = typeof window !== 'undefined';

//Keep track of already prefixed keys so we can skip Modernizr prefixing
let prefixedKeys = {};

let autoPrefix = {
  all(styles) {
    if (!styles) return styles;
    let prefixedStyle = {};
    for (let key in styles) {
      prefixedStyle[this.single(key)] = styles[key];
    }
    return prefixedStyle;
  },

  set(style, key, value) {
    style[this.single(key)] = value;
  },

  single(key) {
    //If a browser doesn't exist, we can't prefix with Modernizr so
    //just return the key
    if (!isBrowser) return key;
    //Check if we've prefixed this key before, just return it
    if (prefixedKeys.hasOwnProperty(key)) return prefixedKeys[key];
    //Key hasn't been prefixed yet, prefix with Modernizr
    const prefKey = Modernizr.prefixed(key);
    // Windows 7 Firefox has an issue with the implementation of Modernizr.prefixed
    // and is capturing 'false' as the CSS property name instead of the non-prefixed version.
    if (prefKey === false) return key;
    //Save the key off for the future and return the prefixed key
    prefixedKeys[key] = prefKey;
    return prefKey;
  },

  singleHyphened(key) {
    let str = this.single(key);
    return !str ? key : str.replace(/([A-Z])/g, (str,m1) => {
      return '-' + m1.toLowerCase();
    }).replace(/^ms-/,'-ms-');
  }
};

let Modernizr = (function( window, document, undefined ) {
  let version = '2.8.3',
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
      featureName,
      injectElementWithStyles = function( rule, callback, nodes, testnames ) {
        let style, ret, node, docOverflow,
            div = document.createElement('div'),
            body = document.body,
            fakeBody = body || document.createElement('body');
        if ( parseInt(nodes, 10) ) {
          while ( nodes-- ) {
            node = document.createElement('div');
            node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
            div.appendChild(node);
          }
        }
        style = ['&#173;','<style id="s', mod, '">', rule, '</style>'].join('');
        div.id = mod;
        (body ? div : fakeBody).innerHTML += style;
        fakeBody.appendChild(div);
        if ( !body ) {
          fakeBody.style.background = '';
          fakeBody.style.overflow = 'hidden';
          docOverflow = docElement.style.overflow;
          docElement.style.overflow = 'hidden';
          docElement.appendChild(fakeBody);
        }
        ret = callback(div, rule);
        if ( !body ) {
          fakeBody.parentNode.removeChild(fakeBody);
          docElement.style.overflow = docOverflow;
        } else {
          div.parentNode.removeChild(div);
        }
        return !!ret;
      },
      _hasOwnProperty = ({}).hasOwnProperty,
      hasOwnProp;

  function is( obj, type ) {
    return typeof obj === type;
  }

  if ( !is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined') ) {
    hasOwnProp = function (object, property) {
      return _hasOwnProperty.call(object, property);
    };
  }
  else {
    hasOwnProp = function (object, property) {
      return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
    };
  }

  function setCss( str ) {
    mStyle.cssText = str;
  }

  function setCssAll( str1, str2 ) {
    return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));
  }

  function contains( str, substr ) {
    return !!~('' + str).indexOf(substr);
  }

  function testProps( props, prefixed ) {
    for ( let i in props ) {
      let prop = props[i];
      if ( !contains(prop, '-') && mStyle[prop] !== undefined ) {
        return prefixed === 'pfx' ? prop : true;
      }
    }
    return false;
  }

  function testDOMProps( props, obj, elem ) {
    for ( let i in props ) {
      let item = obj[props[i]];
      if ( item !== undefined) {
        if (elem === false) return props[i];
        if (is(item, 'function')){
          return item.bind(elem || obj);
        }
        return item;
      }
    }
    return false;
  }

  function testPropsAll( prop, prefixed, elem ) {
    let ucProp  = prop.charAt(0).toUpperCase() + prop.slice(1),
        props   = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');
    if (is(prefixed, 'string') || is(prefixed, 'undefined')) {
      return testProps(props, prefixed);
    } else {
      props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
      return testDOMProps(props, prefixed, elem);
    }
  }

  tests.borderradius = function() {
    return testPropsAll('borderRadius');
  };

  tests.boxshadow = function() {
    return testPropsAll('boxShadow');
  };

  tests.opacity = function() {
    setCssAll('opacity:.55');
    return (/^0.55$/).test(mStyle.opacity);
  };

  tests.csstransforms = function() {
    return !!testPropsAll('transform');
  };

  tests.csstransforms3d = function() {
    let ret = !!testPropsAll('perspective');
    if ( ret && 'webkitPerspective' in docElement.style ) {
      injectElementWithStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', function(node) {
        ret = node.offsetLeft === 9 && node.offsetHeight === 3;
      });
    }
    return ret;
  };

  tests.csstransitions = function() {
    return testPropsAll('transition');
  };

  for ( let feature in tests ) {
    if ( hasOwnProp(tests, feature) ) {
      featureName  = feature.toLowerCase();
      Modernizr[featureName] = tests[feature]();
      classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
    }
  }

  Modernizr.addTest = function ( feature, test ) {
    if ( typeof feature === 'object' ) {
      for ( let key in feature ) {
        if ( hasOwnProp( feature, key ) ) {
          Modernizr.addTest( key, feature[ key ] );
        }
      }
    } else {
      feature = feature.toLowerCase();
      if ( Modernizr[feature] !== undefined ) {
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

  Modernizr._version      = version;
  Modernizr._prefixes     = prefixes;
  Modernizr._domPrefixes  = domPrefixes;
  Modernizr._cssomPrefixes  = cssomPrefixes;

  Modernizr.testProp      = function(prop){
    return testProps([prop]);
  };

  Modernizr.testAllProps  = testPropsAll;

  Modernizr.testStyles    = injectElementWithStyles;
  Modernizr.prefixed      = function(prop, obj, elem){
    if(!obj) {
      return testPropsAll(prop, 'pfx');
    } else {
      return testPropsAll(prop, obj, elem);
    }
  };

  return Modernizr;
})(window, window.document);
