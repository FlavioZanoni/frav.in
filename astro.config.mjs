import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import { enhancedImages } from "@sveltejs/enhanced-img";
import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://frav.in",
  integrations: [tailwind(), svelte(), mdx(), sitemap()],
  vite: {
    plugins: [enhancedImages()],
  },
});

