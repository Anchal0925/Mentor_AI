import React from 'react';
import { Card } from '../ui/Card';
import { CheckCircle, AlertTriangle } from 'lucide-react';

export function BehaviorFlags() {
  const flags = [
    { id: 1, title: 'Approach Confusion', active: true, desc: 'Struggles to identify the optimal starting pattern.' },
    { id: 2, title: 'Hint Dependent', active: false, desc: 'Relies on hints before writing initial logic.' },
    { id: 3, title: 'Slow Translation', active: true, desc: 'Takes >5 mins to translate logic to syntax.' },
    { id: 4, title: 'Edge Case Weakness', active: false, desc: 'Fails hidden test cases frequently.' }
  ];

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-display font-semibold text-primary">Behavioral Flags</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {flags.map((flag) => (
          <Card 
            key={flag.id} 
            className={`p-4 flex items-start gap-3 ${flag.active ? 'border-l-[3px] border-l-accent-red' : 'opacity-60 grayscale'}`}
          >
            {flag.active ? (
              <AlertTriangle className="w-5 h-5 text-accent-red shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 text-accent-teal shrink-0" />
            )}
            <div>
              <h3 className={`font-medium mb-1 ${flag.active ? 'text-primary' : 'text-secondary line-through decoration-muted'}`}>
                {flag.title}
              </h3>
              <p className="text-xs text-secondary leading-relaxed">{flag.desc}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
