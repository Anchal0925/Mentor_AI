import { Search, Bell, User } from 'lucide-react';

export function TopNav() {
  return (
    <nav className="h-[60px] bg-surface flex items-center justify-between px-6 border-b border-border z-50 shrink-0">
      {/* Left: Logo */}
      <div className="flex items-center gap-1.5 cursor-pointer">
        <span className="font-display font-bold text-xl text-primary">MentorMind</span>
        <span className="font-display font-bold text-xl text-accent-green">AI</span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Global Search Ghost Button */}
        <button className="hidden md:flex items-center gap-3 px-3 h-9 bg-elevated border border-border rounded-md text-muted hover:border-border-hover transition-colors group w-64">
          <Search className="w-4 h-4 group-hover:text-secondary" />
          <span className="text-sm flex-1 text-left">Search...</span>
          <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border border-border bg-primary px-1.5 font-mono text-[10px] font-medium opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>

        {/* Notifications */}
        <button className="p-2 text-secondary hover:text-primary transition-colors relative">
          <Bell className="w-5 h-5" />
          <div className="absolute top-2 right-2 w-2 h-2 bg-accent-red rounded-full border-2 border-surface" />
        </button>

        {/* User Avatar */}
        <button className="flex items-center gap-2 pl-2 group">
          <div className="w-8 h-8 rounded-full bg-elevated border border-border flex items-center justify-center text-secondary group-hover:border-border-hover transition-colors overflow-hidden">
            <User className="w-4 h-4" />
          </div>
        </button>
      </div>
    </nav>
  );
}
