import React, { useState } from 'react';
import { Flame, CheckCircle2, BrainCircuit, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { ContributionGraph } from '../components/dashboard/ContributionGraph';
import { useUser } from '../context/UserContext';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('recommended');
  const { dashboard, userStats, loading } = useUser();

  const streak         = userStats?.current_streak ?? 0;
  const solved         = userStats?.ques_attempted ?? 0;
  const mastered       = userStats?.ques_mastered  ?? 0;
  const gapInsight     = dashboard?.gap_analysis;
  const recentSessions = dashboard?.recent_sessions ?? [];
  const weakTopics     = dashboard?.weak_areas?.slice(0, 4) ?? [];
  const firstName      = userStats?.email?.split('@')[0] ?? 'there';

  const problems = [
    { id: 1, title: 'Lowest Common Ancestor',     desc: 'Find the lowest common ancestor of two nodes in a BST.',              tag: 'TREES', diff: 'MEDIUM', diffColor: 'text-accent-yellow', time: '~45m', type: 'RECOMMENDED' },
    { id: 2, title: 'Serialize and Deserialize',   desc: 'Design an algorithm to serialize and deserialize a binary tree.',    tag: 'TREES', diff: 'HARD',   diffColor: 'text-accent-red',    time: '~60m', type: 'HOT' },
    { id: 3, title: 'Validate Binary Search Tree', desc: 'Determine if a valid binary search tree (BST).',                     tag: 'TREES', diff: 'MEDIUM', diffColor: 'text-accent-yellow', time: '~30m' },
    { id: 4, title: 'Binary Tree Level Order',     desc: 'Return the level order traversal of its nodes values.',              tag: 'TREES', diff: 'MEDIUM', diffColor: 'text-accent-yellow', time: '~25m' },
  ];

  const recentProblems = recentSessions.map((s, i) => ({
    id: i + 100,
    title: s.topic ?? 'Practice Session',
    desc: `${s.problems_done} problems · ${s.hints_used} hints used`,
    tag: (s.topic ?? 'SESSION').toUpperCase(),
    diff: s.hints_used > 3 ? 'HARD' : 'MEDIUM',
    diffColor: s.hints_used > 3 ? 'text-accent-red' : 'text-accent-yellow',
    time: s.ended_at
      ? `${Math.round((new Date(s.ended_at).getTime() - new Date(s.started_at).getTime()) / 60000)}m`
      : 'ongoing',
  }));

  const displayProblems = activeTab === 'recent' ? recentProblems : problems;

  if (loading && !dashboard) {
    return (
      <div className="p-8 max-w-6xl mx-auto flex items-center justify-center h-64">
        <span className="font-mono text-muted animate-pulse">Loading your dashboard…</span>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto flex flex-col gap-10">
      <header>
        <h1 className="font-display font-extrabold text-3xl md:text-4xl text-primary tracking-tight">
          Welcome back, {firstName}.{' '}
          {gapInsight?.recommended_topics?.length
            ? `Let's close that ${gapInsight.recommended_topics[0]} gap today.`
            : "Let's keep the momentum going."}
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col justify-between min-h-[140px] col-span-1 border-accent-green/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-[18px] h-[18px] text-accent-yellow" />
              <span className="font-display font-semibold text-lg text-primary">
                {streak} Day{streak !== 1 ? 's' : ''} Streak
              </span>
            </div>
          </div>
          <div className="w-full relative">
            <ContributionGraph />
            <div className="flex items-center gap-1.5 justify-end mt-3">
              <span className="font-mono text-[9px] text-muted">Less</span>
              <div className="flex gap-[2px]">
                <div className="w-[10px] h-[10px] rounded-[1px] bg-surface border border-border/50" />
                <div className="w-[10px] h-[10px] rounded-[1px] bg-accent-green/30" />
                <div className="w-[10px] h-[10px] rounded-[1px] bg-accent-green/50" />
                <div className="w-[10px] h-[10px] rounded-[1px] bg-accent-green/80" />
                <div className="w-[10px] h-[10px] rounded-[1px] bg-accent-green shadow-[0_0_8px_rgba(74,222,128,0.4)] border border-accent-green/50" />
              </div>
              <span className="font-mono text-[9px] text-muted">More</span>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-[18px] h-[18px] text-accent-teal" />
            <span className="font-display font-semibold text-lg text-primary">{solved} Solved</span>
          </div>
          <p className="text-secondary text-sm mt-4 leading-relaxed">
            {userStats?.leaderboard_rank ? `Rank #${userStats.leaderboard_rank} on leaderboard` : 'Top 5% of users this week'}
          </p>
        </Card>

        <Card className="flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-[18px] h-[18px] text-accent-purple" />
            <span className="font-display font-semibold text-lg text-primary">{mastered} Mastered</span>
          </div>
          <p className="text-secondary text-sm mt-4 leading-relaxed">
            {weakTopics.length > 0 ? `Weakest: ${weakTopics[0].topic}` : '+2 concepts learned since Monday'}
          </p>
        </Card>
      </div>

      <Card className="border-l-4 border-l-accent-green bg-elevated/80 relative overflow-hidden flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-accent-green" />
            <span className="font-mono text-[10px] text-muted uppercase tracking-widest">[ AI TUTOR MEMORY INSIGHT ]</span>
          </div>
          <p className="font-body text-sm text-primary leading-relaxed max-w-2xl">
            {gapInsight?.insight ?? 'Complete a session to unlock your first personalized AI insight.'}
          </p>
        </div>
        <div className="shrink-0">
          <Button variant="ghost-green" className="text-sm px-5 py-2">
            Start Recommended <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>

      <section className="flex flex-col gap-6">
        <Tabs
          tabs={[
            { id: 'recommended', label: 'Recommended' },
            { id: 'recent',      label: 'Recent Sessions' },
            { id: 'completed',   label: 'Completed' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="flat"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayProblems.length === 0 ? (
            <p className="font-mono text-muted text-sm col-span-2">
              {activeTab === 'recent' ? 'No recent sessions yet — start one!' : 'No problems to show.'}
            </p>
          ) : (
            displayProblems.map((prob) => (
              <Card key={prob.id} interactive className="group relative flex flex-col justify-between min-h-[150px] overflow-hidden">
                {'type' in prob && prob.type ? (
                  <div className="absolute top-4 right-4">
                    <Badge variant={prob.type as any}>{String(prob.type)}</Badge>
                  </div>
                ) : null}
                <div className="pr-16">
                  <h3 className="font-display font-semibold text-lg text-primary group-hover:text-accent-green transition-colors">
                    {prob.title}
                  </h3>
                  <p className="text-sm text-secondary mt-1.5 line-clamp-1">{prob.desc}</p>
                </div>
                <div className="flex items-center gap-4 mt-6">
                  <Badge variant="TOPIC">{prob.tag}</Badge>
                  <span className={`font-mono text-[11px] uppercase tracking-wider ${prob.diffColor}`}>{prob.diff}</span>
                  <span className="font-mono text-[11px] text-muted tracking-wider ml-auto">{prob.time}</span>
                </div>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
