import { useUser } from '../../context/UserContext';

export function ProgressHeader() {
  const { userStats, loading } = useUser();

  return (
    <div className="flex justify-between items-end mb-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-primary">Your Second Brain</h1>
        <p className="text-secondary mt-2">
          {userStats
            ? `${userStats.ques_mastered} concepts mastered · ${userStats.completed_sessions} sessions completed`
            : 'Live behavioral model and skill topography.'}
        </p>
      </div>
      <div className="flex items-center gap-2 bg-accent-green-bg border border-accent-green/30 rounded-full px-3 py-1.5">
        <div className={`w-2 h-2 rounded-full bg-accent-green ${!loading ? 'animate-pulse' : ''}`} />
        <span className="font-mono text-[10px] tracking-widest text-accent-green">
          {loading ? 'SYNCING…' : 'SYNCED JUST NOW'}
        </span>
      </div>
    </div>
  );
}
