import type { Metadata } from "next";
import { Dela_Gothic_One, Share_Tech_Mono, Zen_Kaku_Gothic_New } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Display: a fat Tokyo-signage gothic, used for headings and signs only.
// Body: a clean gothic made to sit next to Japanese type. Mono: HUD-style microcopy.
const display = Dela_Gothic_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

// The Japanese glyphs for the same typeface, subset to just the characters used on the page.
// Regenerate with `node scripts/fetch-ja-font.mjs` after editing any Japanese text.
const displayJa = localFont({
  src: "./fonts/DelaGothicOne-ja.woff2",
  weight: "400",
  variable: "--font-display-ja",
});

const body = Zen_Kaku_Gothic_New({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-body",
});

const mono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Kawika Miller | Full Stack Software Engineer",
  description:
    "Portfolio of Kawika Miller: full stack engineer building secure, scalable web and cloud systems across TypeScript, React, .NET and AWS.",
};

// Restores a saved palette before first paint so a shuffled theme never flashes back to the default.
const restorePalette = `try{var p=JSON.parse(localStorage.getItem("km-palette-neon")||"null");if(p){var s=document.documentElement.style;for(var k in p){if(k!=="name")s.setProperty("--"+k,p[k])}}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${displayJa.variable} ${body.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: restorePalette }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
