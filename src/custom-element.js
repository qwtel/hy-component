// # src / custom-element.js
// Copyright (c) 2017 Florian Klampfer <https://qwtel.com/>
// Licensed under MIT

import 'core-js/fn/array/for-each';
import 'core-js/fn/array/map';
import 'core-js/fn/number/constructor';
import 'core-js/fn/object/keys';
import 'core-js/fn/object/set-prototype-of';
import 'core-js/fn/reflect/construct';
import 'core-js/fn/string/trim'; // used by camelcase

import camelCase from 'camelcase';
import decamelize from 'decamelize';

import { setup, setupDOM, setState, getEl, MODERNIZR_TESTS as COMPONENT_MODERNIZR_TESTS }
from './component';

const Symbol = global.Symbol || (x => `_${x}`);
export const getTemplate = Symbol('getTemplate');

export const MODERNIZR_TESTS = [
  ...COMPONENT_MODERNIZR_TESTS,
  'template',
  'customelements',
];

// infers primitive types form `defVal` and applies it to `attr`
function simpleType(defVal, attr) {
  if (typeof defVal === 'boolean') {
    return attr != null;
  }
  else if (typeof defVal === 'number') {
    if (attr != null) return Number(attr);
    return defVal;
  }
  else if (defVal && typeof defVal === 'object' && defVal.length > 0) {
    if (attr != null) return attr.split ? attr.split(',') : [];
    return defVal;
  }
  else if (typeof defVal === 'string') {
    if (attr != null) return attr;
    return defVal;
  }
  return undefined;
}

let HACK;

function setAttribute(key, val, silent = false) {
  const attrName = decamelize(key, '-');

  if (silent) HACK = attrName;

  if (val === true) {
    this.setAttribute(attrName, '');
  }
  else if ((val === false || val === null || val === undefined)
           || (typeof val === 'object' && val.length === 0)) {
    this.removeAttribute(attrName);
  }
  else if (val && typeof val === 'object' && val.length > 0 && val.join) {
    this.setAttribute(attrName, val.join(','));
  }
  else if (typeof val === 'string' || typeof val === 'number') {
    this.setAttribute(attrName, val);
  }
  else if (process.env.DEBUG) {
    console.warn(`Unrecognized type for key '${key}' with value`, val);
  }
}

function getStateFromAttributes() {
  const { defaults } = this.constructor;

  const state = {};
  Object.keys(defaults).forEach((key) => {
    const attrName = decamelize(key, '-');
    const attr = this.getAttribute(attrName);
    const value = simpleType(defaults[key], attr);

    if (value != null) {
      state[key] = value;
    }
  });

  return state;
}

function reflectAttributeChanges() {
  const { defaults } = this.constructor;
  Object.keys(defaults).forEach(key => setAttribute.call(this, key, this[key]));
}

// function str(s) { return s === '' ? '<empty>' : s; }

export function customElementMixin(C) {
  return class extends C {
    static getObservedAttributes() {
      const { defaults } = this;
      return Object.keys(defaults).map(x => decamelize(x, '-'));
    }

    /* @override */
    connectedCallback() {
      this[setup]();
    }

    /* @override */
    attributeChangedCallback(attrName, oldAttr, attr) {
      if (HACK === attrName) { HACK = undefined; return; }

      if (oldAttr !== attr) {
        const { defaults } = this.constructor;
        const key = camelCase(attrName);
        const value = simpleType(defaults[key], attr);

        if (value != null) {
          this[key] = value;
        }
      }
    }

    /* @override */
    [setup]() {
      super[setup](this, getStateFromAttributes.call(this));
      reflectAttributeChanges.call(this);
      return this;
    }

    /* @override */
    [setState](key, value) {
      super[setState](key, value);
      setAttribute.call(this, key, value, true);
    }

    /* @override */
    [setupDOM](el) {
      if ('attachShadow' in document.body) {
        el.attachShadow({ mode: 'open' });
        const instance = this[getTemplate]();
        el.shadowRoot.appendChild(instance);
        return el.shadowRoot;
      }
      throw Error('ShadowDOM API not supported');
    }

    /* @override */
    [getEl]() {
      return this;
    }

    /*
    get template() {
      return this[getTemplate]();
    }
    */

    [getTemplate]() {
      const { componentName } = this.constructor;

      return document
        .querySelector(`link[href$="${componentName}.html"]`)
        .import
        .querySelector(`#${componentName}-template`)
        .content
        .cloneNode(true);
    }
  };
}

// This is a drop-in replacement for `HTMLElement` which is compatible with babel.
export function CustomElement() {
  return Reflect.construct(typeof HTMLElement === 'function' ? HTMLElement : () => {},
    [], this.__proto__.constructor); // eslint-disable-line
}
Object.setPrototypeOf(CustomElement.prototype, HTMLElement.prototype);
Object.setPrototypeOf(CustomElement, HTMLElement);

// TODO
export function fragmentFromString(strHTML) {
  return document.createRange().createContextualFragment(strHTML);
}
