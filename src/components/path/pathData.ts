export type ModuleType = 'standard' | 'weakness' | 'critical';
export type LessonType = 'video' | 'problem';
export type SortOption = 'most-popular' | 'shortest-duration' | 'most-modules' | 'beginner-first';

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  type: LessonType;
}

export interface PathModule {
  id: string;
  title: string;
  type: ModuleType;
  tag?: string;
  meta: string;
  locked?: boolean;
  lessons: Lesson[];
}

export interface PathSummary {
  id: string;
  title: string;
  description: string;
  track: string;
  modules: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  durationHours: number;
  popularityRank: number;
  isPro: boolean;
}

export interface PathDetail {
  id: string;
  title: string;
  description: string;
  metaLabel: string;
  modules: PathModule[];
}

export const DEFAULT_PATH_ID = 'fullstack-dev';

export const PATH_SUMMARIES: PathSummary[] = [
  {
    id: 'fullstack-dev',
    title: 'The Fullstack Developer Path',
    description:
      'Learn the entire stack from frontend to backend. Focused on hireable skills from the JavaScript ecosystem, like React, Node, Express, Next, and even AI engineering. This massive course is your one-stop-shop for breaking into tech.',
    track: 'Fullstack',
    modules: 94,
    difficulty: 'Beginner',
    duration: '108.4 hrs',
    durationHours: 108.4,
    popularityRank: 1,
    isPro: true,
  },
  {
    id: 'backend-dev',
    title: 'The Backend Developer Path',
    description:
      'The comprehensive path to becoming a backend developer. Focused on in-demand skills from the JavaScript ecosystem, including Node and Express, this path also explores databases, cybersecurity, DevOps, APIs, algorithms, and more.',
    track: 'Backend',
    modules: 67,
    difficulty: 'Intermediate',
    duration: '88.1 hrs',
    durationHours: 88.1,
    popularityRank: 2,
    isPro: true,
  },
  {
    id: 'ai-engineer',
    title: 'The AI Engineer Path',
    description:
      'Build apps powered by generative AI - an essential 2026 skill for product teams at startups, agencies, and large corporations. Learn about agents, RAG, MCP, multimodality, context engineering, and more.',
    track: 'AI',
    modules: 42,
    difficulty: 'Advanced',
    duration: '45.2 hrs',
    durationHours: 45.2,
    popularityRank: 3,
    isPro: true,
  },
];

const FULLSTACK_MODULES: PathModule[] = [
  {
    id: 'module-1',
    title: 'Arrays & Hashing',
    type: 'standard',
    meta: '52 min • 3/4 completed',
    lessons: [
      { id: 'l-1a', title: 'Contains Duplicate', duration: '12 min', completed: true, type: 'problem' },
      { id: 'l-1b', title: 'Valid Anagram', duration: '10 min', completed: true, type: 'problem' },
      { id: 'l-1c', title: 'Two Sum', duration: '15 min', completed: true, type: 'problem' },
      { id: 'l-1d', title: 'Group Anagrams', duration: '15 min', completed: false, type: 'problem' },
    ],
  },
  {
    id: 'module-2',
    title: 'Edge Case Mastery: Off-by-One Errors',
    type: 'weakness',
    tag: 'AI TARGETED: EDGE CASES',
    meta: '38 min • 0/3 completed',
    lessons: [
      { id: 'l-2a', title: 'Binary Search Boundary Trap', duration: '14 min', completed: false, type: 'problem' },
      { id: 'l-2b', title: 'Sliding Window Fence Post', duration: '12 min', completed: false, type: 'problem' },
      { id: 'l-2c', title: 'Array Rotation Edge Cases', duration: '12 min', completed: false, type: 'problem' },
    ],
  },
  {
    id: 'module-3',
    title: 'Recursion Fundamentals',
    type: 'critical',
    tag: 'CRITICAL PREREQUISITE',
    meta: '45 min • 0/3 completed',
    lessons: [
      { id: 'l-3a', title: 'Understanding the Call Stack', duration: '18 min', completed: false, type: 'video' },
      { id: 'l-3b', title: 'Fibonacci: Naive to Memoized', duration: '15 min', completed: false, type: 'problem' },
      { id: 'l-3c', title: 'Recursive Tree Traversal', duration: '12 min', completed: false, type: 'problem' },
    ],
  },
  {
    id: 'module-4',
    title: 'Stacks & Queues',
    type: 'standard',
    meta: '48 min • 0/4 completed',
    locked: true,
    lessons: [
      { id: 'l-4a', title: 'Valid Parentheses', duration: '10 min', completed: false, type: 'problem' },
      { id: 'l-4b', title: 'Min Stack', duration: '12 min', completed: false, type: 'problem' },
      { id: 'l-4c', title: 'Reverse Polish Notation', duration: '14 min', completed: false, type: 'problem' },
      { id: 'l-4d', title: 'Daily Temperatures', duration: '12 min', completed: false, type: 'problem' },
    ],
  },
];

const BACKEND_MODULES: PathModule[] = [
  {
    id: 'backend-1',
    title: 'Node & Express Foundations',
    type: 'standard',
    meta: '61 min • 2/5 completed',
    lessons: [
      { id: 'b-1a', title: 'Event Loop Deep Dive', duration: '11 min', completed: true, type: 'video' },
      { id: 'b-1b', title: 'REST Routing Patterns', duration: '14 min', completed: true, type: 'problem' },
      { id: 'b-1c', title: 'Middleware Ordering', duration: '12 min', completed: false, type: 'problem' },
      { id: 'b-1d', title: 'Error Handling Pipelines', duration: '13 min', completed: false, type: 'problem' },
      { id: 'b-1e', title: 'Rate Limiting Basics', duration: '11 min', completed: false, type: 'video' },
    ],
  },
  {
    id: 'backend-2',
    title: 'SQL Query Optimization',
    type: 'weakness',
    tag: 'AI TARGETED: PERFORMANCE',
    meta: '42 min • 0/3 completed',
    lessons: [
      { id: 'b-2a', title: 'Index Selectivity in Practice', duration: '13 min', completed: false, type: 'problem' },
      { id: 'b-2b', title: 'N+1 Query Detection', duration: '14 min', completed: false, type: 'problem' },
      { id: 'b-2c', title: 'Query Plan Reading', duration: '15 min', completed: false, type: 'video' },
    ],
  },
  {
    id: 'backend-3',
    title: 'Authentication & Security',
    type: 'critical',
    tag: 'CRITICAL PREREQUISITE',
    meta: '50 min • 0/4 completed',
    lessons: [
      { id: 'b-3a', title: 'JWT Lifecycle', duration: '12 min', completed: false, type: 'video' },
      { id: 'b-3b', title: 'Session Fixation Defense', duration: '12 min', completed: false, type: 'problem' },
      { id: 'b-3c', title: 'Password Reset Design', duration: '13 min', completed: false, type: 'problem' },
      { id: 'b-3d', title: 'Role-based Access Guards', duration: '13 min', completed: false, type: 'problem' },
    ],
  },
  {
    id: 'backend-4',
    title: 'Distributed Caching',
    type: 'standard',
    meta: '37 min • 0/3 completed',
    locked: true,
    lessons: [
      { id: 'b-4a', title: 'Redis TTL Strategy', duration: '12 min', completed: false, type: 'problem' },
      { id: 'b-4b', title: 'Cache Invalidation Patterns', duration: '13 min', completed: false, type: 'problem' },
      { id: 'b-4c', title: 'Hot Key Mitigation', duration: '12 min', completed: false, type: 'problem' },
    ],
  },
];

const AI_MODULES: PathModule[] = [
  {
    id: 'ai-1',
    title: 'Prompt Engineering Core',
    type: 'standard',
    meta: '44 min • 1/4 completed',
    lessons: [
      { id: 'a-1a', title: 'Instruction Hierarchy', duration: '11 min', completed: true, type: 'video' },
      { id: 'a-1b', title: 'Few-shot Design', duration: '10 min', completed: false, type: 'problem' },
      { id: 'a-1c', title: 'Guardrail Prompting', duration: '12 min', completed: false, type: 'problem' },
      { id: 'a-1d', title: 'Prompt Test Harness', duration: '11 min', completed: false, type: 'problem' },
    ],
  },
  {
    id: 'ai-2',
    title: 'RAG Retrieval Quality',
    type: 'weakness',
    tag: 'AI TARGETED: CONTEXT QUALITY',
    meta: '47 min • 0/3 completed',
    lessons: [
      { id: 'a-2a', title: 'Chunking Boundary Tradeoffs', duration: '15 min', completed: false, type: 'problem' },
      { id: 'a-2b', title: 'Embedding Drift Checks', duration: '16 min', completed: false, type: 'problem' },
      { id: 'a-2c', title: 'Reranking Evaluation', duration: '16 min', completed: false, type: 'video' },
    ],
  },
  {
    id: 'ai-3',
    title: 'Agent Planning & Tool Use',
    type: 'critical',
    tag: 'CRITICAL PREREQUISITE',
    meta: '53 min • 0/4 completed',
    lessons: [
      { id: 'a-3a', title: 'Tool Schema Design', duration: '13 min', completed: false, type: 'video' },
      { id: 'a-3b', title: 'Planner-Executor Pattern', duration: '14 min', completed: false, type: 'problem' },
      { id: 'a-3c', title: 'Memory Compaction', duration: '13 min', completed: false, type: 'problem' },
      { id: 'a-3d', title: 'Failure Recovery Loops', duration: '13 min', completed: false, type: 'problem' },
    ],
  },
  {
    id: 'ai-4',
    title: 'Multimodal Pipelines',
    type: 'standard',
    meta: '39 min • 0/3 completed',
    locked: true,
    lessons: [
      { id: 'a-4a', title: 'Vision Prompt Patterns', duration: '13 min', completed: false, type: 'problem' },
      { id: 'a-4b', title: 'Audio Transcript Grounding', duration: '13 min', completed: false, type: 'problem' },
      { id: 'a-4c', title: 'Cross-modal Verification', duration: '13 min', completed: false, type: 'problem' },
    ],
  },
];

export const PATH_DETAILS: Record<string, PathDetail> = {
  'fullstack-dev': {
    id: 'fullstack-dev',
    title: 'The Fullstack Developer Path',
    description:
      'A structured curriculum that adapts in real-time. Your AI tutor injects targeted practice when it detects blind spots so you never hit a wall.',
    metaLabel: '108.4 hrs • Beginner • 94 Modules',
    modules: FULLSTACK_MODULES,
  },
  'backend-dev': {
    id: 'backend-dev',
    title: 'The Backend Developer Path',
    description:
      'Build production-grade backend systems with a progression that balances API architecture, data modeling, security, and reliability.',
    metaLabel: '88.1 hrs • Intermediate • 67 Modules',
    modules: BACKEND_MODULES,
  },
  'ai-engineer': {
    id: 'ai-engineer',
    title: 'The AI Engineer Path',
    description:
      'Go from fundamentals to deploying practical AI systems, with adaptive modules focused on prompt quality, retrieval accuracy, and agent workflows.',
    metaLabel: '45.2 hrs • Advanced • 42 Modules',
    modules: AI_MODULES,
  },
};
