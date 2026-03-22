import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Play, Terminal, CheckCircle2, Lock, Zap, AlertTriangle } from 'lucide-react';
import { Badge } from '../ui/Badge';
import type { ModuleType, PathModule } from './pathData';

const getNodeStyles = (type: ModuleType, locked?: boolean) => {
  if (locked) return 'bg-elevated border border-border text-muted opacity-50';
  switch (type) {
    case 'standard':
      return 'bg-elevated border border-border text-secondary';
    case 'weakness':
      return 'bg-elevated border border-accent-yellow text-accent-yellow';
    case 'critical':
      return 'bg-elevated border border-accent-red text-accent-red';
  }
};

const getNodeIcon = (type: ModuleType, locked?: boolean) => {
  if (locked) return <Lock className="w-4 h-4" />;
  switch (type) {
    case 'standard':
      return <Play className="w-4 h-4 fill-current" />;
    case 'weakness':
      return <Zap className="w-4 h-4" />;
    case 'critical':
      return <AlertTriangle className="w-4 h-4" />;
  }
};

const getTagVariant = (type: ModuleType) => {
  if (type === 'critical') return 'HOT' as const;
  return 'NEW' as const;
};

interface PathTimelineProps {
  modules: PathModule[];
}

export function PathTimeline({ modules }: PathTimelineProps) {
  const firstUnlockedModuleId = useMemo(() => modules.find((module) => !module.locked)?.id ?? '', [modules]);
  const [expandedModules, setExpandedModules] = useState<string[]>(firstUnlockedModuleId ? [firstUnlockedModuleId] : []);

  useEffect(() => {
    setExpandedModules(firstUnlockedModuleId ? [firstUnlockedModuleId] : []);
  }, [firstUnlockedModuleId]);

  const toggleModule = (id: string, locked?: boolean) => {
    if (locked) return;
    setExpandedModules((prev) => (prev.includes(id) ? prev.filter((moduleId) => moduleId !== id) : [...prev, id]));
  };

  return (
    <div className="relative max-w-4xl mx-auto px-6 pb-16">
      <div className="absolute left-[47px] top-4 bottom-4 w-[1px] bg-border" />

      <div className="flex flex-col gap-1">
        {modules.map((module) => {
          const isExpanded = expandedModules.includes(module.id);
          return (
            <div key={module.id} className="relative flex flex-col w-full">
              <button
                onClick={() => toggleModule(module.id, module.locked)}
                className={`flex items-center gap-4 py-4 w-full text-left focus:outline-none hover:bg-[rgba(255,255,255,0.02)] transition-colors rounded-lg px-2 ${
                  module.locked ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 shrink-0 ${getNodeStyles(module.type, module.locked)}`}>
                  {getNodeIcon(module.type, module.locked)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-body font-semibold text-lg ${module.locked ? 'text-muted' : 'text-primary'}`}>
                      {module.title}
                    </span>
                    {module.tag && <Badge variant={getTagVariant(module.type)}>{module.tag}</Badge>}
                  </div>
                  <span className="font-mono text-[10px] text-muted mt-0.5 block">{module.meta}</span>
                </div>

                {!module.locked && (
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-muted shrink-0"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.div>
                )}
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && !module.locked && (
                  <motion.div
                    key={`content-${module.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="flex flex-col gap-1 pl-[52px] pb-6 pr-2">
                      {module.lessons.map((lesson) => (
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
                            {lesson.completed && <CheckCircle2 className="w-4 h-4 text-accent-green" />}
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
