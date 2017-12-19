// # src / common.js
// Copyright (c) 2017 Florian Klampfer <https://qwtel.com/>
// Licensed under MIT

export function parseType(type, attr) {
  if (process.env.DEBUG && !type) {
    return console.warn(`No type provided for attribute ${attr}.`);
  }
  return type ? type(attr) : attr;
}
