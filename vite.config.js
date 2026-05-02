import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        /**
         * Manual chunk splitting (function form required by Rolldown/Vite 8):
         * - vendor-three: Three.js + R3F (~600 KB) — only loaded with Hero
         * - vendor-maps: Google Maps API
         * - vendor-firebase: Firebase SDK
         * - vendor-react: React core (aggressively cached by browsers)
         */
        manualChunks(id) {
          if (id.includes('node_modules/three') || id.includes('@react-three')) return 'vendor-three';
          if (id.includes('@react-google-maps'))  return 'vendor-maps';
          if (id.includes('node_modules/firebase')) return 'vendor-firebase';
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'vendor-react';
        },
      },
    },
  },
});
