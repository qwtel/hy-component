/*
 * Copyright (c) 2016 Florian Klampfer
 * Licensed under MIT
 */

// import 'core-js/fn/array/for-each';

// import 'core-js/fn/object/assign';
// import 'core-js/fn/object/define-property';
// import 'core-js/fn/object/keys';

class Mix {}

const Symbol = global.Symbol || (x => `_${x}`);

const def = Object.defineProperty.bind(Object);

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
  def(this, key, {
    enumerable: true,
    get: () => this[STATE][key],
    set: (value) => {
      if (sideEffect != null) {
        sideEffect(value);
      } else {
        this.setState(key, value);
      }
    },
  });
}

// TODO: do we even need getters/setters?
// TODO: study how native elements deal with attributes/properites
function setupProperties() {
  const sideEffects = this.sideEffects();

  Object.keys(this[STATE]).forEach((key) => {
    if (typeof this[key] === 'undefined') {
      const sideEffect = sideEffects[key];
      setupProperty.call(this, key, sideEffect);
    }
  });
}

export default (C = Mix) => class extends C {
  componentName() {
    throw Error('Component needs to have a name, e.g. `my-tag`. Override `getComponentName`');
  }

  setupComponent(el, state) {
    def(this, STATE, { value: Object.assign({}, this.defaults(), state) });
    setupProperties.call(this);
    def(this, ROOT, { value: this.setupDOM(el) });
    return this;
  }

  setupDOM(el) {
    return el;
  }

  get root() {
    return this.getRoot();
  }

  get el() {
    return this.getEl();
  }

  getRoot() {
    return this[ROOT];
  }

  getEl() {
    return this[ROOT];
  }

  fireEvent(eventName, data) {
    const name = this.componentName();
    const eventNameNS = `${name}-${eventName}`;
    this.el.dispatchEvent(createEvent(eventNameNS, data));
  }

  defaults() {
    // TODO: production builds with preprocess
    console.warn('defaults not provided'); // eslint-disable-line no-console
    return {};
  }

  sideEffects() {
    return {};
  }

  setState(keyOrMap, value) {
    if (typeof keyOrMap === 'string') {
      this.setStateKV(keyOrMap, value);
    } else if (typeof keyOrMap === 'object') {
      this.setStateMap(keyOrMap);
    } else {
      throw Error('setState needs argument');
    }
  }

  setStateKV(key, value) {
    this[STATE][key] = value;
  }

  setStateMap(map) {
    Object.keys(this[STATE]).forEach((key) => {
      this.setStateKV(key, map[key]);
    });
  }
};
