import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

const ADAPTIVE_PROBLEMS = [
  {
    id: 'ai-1',
    title: 'Memoized Tree Traversal',
    desc: 'Apply memoization to optimize recursive tree traversal — targets your identified weakness in overlapping subproblems.',
    topic: 'TREES',
    diff: 'Medium',
    diffColor: 'text-accent-yellow',
    time: '~35m',
    tag: 'RECOMMENDED',
  },
  {
    id: 'ai-2',
    title: 'Sliding Window Edge Cases',
    desc: 'Practice boundary conditions in variable-length sliding windows — your off-by-one error rate was 3× higher than average.',
    topic: 'ARRAYS',
    diff: 'Medium',
    diffColor: 'text-accent-yellow',
    time: '~25m',
    tag: 'HOT',
  },
];

export function AdaptiveRow() {
  return (
    <section className="mb-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
        <h2 className="font-display text-lg text-primary">
          Recommended for your current skill gap
        </h2>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ADAPTIVE_PROBLEMS.map((prob) => (
          <Card key={prob.id} interactive className="group relative flex flex-col justify-between min-h-[150px] overflow-hidden border-accent-green/20">
            <div className="absolute top-4 right-4">
              <Badge variant={prob.tag as any}>{prob.tag === 'HOT' ? 'TARGETS WEAKNESS' : prob.tag}</Badge>
            </div>
            <div className="pr-28">
              <h3 className="font-display font-semibold text-lg text-primary group-hover:text-accent-green transition-colors">
                {prob.title}
              </h3>
              <p className="text-sm text-secondary mt-1.5 line-clamp-2">{prob.desc}</p>
            </div>
            <div className="flex items-center gap-4 mt-6">
              <Badge variant="TOPIC">{prob.topic}</Badge>
              <span className={`font-mono text-[11px] uppercase tracking-wider ${prob.diffColor}`}>
                {prob.diff}
              </span>
              <span className="font-mono text-[11px] text-muted tracking-wider ml-auto">
                {prob.time}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
