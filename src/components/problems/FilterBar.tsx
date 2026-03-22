import { useState } from 'react';
import { Search } from 'lucide-react';

const TOPICS = [
  'All', 'Arrays', 'Two Pointers', 'Sliding Window', 'Stack',
  'Binary Search', 'Linked List', 'Trees', 'Tries', 'Backtracking', 'DP',
];

interface FilterBarProps {
  activeTopic: string;
  onTopicChange: (topic: string) => void;
  difficulty: string;
  onDifficultyChange: (d: string) => void;
  status: string;
  onStatusChange: (s: string) => void;
  search: string;
  onSearchChange: (s: string) => void;
}

export function FilterBar({
  activeTopic, onTopicChange,
  difficulty, onDifficultyChange,
  status, onStatusChange,
  search, onSearchChange,
}: FilterBarProps) {
  return (
    <div className="sticky top-0 z-10 bg-primary/95 backdrop-blur-md border-b border-border py-4 px-1">
      {/* Top Row: Search + Dropdowns */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search problems, topics, or paste a link..."
            className="w-full h-10 bg-elevated border border-border rounded-lg pl-10 pr-4 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent-green transition-colors font-body"
          />
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <select
            value={difficulty}
            onChange={(e) => onDifficultyChange(e.target.value)}
            className="h-10 bg-elevated border border-border rounded-lg px-3 pr-8 text-sm text-secondary focus:outline-none focus:border-accent-green cursor-pointer font-body appearance-none"
          >
            <option value="all">Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-10 bg-elevated border border-border rounded-lg px-3 pr-8 text-sm text-secondary focus:outline-none focus:border-accent-green cursor-pointer font-body appearance-none"
          >
            <option value="all">Status</option>
            <option value="solved">Solved</option>
            <option value="unsolved">Unsolved</option>
            <option value="attempted">Attempted</option>
          </select>
        </div>
      </div>

      {/* Bottom Row: Topic Pills */}
      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
        {TOPICS.map((topic) => (
          <button
            key={topic}
            onClick={() => onTopicChange(topic)}
            className={`border rounded-full px-4 py-1.5 font-mono text-[11px] whitespace-nowrap transition-colors shrink-0 ${
              activeTopic === topic
                ? 'bg-accent-green text-black border-accent-green'
                : 'border-border text-secondary hover:border-accent-green hover:text-accent-green'
            }`}
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
}
