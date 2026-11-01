"use client";

import { useSyncExternalStore } from "react";
import { OPTIONS, readIndex, setIndex, subscribe } from "./store";

// Temporary floating control for cycling through badge candidates live.
export default function EmblemSwitch() {
  const i = useSyncExternalStore(subscribe, readIndex, () => 0);
  const o = OPTIONS[i];
  return (
    <div className="emblem-switch" role="group" aria-label="Badge study (temporary)">
      <span className="emblem-tag">Badge study</span>
      <button type="button" className="emblem-step" onClick={() => setIndex(i - 1)} aria-label="Previous badge">
        ←
      </button>
      <button type="button" className="emblem-next" onClick={() => setIndex(i + 1)}>
        <b>{o.id}</b> {o.liked ? "★ " : ""}{o.name}
        <span className="emblem-count">
          {i + 1}/{OPTIONS.length}
        </span>
      </button>
      <button type="button" className="emblem-step" onClick={() => setIndex(i + 1)} aria-label="Next badge">
        →
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        Badge: {o.name}
      </span>
    </div>
  );
}
