import React, { useMemo } from 'react';

type Level = 0 | 1 | 2 | 3 | 4;

interface Contribution {
  date: Date;
  dateStr: string;
  count: number;
  level: Level;
}

const getLevelClass = (level: Level) => {
  switch (level) {
    case 0: return 'bg-surface border border-border/50';
    case 1: return 'bg-accent-green/30';
    case 2: return 'bg-accent-green/50';
    case 3: return 'bg-accent-green/80';
    case 4: return 'bg-accent-green shadow-[0_0_8px_rgba(74,222,128,0.4)] border border-accent-green/50';
    default: return 'bg-surface border border-border/50';
  }
};

const generateMockContributions = (weeks: number): Contribution[] => {
  const data: Contribution[] = [];
  const today = new Date();
  
  // Go back `weeks` weeks, starting from a Sunday
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - (weeks * 7) + 1);
  const dayOfWeek = startDate.getDay();
  startDate.setDate(startDate.getDate() - dayOfWeek); // snap to previous Sunday

  const numDays = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  for (let i = 0; i < numDays; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    // Weighted random distribution for a realistic streak
    const rand = Math.random();
    let level: Level = 0;
    let count = 0;

    // Simulate recent high activity, past lower activity
    const recencyWeight = i / numDays; // 0 to 1
    const adjustedRand = rand + (recencyWeight * 0.2);

    if (adjustedRand > 1.05) { level = 4; count = Math.floor(Math.random() * 5) + 7; } // 7-11
    else if (adjustedRand > 0.85) { level = 3; count = Math.floor(Math.random() * 2) + 5; } // 5-6
    else if (adjustedRand > 0.65) { level = 2; count = Math.floor(Math.random() * 2) + 3; } // 3-4
    else if (adjustedRand > 0.40) { level = 1; count = Math.floor(Math.random() * 2) + 1; } // 1-2
    else { level = 0; count = 0; }

    data.push({
      date,
      dateStr: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      count,
      level
    });
  }

  return data;
};

export function ContributionGraph() {
  const { data, months } = useMemo(() => {
    const contributions = generateMockContributions(16);
    
    // Calculate months labels based on columns (every 7 days is a column)
    const monthLabels: { label: string; colIndex: number }[] = [];
    let currentMonth = -1;
    
    contributions.forEach((day, i) => {
      const month = day.date.getMonth();
      const colIndex = Math.floor(i / 7);
      
      if (month !== currentMonth && day.date.getDate() <= 14) {
        // Only add label if the month starts reasonably close to the column
        monthLabels.push({
          label: day.date.toLocaleDateString('en-US', { month: 'short' }),
          colIndex
        });
        currentMonth = month;
      }
    });

    return { data: contributions, months: monthLabels };
  }, []);

  return (
    <div className="flex flex-col gap-2 w-full overflow-x-auto pb-1 custom-scrollbar">
      {/* Month Labels */}
      <div className="relative h-4 min-w-max">
        {months.map((m, i) => (
          <span 
            key={i} 
            className="absolute font-mono text-[10px] text-muted uppercase tracking-wider"
            style={{ left: `${m.colIndex * 15}px`, transform: 'translateX(2px)' }}
          >
            {m.label}
          </span>
        ))}
      </div>

      {/* 7-Row Grid */}
      <div className="grid grid-rows-7 grid-flow-col gap-[3px] min-w-max">
        {data.map((day, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-[2px] cursor-pointer transition-all hover:ring-1 hover:ring-primary ${getLevelClass(day.level)}`}
            title={`${day.count} problems solved on ${day.dateStr}`}
          />
        ))}
      </div>
    </div>
  );
}
