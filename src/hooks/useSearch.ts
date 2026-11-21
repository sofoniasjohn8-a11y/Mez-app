import { useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import type { Mezmur } from '../data/types';
import mezmurData from '../data/mezmur_data.json';

const allMezmurs: Mezmur[] = mezmurData as Mezmur[];

const fuse = new Fuse(allMezmurs, {
  keys: [
    { name: 'title', weight: 0.6 },
    { name: 'author', weight: 0.3 },
    { name: 'lyrics', weight: 0.1 },
  ],
  threshold: 0.4,
  minMatchCharLength: 1,
  includeScore: true,
  ignoreLocation: true,
});

// Available tags
export const TAGS = ['ሁሉም', 'ሰላምታ', 'ስለ ቸርነትህ', 'ዋኔን', 'አምባሰል', 'ንዑስ ባቲ'];

export function useSearch() {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState('ሁሉም');

  const searchResults = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return allMezmurs;
    return fuse.search(trimmed).map((r) => r.item);
  }, [query]);

  // Apply tag filter on top of search results
  const results = useMemo(() => {
    if (activeTag === 'ሁሉም') return searchResults;
    return searchResults.filter((m) => m.tag === activeTag);
  }, [searchResults, activeTag]);

  const authorCount = useMemo(() => {
    if (results.length === 0) return 0;
    return new Set(results.map((r) => r.author)).size;
  }, [results]);

  return { query, setQuery, results, total: allMezmurs.length, authorCount, activeTag, setActiveTag };
}

export { allMezmurs };
