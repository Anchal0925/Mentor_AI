import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { Card } from '../ui/Card';
import { useUser } from '../../context/UserContext';

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-elevated border border-border rounded-md px-3 py-2 font-mono text-xs text-primary">
      <p>{payload[0].payload.topic}: <span className="text-accent-green">{payload[0].value}%</span></p>
    </div>
  );
}

const fallbackData = [
  { topic: 'Arrays', score: 85 },
  { topic: 'Two Pointers', score: 65 },
  { topic: 'Sliding Window', score: 40 },
  { topic: 'Recursion', score: 30 },
  { topic: 'Hash Maps', score: 90 },
  { topic: 'Trees', score: 50 },
];

export function SkillRadar() {
  const { dashboard } = useUser();

  const radarData = dashboard?.weak_areas?.length
    ? dashboard.weak_areas.map((w) => ({ topic: w.topic, score: Math.round(w.score) }))
    : fallbackData;

  const sessionCount = dashboard?.user?.completed_sessions ?? 15;

  return (
    <Card className="col-span-1 lg:col-span-2 h-[400px] flex flex-col">
      <div className="mb-4">
        <h2 className="font-display font-semibold text-lg text-primary">Concept Mastery</h2>
        <p className="font-mono text-[10px] text-muted mt-1">Based on last {sessionCount} sessions</p>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} outerRadius="70%">
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis
              dataKey="topic"
              tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar name="Score" dataKey="score" stroke="var(--accent-green)" fill="var(--accent-green)" fillOpacity={0.2} strokeWidth={2} />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
