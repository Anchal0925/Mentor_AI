import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BrowserHeader } from '../components/path/BrowserHeader';
import { PathCard } from '../components/path/PathCard';
import { PATH_SUMMARIES, type PathSummary, type SortOption } from '../components/path/pathData';

const DIFFICULTY_ORDER: Record<PathSummary['difficulty'], number> = {
  Beginner: 0,
  Intermediate: 1,
  Advanced: 2,
};

const container = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], staggerChildren: 0.07 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

export default function PathBrowser() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('most-popular');

  const visiblePaths = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = PATH_SUMMARIES.filter((path) => {
      if (!query) return true;
      return (
        path.title.toLowerCase().includes(query) ||
        path.description.toLowerCase().includes(query) ||
        path.track.toLowerCase().includes(query)
      );
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'shortest-duration':
          return a.durationHours - b.durationHours || a.popularityRank - b.popularityRank;
        case 'most-modules':
          return b.modules - a.modules || a.popularityRank - b.popularityRank;
        case 'beginner-first':
          return DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty] || a.popularityRank - b.popularityRank;
        case 'most-popular':
        default:
          return a.popularityRank - b.popularityRank || a.title.localeCompare(b.title);
      }
    });

    return sorted;
  }, [search, sortBy]);

  return (
    <div className="min-h-full bg-primary">
      <BrowserHeader
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        resultCount={visiblePaths.length}
      />

      <div className="max-w-5xl mx-auto px-6 pb-12">
        {visiblePaths.length === 0 ? (
          <div className="bg-elevated border border-border rounded-xl p-8 text-secondary">
            No paths matched your filter. Try a different keyword.
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-4"
          >
            {visiblePaths.map((path) => (
              <motion.div key={path.id} variants={item}>
                <PathCard path={path} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
