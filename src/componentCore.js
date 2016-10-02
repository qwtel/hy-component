/*
 * Copyright (c) 2016 Florian Klampfer
 * Licensed under MIT
 */
// import 'core-js/fn/object/assign';
// import 'core-js/fn/object/define-property';
// import 'core-js/fn/object/keys';

class Mix {}

export default (C = Mix) => class extends C {
  initComponent(el, state) {
    this.state = Object.assign({}, this.defaults(), state);
    this.el = this.setupDOM(el);
    this.setupProperties();
  }

  setupDOM(el) {
    console.warn('setupDOM not implemented'); // eslint-disable-line no-console
    return el;
  }

  setupProperties() {
    const sideEffects = this.sideEffects();

    for (const key of Object.keys(this.state)) {
      if (typeof this[key] === 'undefined') {
        Object.defineProperty(this, key, {
          get: () => this.state[key],
          set: (value) => {
            const sideEffect = sideEffects[key];
            if (sideEffect != null) {
              sideEffect(value);
            } else {
              this.setState(key, value);
            }
          },
        });
      }
    }
  }

  // TODO: renmae!?
  defaults() {
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
    this.state[key] = value;
  }

  setStateMap(map) {
    for (const key of Object.keys(map)) {
      this.setStateKV(key, map[key]);
    }
  }
};
