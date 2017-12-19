// # src / vanilla.js
// Copyright (c) 2017 Florian Klampfer <https://qwtel.com/>
// Licensed under MIT

import { Set } from 'qd-set';

import { sSetup, sSetupDOM } from './symbols';

export { Set };

export class VanillaComponent {
  constructor(el, props) {
    this[sSetup](el, props);
  }
}

export { sSetup, sSetupDOM };
