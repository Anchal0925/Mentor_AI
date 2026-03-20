import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export function ThinkingPattern() {
  return (
    <Card className="col-span-1 lg:col-span-3 border-l-[3px] border-l-accent-yellow">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="font-display font-semibold text-lg text-primary">Meta-Cognitive Analysis</h2>
        <Badge variant="NEW">AI GENERATED</Badge>
      </div>
      <p className="font-body text-[14px] leading-relaxed text-primary">
        You understand the theoretical concepts but struggle translating them to code efficiently. 
        You tend to write <span className="bg-accent-yellow/10 text-accent-yellow px-1 rounded font-mono text-[12px]">boilerplate before algorithmic logic</span>, which slows you down. 
        However, your <span className="bg-accent-yellow/10 text-accent-yellow px-1 rounded font-mono text-[12px]">boundary handling</span> (off-by-one errors) has improved significantly over the last 3 sessions. 
        You are strongest in the <span className="bg-accent-green/10 text-accent-green px-1 rounded font-mono text-[12px]">first 5 minutes</span> of a session — 
        your <span className="bg-accent-yellow/10 text-accent-yellow px-1 rounded font-mono text-[12px]">cognitive throughput</span> drops noticeably after the 20-minute mark, 
        correlating with increased <span className="bg-accent-red/10 text-accent-red px-1 rounded font-mono text-[12px]">delete-to-write ratio</span>. 
        Recommendation: practice short, focused 15-minute drills to build confidence before tackling complex problems.
      </p>
    </Card>
  );
}
