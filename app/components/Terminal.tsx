"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { VIBE_FADE_MS, bootFrames, complete, promptFor, run, vibeFrames, type Ctx, type Line, type Splash, type Theme } from "../lib/terminal/engine";

type Entry = { kind: "in"; ps: string; text: string } | ({ kind: "out" } & Line);

// Turns bare URLs and email addresses in output into real links.
const LINK = /(https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.-]+)/g;
function linkify(text: string): ReactNode[] {
  return text.split(LINK).map((part, i) => {
    if (i % 2 === 0) return part;
    const href = part.includes("@") && !part.startsWith("http") ? `mailto:${part}` : part;
    return (
      <a key={i} href={href} target="_blank" rel="noopener noreferrer">
        {part}
      </a>
    );
  });
}

type Props = { open: boolean; theme: Theme; onClose: () => void; onTheme: (to: Theme) => void };

export default function Terminal({ open, theme, onClose, onTheme }: Props) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [cwd, setCwd] = useState<string[]>([]);
  const [value, setValue] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [asking, setAsking] = useState(false); // a security question is waiting for its answer
  const [booting, setBooting] = useState(false);
  const [vibing, setVibing] = useState(false);
  const vibeTimers = useRef<number[]>([]);
  const [splash, setSplash] = useState<Splash | null>(null);
  const booted = useRef(false);
  const skipBoot = useRef<() => void>(() => {});
  const history = useRef<string[]>([]);
  const cursor = useRef(0); // position while browsing history; equals history.length when not browsing
  const draft = useRef("");
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  // Focus the prompt on open, give focus back to whatever opened us on close, and stop the page
  // behind from scrolling while the overlay is up.
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const overflow = html.style.overflow;
    html.style.overflow = "hidden";
    html.classList.add("kt-open");
    inputRef.current?.focus();
    return () => {
      html.style.overflow = overflow;
      html.classList.remove("kt-open");
      prev?.focus?.();
    };
  }, [open]);

  // The boot sequence plays the first time the terminal opens. Any key or click skips it, and
  // visitors who prefer reduced motion get the finished screen straight away.
  useEffect(() => {
    if (!open || booted.current) return;
    const frames = bootFrames();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: number[] = [];
    const show = (i: number) => {
      setEntries(frames[i].lines.map((l) => ({ kind: "out" as const, ...l })));
      setSplash(frames[i].splash);
    };
    const finish = () => {
      timers.forEach(window.clearTimeout);
      show(frames.length - 1);
      booted.current = true;
      setBooting(false);
    };
    skipBoot.current = finish;
    if (reduced) {
      timers.push(window.setTimeout(finish, 0));
    } else {
      timers.push(window.setTimeout(() => setBooting(true), 0));
      let t = 0;
      frames.forEach((f, i) => {
        t += f.wait;
        timers.push(window.setTimeout(i === frames.length - 1 ? finish : () => show(i), t));
      });
    }
    return () => {
      // closed mid-boot: stop, and let the next open start it over
      timers.forEach(window.clearTimeout);
      if (!booted.current) {
        setEntries([]);
        setSplash(null);
        setBooting(false);
      }
    };
  }, [open]);

  // Closing the terminal mid-sequence cancels the pending theme switch.
  useEffect(() => {
    if (open) return;
    vibeTimers.current.forEach(window.clearTimeout);
    vibeTimers.current = [];
    setTimeout(() => {
      setAsking(false);
      setVibing(false);
      setSplash((s) => (s?.kind === "vibe" ? null : s));
    }, 0);
  }, [open]);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries, open]);

  if (!open) return null;

  // `vibe`: play a short logo sequence inside the terminal, fade it out, and only then hand over
  // to the page's theme switch (which closes the terminal and runs the glitch). Only when enabling.
  const startVibe = (to: Theme) => {
    // The logo sequence is only for turning the vibe ON. Turning it off just switches back, and
    // reduced-motion visitors skip the overlay either way.
    if (to === "pro" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onTheme(to);
      return;
    }
    const frames = vibeFrames();
    setVibing(true);
    let t = 0;
    frames.forEach((f) => {
      t += f.wait;
      vibeTimers.current.push(window.setTimeout(() => setSplash(f.splash), t));
    });
    vibeTimers.current.push(
      window.setTimeout(() => {
        vibeTimers.current = [];
        onTheme(to);
      }, t + VIBE_FADE_MS),
    );
  };

  const ctx = (): Ctx => ({ cwd, unlocked, theme, history: history.current, asking });
  const ps = asking ? "answer:" : promptFor(cwd);

  const submit = () => {
    const text = value;
    const result = run(text, ctx());
    const next: Entry[] = [{ kind: "in", ps, text }];
    if (result.effect?.kind === "clear") {
      setEntries([]);
    } else {
      setEntries((e) => [...e, ...next, ...result.out.map((l) => ({ kind: "out" as const, ...l }))]);
    }
    if (text.trim() && !asking) history.current.push(text);
    cursor.current = history.current.length;
    draft.current = "";
    setValue("");
    if (result.cwd) setCwd(result.cwd);
    if (result.unlocked) setUnlocked(true);
    if (result.asking !== undefined) setAsking(result.asking);
    const fx = result.effect;
    if (fx?.kind === "close") onClose();
    else if (fx?.kind === "theme") startVibe(fx.to);
    else if (fx?.kind === "open") window.open(fx.href, "_blank", "noopener,noreferrer");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (vibing) {
      // Nothing to type while the sequence plays; Escape cancels it and closes the terminal.
      e.preventDefault();
      if (e.key === "Escape") onClose();
      return;
    }
    if (booting && e.key !== "Escape") {
      e.preventDefault();
      skipBoot.current();
      return;
    }
    const h = history.current;
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!h.length) return;
      if (cursor.current === h.length) draft.current = value;
      cursor.current = Math.max(0, cursor.current - 1);
      setValue(h[cursor.current]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cursor.current >= h.length) return;
      cursor.current += 1;
      setValue(cursor.current === h.length ? draft.current : h[cursor.current]);
    } else if (e.key === "Tab") {
      e.preventDefault(); // keeps focus inside the terminal, and Tab means "complete" here anyway
      if (asking) return;
      const { start, options } = complete(value, ctx());
      if (options.length === 1) {
        setValue(value.slice(0, start) + options[0] + (options[0].endsWith("/") ? "" : " "));
      } else if (options.length > 1) {
        let common = options[0];
        for (const o of options) while (!o.startsWith(common)) common = common.slice(0, -1);
        setValue(value.slice(0, start) + common);
        setEntries((en) => [
          ...en,
          { kind: "in", ps, text: value },
          { kind: "out", text: options.join("  ") },
        ]);
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setEntries([]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  return createPortal(
    <div
      className="kt-overlay"
      data-theme-kind={theme}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="kt"
        role="dialog"
        aria-modal="true"
        aria-label="Terminal"
        onClick={() => {
          if (booting) skipBoot.current();
          if (!window.getSelection()?.toString()) inputRef.current?.focus();
        }}
      >
        <div className="kt-top">
          <span>KM//TERMINAL</span>
          <button type="button" onClick={onClose} aria-label="Close terminal">
            esc ✕
          </button>
        </div>
        <div className="kt-body">
        <div className="kt-log" ref={logRef} role="log" aria-live="polite">
          {entries.map((en, i) =>
            en.kind === "in" ? (
              <p key={i} className="kt-line">
                <span className="kt-ps">{en.ps}</span> {en.text}
              </p>
            ) : en.img ? (
              // A plain <img>: the site is a static export (no image optimizer), and this one photo
              // only ever appears on demand inside the terminal.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                className="kt-img"
                src={en.img.src}
                alt={en.img.alt}
                onLoad={() => {
                  const el = logRef.current;
                  if (el) el.scrollTop = el.scrollHeight;
                }}
              />
            ) : (
              <p key={i} className={`kt-line ${en.cls ?? ""}`}>
                {linkify(en.text)}
              </p>
            ),
          )}
          <label className={`kt-line kt-input${booting || vibing ? " kt-input-hidden" : ""}`}>
            <span className="kt-ps">{ps}</span>
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              aria-label="Terminal input"
            />
          </label>
        </div>
        {splash && (
          <div className="kt-splash" data-phase={splash.phase} aria-hidden="true">
            <span className="kt-corner tl">{splash.kind === "vibe" ? "KM//VIBE" : "KM//TERMINAL BIOS rev.A"}</span>
            <span className="kt-corner bl">{splash.kind === "vibe" ? "Esc to cancel" : "Press any key to skip"}</span>
            {splash.kind !== "vibe" && <span className="kt-corner br">(C) 2026 Kawika Miller</span>}
            {splash.phase === "welcome" || splash.phase === "welcome-out" ? (
              <div className="kt-welcome">
                <p className="kt-welcome-title">Welcome :)</p>
                <p className="kt-welcome-sub">guest access granted</p>
                <p className="kt-welcome-sub">type `help` to get started</p>
              </div>
            ) : (
              <div className={`kt-splash-mid${splash.kind === "vibe" ? " vibe" : ""}`}>
                <pre className="kt-logo">{splash.art.join("\n")}</pre>
                <div className="kt-loadbar">
                  <i style={{ width: `${splash.bar * 100}%` }} />
                </div>
                <div className="kt-steps">
                  {splash.steps.slice(-3).map((t) => (
                    <p key={t}>{t}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
