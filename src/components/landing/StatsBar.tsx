const stats = [
  { value: '2,400+', label: 'Practice Problems' },
  { value: '10k+', label: 'Active Students' },
  { value: '94%', label: 'See Improvement' },
  { value: '#1', label: 'AI Coding Tutor' },
];

export function StatsBar() {
  return (
    <div className="border-t border-b border-border bg-surface py-6 px-6">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-around gap-8">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-1">
            <span className="font-display font-bold text-2xl text-primary">{s.value}</span>
            <span className="font-mono text-[11px] text-muted uppercase tracking-widest">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
