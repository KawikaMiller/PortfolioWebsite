// The terminal's fake filesystem. Professional files are generated from content.ts so the terminal
// can never say more than the site already does; the personal ones come from terminal-content.ts.

import {
  education,
  experience,
  kudos,
  profile,
  projects,
  sideProjects,
  skills,
  trackRecord,
  teaching,
  type Project,
} from "../../content";
import { answer, favorites } from "../../terminal-content";

export type FileNode = {
  type: "file";
  content: string;
  /** Needs the puzzle solved before `cat` shows the real content (shown instead of `content`). */
  locked?: { notice: string };
};
export type DirNode = { type: "dir"; children: Record<string, Node> };
export type Node = FileNode | DirNode;

const file = (content: string, locked?: FileNode["locked"]): FileNode => ({ type: "file", content, locked });
const dir = (children: Record<string, Node>): DirNode => ({ type: "dir", children });

const TRAILING = new Set(["for", "to", "and", "of", "in", "with", "from", "the", "a", "an", "inc", "llc"]);

// "Bot and abuse mitigation for consumer endpoints" -> "bot-and-abuse-mitigation": short enough to
// type, and never ending on a dangling stop word.
const slug = (s: string) => {
  const words = s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .slice(0, 5);
  while (words.length > 1 && TRAILING.has(words[words.length - 1])) words.pop();
  return words.join("-");
};

function projectFile(p: Project): string {
  return [
    `# ${p.title}`,
    p.period,
    "",
    p.summary,
    "",
    ...p.points.map((x) => `- ${x}`),
    "",
    `tags: ${p.tags.join(", ")}`,
    ...(p.href ? ["", p.href] : []),
  ].join("\n");
}

function projectDir(list: Project[]): DirNode {
  const children: Record<string, Node> = {};
  for (const p of list) children[`${slug(p.title)}.md`] = file(projectFile(p));
  return dir(children);
}

const careerDir = dir(
  Object.fromEntries([
    ...experience.map((e) => [
      `${slug(e.company)}.md`,
      file([`# ${e.role}, ${e.company}`, e.period, "", ...e.points.map((x) => `- ${x}`)].join("\n")),
    ]),
    [
      "teaching.md",
      file(teaching.map((t) => `# ${t.title}: ${t.role}\n${t.period}\n\n${t.summary}`).join("\n\n")),
    ],
    ["education.md", file(education.map((e) => `${e.name}: ${e.detail} (${e.date})`).join("\n"))],
  ]),
);

const list = (items: string[]) => items.map((x) => `- ${x}`).join("\n");

export const root: DirNode = dir({
  "readme.md": file(
    [
      "# kawika@portfolio",
      "",
      "Welcome. This is a fake shell over the same content as the page, so nothing here is a secret",
      "and nothing is gated. It's just a different way to look around.",
      "",
      "Try: help, ls, cd projects, cat about.txt, tree",
      "Poke around. Some things are hidden. `ls -a` is your friend.",
    ].join("\n"),
  ),
  "about.txt": file(`${profile.name}\n${profile.title}\n\n${profile.tagline}\n\n${profile.intro}`),
  "stack.log": file(skills.map((g) => `[${g.group}]\n${list(g.items)}`).join("\n\n")),
  "kudos.txt": file(
    [
      ...kudos.map((k) => `"${k.text}"\n  - ${k.from} (${k.context})`),
      "",
      ...trackRecord.map((t) => `- ${t}`),
    ].join("\n\n"),
  ),
  "contact.txt": file(
    [`email:    ${profile.email}`, `github:   ${profile.github}`, `linkedin: ${profile.linkedin}`].join("\n"),
  ),
  "resume.pdf": file("[binary file] try: open resume.pdf"),
  work: projectDir(projects),
  "side-projects": projectDir(sideProjects),
  career: careerDir,
  favorites: dir({
    "foods.txt": file(list(favorites.foods)),
    "games.txt": file(list(favorites.games)),
    "playlist.txt": file(
      favorites.playlist.href ? `${favorites.playlist.name}\n${favorites.playlist.href}` : favorites.playlist.name,
    ),
  }),
  ".secrets": dir({
    "README": file(
      [
        "You weren't supposed to find this. Well, you were. That's why it's here.",
        "",
        "note.enc is locked behind a security question. I leave my favorite things",
        "lying around this filesystem, so a little snooping goes a long way.",
        "",
        "usage: decrypt note.enc",
        "",
        "While you're here: there's a command `help` won't tell you about. It's called `vibe`.",
        "Run it. (`vibe --disable` undoes it.)",
      ].join("\n"),
    ),
    "note.enc": file("", { notice: "note.enc: encrypted. usage: decrypt note.enc" }),
    ".bash_history": file(
      ["cd ~", "ls -a", "cat .secrets/README", "# decrypt note.enc ********  <- nope, not leaving that here"].join("\n"),
    ),
  }),
});

// The answer check lives here so the secret and the lock stay in one module. It ignores case,
// spaces and punctuation, so "Spam Musubi!" matches "spam musubi".
const squash = (t: string) => t.toLowerCase().replace(/[^a-z0-9]/g, "");
export const checkAnswer = (attempt: string) => squash(attempt) === squash(answer);

/** Resolve a user-typed path against the cwd into a segment list, or null if it leaves the root. */
export function resolve(cwd: string[], input: string): string[] | null {
  const parts = input === "~" || input.startsWith("~/") ? input.slice(1).split("/") : input.split("/");
  const out = input.startsWith("/") || input.startsWith("~") ? [] : [...cwd];
  for (const p of parts) {
    if (!p || p === ".") continue;
    if (p === "..") {
      out.pop();
      continue;
    }
    out.push(p);
  }
  return out;
}

export function nodeAt(path: string[]): Node | null {
  let n: Node = root;
  for (const seg of path) {
    if (n.type !== "dir" || !(seg in n.children)) return null;
    n = n.children[seg];
  }
  return n;
}

export const isHidden = (name: string) => name.startsWith(".");
