import { Badge } from '../ui/Badge';

export function QuickAccess() {
  const topics = ['DSA Online', 'DS, ML & AI', 'LLD & HLD', 'Quick Access'];
  
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide mb-8">
      {topics.map((topic, i) => (
        <Badge key={topic} variant="TOPIC" isActive={i === 0}>
          {topic}
        </Badge>
      ))}
    </div>
  );
}
