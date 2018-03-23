// # src / rxjs.js
// Copyright (c) 2018 Florian Klampfer <https://qwtel.com/>
// Licensed under MIT

import { Subject } from "rxjs/_esm5/Subject";

export const rxjsMixin = C =>
  class extends C {
    static get sideEffects() {}

    setupComponent(el, opts) {
      this.subjects = {};
      const sideEffects = {};

      this.subjects.disconnect = new Subject();
      this.subjects.adapt = new Subject();

      const { types } = this.constructor;
      Object.keys(types).map(key => {
        this.subjects[key] = new Subject();
        sideEffects[key] = x => this.subjects[key].next(x);
      });

      Object.defineProperty(this.constructor, "sideEffects", {
        get: () => sideEffects,
        set: () => {},
        enumerable: true,
        configurable: true
      });

      super.setupComponent(el, opts);
    }

    connectComponent() {
      super.connectComponent();

      this.subjects.adapt.next(document); // TODO: should rename to document?

      const { types } = this.constructor;
      Object.keys(types).map(key => {
        this.subjects[key].next(this[key]);
      });
    }

    disconnectComponent() {
      this.subjects.disconnect.next({});
      super.disconnectComponent();
    }

    adaptComponent() {
      this.subjects.adapt.next(document);
      super.adaptComponent();
    }
  };
