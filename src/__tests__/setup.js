import '@testing-library/jest-dom';
import { vi } from 'vitest';

// ── localStorage mock ─────────────────────────────────────────────────────────
const localStorageMock = (() => {
  let store = {};
  return {
    getItem:    vi.fn((key)       => store[key] ?? null),
    setItem:    vi.fn((key, val)  => { store[key] = String(val); }),
    removeItem: vi.fn((key)       => { delete store[key]; }),
    clear:      vi.fn(()          => { store = {}; }),
    /** Helper used in tests to reset state between runs */
    _reset:     ()                => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// ── Browser APIs required by Framer Motion ─────────────────────────────────────
global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

global.IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// ── matchMedia (not in jsdom) ─────────────────────────────────────────────────
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Reset mocks between tests
beforeEach(() => {
  localStorageMock._reset();
  vi.clearAllMocks();
});
