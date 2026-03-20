import { Card } from '../ui/Card';
import { Brain, Eye, Compass, RotateCcw, Network, MessageSquarePlus } from 'lucide-react';

export function FeaturesGrid() {
  const features = [
    {
      icon: Eye,
      title: 'Live Behavioral Analysis',
      desc: 'Analyzes how you type, backspace, and pause to infer your thought process.'
    },
    {
      icon: Brain,
      title: 'AI Tutor with Memory',
      desc: 'Remembers your weak spots across sessions to provide contextual hints.'
    },
    {
      icon: Compass,
      title: 'Adaptive Problem Engine',
      desc: 'Recommends problems based on your cognitive gaps, not just difficulty.'
    },
    {
      icon: RotateCcw,
      title: 'Session Replay',
      desc: 'Playback your entire thought process keystroke by keystroke.'
    },
    {
      icon: Network,
      title: 'Concept Graph Tracking',
      desc: 'Visualize your mastery across interconnected DSA topics.'
    },
    {
      icon: MessageSquarePlus,
      title: 'Real-Time Nudges',
      desc: 'Subtle prompts when you stray off the optimal path or miss an edge case.'
    }
  ];

  return (
    <section className="py-24 px-6 bg-surface/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">A complete mentorship subsystem</h2>
          <p className="text-secondary font-body">Everything you need to break through plateaus.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} interactive className="group">
              <div className="w-10 h-10 rounded-lg bg-border flex items-center justify-center mb-6 group-hover:bg-accent-green/10 group-hover:text-accent-green transition-colors text-secondary">
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-display font-semibold text-primary mb-2">{feature.title}</h3>
              <p className="text-secondary text-sm leading-relaxed">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
