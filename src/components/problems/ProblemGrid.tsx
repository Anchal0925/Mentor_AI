import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface Problem {
  id: number;
  title: string;
  desc: string;
  topic: string;
  diff: string;
  diffColor: string;
  time: string;
  tag?: string;
}

const ALL_PROBLEMS: Problem[] = [
  { id: 1, title: 'Two Sum', desc: 'Return indices of two numbers that add up to target.', topic: 'ARRAYS', diff: 'Easy', diffColor: 'text-accent-green', time: '~15m' },
  { id: 2, title: 'Valid Parentheses', desc: 'Determine if the input string of brackets is valid.', topic: 'STACK', diff: 'Easy', diffColor: 'text-accent-green', time: '~12m' },
  { id: 3, title: 'Container With Most Water', desc: 'Find two lines that contain the most water.', topic: 'TWO POINTERS', diff: 'Medium', diffColor: 'text-accent-yellow', time: '~25m' },
  { id: 4, title: 'Longest Substring', desc: 'Find the longest substring without repeating characters.', topic: 'SLIDING WINDOW', diff: 'Medium', diffColor: 'text-accent-yellow', time: '~30m' },
  { id: 5, title: 'Search in Rotated Array', desc: 'Find the target in a rotated sorted array in O(log n).', topic: 'BINARY SEARCH', diff: 'Medium', diffColor: 'text-accent-yellow', time: '~25m' },
  { id: 6, title: 'Merge K Sorted Lists', desc: 'Merge k sorted linked lists into one sorted list.', topic: 'LINKED LIST', diff: 'Hard', diffColor: 'text-accent-red', time: '~45m', tag: 'HOT' },
  { id: 7, title: 'Binary Tree Level Order', desc: 'Return the level order traversal of a binary tree.', topic: 'TREES', diff: 'Medium', diffColor: 'text-accent-yellow', time: '~20m' },
  { id: 8, title: 'Implement Trie', desc: 'Implement a trie with insert, search, and startsWith.', topic: 'TRIES', diff: 'Medium', diffColor: 'text-accent-yellow', time: '~30m' },
  { id: 9, title: 'Combination Sum', desc: 'Find all unique combinations that sum to a target.', topic: 'BACKTRACKING', diff: 'Medium', diffColor: 'text-accent-yellow', time: '~25m' },
  { id: 10, title: 'Climbing Stairs', desc: 'Count distinct ways to climb n steps taking 1 or 2.', topic: 'DP', diff: 'Easy', diffColor: 'text-accent-green', time: '~10m' },
  { id: 11, title: 'Coin Change', desc: 'Find the fewest coins needed to make up a given amount.', topic: 'DP', diff: 'Medium', diffColor: 'text-accent-yellow', time: '~30m' },
  { id: 12, title: 'Word Search', desc: 'Search for a word in a 2D board of characters.', topic: 'BACKTRACKING', diff: 'Medium', diffColor: 'text-accent-yellow', time: '~35m', tag: 'NEW' },
];

interface ProblemGridProps {
  searchFilter: string;
  topicFilter: string;
  difficultyFilter: string;
}

export function ProblemGrid({ searchFilter, topicFilter, difficultyFilter }: ProblemGridProps) {
  const filtered = ALL_PROBLEMS.filter((p) => {
    if (searchFilter && !p.title.toLowerCase().includes(searchFilter.toLowerCase())) return false;
    if (topicFilter !== 'All' && p.topic !== topicFilter.toUpperCase()) return false;
    if (difficultyFilter !== 'all' && p.diff.toLowerCase() !== difficultyFilter) return false;
    return true;
  });

  return (
    <section>
      <h2 className="font-display text-lg text-primary mb-4">All Problems</h2>
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted font-mono text-sm">No problems match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((prob) => (
            <Card key={prob.id} interactive className="group relative flex flex-col justify-between min-h-[150px] overflow-hidden">
              {prob.tag && (
                <div className="absolute top-4 right-4">
                  <Badge variant={prob.tag as any}>{prob.tag}</Badge>
                </div>
              )}
              <div className={prob.tag ? 'pr-20' : ''}>
                <h3 className="font-display font-semibold text-lg text-primary group-hover:text-accent-green transition-colors">
                  {prob.title}
                </h3>
                <p className="text-sm text-secondary mt-1.5 line-clamp-1">{prob.desc}</p>
              </div>
              <div className="flex items-center gap-4 mt-6">
                <Badge variant="TOPIC">{prob.topic}</Badge>
                <span className={`font-mono text-[11px] uppercase tracking-wider ${prob.diffColor}`}>
                  {prob.diff}
                </span>
                <span className="font-mono text-[11px] text-muted tracking-wider ml-auto">
                  {prob.time}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
