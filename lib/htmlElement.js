'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _camelCase = require('camel-case');

var _camelCase2 = _interopRequireDefault(_camelCase);

var _paramCase = require('param-case');

var _paramCase2 = _interopRequireDefault(_paramCase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright (c) 2016 Florian Klampfer
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under MIT
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


// infers primitive types form `defVal` and applies it to `val`
function simpleType(defVal, val) {
  if (typeof defVal === 'boolean') {
    return val != null;
  } else if (typeof defVal === 'number') {
    if (val != null) {
      return Number(val);
    }
    return defVal;
  } else if (typeof defVal === 'string') {
    if (val != null) {
      return val;
    }
    return defVal;
  }
  return null;
}

function setAttribute(key, value) {
  var attrName = (0, _paramCase2.default)(key);

  if (value === true) {
    this.setAttribute(attrName, '');
  } else if (value === false) {
    this.removeAttribute(attrName);
  } else {
    this.setAttribute(attrName, value);
  }
}

exports.default = function () {
  var C = arguments.length <= 0 || arguments[0] === undefined ? HTMLElement : arguments[0];
  return function (_C) {
    _inherits(_class, _C);

    function _class() {
      _classCallCheck(this, _class);

      return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    _createClass(_class, [{
      key: 'createdConnected',
      value: function createdConnected() {
        this.initComponent(this, this.getStateFromAttributes());
        this.reflectAttributeChanges();
      }
    }, {
      key: 'getStateFromAttributes',
      value: function getStateFromAttributes() {
        var _this2 = this;

        var defaults = this.defaults();

        var state = {};

        Object.keys(defaults).forEach(function (key) {
          var attrName = (0, _paramCase2.default)(key);
          var attrVal = _this2.getAttribute(attrName);
          var typedValue = simpleType(defaults[key], attrVal);

          if (typedValue != null) {
            state[key] = typedValue;
          }
        });

        return state;
      }
    }, {
      key: 'reflectAttributeChanges',
      value: function reflectAttributeChanges() {
        var _this3 = this;

        var defaults = this.defaults();

        Object.keys(defaults).forEach(function (key) {
          var eventName = key.toLowerCase() + 'change';

          _this3.addEventListener(eventName, function (_ref) {
            var detail = _ref.detail;

            setAttribute.call(_this3, key, detail);
          });

          setAttribute.call(_this3, key, _this3[key]);
        });
      }
    }, {
      key: 'attributeChangedCallback',
      value: function attributeChangedCallback(attr, oldVal, val) {
        var defaults = this.defaults();
        var key = (0, _camelCase2.default)(attr);
        var typedValue = simpleType(defaults[key], val);

        if (typedValue != null) {
          this[key] = typedValue;
        }
      }
    }]);

    return _class;
  }(C);
};