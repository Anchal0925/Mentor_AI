import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Flame, CheckCircle, Target } from 'lucide-react';

export function WelcomeCard() {
  return (
    <Card className="mb-8 border-l-[3px] border-l-accent-green overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-accent-green/5 to-transparent pointer-events-none"></div>
      
      <h2 className="text-2xl font-display font-semibold text-primary mb-6">
        Hello, Lakshay. Ready to practice?
      </h2>
      
      <div className="flex flex-wrap items-center gap-6 mb-8">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-accent-red" />
          <span className="font-mono text-sm text-primary"><strong className="text-base">12</strong> Day Streak</span>
        </div>
        <div className="w-px h-6 bg-border"></div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-accent-teal" />
          <span className="font-mono text-sm text-primary"><strong className="text-base">45</strong> Solved</span>
        </div>
        <div className="w-px h-6 bg-border"></div>
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-accent-purple" />
          <span className="font-mono text-sm text-secondary">Weakest: <strong className="text-primary">Dynamic Programming</strong></span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="primary">Continue Practice</Button>
        <Button variant="ghost-neutral">Browse Problems</Button>
      </div>
    </Card>
  );
}
