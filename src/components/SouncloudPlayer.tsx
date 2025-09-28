"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { WaveformTimeline } from "./WaveformTimeline";

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
  artwork?: string;
}

interface SoundCloudPlayerProps {
  track: Track;
  autoPlay?: boolean;
  onTrackEnd?: () => void;
}

export const SoundCloudPlayer = ({
  track,
  autoPlay = false,
  onTrackEnd,
}: SoundCloudPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(track.duration || 0);
  const [isReady, setIsReady] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const handleEnded = () => {
      setIsPlaying(false);
      onTrackEnd?.();
    };
    const handleCanPlay = () => {
      if (autoPlay) {
        audio.play().catch(console.error);
        setIsPlaying(true);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, [autoPlay, onTrackEnd]);

  const togglePlayPause = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error toggling playback:", error);
    }
  }, [isPlaying]);

  const handleProgressChange = useCallback(
    (progress: number) => {
      const audio = audioRef.current;
      if (!audio || !duration) return;

      const newTime = progress * duration;
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    },
    [duration]
  );

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <div className="soundcloud-player bg-white  shadow-lg p-6">
      <audio ref={audioRef} src={track.audioUrl} preload="metadata" />

      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={togglePlayPause}
          disabled={!isReady}
          className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white hover:bg-orange-600 disabled:opacity-50"
        >
          {isPlaying ? "⏸" : "▶"}
        </button>

        <div className="flex-1">
          <h3 className="font-bold text-lg">{track.title}</h3>
          <p className="text-gray-600">{track.artist}</p>
        </div>

        <div className="text-sm text-gray-500">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      <div className="relative">
        <WaveformTimeline
          url={track.audioUrl}
          progress={progress}
          isPlaying={isPlaying}
          onReady={() => setIsReady(true)}
          onProgress={handleProgressChange}
          waveColor="#ccc"
          progressColor="#ff5500"
          className="h-16"
        />
      </div>
    </div>
  );
};
