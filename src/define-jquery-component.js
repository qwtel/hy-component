// # src / define-jquery-compnent.js
// Copyright (c) 2017 Florian Klampfer <https://qwtel.com/>
// Licensed under MIT

import $ from 'jquery';

import { VanillaComponent, sSetupDOM } from './vanilla';

export class JQueryComponent extends VanillaComponent {}
export { sSetupDOM };

export function defineJQueryComponent(name, Component) {
  function plugin(option, ...args) {
    return this.each(function () { // eslint-disable-line func-names
      const $this = $(this);
      const data = $this.data(name);
      const props = $.extend({}, $this.data(), typeof option === 'object' && option);
      const action = typeof option === 'string' ? option : null;

      if (!data) $this.data(name, new Component(this, props));
      else if (action) data[action](...args);
    });
  }

  const old = $.fn[name];

  $.fn[name] = plugin;
  $.fn[name].Constructor = Component;

  $.fn[name].noConflict = function () { // eslint-disable-line func-names
    $.fn[name] = old;
    return this;
  };
}
