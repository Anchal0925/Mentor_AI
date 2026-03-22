import { Card } from '../ui/Card';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

export function AIInsightCard() {
  const { dashboard } = useUser();
  const gap = dashboard?.gap_analysis;

  const insight = gap?.insight
    ?? "I noticed you struggled with overlapping subproblems in the last session. You tend to recompute states instead of memoizing them properly. Let's fix that.";

  const firstTopic = gap?.recommended_topics?.[0];

  return (
    <Card className="border-l-[3px] border-l-accent-green sticky top-[80px]">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-accent-green" />
        <span className="font-mono text-xs uppercase text-muted tracking-wide">AI Tutor Memory</span>
      </div>

      <p className="text-sm text-primary leading-relaxed mb-6 font-body">{insight}</p>

      {firstTopic && (
        <p className="font-mono text-[10px] text-muted mb-3 uppercase tracking-widest">
          Focus: <span className="text-accent-yellow">{firstTopic}</span>
        </p>
      )}

      <Link
        to="/session/new"
        className="inline-flex items-center gap-2 text-sm font-semibold text-accent-green hover:brightness-110 transition-colors"
      >
        Start Recommended Problem <ArrowRight className="w-4 h-4 text-accent-green" />
      </Link>
    </Card>
  );
}
