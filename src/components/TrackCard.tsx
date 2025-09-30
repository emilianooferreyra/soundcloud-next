"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { WaveformTimeline } from "./WaveformTimeline";
import { formatTime } from "@/lib/formatTime";

interface TrackCardProps {
  track: any;
  layout?: "compact" | "full";
}

export const TrackCard = ({ track }: TrackCardProps) => {
  const { player, playTrack, pauseTrack } = useAppStore();
  const [isReady, setIsReady] = useState(false);

  const progress =
    player.currentTrack?.id === track.id && player.duration > 0
      ? player.currentTime / player.duration
      : 0;

  const handleProgressChange = (newProgress: number) => {
    if (player.currentTrack?.id === track.id && player.audioRef) {
      const newTime = newProgress * player.duration;
      player.audioRef.currentTime = newTime;
      useAppStore.getState().setCurrentTime(newTime);
    }
  };

  const displayIsPlaying =
    player.currentTrack?.id === track.id && player.isPlaying;

  const isCurrentlyPlaying =
    player.currentTrack?.id === track.id && player.isPlaying;

  const audioUrl =
    track.stream_url || (track.fileName ? `/tracks/${track.fileName}` : "");

  const handlePlay = () => {
    if (player.currentTrack?.id === track.id) {
      if (player.isPlaying) {
        pauseTrack();
      } else {
        playTrack(track);
      }
    } else {
      playTrack(track);
    }
  };

  return (
    <Card className="soundcloud-track-card">
      <div className="soundcloud-track-card__content">
        <div className="soundcloud-track-card__info">
          <div className="soundcloud-track-card__header">
            <div className="flex items-center">
              <div className="soundcloud-track-card__play-overlay mr-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="soundcloud-track-card__play-btn"
                  onClick={handlePlay}
                  disabled={!isReady}
                >
                  {isCurrentlyPlaying ? (
                    <Pause className="h-5 w-5" fill="currentColor" />
                  ) : (
                    <Play className="h-5 w-5 ml-0.5" fill="currentColor" />
                  )}
                </Button>
              </div>
              <div className="bg-black ml-20 p-2">
                <div className="soundcloud-track-card__meta">
                  <span className="soundcloud-track-card__username">
                    {track.user?.username || "Unknown Artist"}
                  </span>
                </div>
                <h3 className="soundcloud-track-card__title">{track.title}</h3>
              </div>
            </div>

            <div className="soundcloud-track-card__waveform">
              <WaveformTimeline
                url={audioUrl}
                progress={progress}
                isPlaying={displayIsPlaying}
                onReady={() => setIsReady(true)}
                onProgress={handleProgressChange}
                waveColor="rgba(255, 255, 255, 0.5)"
                progressColor="#ff5500"
              />

              <div className="soundcloud-player__time-indicators mt-8">
                <span className="soundcloud-player__current-time">
                  {formatTime(player.currentTime)}
                </span>
                <span className="soundcloud-player__total-time">
                  {formatTime(player.duration)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="soundcloud-track-card__artwork">
          <Image
            width={320}
            height={320}
            src={track.artwork_url || "/images/default-artwork.jpg"}
            alt={track.title}
            className="soundcloud-track-card__artwork-img"
          />
        </div>
      </div>
    </Card>
  );
};
