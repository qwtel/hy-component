// # src / types.js
// Copyright (c) 2017 Florian Klampfer <https://qwtel.com/>
// Licensed under MIT

export function array(attr) {
  return attr.replace(/^\[/, '').replace(/\]$/, '').split(',');
}

export function arrayOf(type) {
  return attr => array(attr).map(type);
}

export function string(attr) {
  return attr;
}

export function boolean(attr) {
  if (attr === true || attr === 'true') return true;
  else if (attr === false || attr === 'false') return false;
  return attr != null;
}

export function number(attr) {
  return Number(attr);
}

export function regex(attr) {
  const match = attr.match(/^\/?(.*?)(\/([gimy]*))?$/);
  return new RegExp(match[1], match[3]);
}

/*
export function oneOf(alts) {
  return (attr) => {
    const i = alts.indexOf(attr);
    if (process.env.DEBUG && i === -1) console.warn(`'${attr}' is not oneOf '${alts.join(',')}'`);
    return i > -1 ? alts[i] : null;
  };
}
*/
