// # src / common.js
// Copyright (c) 2017 Florian Klampfer <https://qwtel.com/>
// Licensed under MIT

import { array, arrayOf, bool, number, regex, string } from './types';

export { array, arrayOf, bool, number, regex, string };

export function simpleType(type, defVal, attr) {
  // Use the provided type, if any.
  if (type && type === bool) return type(attr);
  else if (type) return !attr ? defVal : type(attr);

  // Otherwise, infer primitive types form `defVal`.
  else if (typeof defVal === 'boolean') return bool(attr);
  else if (typeof defVal === 'number') return !attr ? defVal : number(attr);
  else if (typeof defVal === 'object' && defVal) return !attr ? defVal : array(attr);
  else if (typeof defVal === 'string') return !attr ? defVal : string(attr);

  if (process.env.DEBUG) console.warn(`No type provided for attribute ${attr} and can't infer from defaults`);
  return undefined;
}
