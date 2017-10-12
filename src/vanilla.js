// # src / vanilla.js
// Copyright (c) 2017 Florian Klampfer <https://qwtel.com/>
// Licensed under MIT

import { sSetup, sSetupDOM } from './component';

export class VanillaComponent {
  constructor(el, props) {
    this[sSetup](el, props);
  }
}

export { sSetup, sSetupDOM };
