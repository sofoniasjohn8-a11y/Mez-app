import { useState, useCallback } from 'react';
import type { Mezmur } from '../data/types';

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggle = useCallback((id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }, []);

  const isFavorite = useCallback(
    (id: number) => favorites.includes(id),
    [favorites]
  );

  return { favorites, toggle, isFavorite };
}
