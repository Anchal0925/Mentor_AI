import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CODE_LINES = [
  'def two_sum(nums, target):',
  '    seen = {}',
  '    for i, num in enumerate(nums):',
  '        diff = target - num',
  '        if diff in seen:',
  '            return [seen[diff], i]',
  '        seen[num] = i',
  '    return []',
];

function GhostTypingEditor() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [showNudge, setShowNudge] = useState(false);

  useEffect(() => {
    if (visibleLines >= CODE_LINES.length) {
      // All lines typed — pause then show the nudge
      const nudgeTimer = setTimeout(() => setShowNudge(true), 1200);
      return () => clearTimeout(nudgeTimer);
    }

    const currentLine = CODE_LINES[visibleLines] ?? '';
    if (charCount < currentLine.length) {
      const t = setTimeout(() => setCharCount((c) => c + 1), 38);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setVisibleLines((l) => l + 1);
        setCharCount(0);
      }, 120);
      return () => clearTimeout(t);
    }
  }, [visibleLines, charCount]);

  return (
    <div className="flex-1 bg-code rounded-xl border border-border overflow-hidden flex flex-col min-h-0 relative">
      {/* Editor top bar */}
      <div className="flex items-center gap-2 px-4 h-9 bg-surface border-b border-border shrink-0">
        <span className="w-2.5 h-2.5 rounded-full bg-accent-red/60"/>
        <span className="w-2.5 h-2.5 rounded-full bg-accent-yellow/60"/>
        <span className="w-2.5 h-2.5 rounded-full bg-accent-green/60"/>
        <span className="font-mono text-[11px] text-muted ml-3">solution.py</span>
      </div>

      {/* Code lines */}
      <div className="flex-1 p-4 font-mono text-[13px] leading-6 overflow-hidden">
        {CODE_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} className="flex gap-4">
            <span className="text-muted select-none w-4 text-right shrink-0">{i + 1}</span>
            <span className="text-text-primary whitespace-pre">{line}</span>
          </div>
        ))}
        {visibleLines < CODE_LINES.length && (
          <div className="flex gap-4">
            <span className="text-muted select-none w-4 text-right shrink-0">{visibleLines + 1}</span>
            <span className="text-text-primary whitespace-pre">
              {CODE_LINES[visibleLines].slice(0, charCount)}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-[2px] h-[14px] bg-accent-green align-middle ml-px"
              />
            </span>
          </div>
        )}
      </div>

      {/* Nudge Toast overlay */}
      <AnimatePresence>
        {showNudge && (
          <motion.div
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute bottom-4 right-4 max-w-[260px] bg-elevated border-l-[3px] border-l-accent-green border border-border rounded-r-lg p-3 flex items-start gap-2"
          >
            <span className="text-accent-green text-xs mt-0.5">⚡</span>
            <p className="font-mono text-[11px] text-secondary leading-relaxed">
              You've been paused on line 12 for 40s. Want to talk through the loop logic?
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AnimatedMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
      className="w-full max-w-5xl mx-auto mt-16 bg-surface border border-border rounded-2xl overflow-hidden"
      style={{ height: 380 }}
    >
      {/* Mockup top bar */}
      <div className="h-9 bg-surface border-b border-border flex items-center px-4 gap-3 shrink-0">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-border"/>
          <span className="w-3 h-3 rounded-full bg-border"/>
          <span className="w-3 h-3 rounded-full bg-border"/>
        </div>
        <span className="font-mono text-[11px] text-muted mx-auto">MentorMind — Two Sum — Live Session</span>
      </div>

      {/* 3-panel layout */}
      <div className="flex h-full">
        {/* Left: Problem stub */}
        <div className="w-[220px] border-r border-border bg-surface flex flex-col p-4 gap-3 shrink-0">
          <div className="h-3 w-16 bg-border rounded-sm" />
          <div className="h-2 w-full bg-border/60 rounded-sm" />
          <div className="h-2 w-5/6 bg-border/60 rounded-sm" />
          <div className="h-2 w-4/5 bg-border/60 rounded-sm" />
          <div className="mt-2 h-2 w-full bg-border/40 rounded-sm" />
          <div className="h-2 w-3/4 bg-border/40 rounded-sm" />
          <div className="mt-3 h-6 w-24 rounded bg-accent-green/15 border border-accent-green/30" />
        </div>

        {/* Center: Ghost typing editor */}
        <div className="flex-1 p-3 flex">
          <GhostTypingEditor />
        </div>

        {/* Right: AI Tutor stub */}
        <div className="w-[200px] border-l border-border bg-surface flex flex-col p-4 gap-3 shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-accent-green" />
            <span className="font-mono text-[10px] text-muted uppercase tracking-wider">AI Mentor</span>
          </div>
          <div className="h-2 w-full bg-border/50 rounded-sm" />
          <div className="h-2 w-5/6 bg-border/50 rounded-sm" />
          <div className="mt-1 bg-accent-green-bg border border-accent-green/20 rounded-lg p-2 flex flex-col gap-1.5">
            <div className="h-1.5 w-full bg-accent-green/30 rounded-sm" />
            <div className="h-1.5 w-4/5 bg-accent-green/30 rounded-sm" />
            <div className="h-1.5 w-3/5 bg-accent-green/30 rounded-sm" />
          </div>
          <div className="h-2 w-full bg-border/40 rounded-sm mt-2" />
          <div className="h-2 w-2/3 bg-border/40 rounded-sm" />
        </div>
      </div>
    </motion.div>
  );
}
