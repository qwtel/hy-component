// Copyright (C) 2017  Florian Klampfer
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import paramCase from 'param-case';

// infers primitive types form `defVal` and applies it to `val`
export function simpleType(defVal, val) {
  if (typeof defVal === 'boolean') {
    return val != null;
  } else if (typeof defVal === 'number') {
    if (val != null) {
      return Number(val);
    }
    return defVal;
  } else if (typeof defVal === 'object') {
    if (val != null) {
      return val.split ? val.split(',') : [];
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

export function setAttribute(key, value) {
  const attrName = paramCase(key);

  if (value === true) {
    this.setAttribute(attrName, '');
  } else if (value === false ||
             value === null ||
             (typeof value === 'object' && value.length === 0)) {
    this.removeAttribute(attrName);
  } else if (typeof value === 'object' && value.length > 0 && value.join) {
    this.setAttribute(attrName, value.join(','));
  } else {
    this.setAttribute(attrName, value);
  }
}
