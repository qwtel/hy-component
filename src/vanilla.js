// # src / vanilla.js
// Copyright (c) 2017 Florian Klampfer <https://qwtel.com/>
// Licensed under MIT

import { setup, setupDOM } from './component';

export class VanillaComponent {
  constructor(el, props) {
    this[setup](el, props);
  }
}

export { setup, setupDOM };
