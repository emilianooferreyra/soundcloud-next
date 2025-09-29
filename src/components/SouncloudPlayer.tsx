"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { WaveformTimeline } from "./WaveformTimeline";
import { Pause, Play } from "lucide-react";
import Image from "next/image";

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
  artwork?: string;
  uploadedAt?: string;
  genre?: string;
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
    <div className="soundcloud-player-redesign bg-gradient">
      <audio ref={audioRef} src={track.audioUrl} preload="metadata" />

      <div className="soundcloud-player-redesign__overlay" />

      {/* Content */}
      <div className="soundcloud-player-redesign__content">
        {/* Left section - Play button and track info */}
        <div className="soundcloud-player-redesign__left">
          <div className="soundcloud-player-redesign__controls">
            <button
              onClick={togglePlayPause}
              disabled={!isReady}
              className="soundcloud-player-redesign__play-btn"
            >
              {isPlaying ? (
                <Pause size={24} fill="white" />
              ) : (
                <Play size={24} fill="white" />
              )}
            </button>

            <div className="soundcloud-player-redesign__track-info">
              <h1 className="soundcloud-player-redesign__title">
                {track.title}
              </h1>
              <p className="soundcloud-player-redesign__artist">
                {track.artist}
              </p>
            </div>
          </div>
        </div>

        {/* Right section - Upload date, genre and artwork */}
        <div className="soundcloud-player-redesign__right">
          <div className="soundcloud-player-redesign__metadata">
            {track.uploadedAt && (
              <span className="soundcloud-player-redesign__date">
                {track.uploadedAt}
              </span>
            )}
            {track.genre && (
              <span className="soundcloud-player-redesign__genre">
                #{track.genre}
              </span>
            )}
          </div>

          {/* Album artwork */}
          <div className="soundcloud-player-redesign__artwork">
            <Image
              src={track.artwork || "/images/disclosure.jpg"}
              alt={`${track.title} artwork`}
              width={200}
              height={200}
              className="soundcloud-player-redesign__artwork-img"
            />
          </div>
        </div>
      </div>

      {/* Waveform section */}
      <div className="soundcloud-player-redesign__waveform-container">
        {/* Waveform */}
        <div className="soundcloud-player-redesign__waveform">
          <WaveformTimeline
            url={track.audioUrl}
            progress={progress}
            isPlaying={isPlaying}
            onReady={() => setIsReady(true)}
            onProgress={handleProgressChange}
            waveColor="rgba(255, 255, 255, 0.4)"
            progressColor="#ff5500"
          />
        </div>

        {/* Time indicators positioned over the waveform */}
        <div className="soundcloud-player-redesign__time-indicators">
          <span className="soundcloud-player-redesign__current-time">
            {formatTime(currentTime)}
          </span>
          <span className="soundcloud-player-redesign__total-time">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
};
