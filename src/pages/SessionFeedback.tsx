import { motion } from 'framer-motion';
import { Play, Zap } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const mockFeedback = {
  headline: 'Great algorithmic approach, but syntax slowed you down.',
  mistake_breakdown:
    'You attempted to access array[length] instead of array[length - 1], causing an index out of bounds error.',
  behavior_insight:
    'You spent 40% of the session paused on line 12 before requesting a hint. Next time, try writing pseudo-code first.',
  pattern_callout:
    "This is the 2nd session in a row you've had an off-by-one boundary error. Hindsight memory updated.",
  next_focus: 'Loop boundary conditions.',
  improvement_note: 'Your time-to-first-compile improved by 2 minutes!',
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export default function SessionFeedback() {
  const navigate = useNavigate();
  const { id } = useParams();
  const sessionId = id ?? 'new';

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 flex flex-col gap-6">
      <motion.div initial="hidden" animate="show" variants={fadeUp} className="flex flex-col gap-3">
        <h1 className="font-display text-4xl font-bold text-white">Session Complete</h1>
        <p className="text-secondary text-lg">{mockFeedback.headline}</p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.08 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      >
        <motion.div variants={fadeUp} className="col-span-1 lg:col-span-2 bg-elevated border border-border border-l-4 border-l-accent-red p-5">
          <h2 className="font-display text-lg text-primary">Mistake Breakdown</h2>
          <p className="mt-2 text-sm text-secondary leading-relaxed">{mockFeedback.mistake_breakdown}</p>
        </motion.div>

        <motion.div variants={fadeUp} className="col-span-1 bg-elevated border border-border border-l-4 border-l-accent-teal p-5">
          <h2 className="font-display text-lg text-primary">Behavioral Insight</h2>
          <p className="mt-2 text-sm text-secondary leading-relaxed">{mockFeedback.behavior_insight}</p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="col-span-1 lg:col-span-3 bg-accent-yellow/5 border border-accent-yellow/30 p-4 flex items-start gap-3"
        >
          <Zap className="w-4 h-4 text-accent-yellow mt-0.5 shrink-0" />
          <p className="font-mono text-sm text-accent-yellow">{mockFeedback.pattern_callout}</p>
        </motion.div>

        <motion.div variants={fadeUp} className="col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-elevated border border-border border-l-4 border-l-accent-green p-5">
            <h3 className="font-display text-base text-primary">Improvement Note</h3>
            <p className="mt-2 text-sm text-accent-green leading-relaxed">{mockFeedback.improvement_note}</p>
          </div>
          <div className="bg-elevated border border-border p-5">
            <h3 className="font-display text-base text-primary">Next Focus</h3>
            <p className="mt-2 text-sm text-secondary leading-relaxed">{mockFeedback.next_focus}</p>
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
