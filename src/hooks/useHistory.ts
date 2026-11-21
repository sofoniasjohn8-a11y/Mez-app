import { useState, useCallback } from 'react';
import type { Mezmur } from '../data/types';

const MAX_HISTORY = 50;

export function useHistory() {
  const [history, setHistory] = useState<Mezmur[]>([]);

  const add = useCallback((mezmur: Mezmur) => {
    setHistory((prev) => {
      // Remove if already in history (move to front)
      const filtered = prev.filter((m) => m.id !== mezmur.id);
      return [mezmur, ...filtered].slice(0, MAX_HISTORY);
    });
  }, []);

  const clear = useCallback(() => setHistory([]), []);

  return { history, add, clear };
}
