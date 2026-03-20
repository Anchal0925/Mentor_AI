import { Button } from '../ui/Button';

interface PathHeaderProps {
  title: string;
  description: string;
  metaLabel: string;
}

export function PathHeader({ title, description, metaLabel }: PathHeaderProps) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl font-bold text-primary">{title}</h1>
      <p className="text-secondary text-lg mt-4 max-w-2xl leading-relaxed">
        {description}
      </p>
      <div className="flex items-center gap-5 mt-8">
        <Button variant="primary" className="text-base px-7 py-3">
          Continue Learning
        </Button>
        <span className="font-mono text-[11px] text-muted tracking-wide">
          {metaLabel}
        </span>
      </div>
    </div>
  );
}
