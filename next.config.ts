import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: `next build` writes plain HTML/CSS/JS to ./out for GitHub Pages.
  output: "export",
};

export default nextConfig;
