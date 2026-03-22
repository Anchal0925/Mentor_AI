import { useState, useEffect } from 'react';
import { Search, Bell, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export function TopNav() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey ||e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsNotifOpen(false);
        setIsProfileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <nav className="h-[60px] bg-surface flex items-center justify-between px-6 border-b border-border z-50 shrink-0 relative">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity">
          <span className="font-display font-bold text-xl text-primary">MentorMind</span>
          <span className="font-display font-bold text-xl text-accent-green">AI</span>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Global Search Ghost Button */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="hidden md:flex items-center gap-3 px-3 h-9 bg-surface border border-border rounded-md text-muted hover:border-border-hover transition-colors group w-64 justify-between"
          >
            <div className="flex items-center gap-3">
              <Search className="w-4 h-4 group-hover:text-secondary" />
              <span className="text-sm text-left">Search...</span>
            </div>
            <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border border-border bg-elevated px-1.5 font-mono text-[10px] font-medium text-muted">
              <span>⌘ K</span>
            </kbd>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
              className="p-2 text-secondary hover:text-primary transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-accent-red rounded-full border border-surface" />
            </button>
            <AnimatePresence>
              {isNotifOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-elevated border border-border rounded-xl z-50 p-2 shadow-none"
                >
                  <div className="px-2 py-1 flex items-center justify-between border-b border-border mb-1">
                    <span className="font-sans text-sm font-semibold text-white">Notifications</span>
                  </div>
                  <div className="flex flex-col gap-1 my-2">
                    <div className="px-2 py-2 bg-[rgba(255,255,255,0.02)] rounded hover:bg-[rgba(255,255,255,0.04)] cursor-pointer transition-colors border-l-2 border-accent-green">
                      <p className="text-[12px] text-primary">Your Session Report for 'LRU Cache' is ready.</p>
                      <p className="text-[10px] text-muted mt-1">2m ago</p>
                    </div>
                    <div className="px-2 py-2 rounded hover:bg-[rgba(255,255,255,0.04)] cursor-pointer transition-colors border-l-2 border-transparent">
                      <p className="text-[12px] text-secondary">A new highly requested problem "Merge K Sorted Lists" was added.</p>
                      <p className="text-[10px] text-muted mt-1">1h ago</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-border mt-1">
                    <button 
                      onClick={() => setIsNotifOpen(false)}
                      className="w-full text-center font-mono text-[10px] text-accent-green hover:underline cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Avatar */}
          <div className="relative">
            <button 
              onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
              className="flex items-center gap-2 pl-2 group"
            >
              <div className="w-8 h-8 rounded-full bg-elevated border border-border flex items-center justify-center text-secondary group-hover:border-border-hover transition-colors overflow-hidden">
                <User className="w-4 h-4" />
              </div>
            </button>
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-elevated border border-border rounded-xl z-50 flex flex-col p-1 shadow-none"
                >
                  <div className="px-3 py-2 border-b border-border mb-1">
                    <p className="text-sm text-primary font-medium">Demo User</p>
                    <p className="text-[11px] text-muted">user@example.com</p>
                  </div>
                  <div className="flex flex-col">
                    <button className="text-left px-3 py-2 text-[13px] text-secondary hover:text-white hover:bg-[rgba(255,255,255,0.04)] rounded-md cursor-pointer transition-colors">
                      Account Settings
                    </button>
                    <button className="text-left px-3 py-2 text-[13px] text-secondary hover:text-white hover:bg-[rgba(255,255,255,0.04)] rounded-md cursor-pointer transition-colors flex items-center justify-between">
                      <span>Subscription</span>
                      <span className="text-[9px] font-mono bg-accent-green/20 text-accent-green px-1.5 py-0.5 rounded">PRO</span>
                    </button>
                    <button className="text-left px-3 py-2 text-[13px] text-secondary hover:text-white hover:bg-[rgba(255,255,255,0.04)] rounded-md cursor-pointer transition-colors">
                      My Second Brain Data
                    </button>
                  </div>
                  <div className="mt-1 border-t border-border pt-1">
                    <button className="w-full text-left px-3 py-2 text-[13px] text-accent-red hover:bg-accent-red/10 rounded-md cursor-pointer transition-colors">
                      Log out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* Command Palette Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary/80 backdrop-blur-sm z-50 flex items-start justify-center pt-[10vh]"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsSearchOpen(false);
            }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-2xl bg-elevated border border-border rounded-xl overflow-hidden shadow-none"
            >
              <div className="flex items-center px-4 border-b border-border">
                <Search className="w-5 h-5 text-muted" />
                <input 
                  type="text" 
                  placeholder="Search for problems, paths, or settings..." 
                  className="w-full bg-transparent text-white font-sans text-lg p-4 focus:outline-none placeholder:text-muted"
                  autoFocus
                />
                <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border border-border bg-primary px-1.5 font-mono text-[10px] font-medium text-muted">
                  ESC
                </kbd>
              </div>
              <div className="p-2 flex flex-col gap-1 max-h-[60vh] overflow-y-auto">
                <p className="px-3 py-2 text-[10px] font-mono text-muted uppercase tracking-wider">Quick Links</p>
                <div className="px-3 py-3 flex items-center gap-3 rounded-lg hover:bg-[rgba(255,255,255,0.04)] cursor-pointer transition-colors border-l-2 border-accent-green bg-[rgba(255,255,255,0.02)]">
                  <span className="text-secondary text-sm">Go to Dashboard</span>
                </div>
                <div className="px-3 py-3 flex items-center gap-3 rounded-lg hover:bg-[rgba(255,255,255,0.04)] cursor-pointer transition-colors border-l-2 border-transparent">
                  <span className="text-secondary text-sm">Continue DSA Path</span>
                </div>
                <div className="px-3 py-3 flex items-center gap-3 rounded-lg hover:bg-[rgba(255,255,255,0.04)] cursor-pointer transition-colors border-l-2 border-transparent">
                  <span className="text-secondary text-sm">Recent Problem: Two Sum</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
