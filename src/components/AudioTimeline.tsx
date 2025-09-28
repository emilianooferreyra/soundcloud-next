"use client";

interface AudioTimelineProps {
  progress?: number;
  duration?: number;
  className?: string;
}

export const AudioTimeline = ({
  progress = 0,
  duration = 0,
  className = "",
}: AudioTimelineProps) => {
  const progressPercentage = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className={`audio-timeline ${className}`}>
      <div
        className="audio-timeline__progress"
        style={{ width: `${progressPercentage}%` }}
      />
    </div>
  );
};
