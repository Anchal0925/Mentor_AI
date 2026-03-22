import React, { useState } from 'react';
import { Tabs } from '../ui/Tabs';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function ProblemPanel() {
  const [activeTab, setActiveTab] = useState('problem');
  const [hintRevealed, setHintRevealed] = useState(false);

  const tabs = [
    { id: 'problem', label: 'Problem' },
    { id: 'hints', label: 'Hints' },
    { id: 'explanation', label: 'Explanation' },
  ];

  return (
    <div className="w-[280px] shrink-0 bg-surface border-r border-border flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="font-display font-bold text-lg text-primary">Theory Panel</h2>
      </div>

      <div className="px-4 pt-3 border-b border-border">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="flat" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === 'problem' && (
          <div className="flex flex-col gap-6">
            <div className="text-[13px] text-secondary font-body leading-relaxed space-y-4">
              <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.</p>
              <p>You may assume that each input would have exactly one solution, and you may not use the same element twice.</p>
              <p>You can return the answer in any order.</p>
            </div>
            
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase text-muted tracking-wider">Example 1</span>
              <div className="bg-elevated border border-border rounded-md p-3 font-mono text-[13px] text-primary space-y-1">
                <div><span className="text-secondary">Input:</span> nums = [2,7,11,15], target = 9</div>
                <div><span className="text-secondary">Output:</span> [0,1]</div>
                <div><span className="text-secondary">Explanation:</span> Because nums[0] + nums[1] == 9, we return [0, 1].</div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase text-muted tracking-wider">Example 2</span>
              <div className="bg-elevated border border-border rounded-md p-3 font-mono text-[13px] text-primary space-y-1">
                <div><span className="text-secondary">Input:</span> nums = [3,2,4], target = 6</div>
                <div><span className="text-secondary">Output:</span> [1,2]</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hints' && (
          <div className="flex flex-col gap-4">
            <div className="bg-elevated border border-border rounded-md p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-secondary">Hint 1</span>
              </div>
              {!hintRevealed ? (
                <Button variant="ghost-neutral" onClick={() => setHintRevealed(true)} className="text-xs h-8">
                  Reveal Hint
                </Button>
              ) : (
                <p className="text-[13px] text-primary leading-relaxed">
                  A really brute force way would be to search for all possible pairs of numbers but that would be too slow. Again, it's best to try out brute force solutions for just for completeness. It is from these brute force solutions that you can come up with optimizations.
                </p>
              )}
            </div>
            {hintRevealed && (
              <div className="bg-elevated border border-border rounded-md p-4 flex flex-col gap-3 opacity-50">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-secondary">Hint 2</span>
                </div>
                <Button variant="ghost-neutral" className="text-xs h-8 pointer-events-none">
                  Solve previous to unlock
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'explanation' && (
          <div className="text-[13px] text-secondary">
            Keep coding to unlock the optimal explanation.
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border mt-auto shrink-0 flex items-center justify-between bg-surface">
        <span className="font-mono text-[11px] text-muted uppercase">Attempt 1 / 3</span>
        <Badge variant="RECOMMENDED">Easy</Badge>
      </div>
    </div>
  );
}
