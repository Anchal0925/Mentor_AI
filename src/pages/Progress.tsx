import { motion } from 'framer-motion';
import { ProgressHeader } from '../components/progress/ProgressHeader';
import { SkillRadar } from '../components/progress/SkillRadar';
import { BehavioralFlags } from '../components/progress/BehavioralFlags';
import { ThinkingPattern } from '../components/progress/ThinkingPattern';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

export default function Progress() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <ProgressHeader />
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <motion.div variants={fadeUp} className="col-span-1 lg:col-span-2">
          <SkillRadar />
        </motion.div>
        <motion.div variants={fadeUp} className="col-span-1">
          <BehavioralFlags />
        </motion.div>
        <motion.div variants={fadeUp} className="col-span-1 lg:col-span-3">
          <ThinkingPattern />
        </motion.div>
      </motion.div>
    </div>
  );
}
