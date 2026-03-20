import { Button } from '../ui/Button';

export function PathHeader() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl font-bold text-primary">
        The DSA & AI Engineer Path
      </h1>
      <p className="text-secondary text-lg mt-4 max-w-2xl leading-relaxed">
        A structured curriculum that adapts in real-time. Your AI tutor injects targeted practice when it detects blind spots — so you never hit a wall.
      </p>
      <div className="flex items-center gap-5 mt-8">
        <Button variant="primary" className="text-base px-7 py-3">
          Continue Learning
        </Button>
        <span className="font-mono text-[11px] text-muted tracking-wide">
          31.4 hrs • Intermediate • 24 Modules
        </span>
      </div>
    </div>
  );
}
