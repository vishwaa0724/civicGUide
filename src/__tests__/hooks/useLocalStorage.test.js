import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';

describe('useLocalStorage', () => {
  it('returns the initialValue when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 42));
    expect(result.current[0]).toBe(42);
  });

  it('returns a stored value from localStorage on mount', () => {
    window.localStorage.setItem('test-key', JSON.stringify(99));
    const { result } = renderHook(() => useLocalStorage('test-key', 0));
    expect(result.current[0]).toBe(99);
  });

  it('persists the updated value to localStorage on state change', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', []));
    act(() => {
      result.current[1]([1, 2, 3]);
    });
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'test-key',
      JSON.stringify([1, 2, 3]),
    );
  });

  it('reflects the new value in the returned state', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    act(() => {
      result.current[1]('updated');
    });
    expect(result.current[0]).toBe('updated');
  });

  it('works with object values', () => {
    const { result } = renderHook(() =>
      useLocalStorage('obj-key', { count: 0 }),
    );
    act(() => {
      result.current[1]({ count: 5 });
    });
    expect(result.current[0]).toEqual({ count: 5 });
  });

  it('works with array values (voter journey steps)', () => {
    const { result } = renderHook(() =>
      useLocalStorage('voter-journey-completed', [1]),
    );
    expect(result.current[0]).toEqual([1]);
    act(() => {
      result.current[1]([1, 2]);
    });
    expect(result.current[0]).toEqual([1, 2]);
  });

  it('supports functional updates like useState', () => {
    const { result } = renderHook(() => useLocalStorage('count-key', 0));
    act(() => {
      result.current[1]((prev) => prev + 1);
    });
    expect(result.current[0]).toBe(1);
  });
});
