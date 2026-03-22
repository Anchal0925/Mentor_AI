import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Flame, CheckCircle, Target } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

export function WelcomeCard() {
  const { userStats, dashboard } = useUser();
  const navigate = useNavigate();

  const streak    = userStats?.current_streak ?? 0;
  const solved    = userStats?.ques_attempted ?? 0;
  const weakest   = dashboard?.weak_areas?.[0]?.topic ?? 'Dynamic Programming';
  const firstName = userStats?.email?.split('@')[0] ?? 'there';

  return (
    <Card className="mb-8 border-l-[3px] border-l-accent-green overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-accent-green/5 to-transparent pointer-events-none" />

      <h2 className="text-2xl font-display font-semibold text-primary mb-6">
        Hello, {firstName}. Ready to practice?
      </h2>

      <div className="flex flex-wrap items-center gap-6 mb-8">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-accent-red" />
          <span className="font-mono text-sm text-primary">
            <strong className="text-base">{streak}</strong> Day Streak
          </span>
        </div>
        <div className="w-px h-6 bg-border" />
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-accent-teal" />
          <span className="font-mono text-sm text-primary">
            <strong className="text-base">{solved}</strong> Solved
          </span>
        </div>
        <div className="w-px h-6 bg-border" />
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-accent-purple" />
          <span className="font-mono text-sm text-secondary">
            Weakest: <strong className="text-primary">{weakest}</strong>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="primary" onClick={() => navigate('/session/new')}>Continue Practice</Button>
        <Button variant="ghost-neutral" onClick={() => navigate('/problems')}>Browse Problems</Button>
      </div>
    </Card>
  );
}
