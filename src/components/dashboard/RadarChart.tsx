import React from 'react';
import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export function RadarChart() {
  const data = [
    { subject: 'Arrays', A: 90, fullMark: 100 },
    { subject: 'DP', A: 45, fullMark: 100 },
    { subject: 'Graphs', A: 70, fullMark: 100 },
    { subject: 'Strings', A: 85, fullMark: 100 },
    { subject: 'Edge Cases', A: 60, fullMark: 100 },
    { subject: 'Optimization', A: 75, fullMark: 100 },
  ];

  return (
    <Card className="h-full flex flex-col">
      <h2 className="text-xl font-display font-semibold text-primary mb-6">Your Skill Profile</h2>
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadar cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#1e1e2c" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#b0b0c0', fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar name="Skills" dataKey="A" stroke="#4ade80" fill="rgba(74,222,128,0.2)" fillOpacity={1} />
          </RechartsRadar>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs text-muted uppercase">Top Strength</span>
          <Badge variant="FREE">Arrays</Badge>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="font-mono text-xs text-muted uppercase">Top Weakness</span>
          <Badge variant="HOT">DP</Badge>
        </div>
      </div>
    </Card>
  );
}
