// # src / common.js
// Copyright (c) 2017 Florian Klampfer <https://qwtel.com/>
// Licensed under MIT

import { bool } from 'attr-types';

export function simpleType(type, defVal, attr) {
  if (type) {
    if (type === bool) return type(attr);
    return !attr ? defVal : type(attr);
  } else if (process.env.DEBUG) {
    console.warn(`No type provided for attribute ${attr} and can't infer from defaults`);
  }
  return undefined;
}
