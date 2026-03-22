import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  className?: string; // used to set fixed width if needed
}

export function ProgressBar({ progress, className = 'w-10' }: ProgressBarProps) {
  return (
    <div className={`h-[3px] rounded-sm bg-border overflow-hidden ${className}`}>
      <div 
        className="h-full bg-accent-green transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
}
