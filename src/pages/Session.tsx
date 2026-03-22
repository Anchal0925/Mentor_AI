import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import {
  ArrowLeft, Play, Send, ChevronDown, ChevronUp,
  FileCode2, X, Zap, Lightbulb, Sparkles, Terminal as TermIcon,
} from 'lucide-react';
import { Tabs } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { progress as progressApi, hintScore as hintScoreApi } from '../lib/api';
import { useUser } from '../context/UserContext';

/* ═══════════════════ MOCK DATA ═══════════════════ */

const PROBLEM = {
  title: 'Coin Change',
  difficulty: 'MEDIUM',
  topic: 'DYNAMIC PROGRAMMING',
  description: `You are given an integer array <code>coins</code> representing coins of different denominations and an integer <code>amount</code> representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return <code>-1</code>.\n\nYou may assume that you have an infinite number of each kind of coin.`,
  examples: [
    { input: 'coins = [1,5,11], amount = 15', output: '3', explanation: '15 = 5 + 5 + 5' },
    { input: 'coins = [2], amount = 3', output: '-1', explanation: '' },
  ],
  constraints: ['1 ≤ coins.length ≤ 12', '1 ≤ coins[i] ≤ 2³¹ - 1', '0 ≤ amount ≤ 10⁴'],
};

const STARTER_CODE = `def coinChange(coins, amount):
    # dp[i] = minimum coins needed
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0

    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)

    return dp[amount] if dp[amount] != float('inf') else -1
`;

interface Message { role: 'ai' | 'user'; text: string; memoryTag: boolean; }

const MOCK_MESSAGES: Message[] = [
  { role: 'ai', text: "I see you're working on Coin Change. This is a classic bottom-up DP problem. Take your time — I'm watching your approach.", memoryTag: true },
];

/* ═══════════════════ SESSION PAGE ═══════════════════ */

export default function Session() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { userId, refreshDashboard } = useUser();

  /* ── API session tracking ── */
  const [apiSessionId, setApiSessionId] = useState<string | null>(null);
  const hintsUsedRef  = useRef(0);
  const deletesRef    = useRef(0);
  const problemsDoneRef = useRef(0);

  // Start session on mount
  useEffect(() => {
    if (!userId) return;
    progressApi.startSession(userId, PROBLEM.topic)
      .then((s) => setApiSessionId(s.session_id))
      .catch(console.error);
  }, [userId]);

  const sessionId = id ?? 'new';

  /* ── Timer ── */
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  /* ── Left panel ── */
  const [leftTab, setLeftTab] = useState('problem');

  const [code, setCode] = useState(STARTER_CODE);
  const prevCodeLenRef = useRef(STARTER_CODE.length);
  const handleCodeChange = (val: string | undefined) => {
    const newCode = val ?? '';
    const diff = prevCodeLenRef.current - newCode.length;
    if (diff > 0) deletesRef.current += diff; // characters deleted
    prevCodeLenRef.current = newCode.length;
    setCode(newCode);
  };

  /* ── Console ── */
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);
  const [consoleTab, setConsoleTab] = useState('output');
  const [consoleOutput, setConsoleOutput] = useState<string | null>(null);

  const handleRunCode = () => {
    problemsDoneRef.current += 1;
    setIsConsoleOpen(true);
    setConsoleTab('output');
    setConsoleOutput('Running test cases...\n\n> Test 1: coins=[1,5,11], amount=15\n  Expected: 3\n  Got:      3  ✓\n\n> Test 2: coins=[2], amount=3\n  Expected: -1\n  Got:      -1  ✓\n\n-------------------------\nAll test cases passed.');
  };

  /* ── Chat state ── */
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [chatInput, setChatInput] = useState('');
  const [showNudge, setShowNudge] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fire nudge toast after 15 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowNudge(true), 15000);
    return () => clearTimeout(t);
  }, []);

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    // count as hint usage if asking for help
    const isHelpRequest = /hint|help|stuck|how/i.test(chatInput);
    if (isHelpRequest) hintsUsedRef.current += 1;
    setMessages((prev) => [
      ...prev,
      { role: 'user' as const, text: chatInput, memoryTag: false },
      { role: 'ai' as const, text: "Good question. The key insight is that each subproblem dp[i] only depends on previously computed values. This is why bottom-up tabulation works here — you build the answer from the smallest amounts upward.", memoryTag: false },
    ]);
    setChatInput('');
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const quickAction = (type: string) => {
    // Track hints
    if (type === 'hint') {
      hintsUsedRef.current += 1;
      if (userId && hintsUsedRef.current % 3 === 0) {
        // Update hint dependency score every 3 hints
        const score = Math.min(hintsUsedRef.current / 10, 1.0);
        hintScoreApi.update(userId, score).catch(console.error);
      }
    }
    const responses: Record<string, string> = {
      hint: "💡 Hint: Think about what dp[0] represents. If amount is 0, you need 0 coins. Build from there.",
      explain: "📖 Your current code uses bottom-up DP. dp[i] stores the minimum coins for amount i. For each amount, you try every coin denomination and take the minimum.",
      optimize: "⚡ Your solution is O(amount × coins.length) which is optimal for this approach. Space is O(amount). No further optimization needed.",
    };
    setMessages((prev) => [
      ...prev,
      { role: 'user' as const, text: type === 'hint' ? 'Give me a hint' : type === 'explain' ? 'Explain my code' : 'How can I optimize?', memoryTag: false },
      { role: 'ai' as const, text: responses[type] || '', memoryTag: type === 'explain' },
    ]);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  /* ── Submit: end session, persist stats, navigate to feedback ── */
  const handleSubmit = async () => {
    if (apiSessionId && userId) {
      try {
        await progressApi.endSession(apiSessionId, {
          problems_done: problemsDoneRef.current || 1,
          hints_used:    hintsUsedRef.current,
          deletes_made:  deletesRef.current,
        });
        await refreshDashboard();
      } catch (e) {
        console.error('Failed to end session', e);
      }
    }
    navigate(`/session/${sessionId}/feedback`);
  };

  /* ═══════════════════ RENDER ═══════════════════ */

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-primary">

      {/* ── PHASE 5.1: Session Top Bar ── */}
      <div className="h-[48px] bg-surface border-b border-border flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost-neutral" onClick={() => navigate('/problems')} className="text-xs px-3 py-1.5 h-7 flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" /> Exit
          </Button>
          <div className="w-px h-5 bg-border" />
          <span className="font-body font-medium text-primary text-sm">{PROBLEM.title}</span>
        </div>
        <span className="font-mono text-muted text-sm">{formatTime(seconds)}</span>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
          <span className="font-mono text-[10px] tracking-widest text-muted">MEMORY ACTIVE</span>
        </div>
      </div>

      {/* ── THE 3-PANEL GRID ── */}
      <div className="flex-1 grid grid-cols-[280px_1fr_300px] overflow-hidden">

        {/* ════ LEFT PANEL: Problem ════ */}
        <div className="bg-surface border-r border-border flex flex-col h-full overflow-hidden">
          <div className="border-b border-border px-4 pt-3">
            <Tabs
              tabs={[
                { id: 'problem', label: 'Problem' },
                { id: 'hints', label: 'Hints' },
                { id: 'explanation', label: 'Explanation' },
              ]}
              activeTab={leftTab}
              onChange={setLeftTab}
              variant="flat"
            />
          </div>
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="NEW">{PROBLEM.difficulty}</Badge>
              <Badge variant="TOPIC">{PROBLEM.topic}</Badge>
            </div>

            {leftTab === 'problem' && (
              <>
                <div
                  className="font-body text-[13px] leading-relaxed text-secondary [&_code]:bg-elevated [&_code]:border [&_code]:border-border [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-accent-green [&_code]:font-mono [&_code]:text-[12px]"
                  dangerouslySetInnerHTML={{ __html: PROBLEM.description.replace(/\n/g, '<br/>') }}
                />
                <div className="mt-6 flex flex-col gap-4">
                  {PROBLEM.examples.map((ex, i) => (
                    <div key={i}>
                      <p className="font-mono text-[10px] text-muted uppercase tracking-wider mb-1">Example {i + 1}</p>
                      <div className="bg-elevated border border-border rounded-lg p-3 font-mono text-[12px] text-primary whitespace-pre-wrap">
                        <span className="text-muted">Input:  </span>{ex.input}{'\n'}
                        <span className="text-muted">Output: </span>{ex.output}
                        {ex.explanation && (<>{'\n'}<span className="text-muted">Explain: </span>{ex.explanation}</>)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <p className="font-mono text-[10px] text-muted uppercase tracking-wider mb-2">Constraints</p>
                  <ul className="flex flex-col gap-1">
                    {PROBLEM.constraints.map((c, i) => (
                      <li key={i} className="font-mono text-[12px] text-secondary">• {c}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
            {leftTab === 'hints' && (
              <p className="text-secondary text-sm">Think about building the answer from the smallest subproblem. What's the base case?</p>
            )}
            {leftTab === 'explanation' && (
              <p className="text-secondary text-sm">Submit your solution first to unlock the full explanation.</p>
            )}
          </div>
        </div>

        {/* ════ CENTER PANEL: Monaco + Console ════ */}
        <div className="flex flex-col h-full min-w-0 bg-code">
          {/* VS Code Tab Bar */}
          <div className="h-[40px] bg-surface border-b border-border flex items-center pl-2 shrink-0">
            <div className="flex items-center gap-2 px-4 py-2 bg-code border-t-2 border-t-accent-green text-primary text-[13px] font-mono h-full">
              <FileCode2 className="w-3.5 h-3.5 text-accent-green" />
              <span>solution.py</span>
              <button className="ml-2 text-muted hover:text-primary p-0.5 rounded hover:bg-white/10 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* The Editor */}
          <div className="flex-1 relative min-h-0">
            <Editor
              defaultLanguage="python"
              value={code}
              onChange={handleCodeChange}
              theme="mentormind-dark"
              beforeMount={(monaco) => {
                monaco.editor.defineTheme('mentormind-dark', {
                  base: 'vs-dark',
                  inherit: true,
                  rules: [],
                  colors: {
                    'editor.background': '#0a0a0f',
                    'editor.lineHighlightBackground': '#ffffff08',
                    'editorLineNumber.foreground': '#3a3a50',
                    'editorLineNumber.activeForeground': '#888',
                    'editor.selectionBackground': '#2f8f4e33',
                    'editorCursor.foreground': '#4ade80',
                  },
                });
              }}
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', monospace",
                fontLigatures: true,
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                padding: { top: 16 },
                renderLineHighlight: 'line',
                cursorBlinking: 'smooth',
                smoothScrolling: true,
                automaticLayout: true,
              }}
            />
          </div>

          {/* Bottom Action Bar */}
          <div className="h-[56px] bg-surface border-t border-border flex items-center justify-between px-4 shrink-0">
            <Button variant="primary" onClick={handleRunCode} className="text-sm px-4 py-2 h-9 flex items-center gap-2">
              <Play className="w-4 h-4 fill-current" /> Run Code
            </Button>
            <span className="font-mono text-[11px] text-muted hidden md:block">⌘ + Enter to Run</span>
            <Button
              variant="ghost-green"
              className="text-sm px-5 py-2 h-9"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>

          {/* Collapsible Console */}
          <AnimatePresence initial={false}>
            {isConsoleOpen && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 200 }}
                exit={{ height: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="bg-primary border-t border-border flex flex-col overflow-hidden shrink-0"
              >
                <div className="h-9 bg-surface border-b border-border flex items-center justify-between px-4 shrink-0">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setConsoleTab('testcases')}
                      className={`text-xs font-mono ${consoleTab === 'testcases' ? 'text-primary' : 'text-muted hover:text-secondary'}`}
                    >
                      Test Cases
                    </button>
                    <button
                      onClick={() => setConsoleTab('output')}
                      className={`text-xs font-mono ${consoleTab === 'output' ? 'text-primary' : 'text-muted hover:text-secondary'}`}
                    >
                      Output
                    </button>
                  </div>
                  <button onClick={() => setIsConsoleOpen(false)} className="text-muted hover:text-primary">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 font-mono text-[12px]">
                  {consoleOutput ? (
                    <pre className="whitespace-pre-wrap">
                      {consoleOutput.split('\n').map((line, i) => (
                        <div key={i} className={
                          line.includes('✓') ? 'text-accent-teal' :
                          line.includes('✗') ? 'text-accent-red' :
                          line.includes('---') ? 'text-muted' :
                          line.includes('passed') ? 'text-accent-green' :
                          'text-secondary'
                        }>
                          {line}
                        </div>
                      ))}
                    </pre>
                  ) : (
                    <span className="text-muted">Run your code to see output here.</span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {!isConsoleOpen && (
            <button
              onClick={() => setIsConsoleOpen(true)}
              className="h-7 bg-surface border-t border-border flex items-center justify-center text-muted hover:text-primary shrink-0"
            >
              <ChevronUp className="w-4 h-4" />
              <span className="font-mono text-[10px] ml-1">Console</span>
            </button>
          )}
        </div>

        {/* ════ RIGHT PANEL: AI Tutor ════ */}
        <div className="bg-surface border-l border-border flex flex-col h-full relative overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-border shrink-0">
            <h2 className="font-display font-semibold text-primary">AI Mentor</h2>
          </div>

          {/* Chat Feed */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 relative custom-scrollbar">
            {/* Nudge Toast Overlay */}
            <AnimatePresence>
              {showNudge && (
                <motion.div
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 100, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="sticky top-0 z-10 bg-elevated border border-border border-l-[3px] border-l-accent-green rounded-lg p-3 mb-2"
                >
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-accent-yellow shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-[12px] text-primary font-body leading-relaxed">
                        You've been paused on this section for 40s. Consider breaking the problem into smaller subproblems first.
                      </p>
                      <button
                        onClick={() => setShowNudge(false)}
                        className="text-[10px] font-mono text-muted hover:text-secondary mt-1"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`relative rounded-lg p-3 text-[13px] font-body leading-relaxed ${
                  msg.role === 'ai'
                    ? 'bg-accent-green-bg border border-accent-green/20 text-primary'
                    : 'bg-elevated border border-border text-primary self-end max-w-[85%]'
                }`}
              >
                {msg.memoryTag && msg.role === 'ai' && (
                  <div className="absolute top-2 right-2">
                    <span className="font-mono text-[9px] text-accent-yellow border border-accent-yellow/30 rounded px-1.5 py-0.5 bg-accent-yellow/10">
                      ⚡ from memory
                    </span>
                  </div>
                )}
                <p className={msg.memoryTag && msg.role === 'ai' ? 'pr-20' : ''}>{msg.text}</p>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Pinned Bottom Input Area */}
          <div className="p-4 bg-surface border-t border-border flex flex-col gap-2 shrink-0">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => quickAction('hint')}
                className="flex items-center justify-center gap-1.5 py-2 bg-elevated border border-border rounded-md text-[11px] text-secondary hover:border-border-hover hover:text-primary transition-colors font-mono"
              >
                <Lightbulb className="w-3 h-3" /> Hint
              </button>
              <button
                onClick={() => quickAction('explain')}
                className="flex items-center justify-center gap-1.5 py-2 bg-elevated border border-border rounded-md text-[11px] text-secondary hover:border-border-hover hover:text-primary transition-colors font-mono"
              >
                <Sparkles className="w-3 h-3" /> Explain
              </button>
              <button
                onClick={() => quickAction('optimize')}
                className="flex items-center justify-center gap-1.5 py-2 bg-elevated border border-border rounded-md text-[11px] text-secondary hover:border-border-hover hover:text-primary transition-colors font-mono"
              >
                <Zap className="w-3 h-3" /> Optimize
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask MentorMind..."
                className="w-full h-10 bg-elevated border border-border rounded-lg pl-4 pr-10 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent-green transition-colors font-body"
              />
              <button
                onClick={sendMessage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted hover:text-accent-green transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
