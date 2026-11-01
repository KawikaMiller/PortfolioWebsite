import type { Metadata } from "next";
import { Archivo, Martian_Mono } from "next/font/google";
import "./globals.css";
import "./theme.css";

// One variable grotesque does both jobs: set wide (font-stretch 125%) for headings and signs, normal
// width for reading. A wide mono carries labels, serials and other small technical type.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
});

const mono = Martian_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Kawika Miller | Full Stack Software Engineer",
  description:
    "Portfolio of Kawika Miller: full stack engineer building secure, scalable web and cloud systems across TypeScript, React, .NET and AWS.",
};

// Runs before first paint. The page ships as the minimal "pro" theme in dark mode (light is remembered separately); if the visitor previously
// unlocked the colorful "neon" one, switch to it (and restore their shuffled palette) right away
// so neither theme flashes in the other's clothes.
const restoreTheme = `try{var d=document.documentElement;if(localStorage.getItem("km-mode")==="light")d.dataset.mode="light";if(localStorage.getItem("km-theme")==="neon"){d.dataset.theme="neon";var p=JSON.parse(localStorage.getItem("km-palette-neon")||"null");if(p){for(var k in p){if(k!=="name")d.style.setProperty("--"+k,p[k])}}}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${mono.variable}`}
      data-theme="pro"
      data-mode="dark"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: restoreTheme }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
