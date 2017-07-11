// Copyright (c) 2017 Florian Klampfer <https://qwtel.com/>
// Licensed under MIT

import 'core-js/fn/array/for-each';
import 'core-js/fn/object/assign';
import 'core-js/fn/object/define-property';
import 'core-js/fn/object/keys';

export const MODERNIZR_TESTS = {
  customevent: true,
};

const Symbol = global.Symbol || (x => `_${x}`);
const ROOT = Symbol('root');
const STATE = Symbol('state');

function createEvent(eventName, data = {}) {
  try {
    return new CustomEvent(eventName, data);
  } catch (e) {
    const event = document.createEvent('CustomEvent');
    event.initCustomEvent(eventName, true, true, data.detail);
    return event;
  }
}

function setupProperty(key, sideEffect) {
  Object.defineProperty(this, key, {
    enumerable: true,
    get: () => this[STATE][key],
    set: (value) => {
      if (this[STATE][key] !== value) {
        this.setInternalStateKV(key, value);
        if (sideEffect) sideEffect.call(this, value);
      }
    },
  });
}

// TODO: study how native elements deal with attributes/properites
function setupProperties() {
  const { sideEffects } = this.constructor;

  Object.keys(this[STATE]).forEach((key) => {
    if (process.env.DEBUG && typeof this[key] !== 'undefined') {
      console.warn(`Property name ${key} conflicts with pre-existing key.`, this[key]);
    }
    const sideEffect = sideEffects[key];
    setupProperty.call(this, key, sideEffect);
  });
}

class Component {}

export function componentMixin(C = Component) {
  return class extends C {
    setupComponent(el, state) {
      const { defaults } = this.constructor;

      if (process.env.DEBUG) {
        const { componentName, sideEffects } = this.constructor;
        if (!componentName) console.warn('Component needs to have a name, e.g. `my-tag`. To set a name, provide a static getter called `componentName`.');
        if (!defaults) console.warn('No default properties provided. Implement a static getter called `defaults`.');
        if (!sideEffects) console.warn('No side effects provided. Implement a static getter called `sideEffects`.');
      }

      this[STATE] = Object.assign({}, defaults, state);
      setupProperties.call(this);
      this[ROOT] = this.setupDOM(el);
      return this;
    }

    setupDOM(el) {
      return el;
    }

    getRoot() {
      return this[ROOT];
    }

    get root() {
      return this.getRoot();
    }

    getEl() {
      return this[ROOT];
    }

    get el() {
      return this.getEl();
    }

    fireEvent(eventName, data) {
      const { componentName } = this.constructor;
      const eventNameNS = `${componentName}-${eventName}`;
      this.el.dispatchEvent(createEvent(eventNameNS, data));
    }

    setInternalState(keyOrMap, value) {
      if (typeof keyOrMap === 'string') {
        this.setInternalStateKV(keyOrMap, value);
      } else if (typeof keyOrMap === 'object') {
        this.setInternalStateMap(keyOrMap);
      } else if (process.env.DEBUG) {
        console.warn('`setInternalState` called without argument');
      }
    }

    setInternalStateKV(key, value) {
      this[STATE][key] = value;
    }

    setInternalStateMap(map) {
      Object.keys(this[STATE]).forEach((key) => {
        this.setInternalStateKV(key, map[key]);
      });
    }
  };
}
