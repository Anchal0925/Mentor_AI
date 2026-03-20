import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Pause, Play } from 'lucide-react';

export type ReplayMarkerType = 'pause' | 'nudge' | 'compile_error';

export interface ReplayMarker {
  id: string;
  time: number;
  type: ReplayMarkerType;
  tooltip: string;
}

interface TimelineSliderProps {
  currentTime: number;
  totalTime: number;
  isPlaying: boolean;
  markers: ReplayMarker[];
  onTogglePlay: () => void;
  onSeek: (timeInSeconds: number) => void;
}

const MARKER_STYLES: Record<ReplayMarkerType, string> = {
  pause: 'w-[4px] h-[12px] top-[-3px] bg-accent-yellow rounded-sm',
  nudge: 'w-[8px] h-[8px] top-[-1px] rounded-full bg-accent-green border border-[#050505]',
  compile_error: 'w-[4px] h-[12px] top-[-3px] bg-accent-red rounded-sm',
};

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function TimelineSlider({
  currentTime,
  totalTime,
  isPlaying,
  markers,
  onTogglePlay,
  onSeek,
}: TimelineSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);

  const progress = useMemo(() => {
    if (totalTime <= 0) return 0;
    return Math.min((currentTime / totalTime) * 100, 100);
  }, [currentTime, totalTime]);

  const markerPositions = useMemo(
    () =>
      markers.map((marker) => ({
        ...marker,
        left: totalTime > 0 ? Math.min((marker.time / totalTime) * 100, 100) : 0,
      })),
    [markers, totalTime],
  );

  const seekFromClientX = (clientX: number) => {
    const track = trackRef.current;
    if (!track || totalTime <= 0) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    onSeek(ratio * totalTime);
  };

  return (
    <div className="absolute bottom-0 left-0 right-[300px] h-[64px] bg-surface border-t border-border px-6 flex items-center gap-4">
      <button
        onClick={onTogglePlay}
        className="w-9 h-9 rounded-full border border-border text-primary hover:bg-elevated transition-colors flex items-center justify-center shrink-0"
        aria-label={isPlaying ? 'Pause replay' : 'Play replay'}
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
      </button>

      <div className="font-mono text-[12px] text-muted w-[100px]">
        {formatTime(currentTime)} / {formatTime(totalTime)}
      </div>

      <div
        ref={trackRef}
        onClick={(event) => seekFromClientX(event.clientX)}
        className="relative flex-1 h-[6px] bg-primary rounded-full overflow-visible cursor-pointer"
      >
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 260, damping: 34 }}
          className="absolute left-0 top-0 bottom-0 bg-accent-green rounded-full"
        />

        {markerPositions.map((marker) => (
          <button
            key={marker.id}
            onClick={(event) => {
              event.stopPropagation();
              onSeek(marker.time);
            }}
            onMouseEnter={() => setHoveredMarker(marker.id)}
            onMouseLeave={() => setHoveredMarker(null)}
            className={`absolute -translate-x-1/2 transition-transform hover:scale-110 ${MARKER_STYLES[marker.type]}`}
            style={{ left: `${marker.left}%` }}
            aria-label={marker.tooltip}
            title={marker.tooltip}
          />
        ))}

        {markerPositions.map((marker) =>
          hoveredMarker === marker.id ? (
            <div
              key={`${marker.id}-tooltip`}
              className="absolute -translate-x-1/2 -top-8 px-2 py-1 rounded border border-border bg-elevated font-mono text-[10px] text-primary whitespace-nowrap pointer-events-none z-10"
              style={{ left: `${marker.left}%` }}
            >
              {marker.tooltip}
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
}
