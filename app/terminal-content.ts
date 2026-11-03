// Copy for the hidden terminal's personal files (the `favorites/` folder and the puzzle).
// Everything professional is generated from content.ts, so only the fun, hand-written bits live here.

export const favorites = {
  foods: [
    "Main dishes: Shoyu Chicken, Lau Lau, Kalua Pig",
    "Snack: Spam Musubi",
    "Guilty pleasure: Anchovy Pizza",
  ],
  games: [
    "In rotation: Old School RuneScape, Rocket League, Wardogs",
    "Nostalgic favorites: Final Fantasy VII, Halo 3",
  ],
  // Leave href empty to hide the link line.
  playlist: {
    name: "My Spotify Wrapped top 100 of 2025",
    href: "https://open.spotify.com/playlist/37i9dQZEVXdj90r9nadiZm",
  },
};

// The one-step puzzle: `decrypt note.enc` asks this question. The answer is on the favorites list in
// this same filesystem (favorites/foods.txt), so anyone who explores finds it. Matching ignores
// case, spaces and punctuation, so "spam musubi", "Spam Musubi!" and "spammusubi" all work.
export const question = "What is my favorite snack food?";
export const answer = "spam musubi";

// A photo shown under the payoff, served from /public. It was cropped and re-encoded with no
// embedded metadata; do the same (no GPS location!) for any replacement. Set null for no image.
export const payoffImage: { src: string; alt: string } | null = {
  src: "/dog.jpg",
  alt: "My Shiba Inu grinning in a field of daisies",
};

// What a correct answer prints. One line per entry; the terminal wraps long lines, but keeping them
// under ~80 characters reads best.
export const payoff: string[] = [
  "decrypting ........ ok",
  "",
  "Wow. I honestly didn't expect anyone to actually get this far.",
  "",
  "If your team is looking for a new member, or you'd like to connect for a",
  "quick coffee chat, I'd love to hear from you: hello@kawikamiller.com",
  "",
  "I'll bring the Spam musubi.",
  "",
  "P.S. Here's a very good dog as a thank-you:",
];
