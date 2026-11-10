// The terminal's brain: pure functions from (input, state) to output plus side effects. The React
// component owns the state and performs the effects, so this file is easy to test on its own.

import { profile, projects, sideProjects, skills } from "../../content";
import { payoff, payoffImage, question } from "../../terminal-content";
import { checkAnswer, isHidden, nodeAt, resolve, type Node } from "./fs";

export type Theme = "pro" | "neon";
export type Line = { text: string; cls?: "err" | "dim" | "ok"; img?: { src: string; alt: string } };
/** The full-window splash, like a PC logo screen: centered logo, a loading bar and BIOS corner text. */
export type Splash = {
  art: string[];
  /** 0..1 */
  bar: number;
  /** The checklist shown under the bar; the last entry is the step in progress. */
  steps: string[];
  /** show: normal. fade: the splash fades out. welcome / welcome-out: the "Welcome :)" screen. */
  phase: "show" | "fade" | "welcome" | "welcome-out";
  /** Which sequence this is, so the corner text and sizing can differ. Defaults to the boot one. */
  kind?: "boot" | "vibe";
};
export type Effect =
  | { kind: "clear" }
  | { kind: "close" }
  | { kind: "theme"; to: Theme }
  | { kind: "open"; href: string };
export type Ctx = { cwd: string[]; unlocked: boolean; theme: Theme; history: string[]; asking?: boolean };
export type Result = { out: Line[]; cwd?: string[]; unlocked?: boolean; asking?: boolean; effect?: Effect };

export const promptFor = (cwd: string[]) => `kawika@portfolio:${cwd.length ? "~/" + cwd.join("/") : "~"}$`;

const lines = (text: string, cls?: Line["cls"]): Line[] => text.split("\n").map((t) => ({ text: t, cls }));
// The unlocked note: the text, then the photo if one is configured.
const payoffLines = (): Line[] => [
  ...lines(payoff.join("\n")),
  ...(payoffImage ? [{ text: "", img: payoffImage }] : []),
];
const err = (text: string): Result => ({ out: lines(text, "err") });
const ok = (out: Line[]): Result => ({ out });

const HELP = [
  "commands:",
  "  ls [-a] [path]     list files (-a shows hidden ones)",
  "  cd <path>          change directory",
  "  cat <file>         print a file",
  "  tree               show everything at a glance",
  "  pwd, whoami, date, history, clear, exit",
  "  open <file|url>    open resume.pdf or a link from a file",
  "  neofetch           the short version of me",
  "",
  "Tab completes, ↑/↓ browse history, Esc closes.",
];

const COMMANDS = [
  "help", "ls", "cd", "cat", "tree", "pwd", "whoami", "date", "history", "clear", "exit", "open",
  "neofetch", "sudo", "decrypt", "echo", "man", "uname", "ping", "rm", "vim", "emacs", "nano",
];

function treeLines(n: Node, prefix = "", showHidden: boolean): string[] {
  if (n.type !== "dir") return [];
  const names = Object.keys(n.children)
    .filter((k) => showHidden || !isHidden(k))
    .sort((a, b) => {
      const ad = n.children[a].type === "dir" ? 0 : 1;
      const bd = n.children[b].type === "dir" ? 0 : 1;
      return ad - bd || a.localeCompare(b);
    });
  return names.flatMap((name, i) => {
    const last = i === names.length - 1;
    const child = n.children[name];
    const here = `${prefix}${last ? "└── " : "├── "}${name}${child.type === "dir" ? "/" : ""}`;
    return [here, ...treeLines(child, prefix + (last ? "    " : "│   "), showHidden)];
  });
}

function ls(args: string[], ctx: Ctx): Result {
  const all = args.some((a) => a === "-a" || a === "-la" || a === "-al");
  const target = args.find((a) => !a.startsWith("-")) ?? ".";
  const path = resolve(ctx.cwd, target);
  const n = path && nodeAt(path);
  if (!n) return err(`ls: cannot access '${target}': No such file or directory`);
  if (n.type === "file") return ok([{ text: target }]);
  const names = Object.keys(n.children)
    .filter((k) => all || !isHidden(k))
    .sort((a, b) => a.localeCompare(b))
    .map((k) => (n.children[k].type === "dir" ? `${k}/` : k));
  return ok([{ text: names.join("  ") || "(empty)", cls: names.length ? undefined : "dim" }]);
}

function cat(args: string[], ctx: Ctx): Result {
  if (!args.length) return err("cat: missing file operand");
  const out: Line[] = [];
  for (const a of args) {
    const path = resolve(ctx.cwd, a);
    const n = path && nodeAt(path);
    if (!n) return err(`cat: ${a}: No such file or directory`);
    if (n.type === "dir") return err(`cat: ${a}: Is a directory`);
    if (n.locked) {
      out.push(...(ctx.unlocked ? payoffLines() : lines(n.locked.notice, "err")));
    } else out.push(...lines(n.content));
  }
  return ok(out);
}

function open(args: string[], ctx: Ctx): Result {
  const a = args[0];
  if (!a) return err("open: missing operand");
  if (/^https?:\/\//.test(a)) return { out: lines(`opening ${a}`, "dim"), effect: { kind: "open", href: a } };
  if (a === "resume.pdf" || a === "resume") {
    return { out: lines("opening resume.pdf", "dim"), effect: { kind: "open", href: profile.resume } };
  }
  const path = resolve(ctx.cwd, a);
  const n = path && nodeAt(path);
  if (!n) return err(`open: ${a}: No such file or directory`);
  if (n.type === "file") {
    const url = n.content.match(/https?:\/\/\S+/)?.[0];
    if (url) return { out: lines(`opening ${url}`, "dim"), effect: { kind: "open", href: url } };
  }
  return err(`open: nothing to open in '${a}'. try cat.`);
}

const neofetch = (): Result =>
  ok(
    lines(
      [
        "kawika@portfolio",
        "----------------",
        `role     ${profile.title}`,
        `langs    ${skills[0].items.join(", ")}`,
        "cloud    AWS, Terraform, Docker",
        `shipped  ${projects.length} work projects, ${sideProjects.length} side projects`,
        "editor   whatever is open and has Claude Code in it",
        "uptime   since the first time I broke production on purpose (in staging)",
        `mail     ${profile.email}`,
      ].join("\n"),
    ),
  );

function sudo(args: string[], ctx: Ctx): Result {
  const [cmd, ...rest] = args;
  if (!cmd) return err("usage: sudo <command>");
  if (cmd === "vibe") return vibe(rest, ctx);
  if (cmd === "rm") return rm(rest);
  if (cmd === "make") return ok(lines("What? Make it yourself.", "dim"));
  return err("kawika is not in the sudoers file. This incident will be reported. (To no one. Relax.)");
}

function vibe(args: string[], ctx: Ctx): Result {
  if (args.includes("--disable")) {
    if (ctx.theme === "pro") return ok(lines("vibe is already disabled.", "dim"));
    return { out: lines("> vibe --disable", "ok"), effect: { kind: "theme", to: "pro" } };
  }
  if (ctx.theme === "neon") return ok(lines("vibe is already enabled. you are already in it. (vibe --disable to undo)", "dim"));
  return { out: lines("> vibe --enable", "ok"), effect: { kind: "theme", to: "neon" } };
}

function rm(args: string[]): Result {
  const nuke = args.some((a) => a === "/" || a === "/*" || a === "~");
  if (nuke) {
    return ok(
      lines(
        "rm: it is dangerous to operate recursively on '/'\nrm: use --no-preserve-root to override this failsafe\n(fail-closed, as always.)",
        "err",
      ),
    );
  }
  return err("rm: this filesystem is read-only. I have trust issues with write access.");
}

function tryAnswer(text: string): Result {
  if (checkAnswer(text)) return { out: payoffLines(), unlocked: true, asking: false };
  return { out: lines("incorrect. hint: I leave my favorite things lying around in here.", "err"), asking: false };
}

export function run(input: string, ctx: Ctx): Result {
  const trimmed = input.trim();
  // While a security question is pending, the next line typed is the answer, not a command.
  if (ctx.asking) {
    if (!trimmed) return ok([]);
    if (trimmed === "cancel") return { out: lines("cancelled.", "dim"), asking: false };
    return tryAnswer(trimmed);
  }
  if (!trimmed) return ok([]);
  const [cmd, ...args] = trimmed.split(/\s+/);

  switch (cmd) {
    case "help":
    case "?":
      return ok(lines([...HELP, ...(ctx.theme === "neon" ? ["", "vibe --disable   back to the minimal design"] : [])].join("\n")));
    case "ls":
      return ls(args, ctx);
    case "cd": {
      const target = args[0] ?? "~";
      const path = resolve(ctx.cwd, target);
      const n = path && nodeAt(path);
      if (!path || !n) return err(`cd: ${target}: No such file or directory`);
      if (n.type !== "dir") return err(`cd: ${target}: Not a directory`);
      return { out: [], cwd: path };
    }
    case "pwd":
      return ok([{ text: ctx.cwd.length ? "/home/kawika/" + ctx.cwd.join("/") : "/home/kawika" }]);
    case "cat":
      return cat(args, ctx);
    case "tree": {
      const path = resolve(ctx.cwd, args.find((a) => !a.startsWith("-")) ?? ".");
      const n = path && nodeAt(path);
      if (!n) return err("tree: no such directory");
      return ok(lines([".", ...treeLines(n, "", args.includes("-a"))].join("\n")));
    }
    case "whoami":
      return ok([{ text: "a person who reads the page source. respect." }]);
    case "date":
      return ok([{ text: new Date().toString() }]);
    case "uname":
      return ok([{ text: "KM/OS 2026.Rev.A portfolio x86_64 (it's a div)" }]);
    case "history":
      return ok(ctx.history.map((h, i) => ({ text: `${String(i + 1).padStart(4)}  ${h}` })));
    case "clear":
      return { out: [], effect: { kind: "clear" } };
    case "exit":
    case "quit":
    case "logout":
      return { out: [], effect: { kind: "close" } };
    case "open":
      return open(args, ctx);
    case "neofetch":
      return neofetch();
    case "echo":
      return ok([{ text: args.join(" ") }]);
    case "man":
      return ok(lines(args[0] ? `No manual entry for ${args[0]}. Have you tried reading the code?` : "What manual page do you want?", "dim"));
    case "sudo":
      return sudo(args, ctx);
    case "vibe":
      return vibe(args, ctx);
    case "decrypt": {
      const [fileArg, ...given] = args;
      if (!fileArg) return err("usage: decrypt note.enc");
      const path = resolve(ctx.cwd, fileArg);
      const n = path && nodeAt(path);
      if (!n || n.type !== "file" || !n.locked) return err(`decrypt: ${fileArg}: nothing to decrypt`);
      if (ctx.unlocked) return ok(payoffLines());
      // `decrypt note.enc <answer>` works as a shortcut; otherwise ask, and the next line is the answer.
      if (given.length) return tryAnswer(given.join(" "));
      return { out: lines(`security question: ${question}\n(type your answer, or \`cancel\`)`), asking: true };
    }
    case "ping":
      return ok(lines("PING hello@... 64 bytes: time=0.2ms\n(just email me. it's on contact.txt.)", "dim"));
    case "rm":
      return rm(args);
    case "vim":
    case "nano":
    case "emacs":
      return ok(lines(`${cmd}: read-only filesystem. besides, you'd never get out of it.`, "dim"));
    default:
      return err(`${cmd}: command not found. try \`help\`.`);
  }
}

/** Tab completion: returns the full set of candidates for the word being typed. */
export function complete(input: string, ctx: Ctx): { start: number; options: string[] } {
  const m = input.match(/(\S*)$/);
  const word = m ? m[1] : "";
  const start = input.length - word.length;
  const isFirst = !input.slice(0, start).trim();
  if (isFirst) return { start, options: COMMANDS.filter((c) => c.startsWith(word)).sort() };

  const slash = word.lastIndexOf("/");
  const base = slash >= 0 ? word.slice(0, slash + 1) : "";
  const frag = slash >= 0 ? word.slice(slash + 1) : word;
  const dirPath = resolve(ctx.cwd, base || ".");
  const n = dirPath && nodeAt(dirPath);
  if (!n || n.type !== "dir") return { start, options: [] };
  const options = Object.keys(n.children)
    .filter((k) => k.startsWith(frag) && (frag.startsWith(".") || !isHidden(k)))
    .sort()
    .map((k) => base + k + (n.children[k].type === "dir" ? "/" : ""));
  return { start, options };
}

// "KM" as a 5-row pixel font. Each pixel is drawn 3 blocks wide and 2 rows tall so it reads as
// square. Only solid block characters, because box-drawing glyphs fall back to a different font
// and stop lining up.
const SPLASH_ART = [
  ["#..#", "#...#"],
  ["#.#.", "##.##"],
  ["##..", "#.#.#"],
  ["#.#.", "#...#"],
  ["#..#", "#...#"],
].flatMap((row) => {
  const line = row.join("..").replace(/#/g, "███").replace(/\./g, "   ");
  return [line, line];
});

/** `wait` is the delay BEFORE this frame appears, i.e. how long the previous frame stays on screen. */
export type Frame = { lines: Line[]; splash: Splash | null; wait: number };

// Pacing knobs: every wait below is multiplied by one of these. 1 = the original speed.
const SPLASH_PACE = 2.25; // the logo intro
const STEP_PACE = 1.95; // the fake checks
const WELCOME_HOLD = 3600; // how long "Welcome :)" stays up, fade-in included

// The fake startup checks shown on the splash. Purely theatrical: nothing is actually verified.
const CHECKS: { label: string; result: string }[] = [
  { label: "memory check", result: "640K ok" },
  { label: "mounting /home/kawika", result: "ok (read-only)" },
  { label: "linking content", result: "ok" },
  { label: "verifying visitor", result: "human" },
  { label: "authenticating session", result: "guest" },
  { label: "checking clearance", result: "level 0" },
  { label: "access", result: "granted" },
];

const WIDTH = 32;
const pending = (label: string) => `> ${label} `.padEnd(WIDTH, ".");
const done = (label: string, result: string) => `${pending(label)} ${result}`;

/**
 * The boot sequence as cumulative snapshots: logo splash, then each check in turn (the bar advances
 * with them), a fade out, a "Welcome :)" screen, and finally the terminal with its welcome text.
 */
export function bootFrames(): Frame[] {
  const frames: Frame[] = [];
  const full = SPLASH_ART.length;
  const splash = (over: Partial<Splash>): Splash => ({
    art: SPLASH_ART,
    bar: 0,
    steps: [],
    phase: "show",
    ...over,
  });
  const add = (s: Splash | null, wait: number, lines: Line[] = []) => frames.push({ lines, splash: s, wait });

  // Logo draws in row by row, with a short beat once it is complete.
  add(splash({ art: [] }), 250 * SPLASH_PACE);
  for (let i = 1; i <= full; i++) add(splash({ art: SPLASH_ART.slice(0, i) }), 55 * SPLASH_PACE);
  add(splash({}), 220 * SPLASH_PACE);

  // Each check shows as pending (bar half a step along), then resolves (bar a full step along).
  const n = CHECKS.length;
  const shown: string[] = [];
  CHECKS.forEach((c, i) => {
    add(splash({ bar: (i + 0.5) / n, steps: [...shown, pending(c.label)] }), 220 * STEP_PACE);
    shown.push(done(c.label, c.result));
    add(splash({ bar: (i + 1) / n, steps: [...shown] }), 280 * STEP_PACE);
  });

  // Hold on the finished splash, fade it out, then the welcome screen in and out. Remember each
  // wait is the time the PREVIOUS frame stays up: the welcome screen's hold is the wait on the
  // "welcome-out" frame (including its 0.6s fade-in).
  const finished = { bar: 1, steps: [...shown] };
  add(splash({ ...finished, phase: "fade" }), 750); // hold the finished splash
  add(splash({ ...finished, phase: "welcome" }), 650); // splash fade-out
  add(splash({ ...finished, phase: "welcome-out" }), WELCOME_HOLD); // welcome screen on display
  add(null, 600, BOOT); // welcome fade-out, then the terminal
  return frames;
}

export const BOOT: Line[] = [
  { text: "KM//TERMINAL  rev.A  [ link established ]", cls: "ok" },
  { text: "type `help` to get started.", cls: "dim" },
];

// The wordmark is real text (shown large and glowing by CSS), typed in letter by letter. A pixel-art
// version was tried first but four letters at this size broke apart into unreadable dots.
const VIBE_WORD = "VIBE";
const VIBE_ART = [VIBE_WORD];

/** The short in-terminal sequence that plays between typing `vibe` and the page switching to neon. */
export function vibeFrames(): Frame[] {
  const steps = ["> vibe --enable", "> loading neon.css ......... ok", "> signal ................... 100%"];
  const mk = (over: Partial<Splash>): Splash => ({
    art: VIBE_ART,
    bar: 0,
    steps: [],
    phase: "show",
    kind: "vibe",
    ...over,
  });
  const frames: Frame[] = [{ lines: [], splash: mk({ art: [] }), wait: 150 }];
  for (let i = 1; i <= VIBE_WORD.length; i++) {
    frames.push({ lines: [], splash: mk({ art: [VIBE_WORD.slice(0, i)] }), wait: 260 });
  }
  steps.forEach((_, i) =>
    frames.push({ lines: [], splash: mk({ bar: (i + 1) / steps.length, steps: steps.slice(0, i + 1) }), wait: 650 }),
  );
  // Hold the finished screen, then fade it out; the last frame's wait is the fade's duration.
  frames.push({ lines: [], splash: mk({ bar: 1, steps, phase: "fade" }), wait: 900 });
  return frames;
}

/** How long the final (fade) frame of the vibe sequence needs before the caller moves on. */
export const VIBE_FADE_MS = 700;
