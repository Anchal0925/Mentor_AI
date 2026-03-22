import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { AnimatedMockup } from './AnimatedMockup';

export function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center relative overflow-hidden">
      {/* Soft background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-accent-green/5 blur-3xl" />
      </div>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 inline-flex items-center gap-2 border border-border bg-elevated rounded-full px-4 py-1.5"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
        <span className="font-mono text-[11px] text-secondary uppercase tracking-wider">Now in Beta · Join 10,000+ developers</span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-display font-extrabold text-5xl md:text-7xl text-primary leading-[1.05] tracking-tight max-w-4xl"
      >
        The AI that knows{' '}
        <span className="text-accent-green">how you think.</span>
      </motion.h1>

      {/* Sub-headline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-6 text-lg md:text-xl text-secondary max-w-2xl leading-relaxed"
      >
        MentorMind watches you code in real time, builds a memory of your unique thought patterns, and tutors you — not after you fail, but in the moment.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-10 flex items-center gap-4 flex-wrap justify-center"
      >
        <Link to="/onboarding">
          <Button variant="primary" className="text-base px-8 py-3 font-semibold">
            Start Coding Free
          </Button>
        </Link>
        <Link to="/dashboard">
          <Button variant="ghost-neutral" className="text-base px-8 py-3">
            Watch Demo
          </Button>
        </Link>
      </motion.div>

      {/* Animated 3-panel mockup */}
      <AnimatedMockup />
    </section>
  );
}
