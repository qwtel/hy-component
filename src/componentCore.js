/*
 * Copyright (c) 2016 Florian Klampfer
 * Licensed under MIT
 */
class Mix {}

export default (C = Mix) => class extends C {
  initComponent(el, state) {
    this.state = Object.assign({}, this.defaults(), state);
    this.el = this.setupDOM(el);
    this.setupProperties();
  }

  // TODO: use requestIdleCallback to init the component
  // initComponentIdle() {
  //
  // }

  setupDOM(el) {
    console.warn('setupDOM not implemented'); // eslint-disable-line no-console
    return el;
  }

  setupProperties() {
    const hooks = this.hooks();

    Object.keys(this.state).forEach(key => {
      if (typeof this[key] === 'undefined') {
        Object.defineProperty(this, key, {
          get: () => this.state[key],
          set: (value) => {
            if (hooks[key] != null) {
              hooks[key](value);
            } else {
              this.setState(key, value);
            }
          },
        });
      }
    });
  }

  // TODO: renmae!?
  defaults() {
    console.warn('defaults not provided'); // eslint-disable-line no-console
    return {};
  }

  // TODO: renmae!?
  hooks() {
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
    const oldVal = this.state[key];
    this.state[key] = value;

    if (value !== oldVal) {
      this.el.dispatchEvent(new CustomEvent(`${key.toLowerCase()}change`, {
        detail: value,
      }));
    }
  }

  setStateMap(map) {
    Object.keys(map).forEach(key => {
      this.setStateKV(key, map[key]);
    });
  }
};
