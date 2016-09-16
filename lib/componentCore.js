'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * Copyright (c) 2016 Florian Klampfer
 * Licensed under MIT
 */
// import 'core-js/fn/object/assign';
// import 'core-js/fn/object/define-property';

var Mix = function Mix() {
  _classCallCheck(this, Mix);
};

exports.default = function () {
  var C = arguments.length <= 0 || arguments[0] === undefined ? Mix : arguments[0];
  return function (_C) {
    _inherits(_class, _C);

    function _class() {
      _classCallCheck(this, _class);

      return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    _createClass(_class, [{
      key: 'initComponent',
      value: function initComponent(el, state) {
        this.state = Object.assign({}, this.defaults(), state);
        this.el = this.setupDOM(el);
        this.setupProperties();
      }

      // TODO: use requestIdleCallback to init the component
      // initComponentIdle() {
      //
      // }

    }, {
      key: 'setupDOM',
      value: function setupDOM(el) {
        console.warn('setupDOM not implemented'); // eslint-disable-line no-console
        return el;
      }
    }, {
      key: 'setupProperties',
      value: function setupProperties() {
        var _this2 = this;

        var hooks = this.hooks();

        Object.keys(this.state).forEach(function (key) {
          if (typeof _this2[key] === 'undefined') {
            Object.defineProperty(_this2, key, {
              get: function get() {
                return _this2.state[key];
              },
              set: function set(value) {
                if (hooks[key] != null) {
                  hooks[key](value);
                } else {
                  _this2.setState(key, value);
                }
              }
            });
          }
        });
      }

      // TODO: renmae!?

    }, {
      key: 'defaults',
      value: function defaults() {
        console.warn('defaults not provided'); // eslint-disable-line no-console
        return {};
      }

      // TODO: renmae!?

    }, {
      key: 'hooks',
      value: function hooks() {
        return {};
      }
    }, {
      key: 'setState',
      value: function setState(keyOrMap, value) {
        if (typeof keyOrMap === 'string') {
          this.setStateKV(keyOrMap, value);
        } else if ((typeof keyOrMap === 'undefined' ? 'undefined' : _typeof(keyOrMap)) === 'object') {
          this.setStateMap(keyOrMap);
        } else {
          throw Error('setState needs argument');
        }
      }
    }, {
      key: 'setStateKV',
      value: function setStateKV(key, value) {
        var oldVal = this.state[key];
        this.state[key] = value;

        if (value !== oldVal) {
          this.el.dispatchEvent(new CustomEvent(key.toLowerCase() + 'change', {
            detail: value
          }));
        }
      }
    }, {
      key: 'setStateMap',
      value: function setStateMap(map) {
        var _this3 = this;

        Object.keys(map).forEach(function (key) {
          _this3.setStateKV(key, map[key]);
        });
      }
    }]);

    return _class;
  }(C);
};