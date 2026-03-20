import { AlertTriangle, Cpu, Zap } from 'lucide-react';

const features = [
  {
    id: 'live-capture',
    icon: Cpu,
    title: 'Live Capture',
    subtitle: 'Watches every keystroke, pause, and backspace.',
    card: {
      label: 'LIVE SESSION LOG',
      lines: [
        { text: '> 3 backspaces on line 7 — hesitation detected', color: 'text-accent-yellow' },
        { text: '> Solution approach: Brute Force (O(N²))', color: 'text-secondary' },
        { text: '> Better pattern available: Hash Map →', color: 'text-accent-green' },
      ],
    },
  },
  {
    id: 'fingerprint',
    icon: AlertTriangle,
    title: 'Bug Fingerprinting',
    subtitle: 'Maps your recurring blind spots across every session.',
    card: {
      label: 'BEHAVIORAL FLAGS',
      lines: [
        { text: '⚠ Approach Confusion — 3 sessions', color: 'text-accent-red' },
        { text: '⚠ Slow Translation — 2 sessions', color: 'text-accent-yellow' },
        { text: '✓ Edge Case Mastery — improving', color: 'text-accent-green' },
      ],
    },
  },
  {
    id: 'nudges',
    icon: Zap,
    title: 'Context-Aware Nudges',
    subtitle: 'AI interrupts only when it matters — not on every line.',
    card: {
      label: 'AI MENTOR',
      lines: [
        { text: 'You paused for 45s on the loop.', color: 'text-secondary' },
        { text: 'Last session you solved this with a dict. Try that first.', color: 'text-primary' },
      ],
    },
  },
];

export function StickyScrollFeatures() {
  return (
    <section className="py-32 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-20">
        <p className="font-mono text-[11px] text-accent-green uppercase tracking-widest mb-4">How It Works</p>
        <h2 className="font-display font-extrabold text-4xl md:text-5xl text-primary">
          Not just a linter. A tutor<br />that remembers you.
        </h2>
      </div>

      <div className="flex flex-col gap-32">
        {features.map((feat, i) => {
          const Icon = feat.icon;
          const isReversed = i % 2 !== 0;
          return (
            <div
              key={feat.id}
              className={`flex flex-col md:flex-row items-center gap-12 ${isReversed ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Text side */}
              <div className="flex-1 flex flex-col gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent-green-bg border border-accent-green/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-accent-green" />
                </div>
                <h3 className="font-display font-bold text-2xl md:text-3xl text-primary">
                  {feat.title}
                </h3>
                <p className="text-secondary text-lg leading-relaxed max-w-sm">
                  {feat.subtitle}
                </p>
              </div>

              {/* Card side */}
              <div className="flex-1 w-full bg-elevated border border-border rounded-xl p-6 font-mono">
                <p className="text-[10px] text-muted uppercase tracking-widest mb-4 border-b border-border pb-3">
                  {feat.card.label}
                </p>
                <div className="flex flex-col gap-3">
                  {feat.card.lines.map((line, li) => (
                    <div key={li} className={`text-[13px] leading-relaxed ${line.color}`}>
                      {line.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
