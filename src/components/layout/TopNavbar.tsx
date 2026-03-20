import { Link } from 'react-router-dom';
import { Search, Bell, User } from 'lucide-react';

export default function TopNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-[56px] bg-surface flex items-center justify-between px-6 border-b border-border z-50">
      <div className="flex items-center gap-2 cursor-pointer">
        <span className="font-display font-semibold text-xl text-primary">CodeMentor</span>
        <span className="font-display font-semibold text-xl text-accent-green">AI</span>
      </div>

      <div className="hidden md:flex items-center gap-6">
        <Link to="/features" className="text-secondary hover:text-primary transition-colors text-sm font-medium">Courses</Link>
        <Link to="/features" className="text-secondary hover:text-primary transition-colors text-sm font-medium">Tutorials</Link>
        <Link to="/dashboard" className="text-secondary hover:text-primary transition-colors text-sm font-medium">Practice</Link>
        <Link to="/progress" className="text-secondary hover:text-primary transition-colors text-sm font-medium">Progress</Link>
        <Link to="/problems" className="text-secondary hover:text-primary transition-colors text-sm font-medium">Problems</Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 h-9 bg-primary border border-border rounded-md pl-9 pr-3 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent-green focus:ring-1 focus:ring-accent-green/20"
          />
        </div>
        <button className="text-secondary hover:text-primary">
          <Bell className="w-5 h-5" />
        </button>
        <button className="w-8 h-8 rounded-full bg-border flex items-center justify-center text-secondary hover:text-primary">
          <User className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}
