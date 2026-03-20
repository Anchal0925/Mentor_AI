import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';

interface Flag {
  id: number;
  type: 'negative' | 'positive';
  title: string;
  desc: string;
  occurrences: number;
}

const mockFlags: Flag[] = [
  { id: 1, type: 'negative', title: 'Approach Confusion', desc: 'High delete ratio detected in early session phases.', occurrences: 3 },
  { id: 2, type: 'negative', title: 'Hint Dependent', desc: 'Requests hints before attempting compilation.', occurrences: 5 },
  { id: 3, type: 'positive', title: 'Syntax Stabilized', desc: 'Compile error rate dropped by 40% this week.', occurrences: 1 },
  { id: 4, type: 'positive', title: 'Structured Thinker', desc: 'Consistently plans approach before coding.', occurrences: 7 },
  { id: 5, type: 'negative', title: 'Time Pressure Collapse', desc: 'Performance drops significantly after 25 minutes.', occurrences: 4 },
];

export function BehavioralFlags() {
  return (
    <Card className="col-span-1 h-[400px] flex flex-col overflow-hidden">
      <h2 className="font-display font-semibold text-lg text-primary mb-1">Active Behavioral Flags</h2>
      <p className="font-mono text-[10px] text-muted">{mockFlags.length} patterns tracked</p>

      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3 mt-4">
        {mockFlags.map((flag, i) => {
          const isNeg = flag.type === 'negative';
          return (
            <motion.div
              key={flag.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`p-3 rounded-lg border flex items-start gap-3 ${
                isNeg
                  ? 'bg-accent-red/5 border-accent-red/20'
                  : 'bg-accent-green-bg border-accent-green/20'
              }`}
            >
              {isNeg
                ? <AlertTriangle className="w-4 h-4 text-accent-red shrink-0 mt-0.5" />
                : <CheckCircle2 className="w-4 h-4 text-accent-green shrink-0 mt-0.5" />
              }
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`font-medium text-sm ${isNeg ? 'text-accent-red' : 'text-accent-green'}`}>
                    {flag.title}
                  </p>
                  <span className="font-mono text-[9px] text-muted">×{flag.occurrences}</span>
                </div>
                <p className="text-secondary text-xs mt-1 leading-relaxed">{flag.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
