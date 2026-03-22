import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Zap } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useUser } from '../context/UserContext';
import type { Session } from '../lib/api';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

// Derive human-readable feedback from real session data
function buildFeedback(session: Session | null, weakTopics: string[]) {
  const hints    = session?.hints_used   ?? 0;
  const deletes  = session?.deletes_made ?? 0;
  const problems = session?.problems_done ?? 1;
  const deleteRatio = problems > 0 ? (deletes / problems).toFixed(0) : '0';

  return {
    headline: hints > 5
      ? 'Good effort — but try to rely less on hints next time.'
      : deletes > 200
      ? 'Great algorithmic approach, but syntax slowed you down.'
      : 'Strong session! Your problem-solving instincts are improving.',

    mistake_breakdown: deletes > 200
      ? `You deleted ~${deleteRatio} characters per problem, suggesting uncertainty in syntax. Try writing pseudo-code before jumping to code.`
      : 'No major structural mistakes detected this session. Keep building on this approach.',

    behavior_insight: hints > 0
      ? `You requested ${hints} hint${hints !== 1 ? 's' : ''} this session. ${
          hints > 3
            ? 'Try spending at least 10 minutes on independent exploration before asking for help.'
            : 'Good balance between seeking help and working independently.'
        }`
      : 'You completed this session without requesting any hints — excellent self-reliance!',

    pattern_callout: weakTopics.length > 0
      ? `Your weakest area is still ${weakTopics[0]}. Hindsight memory updated — expect more targeted problems there.`
      : 'No strong pattern weaknesses detected yet. Keep practising to build your profile.',

    next_focus: weakTopics[1] ?? weakTopics[0] ?? 'Tree Traversal',

    improvement_note: problems >= 2
      ? `You solved ${problems} problems this session. ${hints === 0 ? 'Zero hints used — outstanding!' : 'Keep reducing hint dependency.'}`
      : 'Complete more problems per session to build consistency.',
  };
}

export default function SessionFeedback() {
  const navigate = useNavigate();
  const { id }   = useParams();
  const sessionId = id ?? 'new';
  const { dashboard, userStats } = useUser();

  // Find the most recently ended session from context
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  useEffect(() => {
    if (dashboard?.recent_sessions?.length) {
      // Most recent is first (sorted DESC)
      setCurrentSession(dashboard.recent_sessions[0]);
    }
  }, [dashboard]);

  const weakTopics = dashboard?.weak_areas?.map((w) => w.topic) ?? [];
  const topBug     = dashboard?.most_frequent_bug;
  const feedback   = buildFeedback(currentSession, weakTopics);

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 flex flex-col gap-6">
      <motion.div initial="hidden" animate="show" variants={fadeUp} className="flex flex-col gap-3">
        <h1 className="font-display text-4xl font-bold text-white">Session Complete</h1>
        <p className="text-secondary text-lg">{feedback.headline}</p>
        {currentSession && (
          <div className="flex gap-6 font-mono text-[11px] text-muted mt-1">
            <span>Problems: <span className="text-accent-green">{currentSession.problems_done}</span></span>
            <span>Hints: <span className={currentSession.hints_used > 3 ? 'text-accent-red' : 'text-accent-teal'}>{currentSession.hints_used}</span></span>
            <span>Streak: <span className="text-accent-yellow">{userStats?.current_streak ?? 0} days</span></span>
          </div>
        )}
      </motion.div>

      <motion.div
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.08 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      >
        <motion.div variants={fadeUp} className="col-span-1 lg:col-span-2 bg-elevated border border-border border-l-4 border-l-accent-red p-5">
          <h2 className="font-display text-lg text-primary">Mistake Breakdown</h2>
          <p className="mt-2 text-sm text-secondary leading-relaxed">{feedback.mistake_breakdown}</p>
          {topBug && (
            <p className="mt-3 font-mono text-[11px] text-accent-red">
              Most frequent bug: {topBug.bug_type.replace(/_/g, ' ')} (×{topBug.occurrences})
            </p>
          )}
        </motion.div>

        <motion.div variants={fadeUp} className="col-span-1 bg-elevated border border-border border-l-4 border-l-accent-teal p-5">
          <h2 className="font-display text-lg text-primary">Behavioral Insight</h2>
          <p className="mt-2 text-sm text-secondary leading-relaxed">{feedback.behavior_insight}</p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="col-span-1 lg:col-span-3 bg-accent-yellow/5 border border-accent-yellow/30 p-4 flex items-start gap-3"
        >
          <Zap className="w-4 h-4 text-accent-yellow mt-0.5 shrink-0" />
          <p className="font-mono text-sm text-accent-yellow">{feedback.pattern_callout}</p>
        </motion.div>

        <motion.div variants={fadeUp} className="col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-elevated border border-border border-l-4 border-l-accent-green p-5">
            <h3 className="font-display text-base text-primary">Improvement Note</h3>
            <p className="mt-2 text-sm text-accent-green leading-relaxed">{feedback.improvement_note}</p>
          </div>
          <div className="bg-elevated border border-border p-5">
            <h3 className="font-display text-base text-primary">Next Focus</h3>
            <p className="mt-2 text-sm text-secondary leading-relaxed">{feedback.next_focus}</p>
            {weakTopics.slice(0, 3).length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {weakTopics.slice(0, 3).map((t) => (
                  <span key={t} className="font-mono text-[10px] bg-surface border border-border px-2 py-0.5 rounded text-muted">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      <motion.div initial="hidden" animate="show" variants={fadeUp} className="mt-8 flex justify-end gap-4">
        <Button variant="ghost-neutral" onClick={() => navigate('/problems')}>
          Next Problem
        </Button>
        <Button variant="primary" onClick={() => navigate(`/session/${sessionId}/replay`)} className="gap-2">
          <Play className="w-4 h-4 fill-current" />
          Watch Replay
        </Button>
      </motion.div>
    </div>
  );
}
