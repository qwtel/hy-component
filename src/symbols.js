// # src / symbols.js
// Copyright (c) 2017 Florian Klampfer <https://qwtel.com/>
// Licensed under MIT

const Symbol = global.Symbol || (x => `_${x}`);

export const sSetup = Symbol('setup');
export const sSetupDOM = Symbol('setupDOM');
export const sGetRoot = Symbol('getRoot');
export const sGetEl = Symbol('getElement');
export const sFire = Symbol('fire');
export const sSetState = Symbol('setState');
export const sGetTemplate = Symbol('getTemplate');
