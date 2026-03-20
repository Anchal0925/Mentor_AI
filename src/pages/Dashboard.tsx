import React, { useState } from 'react';
import { WelcomeCard } from '../components/dashboard/WelcomeCard';
import { QuickAccess } from '../components/dashboard/QuickAccess';
import { AIInsightCard } from '../components/dashboard/AIInsightCard';
import { ProblemCard } from '../components/problems/ProblemCard';
import { Tabs } from '../components/ui/Tabs';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('recent');

  const tabs = [
    { id: 'recent', label: 'Recent' },
    { id: 'recommended', label: 'Recommended' },
    { id: 'completed', label: 'Completed' },
  ];

  const problems = [
    {
      id: 'p1',
      title: 'Longest Palindromic Sequence',
      description: 'Find the length of the longest palindromic subsequence in a given string.',
      topic: 'Dynamic Programming',
      difficulty: 'Hard' as const,
      timeEst: '45m',
      badge: 'RECOMMENDED' as const
    },
    {
      id: 'p2',
      title: 'Merge K Sorted Arrays',
      description: 'Merge k sorted arrays into a single sorted array optimally.',
      topic: 'Heaps & Maps',
      difficulty: 'Medium' as const,
      timeEst: '30m',
      badge: 'HOT' as const
    },
    {
      id: 'p3',
      title: 'Valid Parentheses',
      description: 'Given a string of brackets, determine if the input sequence is valid.',
      topic: 'Stacks',
      difficulty: 'Easy' as const,
      timeEst: '15m'
    },
    {
      id: 'p4',
      title: 'Course Schedule II',
      description: 'Return the ordering of courses you should take to finish all courses.',
      topic: 'Graphs',
      difficulty: 'Medium' as const,
      timeEst: '35m',
      badge: 'NEW' as const
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        <WelcomeCard />
        <QuickAccess />
        
        <div className="mb-6">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="flat" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-8">
          {problems.map(problem => (
            <ProblemCard key={problem.id} {...problem} />
          ))}
        </div>
      </div>

      {/* Right Sidebar Area for AI Insight */}
      <div className="w-full lg:w-[320px] shrink-0">
        <AIInsightCard />
      </div>
    </div>
  );
}
