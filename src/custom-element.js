// Copyright (c) 2017 Florian Klampfer <https://qwtel.com/>
// Licensed under MIT

import 'core-js/fn/array/for-each';
import 'core-js/fn/array/map';
import 'core-js/fn/object/keys';
import 'core-js/fn/object/set-prototype-of';
import 'core-js/fn/reflect/construct';
import 'core-js/fn/string/trim'; // used by camelcase

import camelCase from 'camelcase';
import decamelize from 'decamelize';

import { simpleType, setAttribute } from './common';
import { MODERNIZR_TESTS as COMPONENT_MODERNIZER_TESTS } from './component';

export const MODERNIZR_TESTS = Object.assign({
  template: true,
  customelements: true,
}, COMPONENT_MODERNIZER_TESTS);

function getStateFromAttributes() {
  const { defaults } = this.constructor;
  const state = {};

  Object.keys(defaults).forEach((key) => {
    const attrName = decamelize(key, '-');
    const attrVal = this.getAttribute(attrName);
    const typedValue = simpleType(defaults[key], attrVal);

    if (typedValue != null) {
      state[key] = typedValue;
    }
  });

  return state;
}

function reflectAttributeChanges() {
  const { defaults } = this.constructor;
  Object.keys(defaults).forEach(key => setAttribute.call(this, key, this[key]));
}

export function customElementMixin(C) {
  return class extends C {
    static getObservedAttributes() {
      const { defaults } = this;
      return Object.keys(defaults).map(x => decamelize(x, '-'));
    }

    // @override
    connectedCallback() {
      this.setupComponent();
      this.fireEvent('attached');
    }

    // @override
    setupComponent() {
      super.setupComponent(this, getStateFromAttributes.call(this));
      reflectAttributeChanges.call(this);
      return this;
    }

    // @override
    attributeChangedCallback(attr, oldVal, val) {
      const { defaults } = this.constructor;
      const key = camelCase(attr);
      const typedValue = simpleType(defaults[key], val);

      if (typedValue != null) {
        this[key] = typedValue;
      }
    }

    // @override
    setInternalStateKV(key, value) {
      super.setInternalStateKV(key, value);
      setAttribute.call(this, key, value);
    }

    // @override
    setupDOM(el) {
      if ('attachShadow' in document.body) {
        el.attachShadow({ mode: 'open' });
        const instance = this.getTemplateInstance();
        el.shadowRoot.appendChild(instance);
        return el.shadowRoot;
      }
      throw Error('ShadowDOM API not supported');
    }

    getTemplateInstance() {
      const { componentName } = this.constructor;

      return document
        .querySelector(`link[href$="${componentName}.html"]`)
        .import
        .querySelector(`#${componentName}-template`)
        .content
        .cloneNode(true);
    }

    // @override
    getEl() {
      return this;
    }
  };
}

export function CustomElement() {
  return Reflect.construct(typeof HTMLElement === 'function' ? HTMLElement : () => {},
    [], this.__proto__.constructor); // eslint-disable-line
}

Object.setPrototypeOf(CustomElement.prototype, HTMLElement.prototype);
Object.setPrototypeOf(CustomElement, HTMLElement);
