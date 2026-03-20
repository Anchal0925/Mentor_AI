import { motion } from 'framer-motion';
import { BarChart3, Clock3, Layers, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../ui/Badge';
import type { PathSummary } from './pathData';

interface PathCardProps {
  path: PathSummary;
}

export function PathCard({ path }: PathCardProps) {
  return (
    <Link to={`/paths/${path.id}`} aria-label={`Open ${path.title}`}>
      <motion.div
        whileHover={{ y: -2, scale: 1.005 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative w-full bg-elevated border border-border rounded-xl p-8 cursor-pointer overflow-hidden group transition-colors duration-300 hover:border-border-hover hover:bg-[#1b222d]"
      >
        {path.isPro && (
          <div className="absolute top-6 right-6">
            <Badge variant="PRO">PRO</Badge>
          </div>
        )}

        <h3 className="font-display text-2xl font-bold text-primary group-hover:text-accent-green transition-colors pr-16">
          {path.title}
        </h3>

        <p className="text-secondary mt-3 leading-relaxed max-w-2xl text-[15px]">
          {path.description}
        </p>

        <div className="flex items-center gap-6 mt-8 flex-wrap">
          <span className="font-mono text-[11px] text-muted uppercase tracking-wider flex items-center gap-2">
            <Terminal size={14} />
            {path.track}
          </span>
          <span className="font-mono text-[11px] text-muted uppercase tracking-wider flex items-center gap-2">
            <Layers size={14} />
            {path.modules} modules
          </span>
          <span className="font-mono text-[11px] text-muted uppercase tracking-wider flex items-center gap-2">
            <BarChart3 size={14} />
            {path.difficulty}
          </span>
          <span className="font-mono text-[11px] text-muted uppercase tracking-wider flex items-center gap-2">
            <Clock3 size={14} />
            {path.duration}
          </span>
        </div>
      </motion.div>
    </Link>
  );
}
