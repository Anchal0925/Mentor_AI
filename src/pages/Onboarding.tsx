import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Server, Layout, Brain, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useUser } from '../context/UserContext';
import { weakAreas as weakAreasApi, gapAnalysis as gapAnalysisApi } from '../lib/api';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';

/* ─── QUESTION BANK ─── */
const QUESTIONS = [
  { title: 'Two Sum', description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.', startingCode: 'def two_sum(nums, target):\n    # Write your solution here\n    pass', difficulty: 'Easy' },
  { title: 'Valid Parentheses', description: 'Given a string s containing just the characters (){}[], determine if the input string is valid.', startingCode: 'def is_valid(s):\n    # Write your solution here\n    pass', difficulty: 'Easy' },
  { title: 'Reverse Linked List', description: 'Given the head of a singly linked list, reverse the list and return its head.', startingCode: 'def reverse_list(head):\n    # Write your solution here\n    pass', difficulty: 'Easy' },
  { title: 'Binary Search', description: 'Given a sorted array of integers and a target value, return the index if found. Otherwise return -1.', startingCode: 'def search(nums, target):\n    # Write your solution here\n    pass', difficulty: 'Easy' },
  { title: 'Max Depth of Binary Tree', description: 'Given the root of a binary tree, return its maximum depth.', startingCode: 'def max_depth(root):\n    # Write your solution here\n    pass', difficulty: 'Easy' },
  { title: 'Merge Two Sorted Lists', description: 'You are given the heads of two sorted linked lists. Merge them into one sorted list.', startingCode: 'def merge_two_lists(l1, l2):\n    # Write your solution here\n    pass', difficulty: 'Easy' },
  { title: 'Climbing Stairs', description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?', startingCode: 'def climb_stairs(n):\n    # Write your solution here\n    pass', difficulty: 'Medium' },
  { title: 'Container With Most Water', description: 'Given n non-negative integers where each represents a vertical line, find two lines that together with the x-axis contain the most water.', startingCode: 'def max_area(height):\n    # Write your solution here\n    pass', difficulty: 'Medium' },
  { title: 'Longest Substring Without Repeating Characters', description: 'Given a string s, find the length of the longest substring without repeating characters.', startingCode: 'def length_of_longest_substring(s):\n    # Write your solution here\n    pass', difficulty: 'Medium' },
  { title: 'Group Anagrams', description: 'Given an array of strings strs, group the anagrams together. You can return the answer in any order.', startingCode: 'def group_anagrams(strs):\n    # Write your solution here\n    pass', difficulty: 'Medium' },
];

/* ─── TRACK SELECTIONS ─── */
const TRACKS = [
  { id: 'dsa', label: 'DSA Online', desc: 'Arrays, Trees, Graphs, DP…', icon: Code2 },
  { id: 'sysdesign', label: 'System Design', desc: 'Scalable architectures', icon: Server },
  { id: 'frontend', label: 'Frontend Dev', desc: 'React, CSS, Accessibility', icon: Layout },
  { id: 'ai-ml', label: 'AI / ML', desc: 'Models, training, inference', icon: Brain },
];

/* ─── GENESIS GRAPH NODES ─── */
const GENESIS_NODES = [
  { label: 'Arrays', cx: 200, cy: 100, color: 'var(--accent-green)' },
  { label: 'Recursion', cx: 400, cy: 80, color: 'var(--accent-red)' },
  { label: 'DP', cx: 350, cy: 220, color: 'var(--accent-yellow)' },
  { label: 'Pointers', cx: 150, cy: 230, color: 'var(--accent-teal)' },
  { label: 'Hashing', cx: 300, cy: 150, color: 'var(--accent-green)' },
];

const GENESIS_EDGES = [
  [0, 4], [1, 4], [2, 4], [3, 0], [1, 2],
];

const TERMINAL_LINES = [
  '> Analyzing 10 code snapshots...',
  '> Extracting behavioral fingerprints...',
  '> [ SYSTEM ] Baseline established. 5 concepts mapped.',
  '> Routing to Second Brain Dashboard...',
];

/* ═══════════════════════════════════════════════════ */

export default function Onboarding() {
  const navigate = useNavigate();
  const { userId } = useUser();
  // step: 'calibrate' | 'assess' | 'genesis'
  const [step, setStep] = useState<'calibrate' | 'assess' | 'genesis'>('calibrate');

  /* ── Calibration state ── */
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);

  /* ── Assessment state ── */
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [codeValue, setCodeValue] = useState(QUESTIONS[0].startingCode);
  const [showSkipModal, setShowSkipModal] = useState(false);

  /* ── Genesis state ── */
  const [terminalIndex, setTerminalIndex] = useState(0);

  /* ── Helpers ── */
  const advanceQuestion = useCallback(() => {
    const next = currentQuestion + 1;
    if (next >= QUESTIONS.length) {
      setStep('genesis');
    } else {
      setCurrentQuestion(next);
      setCodeValue(QUESTIONS[next].startingCode);
    }
  }, [currentQuestion]);

  /* ── Seed initial weak areas + gap analysis after assessment ── */
  const seedInitialAnalysis = useCallback(async (uid: string) => {
    const initialWeakAreas = [
      { topic: 'Recursion',    score: 40, attempts: 2 },
      { topic: 'Dynamic Programming', score: 35, attempts: 3 },
      { topic: 'Trees',        score: 55, attempts: 2 },
      { topic: 'Graphs',       score: 30, attempts: 1 },
      { topic: 'Hash Maps',    score: 70, attempts: 4 },
    ];
    try {
      await weakAreasApi.upsertBulk(uid, initialWeakAreas);
      await gapAnalysisApi.create(
        uid,
        "Welcome! Based on your assessment, you show strength in Hash Maps but need focused work on Dynamic Programming and Graphs. I've queued a personalised path starting with foundational recursion problems.",
        ['Recursion', 'Dynamic Programming', 'Graphs'],
      );
    } catch (e) {
      console.error('Failed to seed initial analysis', e);
    }
  }, []);

  /* ── Genesis auto-typing terminal + redirect ── */
  useEffect(() => {
    if (step !== 'genesis') return;
    if (terminalIndex < TERMINAL_LINES.length) {
      const t = setTimeout(() => setTerminalIndex((i) => i + 1), 900);
      return () => clearTimeout(t);
    } else {
      // Seed initial data then navigate
      const t = setTimeout(async () => {
        if (userId) await seedInitialAnalysis(userId);
        navigate('/dashboard');
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [step, terminalIndex, navigate, userId, seedInitialAnalysis]);

  /* ═══════════════════════════════ RENDER ═══════════════════════════════ */

  return (
    <div className="min-h-screen bg-primary text-primary flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">

      <AnimatePresence mode="wait">

        {/* ───────────── STEP 1: CALIBRATION ───────────── */}
        {step === 'calibrate' && (
          <motion.div
            key="calibrate"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-3xl flex flex-col items-center gap-10"
          >
            <div className="text-center">
              <p className="font-mono text-[11px] text-accent-green uppercase tracking-widest mb-3">Step 1 of 3</p>
              <h1 className="font-display font-extrabold text-4xl md:text-5xl text-primary">
                What are you mastering?
              </h1>
              <p className="text-secondary mt-3 text-lg">Pick a track so your AI tutor knows where to focus.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {TRACKS.map((track) => {
                const isSelected = selectedTrack === track.id;
                const Icon = track.icon;
                return (
                  <Card
                    key={track.id}
                    interactive
                    isActive={isSelected}
                    onClick={() => setSelectedTrack(track.id)}
                    className={`cursor-pointer flex items-start gap-4 ${
                      isSelected ? 'border-accent-green bg-accent-green-bg' : ''
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-accent-green/20' : 'bg-border/40'
                    }`}>
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-accent-green' : 'text-muted'}`} />
                    </div>
                    <div>
                      <p className="font-display font-semibold text-primary">{track.label}</p>
                      <p className="text-sm text-secondary mt-0.5">{track.desc}</p>
                    </div>
                  </Card>
                );
              })}
            </div>

            <Button
              variant="primary"
              disabled={!selectedTrack}
              onClick={() => setStep('assess')}
              className="px-8 py-3 text-base disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue <ChevronRight className="w-4 h-4 ml-1 inline" />
            </Button>
          </motion.div>
        )}

        {/* ───────────── STEP 2: MICRO-IDE ASSESSMENT ───────────── */}
        {step === 'assess' && (
          <motion.div
            key="assess"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-5xl flex flex-col items-center gap-6"
          >
            <div className="text-center">
              <p className="font-mono text-[11px] text-accent-green uppercase tracking-widest mb-2">Step 2 of 3 — Baseline Assessment</p>
              <h2 className="font-display font-bold text-2xl text-primary">
                Show us how you think.
              </h2>
              <p className="text-sm text-secondary mt-1">
                Solve (or attempt) 10 quick problems. We track your patterns, not just correctness.
              </p>
            </div>

            {/* Micro-IDE container */}
            <div className="w-full bg-surface border border-border rounded-xl overflow-hidden flex flex-col md:flex-row" style={{ height: 520 }}>
              {/* LEFT — Problem panel */}
              <div className="md:w-[35%] border-r border-border p-6 flex flex-col gap-4 overflow-y-auto">
                <p className="font-mono text-accent-green text-[10px] uppercase tracking-widest">
                  Question {currentQuestion + 1} of {QUESTIONS.length}
                </p>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-xl text-primary">{QUESTIONS[currentQuestion].title}</h3>
                  <span className={`font-mono text-[10px] px-2 py-0.5 rounded border ${
                    QUESTIONS[currentQuestion].difficulty === 'Easy'
                      ? 'text-accent-green border-accent-green/30 bg-accent-green/10'
                      : 'text-accent-yellow border-accent-yellow/30 bg-accent-yellow/10'
                  }`}>
                    {QUESTIONS[currentQuestion].difficulty}
                  </span>
                </div>
                <p className="text-secondary text-sm leading-relaxed">
                  {QUESTIONS[currentQuestion].description}
                </p>

                {/* Progress dots */}
                <div className="mt-auto flex items-center gap-1.5 pt-4 border-t border-border">
                  {QUESTIONS.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i < currentQuestion ? 'bg-accent-green' : i === currentQuestion ? 'bg-accent-green/50 ring-2 ring-accent-green/30' : 'bg-border'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* RIGHT — Code editor */}
              <div className="md:w-[65%] bg-code flex flex-col">
                <div className="h-9 bg-surface border-b border-border flex items-center px-4 gap-2 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent-red/50" />
                  <span className="w-2.5 h-2.5 rounded-full bg-accent-yellow/50" />
                  <span className="w-2.5 h-2.5 rounded-full bg-accent-green/50" />
                  <span className="font-mono text-[11px] text-muted ml-3">solution.py</span>
                </div>
                <div className="flex-1 p-0">
                  <textarea
                    value={codeValue}
                    onChange={(e) => setCodeValue(e.target.value)}
                    className="w-full h-full bg-transparent text-primary font-mono text-[13px] leading-6 p-4 resize-none focus:outline-none"
                    spellCheck={false}
                  />
                </div>
              </div>
            </div>

            {/* Bottom action bar */}
            <div className="w-full flex items-center justify-between">
              <Button variant="ghost-neutral" onClick={() => setShowSkipModal(true)} className="text-sm px-5 py-2">
                Skip Question
              </Button>
              <Button variant="primary" onClick={advanceQuestion} className="text-sm px-6 py-2.5">
                {currentQuestion === QUESTIONS.length - 1 ? 'Finish Assessment' : 'Submit & Next'}
              </Button>
            </div>

            {/* Skip confirmation modal */}
            <Modal isOpen={showSkipModal} onClose={() => setShowSkipModal(false)} title="Skip this question?">
              <p className="text-secondary text-sm leading-relaxed mb-6">
                Are you sure? For the best experience and to accurately build your initial Second Brain, try to attempt the test. You can write pseudo-code if you're stuck.
              </p>
              <div className="flex items-center gap-3 justify-end">
                <Button variant="ghost-green" onClick={() => setShowSkipModal(false)} className="text-sm px-5 py-2">
                  I'll Try
                </Button>
                <Button
                  variant="ghost-neutral"
                  onClick={() => {
                    setShowSkipModal(false);
                    advanceQuestion();
                  }}
                  className="text-sm px-5 py-2"
                >
                  Skip Anyway
                </Button>
              </div>
            </Modal>
          </motion.div>
        )}

        {/* ───────────── STEP 3: GENESIS TRANSITION ───────────── */}
        {step === 'genesis' && (
          <motion.div
            key="genesis"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-10"
          >
            <p className="font-mono text-[11px] text-accent-green uppercase tracking-widest">Building Your Second Brain</p>

            {/* SVG Network Graph */}
            <svg viewBox="0 0 500 320" className="w-full max-w-lg h-auto">
              {/* Edges */}
              {GENESIS_EDGES.map(([a, b], i) => (
                <motion.line
                  key={`edge-${i}`}
                  x1={GENESIS_NODES[a].cx}
                  y1={GENESIS_NODES[a].cy}
                  x2={GENESIS_NODES[b].cx}
                  y2={GENESIS_NODES[b].cy}
                  stroke="var(--border)"
                  strokeWidth={1.5}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.3 + i * 0.25, ease: 'easeOut' }}
                />
              ))}

              {/* Nodes */}
              {GENESIS_NODES.map((node, i) => (
                <g key={node.label}>
                  <motion.circle
                    cx={node.cx}
                    cy={node.cy}
                    r={22}
                    fill="var(--bg-elevated)"
                    strokeWidth={2}
                    initial={{ scale: 0, opacity: 0, stroke: 'var(--border)' }}
                    animate={{ scale: 1, opacity: 1, stroke: node.color }}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.3, type: 'spring', stiffness: 200, damping: 20 }}
                  />
                  <motion.text
                    x={node.cx}
                    y={node.cy + 4}
                    textAnchor="middle"
                    fill="var(--text-secondary)"
                    className="font-mono"
                    fontSize={9}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 + i * 0.3 }}
                  >
                    {node.label}
                  </motion.text>
                </g>
              ))}
            </svg>

            {/* Terminal output */}
            <div className="w-full max-w-lg bg-elevated border border-border rounded-lg p-4 font-mono text-[12px] leading-6 min-h-[120px]">
              {TERMINAL_LINES.slice(0, terminalIndex).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`${
                    line.includes('[ SYSTEM ]') ? 'text-accent-green' : 'text-muted'
                  }`}
                >
                  {line}
                </motion.div>
              ))}
              {terminalIndex < TERMINAL_LINES.length && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-2 h-4 bg-accent-green align-middle"
                />
              )}
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
