import { useNavigate } from 'react-router-dom';

interface SessionTopBarProps {
  title: string;
  timeRunning: string;
}

export function SessionTopBar({ title, timeRunning }: SessionTopBarProps) {
  const navigate = useNavigate();

  return (
    <div className="h-[40px] w-full bg-surface border-b border-border flex items-center justify-between px-4 shrink-0 z-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="text-secondary hover:text-primary text-sm font-medium transition-colors"
        >
          ← Exit
        </button>
        <span className="text-secondary text-sm font-body hidden md:block">{title}</span>
      </div>

      <div className="flex items-center gap-6">
        <span className="font-mono text-sm text-primary tracking-widest">{timeRunning}</span>
        
        {/* Progress dots */}
        <div className="hidden md:flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-accent-green"></div>
          <div className="w-2 h-2 rounded-full border border-border"></div>
          <div className="w-2 h-2 rounded-full border border-border"></div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-accent-green"></div>
        <span className="font-mono text-xs text-accent-green uppercase tracking-wide">Memory Active</span>
      </div>
    </div>
  );
}
