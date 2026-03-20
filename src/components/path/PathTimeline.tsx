import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Play, Terminal, CheckCircle2, Lock, Zap, AlertTriangle } from 'lucide-react';
import { Badge } from '../ui/Badge';

/* ─── TYPES ─── */
type ModuleType = 'standard' | 'weakness' | 'critical';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  type: 'video' | 'problem';
}

interface PathModule {
  id: string;
  title: string;
  type: ModuleType;
  tag?: string;
  meta: string;
  locked?: boolean;
  lessons: Lesson[];
}

/* ─── MOCK DATA ─── */
const MODULES: PathModule[] = [
  {
    id: 'module-1',
    title: 'Arrays & Hashing',
    type: 'standard',
    meta: '52 min • 3/4 completed',
    lessons: [
      { id: 'l-1a', title: 'Contains Duplicate', duration: '12 min', completed: true, type: 'problem' },
      { id: 'l-1b', title: 'Valid Anagram', duration: '10 min', completed: true, type: 'problem' },
      { id: 'l-1c', title: 'Two Sum', duration: '15 min', completed: true, type: 'problem' },
      { id: 'l-1d', title: 'Group Anagrams', duration: '15 min', completed: false, type: 'problem' },
    ],
  },
  {
    id: 'module-2',
    title: 'Edge Case Mastery: Off-by-One Errors',
    type: 'weakness',
    tag: 'AI TARGETED: EDGE CASES',
    meta: '38 min • 0/3 completed',
    lessons: [
      { id: 'l-2a', title: 'Binary Search Boundary Trap', duration: '14 min', completed: false, type: 'problem' },
      { id: 'l-2b', title: 'Sliding Window Fence Post', duration: '12 min', completed: false, type: 'problem' },
      { id: 'l-2c', title: 'Array Rotation Edge Cases', duration: '12 min', completed: false, type: 'problem' },
    ],
  },
  {
    id: 'module-3',
    title: 'Recursion Fundamentals',
    type: 'critical',
    tag: 'CRITICAL PREREQUISITE',
    meta: '45 min • 0/3 completed',
    lessons: [
      { id: 'l-3a', title: 'Understanding the Call Stack', duration: '18 min', completed: false, type: 'video' },
      { id: 'l-3b', title: 'Fibonacci — Naive to Memoized', duration: '15 min', completed: false, type: 'problem' },
      { id: 'l-3c', title: 'Recursive Tree Traversal', duration: '12 min', completed: false, type: 'problem' },
    ],
  },
  {
    id: 'module-4',
    title: 'Stacks & Queues',
    type: 'standard',
    meta: '48 min • 0/4 completed',
    locked: true,
    lessons: [
      { id: 'l-4a', title: 'Valid Parentheses', duration: '10 min', completed: false, type: 'problem' },
      { id: 'l-4b', title: 'Min Stack', duration: '12 min', completed: false, type: 'problem' },
      { id: 'l-4c', title: 'Evaluate Reverse Polish Notation', duration: '14 min', completed: false, type: 'problem' },
      { id: 'l-4d', title: 'Daily Temperatures', duration: '12 min', completed: false, type: 'problem' },
    ],
  },
];

/* ─── NODE COLORS ─── */
const getNodeStyles = (type: ModuleType, locked?: boolean) => {
  if (locked) return 'bg-elevated border border-border text-muted opacity-50';
  switch (type) {
    case 'standard': return 'bg-elevated border border-border text-secondary';
    case 'weakness': return 'bg-elevated border border-accent-yellow text-accent-yellow';
    case 'critical': return 'bg-elevated border border-accent-red text-accent-red';
  }
};

const getNodeIcon = (type: ModuleType, locked?: boolean) => {
  if (locked) return <Lock className="w-4 h-4" />;
  switch (type) {
    case 'standard': return <Play className="w-4 h-4 fill-current" />;
    case 'weakness': return <Zap className="w-4 h-4" />;
    case 'critical': return <AlertTriangle className="w-4 h-4" />;
  }
};

const getTagVariant = (type: ModuleType) => {
  if (type === 'critical') return 'HOT' as const;
  return 'NEW' as const; // yellow-toned for weakness
};

/* ═══════════════════════════════════════════════════ */

export function PathTimeline() {
  const [expandedModules, setExpandedModules] = useState<string[]>(['module-1']);

  const toggleModule = (id: string, locked?: boolean) => {
    if (locked) return;
    setExpandedModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  return (
    <div className="relative max-w-4xl mx-auto px-6 pb-16">
      {/* The vertical line */}
      <div className="absolute left-[47px] top-4 bottom-4 w-[1px] bg-border" />

      <div className="flex flex-col gap-1">
        {MODULES.map((mod) => {
          const isExpanded = expandedModules.includes(mod.id);
          return (
            <div key={mod.id} className="relative flex flex-col w-full">
              {/* ── Clickable Header ── */}
              <button
                onClick={() => toggleModule(mod.id, mod.locked)}
                className={`flex items-center gap-4 py-4 w-full text-left focus:outline-none hover:bg-[rgba(255,255,255,0.02)] transition-colors rounded-lg px-2 ${
                  mod.locked ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                {/* Node Icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 shrink-0 ${getNodeStyles(mod.type, mod.locked)}`}>
                  {getNodeIcon(mod.type, mod.locked)}
                </div>

                {/* Text block */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-body font-semibold text-lg ${mod.locked ? 'text-muted' : 'text-primary'}`}>
                      {mod.title}
                    </span>
                    {mod.tag && (
                      <Badge variant={getTagVariant(mod.type)}>
                        {mod.tag}
                      </Badge>
                    )}
                  </div>
                  <span className="font-mono text-[10px] text-muted mt-0.5 block">{mod.meta}</span>
                </div>

                {/* Chevron */}
                {!mod.locked && (
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-muted shrink-0"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.div>
                )}
              </button>

              {/* ── Expanding Content ── */}
              <AnimatePresence initial={false}>
                {isExpanded && !mod.locked && (
                  <motion.div
                    key={`content-${mod.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="flex flex-col gap-1 pl-[52px] pb-6 pr-2">
                      {mod.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors hover:bg-[rgba(255,255,255,0.04)] border border-transparent hover:border-border-hover group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {lesson.type === 'video' ? (
                              <Play className="w-4 h-4 text-muted group-hover:text-primary shrink-0 fill-current" />
                            ) : (
                              <Terminal className="w-4 h-4 text-muted group-hover:text-primary shrink-0" />
                            )}
                            <span className="text-sm text-secondary group-hover:text-primary transition-colors truncate">
                              {lesson.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 shrink-0 ml-4">
                            {lesson.completed && (
                              <CheckCircle2 className="w-4 h-4 text-accent-green" />
                            )}
                            <span className="font-mono text-[10px] text-muted">{lesson.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
