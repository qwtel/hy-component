// # src / define-jquery-compnent.js
// Copyright (c) 2017 Florian Klampfer <https://qwtel.com/>
// Licensed under MIT

// jQuery predates arrow functions and makes use of binding a functions's `this`,
// so that passing arrow functions results in errors in many cases.
// We modify eslint to allow passing anonymous `function`s:
/* eslint-disable func-names, consistent-return */

// jQuery is an optional dependency
import $ from 'jquery'; // eslint-disable-line import/no-extraneous-dependencies

import { sSetup, sSetupDOM, sFire } from './component';
import { VanillaComponent } from './vanilla';

export { sSetup, sSetupDOM };

export const JQueryComponent = VanillaComponent;

export function defineJQueryComponent(name, Component) {
  const cName = name.toLowerCase();

  const Constructor = class extends Component {
    [sSetupDOM](el) {
      this.$element = super[sSetupDOM]($(el));
      return this.$element[0];
    }

    [sFire](eventName, data) {
      const event = $.Event(`${eventName}.${cName}`, data);
      this.$element.trigger(event);
    }
  };

  function plugin(option, arg, ...args) {
    const key = typeof option === 'string' ? option : null;

    return this.each(function () {
      const $this = $(this);
      const data = $this.data(cName);
      const props = $.extend({}, $this.data(), typeof option === 'object' && option);

      if (!data) $this.data(cName, new Constructor(this, props));
      else if (key && typeof data[key] === 'function') data[key](arg, ...args);
      else if (typeof option === 'object' && option) $.extend(data, option);
    });
  }

  const fName = cName.split('.').pop();

  const old = $.fn[fName];

  $.fn[fName] = plugin;
  $.fn[fName].Constructor = Constructor;

  $.fn[fName].noConflict = function () {
    $.fn[fName] = old;
    return this;
  };
}
