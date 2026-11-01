import type { ReactNode } from "react";
import SunLeaf from "./SunLeaf";
import { Monogram, Planet, Reticle, Scope, Shield, Topology } from "./Emblems";
import { Circuit, Fingerprint, HexCluster, IsoStack, OrbWeb, Radar, Sigil, Spectrum } from "./Emblems2";
import FingerprintDie from "../../components/FingerprintDie";
import Gyroscope from "./Gyroscope";
import Terrain from "./Terrain";
import Wireframe from "./Wireframe";

// id -> artwork, shared by the live switcher and the gallery page.
export const ART: Record<string, ReactNode> = {
  "0": <SunLeaf className="bb-art" />,
  A: <Reticle />,
  B: <Topology />,
  C: <Shield />,
  D: <Planet />,
  E: <Wireframe />,
  F: <Monogram />,
  G: <Scope />,
  H: <Terrain />,
  I: <IsoStack />,
  J: <Radar />,
  K: <Gyroscope />,
  L: <Fingerprint />,
  M: <Circuit />,
  N: <HexCluster />,
  O: <Sigil />,
  P: <Spectrum />,
  Q: <OrbWeb />,
  R: <FingerprintDie />,
};

export const NOTES: Record<string, string> = {
  A: "Targeting ring with a rotating tick scale and crosshair.",
  B: "Services as nodes joined by orthogonal lines, data flowing along them.",
  C: "Flat geometric shield with livery stripes. The literal security badge.",
  D: "Halftone-shaded world with an orbit ring and a scale bar.",
  E: "Slowly turning wireframe icosahedron in vector-era style.",
  F: "Your initials as a faction-style mark.",
  G: "Oscilloscope trace with a sweep line.",
  H: "Wireframe terrain scrolling toward you, with a striped sun and ridges.",
  I: "Isometric stack of flat-shaded cubes, like services stacked up.",
  J: "Radar sweep with pinging blips.",
  K: "Three great circles turning in 3D around a core.",
  L: "Biometric fingerprint with a scanning bar.",
  M: "A chip die with traces fanning out to pads, data flowing along them.",
  N: "Hex cluster with a few cells blinking.",
  O: "Faction-style sigil from the same flat shapes as the hero.",
  P: "Audio spectrum bars with a reflection: a nod to the visualizer project.",
  Q: "Straight-lined orb and web: a nod to Orbweaver.",
  R: "Fingerprint pressed onto a chip: procedural loop-type print over a die with traces, scan bar sweeping across.",
};
