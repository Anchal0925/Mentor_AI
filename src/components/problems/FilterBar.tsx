import { Badge } from '../ui/Badge';
import { Search, ChevronDown } from 'lucide-react';
import React from 'react';

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  const topics = ['All', 'Arrays', 'Strings', 'DP', 'Graphs', 'Trees', 'Edge Cases'];

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
      {/* Left side pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
        {topics.map(topic => (
          <Badge 
            key={topic} 
            variant="TOPIC" 
            isActive={activeFilter === topic}
            onClick={() => onFilterChange(topic)}
          >
            {topic}
          </Badge>
        ))}
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <select className="appearance-none bg-elevated border border-border text-primary text-sm rounded-md pl-4 pr-10 py-2 focus:outline-none focus:border-accent-green hover:border-border-hover cursor-pointer w-[120px]">
            <option>Difficulty</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
        </div>

        <div className="relative">
          <select className="appearance-none bg-elevated border border-border text-primary text-sm rounded-md pl-4 pr-10 py-2 focus:outline-none focus:border-accent-green hover:border-border-hover cursor-pointer w-[120px]">
            <option>Status</option>
            <option>Todo</option>
            <option>Solved</option>
            <option>Attempted</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
        </div>

        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search problems..."
            className="w-full bg-elevated border border-border rounded-md pl-9 pr-3 py-2 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent-green focus:ring-1 focus:ring-accent-green/20"
          />
        </div>
      </div>
    </div>
  );
}
