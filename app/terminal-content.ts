// Copy for the hidden terminal's personal files (the `favorites/` folder and the puzzle).
// Everything professional is generated from content.ts, so only the fun, hand-written bits live here.
//
// The [TODO] entries are placeholders for the owner to fill in. Replace every one of them before the
// next release to main: `grep -rn "TODO" app/terminal-content.ts`.

export const favorites = {
  foods: ["[TODO] favorite food", "[TODO] favorite food", "[TODO] guilty-pleasure food"],
  games: ["[TODO] favorite game", "[TODO] favorite game", "[TODO] game I keep coming back to"],
  // Leave href empty to hide the link line.
  playlist: { name: "[TODO] playlist name", href: "" },
};

// The one-step puzzle. The passphrase is a design principle that runs through the whole site, so
// anyone who actually read it can guess it. Compared case-insensitively.
export const passphrase = "fail-closed";

// What `decrypt note.enc fail-closed` prints. Placeholder until the owner picks a payoff.
export const payoff: string[] = [
  "decrypting ........ ok",
  "",
  "You found it. Most people stop at `ls`.",
  "",
  "[TODO] payoff goes here: a candid working-style note, a coffee-chat invite, a bonus story, etc.",
];
