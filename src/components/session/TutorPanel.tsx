import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { NudgeToast } from '../ui/NudgeToast';
import { Input } from '../ui/Input';
import { Send, Sparkles } from 'lucide-react';

export function TutorPanel() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', text: "I'm watching your code. Let me know if you get stuck.", isMemory: false },
    { id: 2, role: 'user', text: "I'm trying to optimize the loop." },
    { id: 3, role: 'ai', text: "Based on our last session, remember how you used a hash map to reduce O(N^2) to O(N)? You can apply the same pattern here.", isMemory: true },
  ]);
  
  const [nudgeVisible, setNudgeVisible] = useState(true);

  return (
    <div className="w-[300px] shrink-0 bg-surface flex flex-col h-full relative">
      <div className="p-4 border-b border-border shrink-0 flex items-center justify-between">
        <div>
          <h2 className="font-display font-medium text-lg text-primary leading-tight">AI Assistant Panel</h2>
          <span className="font-mono text-[11px] text-muted uppercase tracking-wide">AI Mentor</span>
        </div>
        <div className="w-2 h-2 rounded-full bg-accent-green"></div>
      </div>

      {/* Floating Nudge Toast Area (Absolute inside relative parent) */}
      <div className="absolute top-20 left-4 right-4 z-20">
        <NudgeToast 
          id="nudge-1"
          message="Notice how you're iterating twice? Try storing values in a dictionary during the first pass."
          isVisible={nudgeVisible}
          onDismiss={() => setNudgeVisible(false)}
          autoDismissMs={0} // Keeps it visible for the demo
        />
      </div>

      {/* Chat scroll area */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-4">
        {/* Spacer if nudge is visible to prevent overlap */}
        {nudgeVisible && <div className="h-24 shrink-0"></div>}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col max-w-[90%] ${msg.role === 'user' ? 'self-end' : 'self-start'}`}>
            <div className={`
              rounded-lg p-3 text-[13px] leading-relaxed relative
              ${msg.role === 'user' 
                ? 'bg-elevated text-primary border border-border rounded-br-none' 
                : 'bg-accent-green-bg text-primary border border-accent-green/15 rounded-tl-none'}
            `}>
              {msg.isMemory && (
                <div className="absolute -top-2 -right-2 bg-accent-yellow text-[#453100] text-[9px] font-mono px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-[#453100]/10">
                  <Sparkles className="w-2.5 h-2.5" /> from memory
                </div>
              )}
              {msg.role === 'ai' && msg.isMemory && (
                <div className="text-[10px] font-mono text-accent-green uppercase font-bold mb-1 tracking-wider">Insight</div>
              )}
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Pinned Action Buttons & Input */}
      <div className="p-4 border-t border-border bg-surface shrink-0 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Button variant="full-action">Get Hint</Button>
          <Button variant="full-action">Explain Code</Button>
          <Button variant="full-action">Optimize</Button>
        </div>

        <div className="relative">
          <Input 
            className="w-full pl-3 pr-10 py-2.5 bg-elevated h-10" 
            placeholder="Ask AI mentor..." 
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-accent-green hover:brightness-110 transition-all rounded transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
