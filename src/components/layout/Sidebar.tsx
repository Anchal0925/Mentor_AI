import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, List, BarChart2, Plus, Settings, ChevronRight } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', icon: Home, path: '/dashboard' },
    { label: 'Problems Browser', icon: List, path: '/problems' },
    { label: 'Progress & Memory', icon: BarChart2, path: '/progress' },
  ];

  return (
    <aside className="w-[210px] fixed top-[56px] bottom-0 left-0 bg-surface border-r border-border flex flex-col z-40">
      <div className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 h-10 group transition-colors ${
                isActive 
                  ? 'bg-accent-green-bg text-primary border-l-3 border-accent-green'
                  : 'text-secondary hover:text-primary hover:bg-white/5 border-l-3 border-transparent'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}

        <div className="mt-6 mb-2 px-4 text-xs font-mono text-muted uppercase tracking-wider">
          Learning Paths
        </div>
        
        {/* Expandable Example Item */}
        <div className="flex flex-col">
          <button className="flex items-center justify-between px-4 h-10 text-secondary hover:text-primary hover:bg-white/5 transition-colors border-l-3 border-transparent">
            <div className="flex items-center gap-3">
              <ChevronRight className="w-4 h-4" />
              <span className="font-medium text-sm">DSA Online</span>
            </div>
          </button>
          
          <div className="flex flex-col py-1">
            <div className="flex items-center justify-between pl-11 pr-4 h-8 text-secondary hover:text-primary hover:bg-white/5 cursor-pointer">
              <span className="text-sm">Arrays & AI</span>
              <div className="w-10 h-[3px] bg-border rounded-full overflow-hidden">
                <div className="h-full bg-accent-green w-3/4"></div>
              </div>
            </div>
            <div className="flex items-center justify-between pl-11 pr-4 h-8 text-secondary hover:text-primary hover:bg-white/5 cursor-pointer">
              <span className="text-sm">Strings</span>
              <div className="w-10 h-[3px] bg-border rounded-full overflow-hidden">
                <div className="h-full bg-accent-green w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border mt-auto shrink-0 flex flex-col gap-2">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-4 h-10 text-secondary hover:text-primary hover:bg-white/5 transition-colors rounded-md"
        >
          <Settings className="w-4 h-4" />
          <span className="font-medium text-sm">Settings</span>
        </Link>
        <button 
          onClick={() => navigate('/session/new')}
          className="w-full flex items-center justify-center gap-2 h-10 bg-accent-green text-black rounded-lg font-display font-semibold transition-transform hover:brightness-110 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          New Session
        </button>
      </div>
    </aside>
  );
}
