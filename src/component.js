// # src / component.js
// Copyright (c) 2017 Florian Klampfer <https://qwtel.com/>
// Licensed under MIT

import 'core-js/fn/array/for-each';
import 'core-js/fn/object/assign';
import 'core-js/fn/object/define-property';
import 'core-js/fn/object/keys';

import { Set } from 'qd-set';

import { sSetup, sSetupDOM, sGetRoot, sGetEl, sFire, sSetState } from './symbols';

export const COMPONENT_FEATURE_TESTS = new Set([
  'customevent',
]);

const Symbol = global.Symbol || (x => `_${x}`);
const sRoot = Symbol('root');
const sState = Symbol('state');

function setupProperty(key, sideEffect) {
  Object.defineProperty(this, key, {
    get: () => this[sState][key],
    set: (value) => {
      const oldValue = this[sState][key];
      this[sSetState](key, value);
      if (sideEffect) sideEffect.call(this, value, oldValue);
    },
    enumerable: true,
    configurable: true,
  });
}

function setupProperties() {
  const { sideEffects } = this.constructor;

  Object.keys(this[sState]).forEach((key) => {
    const sideEffect = sideEffects[key];
    setupProperty.call(this, key, sideEffect);
  });
}

class Component {}

export function componentMixin(C = Component) {
  return class extends C {
    get root() {
      return this[sGetRoot]();
    }

    get el() {
      return this[sGetEl]();
    }

    [sSetup](el, state) {
      const { defaults } = this.constructor;

      if (process.env.DEBUG) {
        const { componentName, sideEffects } = this.constructor;
        if (!componentName) console.warn('Component needs to have a name, e.g. `my-tag`. To set a name, provide a static getter called `componentName`.');
        if (!defaults) console.warn('No default properties provided. Implement a static getter called `defaults`.');
        if (!sideEffects) console.warn('No side effects provided. Implement a static getter called `sideEffects`.');
      }

      this[sState] = Object.assign({}, defaults, state);
      setupProperties.call(this);
      this[sRoot] = this[sSetupDOM](el);
      return this;
    }

    [sSetupDOM](el) {
      return el;
    }

    [sGetRoot]() {
      return this[sRoot];
    }

    [sGetEl]() {
      return this[sRoot];
    }

    [sFire](eventName, data) {
      const { componentName } = this.constructor;
      const event = new CustomEvent(`${componentName}-${eventName}`, data);
      this.el.dispatchEvent(event);
    }

    [sSetState](key, value) {
      this[sState][key] = value;
    }
  };
}
