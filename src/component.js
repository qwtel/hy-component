// # src / component.js
// Copyright (c) 2017 Florian Klampfer <https://qwtel.com/>
// Licensed under MIT

import 'core-js/fn/array/for-each';
import 'core-js/fn/object/assign';
import 'core-js/fn/object/define-property';
import 'core-js/fn/object/keys';

import { Set } from 'qd-set';

export { Set };

export const COMPONENT_FEATURE_TESTS = new Set([
  'customevent',
]);

const Symbol = global.Symbol || (x => `_${x}`);
const sRoot = Symbol('root');
const sState = Symbol('state');

class Component {}

export const componentMixin = (C = Component) => class extends C {
  get root() { return this.getRoot(); }

  get el() { return this.getEl(); }

  setupComponent(el, state) {
    const { defaults } = this.constructor;

    if (process.env.DEBUG) {
      const { componentName, sideEffects } = this.constructor;
      if (!componentName) console.warn('Component needs to have a name, e.g. `my-tag`. To set a name, provide a static getter called `componentName`.');
      if (!defaults) console.warn('No default properties provided. Implement a static getter called `defaults`.');
      if (!sideEffects) console.warn('No side effects provided. Implement a static getter called `sideEffects`.');
    }

    this[sState] = Object.assign({}, defaults, state);
    this.setupProperties(this);
    this[sRoot] = this.setupShadowDOM(el);
  }

  setupShadowDOM(el) { return el; }

  connectComponent() {}

  disconnectComponent() {}

  adoptComponent() {}

  getRoot() { return this[sRoot]; }

  getEl() { return this[sRoot]; }

  fireEvent(eventName, data) {
    const { componentName } = this.constructor;
    const event = new CustomEvent(`${componentName}-${eventName}`, data);
    this.el.dispatchEvent(event);
  }

  setInternalState(key, value) { this[sState][key] = value; }

  setupProperties() {
    const { sideEffects } = this.constructor;

    Object.keys(this[sState]).forEach((key) => {
      const sideEffect = sideEffects[key];
      this.setupProperty(key, sideEffect);
    });
  }

  setupProperty(key, sideEffect) {
    Object.defineProperty(this, key, {
      get: () => this[sState][key],
      set: (value) => {
        const oldValue = this[sState][key];
        this.setInternalState(key, value);
        if (sideEffect) sideEffect.call(this, value, oldValue);
      },
      enumerable: true,
      configurable: true,
    });
  }
};
