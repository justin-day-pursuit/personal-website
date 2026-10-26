import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// Astro configuration optimized for Vercel deployment
// See https://astro.build/config for complete documentation.
export default defineConfig({
  output: 'static',
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
    speedInsights: {
      enabled: true,
    },
  }),
});
