import React, { useState } from 'react';
import { FilterBar } from '../components/problems/FilterBar';
import { ProblemCard } from '../components/problems/ProblemCard';

export default function Problems() {
  const [activeFilter, setActiveFilter] = useState('All');

  // Extended mock data for the grid
  const allProblems = [
    { id: '1', title: 'Two Sum', description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.', topic: 'Arrays', difficulty: 'Easy' as const, timeEst: '15m' },
    { id: '2', title: 'Longest Substring Without Repeating Characters', description: 'Given a string s, find the length of the longest substring without repeating characters.', topic: 'Strings', difficulty: 'Medium' as const, timeEst: '25m', badge: 'HOT' as const },
    { id: '3', title: 'Median of Two Sorted Arrays', description: 'Given two sorted arrays nums1 and nums2, return the median of the two sorted arrays.', topic: 'Arrays', difficulty: 'Hard' as const, timeEst: '45m' },
    { id: '4', title: 'Regular Expression Matching', description: 'Implement regular expression matching with support for \'.\' and \'*\'', topic: 'DP', difficulty: 'Hard' as const, timeEst: '50m', badge: 'PRO' as const },
    { id: '5', title: 'Container With Most Water', description: 'You are given an integer array height of length n. Find two lines that together with the x-axis form a container, such that the container contains the most water.', topic: 'Arrays', difficulty: 'Medium' as const, timeEst: '30m' },
    { id: '6', title: 'Integer to Roman', description: 'Given an integer, convert it to a roman numeral.', topic: 'Strings', difficulty: 'Medium' as const, timeEst: '20m', badge: 'NEW' as const },
    { id: '7', title: 'Climbing Stairs', description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps.', topic: 'DP', difficulty: 'Easy' as const, timeEst: '10m' },
    { id: '8', title: 'Word Search II', description: 'Given an m x n board of characters and a list of strings words, return all words on the board.', topic: 'Graphs', difficulty: 'Hard' as const, timeEst: '40m' },
    { id: '9', title: 'Serialize and Deserialize Binary Tree', description: 'Design an algorithm to serialize and deserialize a binary tree.', topic: 'Trees', difficulty: 'Hard' as const, timeEst: '45m', badge: 'RECOMMENDED' as const },
  ];

  const filteredProblems = activeFilter === 'All' 
    ? allProblems 
    : allProblems.filter(p => p.topic === activeFilter);

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-semibold text-primary mb-2">Problems</h1>
        <p className="text-secondary font-body">Browse and practice from our curated list of 2,400+ questions.</p>
      </div>

      <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProblems.map(problem => (
          <ProblemCard key={problem.id} {...problem} />
        ))}
      </div>
    </div>
  );
}
