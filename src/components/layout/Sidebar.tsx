import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Compass, BarChart2, CheckSquare, Plus, ChevronLeft, ChevronRight, Play } from 'lucide-react';

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Path', icon: Compass, path: '/path' },
    { label: 'Progress', icon: BarChart2, path: '/progress' },
    { label: 'Problems', icon: CheckSquare, path: '/problems' },
  ];

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 72 : 240 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="h-full bg-surface border-r border-border flex flex-col relative shrink-0 z-40"
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 w-6 h-6 bg-surface border border-border rounded-full flex items-center justify-center text-muted hover:text-primary transition-colors hover:border-border-hover z-50"
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Navigation Links */}
      <div className="flex-1 py-6 flex flex-col gap-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center h-10 transition-colors mx-3 rounded-md group ${
                isActive 
                  ? 'bg-accent-green-bg text-primary border-l-[3px] border-l-accent-green' 
                  : 'text-secondary hover:text-primary hover:bg-white/5 border-l-[3px] border-transparent'
              }`}
            >
              <div className="w-[48px] h-full flex items-center justify-center shrink-0">
                <Icon className={`w-[18px] h-[18px] transition-colors ${isActive ? 'text-accent-green' : 'group-hover:text-primary'}`} />
              </div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="font-medium text-[13px] whitespace-nowrap overflow-hidden pr-3"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </div>

      {/* Bottom Pinned CTA */}
      <div className="p-3 border-t border-border shrink-0">
        <button
          onClick={() => navigate('/session/new')}
          title="New Session"
          className={`h-11 bg-accent-green text-black rounded-lg font-display font-semibold transition-transform hover:brightness-110 active:scale-95 flex items-center justify-center gap-2 overflow-hidden mx-auto ${
            isCollapsed ? 'w-11' : 'w-full px-4'
          }`}
        >
          {isCollapsed ? <Play className="w-[18px] h-[18px] fill-current" /> : (
            <>
              <Plus className="w-4 h-4 shrink-0" />
              <motion.span
                initial={{ opacity: isCollapsed ? 0 : 1 }}
                animate={{ opacity: isCollapsed ? 0 : 1 }}
                className="whitespace-nowrap flex-1 text-left whitespace-nowrap overflow-hidden"
              >
                New Session
              </motion.span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
