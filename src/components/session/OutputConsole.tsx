import React, { useState } from 'react';
import { Tabs } from '../ui/Tabs';
import { Button } from '../ui/Button';
import { Play } from 'lucide-react';

interface OutputConsoleProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function OutputConsole({ isCollapsed, onToggleCollapse }: OutputConsoleProps) {
  const [activeTab, setActiveTab] = useState('output');

  const tabs = [
    { id: 'test-cases', label: 'Test Cases' },
    { id: 'output', label: 'Output' },
    { id: 'explanation', label: 'Explanation' },
  ];

  if (isCollapsed) {
    return (
      <div className="h-10 bg-primary border-t border-border flex items-center px-4 cursor-pointer hover:bg-white/5 transition-colors" onClick={onToggleCollapse}>
        <span className="font-mono text-xs uppercase tracking-wider text-muted flex-1">Console Collapsed</span>
        <button className="text-secondary text-xs font-mono">Expand ↑</button>
      </div>
    );
  }

  return (
    <div className="h-64 bg-primary border-t border-border flex flex-col shrink-0">
      <div className="flex items-center justify-between px-4 pt-2 border-b border-border">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="flat" />
        <button onClick={onToggleCollapse} className="text-secondary hover:text-primary text-xs font-mono pb-2">
          Collapse ↓
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 font-mono text-[13px] custom-scrollbar space-y-3">
        {activeTab === 'output' && (
          <>
            <div className="text-secondary">Running tests...</div>
            <div className="text-muted">------------------------------</div>
            <div className="text-accent-teal">Test Case 1 Passed! (2ms)</div>
            <div className="text-secondary">Input: nums = [2,7,11,15], target = 9</div>
            <div className="text-secondary">Output: [0, 1]</div>
            <div className="text-muted">------------------------------</div>
            <div className="text-accent-red">Test Case 2 Failed.</div>
            <div className="text-secondary">Expected: [1, 2]</div>
            <div className="text-accent-red">Received: [0, 1]</div>
          </>
        )}
        
        {activeTab === 'test-cases' && (
          <div className="text-secondary">Select a test case to view its details.</div>
        )}

        {activeTab === 'explanation' && (
          <div className="text-secondary font-body">Console explanation metrics will appear here.</div>
        )}
      </div>
    </div>
  );
}
