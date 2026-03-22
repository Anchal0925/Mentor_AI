import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProblemCardProps {
  id: string;
  title: string;
  description: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeEst: string;
  badge?: 'HOT' | 'NEW' | 'RECOMMENDED' | 'PRO';
}

export function ProblemCard({ id, title, description, topic, difficulty, timeEst, badge }: ProblemCardProps) {
  const difficultyColors = {
    Easy: 'text-accent-teal',
    Medium: 'text-accent-yellow',
    Hard: 'text-accent-red'
  };

  return (
    <Link to={`/session/${id}`} className="block">
      <Card interactive className="h-full flex flex-col relative group">
        {badge && (
          <div className="absolute top-4 right-4">
            <Badge variant={badge}>{badge}</Badge>
          </div>
        )}
        
        <h3 className="text-lg font-display font-semibold text-primary mb-2 pr-12 group-hover:text-accent-green transition-colors">
          {title}
        </h3>
        
        <p className="text-sm text-secondary mb-6 line-clamp-2 leading-relaxed flex-1">
          {description}
        </p>
        
        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-border/50">
          <span className="font-mono text-[11px] text-muted uppercase tracking-wide bg-tag-bg px-2 py-0.5 rounded">
            {topic}
          </span>
          <div className="w-1 h-1 rounded-full bg-border"></div>
          <span className={`font-mono text-[11px] uppercase tracking-wide ${difficultyColors[difficulty]}`}>
            {difficulty}
          </span>
          <div className="w-1 h-1 rounded-full bg-border"></div>
          <span className="font-mono text-[11px] text-muted flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeEst}
          </span>
        </div>
      </Card>
    </Link>
  );
}
