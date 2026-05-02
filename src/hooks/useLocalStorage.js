import { useState, useEffect } from 'react';

/**
 * A drop-in replacement for `useState` that persists the value to localStorage.
 * On mount it reads the stored value; on every change it writes back.
 *
 * @template T
 * @param {string} key - The localStorage key
 * @param {T} initialValue - Default value if nothing is stored
 * @returns {[T, React.Dispatch<React.SetStateAction<T>>]}
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // Storage might be unavailable (private browsing, quota exceeded)
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
