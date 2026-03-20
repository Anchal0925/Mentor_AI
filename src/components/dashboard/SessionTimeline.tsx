import { motion } from 'framer-motion';
import React from 'react';

export function SessionTimeline() {
  const history = [
    { id: 1, title: 'Climbing Stairs', date: 'Today, 10:45 AM', mistake: 'Loop constraint error', flag: 'Edge Case Weakness' },
    { id: 2, title: 'Merge Intervals', date: 'Yesterday', mistake: 'Inefficient sorting O(N^2)', flag: 'Optimization Gap' },
    { id: 3, title: 'Valid Parentheses', date: 'Mar 15', mistake: 'Stack underflow', flag: 'Logic Flaw' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-display font-semibold text-primary">Recent Sessions</h2>
      <div className="relative pl-4 border-l-2 border-border space-y-8">
        {history.map((item, index) => (
          <div key={item.id} className="relative">
            <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-surface border-2 border-accent-green"></div>
            <motion.div
              whileHover={{ y: -2, scale: 1.005 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-elevated border border-border rounded-lg p-4 cursor-pointer hover:border-border-hover hover:bg-[#1b222d] transition-colors duration-300 group"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-primary group-hover:text-accent-green transition-colors">{item.title}</h3>
                <span className="font-mono text-[11px] text-muted">{item.date}</span>
              </div>
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border border-dashed">
                <span className="font-mono text-[10px] text-accent-red uppercase tracking-wider bg-accent-red/10 px-2 py-0.5 rounded">
                  {item.mistake}
                </span>
                <span className="font-mono text-[10px] text-accent-yellow uppercase tracking-wider bg-accent-yellow/10 px-2 py-0.5 rounded">
                  {item.flag}
                </span>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
