import { useParams } from 'react-router-dom';
import { PathHeader } from '../components/path/PathHeader';
import { PathTimeline } from '../components/path/PathTimeline';
import { DEFAULT_PATH_ID, PATH_DETAILS } from '../components/path/pathData';

export default function LearningPath() {
  const { id } = useParams();
  const selectedPath = PATH_DETAILS[id ?? ''] ?? PATH_DETAILS[DEFAULT_PATH_ID];

  return (
    <div className="min-h-full bg-primary">
      <PathHeader
        title={selectedPath.title}
        description={selectedPath.description}
        metaLabel={selectedPath.metaLabel}
      />
      <PathTimeline modules={selectedPath.modules} />
    </div>
  );
}
