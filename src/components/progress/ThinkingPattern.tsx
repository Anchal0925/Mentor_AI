import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useUser } from '../../context/UserContext';

export function ThinkingPattern() {
  const { dashboard } = useUser();

  const gap    = dashboard?.gap_analysis;
  const topBug = dashboard?.most_frequent_bug;

  const insight = gap?.insight ?? (
    'You understand the theoretical concepts but struggle translating them to code efficiently. ' +
    'You tend to write boilerplate before algorithmic logic, which slows you down. ' +
    'However, your boundary handling (off-by-one errors) has improved significantly over the last 3 sessions. ' +
    'Recommendation: practice short, focused 15-minute drills to build confidence before tackling complex problems.'
  );

  const topics = gap?.recommended_topics ?? [];

  return (
    <Card className="col-span-1 lg:col-span-3 border-l-[3px] border-l-accent-yellow">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="font-display font-semibold text-lg text-primary">Meta-Cognitive Analysis</h2>
        <Badge variant="NEW">AI GENERATED</Badge>
      </div>
      <p className="font-body text-[14px] leading-relaxed text-primary">{insight}</p>

      {(topics.length > 0 || topBug) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {topics.map((t) => (
            <span key={t} className="bg-accent-yellow/10 text-accent-yellow px-2 py-0.5 rounded font-mono text-[11px]">
              {t}
            </span>
          ))}
          {topBug && (
            <span className="bg-accent-red/10 text-accent-red px-2 py-0.5 rounded font-mono text-[11px]">
              Most frequent bug: {topBug.bug_type.replace(/_/g, ' ')} ×{topBug.occurrences}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
