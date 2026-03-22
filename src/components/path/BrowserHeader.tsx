import { Search } from 'lucide-react';
import { Input } from '../ui/Input';
import type { SortOption } from './pathData';

interface BrowserHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  resultCount: number;
}

export function BrowserHeader({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  resultCount,
}: BrowserHeaderProps) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl font-bold text-white mb-4">Paths</h1>
      <p className="text-secondary text-lg max-w-3xl leading-relaxed">
        Our paths are one-stop-shops to become hireable. Pick a curriculum, follow the adaptive timeline, and let MentorMind tune each step to your real weaknesses.
      </p>

      <div className="mt-8 pb-4 border-b border-border flex items-center justify-between gap-4 flex-wrap">
        <div className="relative w-full md:flex-1 md:max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={`Filter ${resultCount} results...`}
            className="w-full h-10 rounded-lg pl-10 pr-4"
          />
        </div>

        <select
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value as SortOption)}
          className="h-10 bg-elevated border border-border rounded-lg px-3 pr-8 text-sm text-secondary focus:outline-none focus:border-accent-green cursor-pointer font-body appearance-none"
          aria-label="Sort paths"
        >
          <option value="most-popular">Most Popular</option>
          <option value="shortest-duration">Shortest Duration</option>
          <option value="most-modules">Most Modules</option>
          <option value="beginner-first">Beginner First</option>
        </select>
      </div>
    </div>
  );
}
