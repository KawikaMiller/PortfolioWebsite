"use client";

import { useSyncExternalStore } from "react";
import "./emblems.css";
import { ART } from "./registry";
import { OPTIONS, readIndex, subscribe } from "./store";

// Renders whichever badge is selected in the study switch. "0" is the original sun and lotus.
export default function BadgeArt() {
  const i = useSyncExternalStore(subscribe, readIndex, () => 0);
  return <>{ART[OPTIONS[i].id] ?? ART["0"]}</>;
}
