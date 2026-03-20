import { PathHeader } from '../components/path/PathHeader';
import { PathTimeline } from '../components/path/PathTimeline';

export default function LearningPath() {
  return (
    <div className="min-h-full bg-primary">
      <PathHeader />
      <PathTimeline />
    </div>
  );
}
