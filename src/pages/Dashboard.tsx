import React, { useState } from 'react';
import { Flame, CheckCircle2, BrainCircuit, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('recommended');

  const githubGrid = Array.from({ length: 28 }).map((_, i) => (
    <div
      key={i}
      className={`w-3 h-3 rounded-[3px] ${
        Math.random() > 0.8 ? 'bg-accent-green' : Math.random() > 0.5 ? 'bg-accent-green/30' : 'bg-primary'
      }`}
    />
  ));

  const problems = [
    { id: 1, title: 'Lowest Common Ancestor', desc: 'Find the lowest common ancestor of two nodes in a BST.', tag: 'TREES', diff: 'MEDIUM', diffColor: 'text-accent-yellow', time: '~45m', type: 'RECOMMENDED' },
    { id: 2, title: 'Serialize and Deserialize', desc: 'Design an algorithm to serialize and deserialize a binary tree.', tag: 'TREES', diff: 'HARD', diffColor: 'text-accent-red', time: '~60m', type: 'HOT' },
    { id: 3, title: 'Validate Binary Search Tree', desc: 'Determine if a valid binary search tree (BST).', tag: 'TREES', diff: 'MEDIUM', diffColor: 'text-accent-yellow', time: '~30m' },
    { id: 4, title: 'Binary Tree Level Order', desc: 'Return the level order traversal of its nodes values.', tag: 'TREES', diff: 'MEDIUM', diffColor: 'text-accent-yellow', time: '~25m' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto flex flex-col gap-10">
      {/* PHASE 3.2: Welcome Header */}
      <header>
        <h1 className="font-display font-extrabold text-3xl md:text-4xl text-primary tracking-tight">
          Welcome back, Lakshay. Let's close that recursion gap today.
        </h1>
      </header>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Streak */}
        <Card className="flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-[18px] h-[18px] text-accent-yellow" />
            <span className="font-display font-semibold text-lg text-primary">12 Days Streak</span>
          </div>
          <div className="grid grid-cols-7 gap-1.5 w-fit">
            {githubGrid}
          </div>
        </Card>

        {/* Card 2: Solved */}
        <Card className="flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-[18px] h-[18px] text-accent-teal" />
            <span className="font-display font-semibold text-lg text-primary">148 Solved</span>
          </div>
          <p className="text-secondary text-sm mt-4 leading-relaxed">Top 5% of users this week</p>
        </Card>

        {/* Card 3: Mastered */}
        <Card className="flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-[18px] h-[18px] text-accent-purple" />
            <span className="font-display font-semibold text-lg text-primary">14 Mastered</span>
          </div>
          <p className="text-secondary text-sm mt-4 leading-relaxed">+2 concepts learned since Monday</p>
        </Card>
      </div>

      {/* PHASE 3.3: Magic AI Insight */}
      <Card className="border-l-4 border-l-accent-green bg-elevated/80 relative overflow-hidden flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-accent-green" />
            <span className="font-mono text-[10px] text-muted uppercase tracking-widest">[ AI TUTOR MEMORY INSIGHT ]</span>
          </div>
          <p className="font-body text-sm text-primary leading-relaxed max-w-2xl">
            In your last 3 sessions, you consistently struggled with identifying overlapping subproblems. 
            I've queued up a specialized set of Memoization tasks tailored to how you process tree traversals.
          </p>
        </div>
        <div className="shrink-0">
          <Button variant="ghost-green" className="text-sm px-5 py-2">
            Start Recommended <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>

      {/* PHASE 3.4: Problem Queue */}
      <section className="flex flex-col gap-6">
        <Tabs 
          tabs={[
            { id: 'recommended', label: 'Recommended' },
            { id: 'recent', label: 'Recent Sessions' },
            { id: 'completed', label: 'Completed' }
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="flat"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {problems.map((prob) => (
            <Card key={prob.id} interactive className="group relative flex flex-col justify-between min-h-[150px] overflow-hidden">
              {prob.type && (
                <div className="absolute top-4 right-4">
                  <Badge variant={prob.type as any}>{prob.type}</Badge>
                </div>
              )}
              <div className="pr-16">
                <h3 className="font-display font-semibold text-lg text-primary group-hover:text-accent-green transition-colors">
                  {prob.title}
                </h3>
                <p className="text-sm text-secondary mt-1.5 line-clamp-1">{prob.desc}</p>
              </div>
              <div className="flex items-center gap-4 mt-6">
                <Badge variant="TOPIC">{prob.tag}</Badge>
                <span className={`font-mono text-[11px] uppercase tracking-wider ${prob.diffColor}`}>
                  {prob.diff}
                </span>
                <span className="font-mono text-[11px] text-muted tracking-wider ml-auto">
                  {prob.time}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
