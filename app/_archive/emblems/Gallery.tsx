import Barcode from "../../components/Barcode";
import ThemeShuffle from "../../components/ThemeShuffle";
import "./emblems.css";
import { ART, NOTES } from "./registry";
import { OPTIONS } from "./store";

const options = OPTIONS.filter((o) => o.id !== "0").map((o) => ({
  id: o.id,
  name: o.name,
  liked: o.liked,
  art: ART[o.id],
  note: NOTES[o.id],
}));

export default function Emblems() {
  return (
    <main className="wrap">
      <div className="intro-bar">
        <div>
          <p className="hud">EMBLEM STUDY {"//"} {OPTIONS.length - 1} CANDIDATES</p>
          <h1 className="name" style={{ fontSize: "clamp(1.6rem,3.6vw,2.4rem)", marginTop: "0.4rem" }}>
            Badge art options
          </h1>
        </div>
        <ThemeShuffle />
      </div>
      <p className="intro" style={{ marginTop: "0.6rem" }}>
        Each option sits in the real ID-plate frame. Use Shuffle colors to see them in other palettes.
      </p>
      <div className="gallery">
        {options.map((o) => (
          <figure key={o.id}>
            <div className="billboard">
              <p className="bb-row">
                <span>Status</span>
                <b>Available</b>
              </p>
              {o.art}
              <p className="bb-top">Open to roles</p>
              <p className="bb-meta">Hands-on engineering · .NET · TypeScript · AWS</p>
              <div className="bb-code">
                <Barcode seed={11} />
                <span>KM-2026-A</span>
              </div>
            </div>
            <figcaption>
              <b>
                {o.id} {"//"} {o.liked ? "★ " : ""}
                {o.name}
              </b>
              <p>{o.note}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </main>
  );
}
