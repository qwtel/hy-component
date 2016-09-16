'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/*
 * Copyright (c) 2016 Florian Klampfer
 * Licensed under MIT
 */
/* eslint-disable func-names, no-param-reassign */
exports.default = function ($, name, Component) {
  function plugin(option) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return this.each(function () {
      // Not using => on purpose!
      var $this = $(this);
      var data = $this.data(name);
      var props = $.extend({}, $this.data(), (typeof option === 'undefined' ? 'undefined' : _typeof(option)) === 'object' && option);
      var action = typeof option === 'string' ? option : null;

      if (!data) $this.data(name, new Component(this, props));else if (action) data[action].apply(data, args);
    });
  }

  var old = $.fn[name];

  $.fn[name] = plugin;
  $.fn[name].Constructor = Component;

  $.fn[name].noConflict = function () {
    // Not using => on purpose!
    $.fn[name] = old;
    return this;
  };
};