import { Card } from '../ui/Card';
import { ArrowRight } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'You Code',
      desc: 'Jump into our Monaco-based editor. Solve problems naturally while the system tracks your keystrokes and timing.'
    },
    {
      num: '02',
      title: 'We Watch',
      desc: 'The AI observes your problem-solving approach. It detects hesitation, brute-force attempts, and edge case misses.'
    },
    {
      num: '03',
      title: 'Memory Adapts',
      desc: 'Feedback is personalized. Next time you struggle, the AI reminds you of past mistakes instead of giving generic hints.'
    }
  ];

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">How it works</h2>
        <p className="text-secondary font-body">A seamless feedback loop designed for genuine learning.</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 relative">
        {steps.map((step, i) => (
          <React.Fragment key={step.num}>
            <Card className="flex-1 w-full relative z-10 hover:border-accent-green/50 transition-colors">
              <div className="text-accent-green font-mono text-sm mb-4 tracking-widest">{step.num}</div>
              <h3 className="text-xl font-display font-semibold text-primary mb-2">{step.title}</h3>
              <p className="text-secondary text-sm leading-relaxed">{step.desc}</p>
            </Card>
            {i < steps.length - 1 && (
              <div className="hidden md:flex text-muted shrink-0 z-0">
                <ArrowRight className="w-6 h-6" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

import React from 'react';
