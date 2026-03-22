import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { TimelineSlider, type ReplayMarker } from '../components/replay/TimelineSlider';

type ReplayEventType = 'pause' | 'compile_error' | 'nudge' | 'hint' | 'success';

interface ReplayEvent {
  time: number;
  type: ReplayEventType;
  desc: string;
}

const TOTAL_DURATION_SECONDS = 760;

const mockReplayEvents: ReplayEvent[] = [
  { time: 45, type: 'pause', desc: 'Paused for 42s on line 8' },
  { time: 120, type: 'compile_error', desc: 'SyntaxError: Unexpected token' },
  { time: 125, type: 'nudge', desc: 'AI intervened: "Check your closing brackets."' },
  { time: 300, type: 'hint', desc: 'Requested Hint #1' },
  { time: 450, type: 'success', desc: 'All test cases passed' },
];

const mockCodeSnapshots = [
  {
    time: 0,
    code: `def coinChange(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0

    for i in range(1, amount + 1):
        for coin in coins:
            pass`,
  },
  {
    time: 110,
    code: `def coinChange(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0

    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)`,
  },
  {
    time: 260,
    code: `def coinChange(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0

    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)

    return dp[amount] if dp[amount] != float('inf') else -1`,
  },
];

const eventColorMap: Record<ReplayEventType, string> = {
  pause: 'bg-accent-yellow',
  compile_error: 'bg-accent-red',
  nudge: 'bg-accent-green',
  hint: 'bg-accent-blue',
  success: 'bg-accent-teal',
};

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `[${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}]`;
}

export default function SessionReplay() {
  const navigate = useNavigate();
  const { id } = useParams();
  const sessionId = id ?? 'new';

  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<1 | 2 | 4>(1);

  useEffect(() => {
    if (!isPlaying) return;
    const tickMs = 250;
    const interval = window.setInterval(() => {
      setCurrentTime((previous) => Math.min(previous + (tickMs / 1000) * speed, TOTAL_DURATION_SECONDS));
    }, tickMs);
    return () => window.clearInterval(interval);
  }, [isPlaying, speed]);

  useEffect(() => {
    if (currentTime >= TOTAL_DURATION_SECONDS && isPlaying) {
      setIsPlaying(false);
    }
  }, [currentTime, isPlaying]);

  const activeCode = useMemo(() => {
    let snapshot = mockCodeSnapshots[0].code;
    for (const item of mockCodeSnapshots) {
      if (currentTime >= item.time) snapshot = item.code;
      if (currentTime < item.time) break;
    }
    return snapshot;
  }, [currentTime]);

  const markers = useMemo<ReplayMarker[]>(() => {
    const timelineMarkers: ReplayMarker[] = [];
    mockReplayEvents.forEach((event, index) => {
      if (event.type === 'pause' || event.type === 'compile_error' || event.type === 'nudge') {
        timelineMarkers.push({
          id: `marker-${index}`,
          time: event.time,
          type: event.type,
          tooltip: event.desc,
        });
      }
    });
    return timelineMarkers;
  }, []);

  const handleTogglePlay = () => {
    if (currentTime >= TOTAL_DURATION_SECONDS) {
      setCurrentTime(0);
      setIsPlaying(true);
      return;
    }
    setIsPlaying((previous) => !previous);
  };

  return (
    <div className="h-screen w-screen bg-primary overflow-hidden flex flex-col relative">
      <div className="h-[48px] bg-surface border-b border-border flex items-center justify-between px-4 shrink-0">
        <button
          onClick={() => navigate(`/session/${sessionId}/feedback`)}
          className="h-8 px-3 text-xs rounded-md border border-border text-secondary hover:text-primary hover:border-border-hover transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Feedback
        </button>

        <span className="h-7 px-3 inline-flex items-center rounded border border-accent-yellow/30 text-accent-yellow font-mono text-[10px] tracking-wider">
          SESSION REPLAY - READ ONLY
        </span>

        <div className="flex items-center gap-1">
          {[1, 2, 4].map((option) => (
            <button
              key={option}
              onClick={() => setSpeed(option as 1 | 2 | 4)}
              className={`h-7 px-2.5 rounded border text-[11px] font-mono transition-colors ${
                speed === option
                  ? 'bg-accent-green text-black border-accent-green'
                  : 'bg-elevated text-secondary border-border hover:border-border-hover hover:text-primary'
              }`}
            >
              {option}x
            </button>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 min-h-0 grid grid-cols-[1fr_300px] pb-[64px]"
      >
        <div className="bg-code min-w-0">
          <Editor
            defaultLanguage="python"
            value={activeCode}
            theme="mentormind-replay"
            beforeMount={(monaco) => {
              monaco.editor.defineTheme('mentormind-replay', {
                base: 'vs-dark',
                inherit: true,
                rules: [],
                colors: {
                  'editor.background': '#050505',
                  'editor.lineHighlightBackground': '#ffffff08',
                  'editorLineNumber.foreground': '#3a3a50',
                  'editorLineNumber.activeForeground': '#888',
                  'editor.selectionBackground': '#2f8f4e33',
                  'editorCursor.foreground': '#4ade80',
                },
              });
            }}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "'JetBrains Mono', monospace",
              fontLigatures: true,
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              automaticLayout: true,
              padding: { top: 16 },
            }}
          />
        </div>

        <div className="w-[300px] bg-surface border-l border-border flex flex-col">
          <div className="h-[48px] px-4 border-b border-border flex items-center">
            <h2 className="font-display text-sm text-primary">Session Events</h2>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-0">
            {mockReplayEvents.map((event, index) => (
              <div key={`${event.type}-${event.time}`} className="relative pl-6 py-3 border-l border-border">
                <div className={`absolute -left-[5px] top-[18px] w-[10px] h-[10px] rounded-full ${eventColorMap[event.type]}`} />
                <p className="font-mono text-[10px] text-muted">{formatTime(event.time)}</p>
                <p className="mt-1 text-[12px] text-primary leading-relaxed">{event.desc}</p>
                {index === mockReplayEvents.length - 1 ? <div className="absolute left-[-1px] bottom-0 w-px h-3 bg-surface" /> : null}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <TimelineSlider
        currentTime={currentTime}
        totalTime={TOTAL_DURATION_SECONDS}
        isPlaying={isPlaying}
        markers={markers}
        onTogglePlay={handleTogglePlay}
        onSeek={(timeInSeconds) => setCurrentTime(Math.max(0, Math.min(timeInSeconds, TOTAL_DURATION_SECONDS)))}
      />
    </div>
  );
}
