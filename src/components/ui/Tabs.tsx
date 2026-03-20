import React from 'react';
import { X } from 'lucide-react';

type TabStyle = 'flat' | 'vscode';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  onClose?: (id: string) => void;
  variant?: TabStyle;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, onClose, variant = 'flat', className = '' }: TabsProps) {
  if (variant === 'vscode') {
    return (
      <div className={`flex items-end h-9 bg-[#08080c] overflow-x-auto ${className}`}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <div 
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`group flex items-center gap-2 px-3 h-full min-w-[120px] max-w-[200px] border-r border-[#1e1e2c] cursor-pointer transition-colors
                ${isActive ? 'bg-[#0a0a0f] text-primary border-b-[2px] border-b-accent-green' : 'bg-[#08080c] text-muted hover:bg-[#0a0a0f] border-b-[2px] border-b-transparent'}
              `}
            >
              {tab.icon && <span className="text-secondary group-hover:text-primary">{tab.icon}</span>}
              <span className="text-sm font-mono truncate flex-1">{tab.label}</span>
              {onClose && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onClose(tab.id); }}
                  className="opacity-0 group-hover:opacity-100 hover:bg-white/10 p-0.5 rounded text-secondary hover:text-primary transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Flat variants
  return (
    <div className={`flex items-center gap-6 ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`pb-2 text-sm font-body transition-colors relative
              ${isActive ? 'text-primary' : 'text-muted hover:text-secondary'}
            `}
          >
            {tab.label}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-green rounded-t-sm" />
            )}
          </button>
        );
      })}
    </div>
  );
}
