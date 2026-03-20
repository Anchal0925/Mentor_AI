import { useState } from 'react';
import { FilterBar } from '../components/problems/FilterBar';
import { AdaptiveRow } from '../components/problems/AdaptiveRow';
import { ProblemGrid } from '../components/problems/ProblemGrid';

export default function Problems() {
  const [activeTopic, setActiveTopic] = useState('All');
  const [difficulty, setDifficulty] = useState('all');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');

  return (
    <div className="max-w-7xl mx-auto px-6 py-2 flex flex-col gap-6">
      <FilterBar
        activeTopic={activeTopic}
        onTopicChange={setActiveTopic}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        status={status}
        onStatusChange={setStatus}
        search={search}
        onSearchChange={setSearch}
      />
      <AdaptiveRow />
      <ProblemGrid
        searchFilter={search}
        topicFilter={activeTopic}
        difficultyFilter={difficulty}
      />
    </div>
  );
}
