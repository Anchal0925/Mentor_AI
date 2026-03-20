import React from 'react';
import { Card } from '../ui/Card';

export function ConceptGraph() {
  // A clean CSS-based mock of a node network graph
  return (
    <Card className="h-[300px] flex flex-col relative overflow-hidden group">
      <h2 className="text-lg font-display font-semibold text-primary mb-4 z-10">Concept Graph</h2>
      
      <div className="absolute inset-0 pt-16 flex items-center justify-center">
        <div className="relative w-full h-full max-w-[400px]">
          {/* Edges */}
          <svg className="absolute inset-0 w-full h-full" style={{ stroke: 'var(--border)', strokeWidth: 2 }}>
            <line x1="50%" y1="20%" x2="30%" y2="50%" />
            <line x1="50%" y1="20%" x2="70%" y2="50%" />
            <line x1="30%" y1="50%" x2="50%" y2="80%" />
            <line x1="70%" y1="50%" x2="50%" y2="80%" />
          </svg>
          
          {/* Nodes */}
          <div className="absolute top-[20%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-accent-green z-10 border-4 border-surface group-hover:scale-110 transition-transform cursor-pointer"></div>
            <span className="mt-2 font-mono text-[10px] text-primary">Arrays</span>
          </div>

          <div className="absolute top-[50%] left-[30%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-accent-purple z-10 border-4 border-surface group-hover:scale-110 transition-transform cursor-pointer"></div>
            <span className="mt-2 font-mono text-[10px] text-primary">Two Pointers</span>
          </div>

          <div className="absolute top-[50%] left-[70%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-accent-red z-10 border-4 border-surface group-hover:scale-110 transition-transform cursor-pointer"></div>
            <span className="mt-2 font-mono text-[10px] text-primary">DP</span>
          </div>

          <div className="absolute top-[80%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-border z-10 border-4 border-surface group-hover:scale-110 transition-transform cursor-pointer"></div>
            <span className="mt-2 font-mono text-[10px] text-muted">Graphs</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
