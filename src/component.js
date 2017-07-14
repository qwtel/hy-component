// Copyright (c) 2017 Florian Klampfer <https://qwtel.com/>
// Licensed under MIT

import 'core-js/fn/array/for-each';
import 'core-js/fn/object/assign';
import 'core-js/fn/object/define-property';
import 'core-js/fn/object/keys';

export const MODERNIZR_TESTS = [
  'customevent',
];

const Symbol = global.Symbol || (x => `_${x}`);
const ROOT = Symbol('root');
const STATE = Symbol('state');

export const setup = Symbol('setup');
export const setupDOM = Symbol('setupDOM');
export const getRoot = Symbol('getRoot');
export const getEl = Symbol('getEl');
export const fire = Symbol('fire');
export const setState = Symbol('setState');

function createEvent(eventName, data = {}) {
  try {
    return new CustomEvent(eventName, { detail: data });
  } catch (e) {
    const event = document.createEvent('CustomEvent');
    event.initCustomEvent(eventName, true, true, data);
    return event;
  }
}

function setupProperty(key, sideEffect) {
  Object.defineProperty(this, key, {
    get: () => this[STATE][key],
    set: (value) => {
      if (this[STATE][key] !== value) {
        this[setState](key, value);
        if (sideEffect) sideEffect.call(this, value);
        // this[fire](`${key}-change`);
      }
    },
    enumerable: true,
    configurable: true,
  });
}

// TODO: study how native elements deal with attributes/properites
function setupProperties() {
  const { sideEffects } = this.constructor;

  Object.keys(this[STATE]).forEach((key) => {
    // if (process.env.DEBUG && typeof this.prototype[key] !== 'undefined') {
    //   console.warn(`Property name ${key} conflicts with pre-existing key.`, this[key]);
    // }
    const sideEffect = sideEffects[key];
    setupProperty.call(this, key, sideEffect);
  });
}

class Component {}

export function componentMixin(C = Component) {
  return class extends C {
    get root() {
      return this[getRoot]();
    }

    get el() {
      return this[getEl]();
    }

    [setup](el, state) {
      const { defaults } = this.constructor;

      if (process.env.DEBUG) {
        const { componentName, sideEffects } = this.constructor;
        if (!componentName) console.warn('Component needs to have a name, e.g. `my-tag`. To set a name, provide a static getter called `componentName`.');
        if (!defaults) console.warn('No default properties provided. Implement a static getter called `defaults`.');
        if (!sideEffects) console.warn('No side effects provided. Implement a static getter called `sideEffects`.');
      }

      this[STATE] = Object.assign({}, defaults, state);
      setupProperties.call(this);
      this[ROOT] = this[setupDOM](el);
      return this;
    }

    [setupDOM](el) {
      return el;
    }

    [getRoot]() {
      return this[ROOT];
    }

    [getEl]() {
      return this[ROOT];
    }

    [fire](eventName, data) {
      const { componentName } = this.constructor;
      const eventNameNS = `${componentName}-${eventName}`;
      this.el.dispatchEvent(createEvent(eventNameNS, data));
    }

    [setState](key, value) {
      this[STATE][key] = value;
    }

    // setInternalStateMap(map) {
    //   Object.keys(this[STATE]).forEach((key) => {
    //     this.setInternalStateKV(key, map[key]);
    //   });
    // }

    // setInternalState(keyOrMap, value) {
    //   if (typeof keyOrMap === 'string') {
    //     this.setInternalStateKV(keyOrMap, value);
    //   } else if (typeof keyOrMap === 'object') {
    //     this.setInternalStateMap(keyOrMap);
    //   } else if (process.env.DEBUG) {
    //     console.warn('`setInternalState` called without argument');
    //   }
    // }
  };
}
