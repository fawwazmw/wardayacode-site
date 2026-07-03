// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Root deploy (e.g. custom domain or user.github.io). Set `site` to the final URL for correct OG/canonical tags.
  site: 'https://wardayacode.my.id',

  // --- GitHub Pages project site? ---
  // If deploying to https://<user>.github.io/wardayacode-site/, uncomment the next line
  // and set `site` above to 'https://<user>.github.io':
  // base: '/wardayacode-site',
});
