// # src / rxjs.js
// Copyright (c) 2018 Florian Klampfer <https://qwtel.com/>
// Licensed under MIT

import { Subject, ReplaySubject } from "rxjs/_esm5";

export const rxjsMixin = C =>
  class extends C {
    setupComponent(el, opts) {
      const sideEffects = {};

      this.subjects = {};
      this.subjects.disconnect = new Subject();
      this.subjects.document = new ReplaySubject();

      Object.keys(this.constructor.types).map(key => {
        this.subjects[key] = new ReplaySubject(1);
        sideEffects[key] = x => this.subjects[key].next(x);
      });

      Object.defineProperty(this.constructor, "sideEffects", {
        get: () => sideEffects,
        set: () => {},
        enumerable: true,
        configurable: true,
      });

      super.setupComponent(el, opts);
    }

    connectComponent() {
      super.connectComponent();
      this.subjects.document.next(document);
      Object.keys(this.constructor.types).map(key => this.subjects[key].next(this[key]));
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
