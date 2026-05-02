import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

/**
 * Vitest configuration.
 * - environment: jsdom — simulates a browser DOM for React component tests
 * - setupFiles: runs global mocks (jest-dom, localStorage, browser APIs) before each test
 * - globals: true — allows `describe`, `it`, `expect` without explicit imports
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.js'],
    globals: true,
    css: false, // Skip CSS processing in tests for speed
  },
});
