import { setup, setupDOM } from './component';

export class VanillaComponent {
  constructor(el, props) {
    this[setup](el, props);
  }
}

export { setup, setupDOM };
