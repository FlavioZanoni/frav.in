import svelte from "@astrojs/svelte";
import { enhancedImages } from "@sveltejs/enhanced-img";
import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://frav.in",
  integrations: [svelte(), mdx(), sitemap()],
  vite: {
    plugins: [enhancedImages()],
  },
});

