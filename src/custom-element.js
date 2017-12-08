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
import { Set } from 'qd-set';

import { simpleType } from './common';
import { sSetup, sSetupDOM, sSetState, sGetEl, sGetTemplate } from './symbols';
import { COMPONENT_FEATURE_TESTS } from './component';

export const CUSTOM_ELEMENT_FEATURE_TESTS = new Set([
  ...COMPONENT_FEATURE_TESTS,
  'template',
  'customelements',
]);

let circutBreaker;

// TODO: integrate with ./types.js !?
function setAttribute(key, val, silent = false) {
  const attrName = decamelize(key, '-');

  if (silent) circutBreaker = attrName;

  if (val === true) {
    this.setAttribute(attrName, '');
  } else if ((val === false || val === null || val === undefined) ||
             (typeof val === 'object' && val.length === 0)) {
    this.removeAttribute(attrName);
  } else if (val && typeof val === 'object' && val.length > 0 && val.join) {
    this.setAttribute(attrName, val.join(','));
  } else if (typeof val === 'string' || typeof val === 'number') {
    this.setAttribute(attrName, val);
  } else if (process.env.DEBUG) {
    console.warn(`Unrecognized type for key '${key}' with value`, val);
  }
}

function getStateFromAttributes() {
  const { defaults, types } = this.constructor;

  const state = {};
  Object.keys(defaults).forEach((key) => {
    const attrName = decamelize(key, '-');
    const attr = this.getAttribute(attrName);
    const value = simpleType(types[key], defaults[key], attr);

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
      this[sSetup]();
    }

    /* @override */
    attributeChangedCallback(attrName, oldAttr, attr) {
      if (circutBreaker === attrName) {
        circutBreaker = undefined;
        return;
      }

      if (oldAttr !== attr) {
        const { defaults, types } = this.constructor;
        const key = camelCase(attrName);
        const value = simpleType(types[key], defaults[key], attr);

        if (value != null) {
          this[key] = value;
        }
      }
    }

    /* @override */
    [sSetup]() {
      super[sSetup](this, getStateFromAttributes.call(this));
      reflectAttributeChanges.call(this);
      return this;
    }

    /* @override */
    [sSetState](key, value) {
      super[sSetState](key, value);
      setAttribute.call(this, key, value, true);
    }

    /* @override */
    [sSetupDOM](el) {
      const instance = this[sGetTemplate]();
      if (instance) {
        if ('attachShadow' in Element.prototype) {
          el.attachShadow({ mode: 'open' });
          el.shadowRoot.appendChild(instance);
          return el.shadowRoot;
        }
        if (process.env.DEBUG) console.warn('Component doesnt define a template. Intentional?');
        throw Error('ShadowDOM API not supported');
      }
      return el;
    }

    /* @override */
    [sGetEl]() {
      return this;
    }

    [sGetTemplate]() {
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
  const HTMLElement = typeof window.HTMLElement === 'function' ? window.HTMLElement : () => {};
  return Reflect.construct(HTMLElement, [], this.__proto__.constructor); // eslint-disable-line
}

if (Object.setPrototypeOf) {
  Object.setPrototypeOf(CustomElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(CustomElement, HTMLElement);
}

// TODO
export function fragmentFromString(strHTML) {
  return document.createRange().createContextualFragment(strHTML);
}
