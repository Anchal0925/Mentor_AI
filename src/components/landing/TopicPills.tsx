import { Badge } from '../ui/Badge';

export function TopicPills() {
  const topics = ['DSA Online', 'Arrays & AI', 'LLD & HLD', 'DP', 'Quick Access'];
  
  return (
    <section className="py-8 border-y border-border bg-surface/50">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {topics.map((topic, i) => (
          <Badge key={topic} variant="TOPIC" isActive={i === 0}>
            {topic}
          </Badge>
        ))}
      </div>
    </section>
  );
}
