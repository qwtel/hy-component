// # src / rxjs.js
// Copyright (c) 2018 Florian Klampfer <https://qwtel.com/>
// Licensed under MIT

import { Subject } from "rxjs/_esm5/Subject";
import { ReplaySubject } from "rxjs/_esm5/ReplaySubject";

export const rxjsMixin = C =>
  class extends C {
    static get sideEffects() {}

    setupComponent(el, opts) {
      this.subjects = {};
      const sideEffects = {};

      this.subjects.disconnect = new Subject();
      this.subjects.document = new ReplaySubject();

      const { types } = this.constructor;
      Object.keys(types).map(key => {
        this.subjects[key] = new ReplaySubject(1);
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
      this.subjects.document.next(document); // TODO: should rename to document?

      const { types } = this.constructor;
      Object.keys(types).map(key => {
        this.subjects[key].next(this[key]);
      });
    }

    disconnectComponent() {
      super.disconnectComponent();
      this.subjects.disconnect.next({});
    }

    adaptComponent() {
      super.adaptComponent();
      this.subjects.document.next(document);
    }
  };
