// # src / common.js
// Copyright (c) 2017 Florian Klampfer <https://qwtel.com/>
// Licensed under MIT

import { array, arrayOf, boolean, number, regex, string } from './types';

export { array, arrayOf, boolean, number, regex, string };

// Quick-and-Dirty `Set` implementation.
/* eslint-disable */
export const Set = global.Set || function (a = []) {
  a = a.filter((x, i) => i === a.indexOf(x));
  a.size = a.length;
  a.has = x => a.indexOf(x) > -1;
  a.add = x => { if (!a.has(x)) { a.size++; a.push(x); } return a; };
  a.delete = x => { let t; if (t = a.has(x)) { a.size--; delete a[a.indexOf(x)]; } return t; };
  a.keys = a.values = () => a[Symbol.iterator]();
  a.clear = () => { while (a.pop()) {} a.size = 0; };
  return a;
};
/* eslint-enable */

export function simpleType(type, defVal, attr) {
  // Use the provided type, if any.
  if (type && type === boolean) return type(attr);
  else if (type) return !attr ? defVal : type(attr);

  // Otherwise, infer primitive types form `defVal`.
  else if (typeof defVal === 'boolean') return boolean(attr);
  else if (typeof defVal === 'number') return !attr ? defVal : number(attr);
  else if (typeof defVal === 'object' && defVal) return !attr ? defVal : array(attr);
  else if (typeof defVal === 'string') return !attr ? defVal : string(attr);

  if (process.env.DEBUG) console.warn(`No type provided for attribute ${attr} and can't infer from defaults`);
  return undefined;
}
