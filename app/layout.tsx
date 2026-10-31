import type { Metadata } from "next";
import { Archivo, Martian_Mono } from "next/font/google";
import "./globals.css";

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

// Restores a saved palette before first paint so a shuffled theme never flashes back to the default.
const restorePalette = `try{var p=JSON.parse(localStorage.getItem("km-palette-neon")||"null");if(p){var s=document.documentElement.style;for(var k in p){if(k!=="name")s.setProperty("--"+k,p[k])}}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: restorePalette }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
