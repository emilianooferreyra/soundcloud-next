"use client";

import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, SkipForward, SkipBack } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useEffect, useRef, useState } from "react";

export const Player = () => {
  const {
    player,
    playTrack,
    pauseTrack,
    setCurrentTime,
    setVolume,
    stopTrack,
    setAudioRef,
    skipTrack,
  } = useAppStore();

  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [hasPlayedAnimation, setHasPlayedAnimation] = useState(false);

  useEffect(() => {
    if (!player.audioRef && typeof window !== "undefined") {
      const audio = new Audio();
      audio.volume = player.volume;
      setAudioRef(audio);
      audioRef.current = audio;
    } else if (player.audioRef) {
      audioRef.current = player.audioRef;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [player.audioRef, setAudioRef, player.volume]);

  useEffect(() => {
    if (player.currentTrack && !hasPlayedAnimation) {
      setHasPlayedAnimation(true);
    }
  }, [player.currentTrack, hasPlayedAnimation]);

  useEffect(() => {
    if (!player.currentTrack) {
      setHasPlayedAnimation(false);
    }
  }, [player.currentTrack]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !player.currentTrack) return;

    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * player.duration;
    setCurrentTime(newTime);
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeRef.current) return;

    const rect = volumeRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newVolume = Math.max(0, Math.min(1, pos));
    setVolume(newVolume);
  };

  if (!player.currentTrack) {
    return null;
  }

  return (
    <>
      <div
        className={`fixed left-0 w-full h-[71px] border-t border-black/20 shadow-[0_-3px_0_0_rgba(0,0,0,0.1)] ${
          hasPlayedAnimation
            ? "animate-[showPlayer_300ms_ease-in-out_forwards] bottom-[-10px] bg-[#2d2e2f]"
            : "bottom-[-10px] bg-[#2d2e2f]"
        }`}
      >
        <div className="mx-auto max-w-[970px] px-4">
          <div
            ref={progressRef}
            className="h-[4px] bg-[#3a3b3c] cursor-pointer mb-2"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-[#aaabac] transition-all"
              style={{
                width: `${
                  player.duration > 0
                    ? (player.currentTime / player.duration) * 100
                    : 0
                }%`,
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full text-[#5d5e5f] hover:text-[#78797a] active:bg-black/15"
                onClick={() => skipTrack("previous")}
              >
                <SkipBack className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-[#5d5e5f] hover:bg-[#78797a] text-[#2d2e2f]"
                onClick={
                  player.isPlaying
                    ? pauseTrack
                    : () => {
                        if (player.currentTrack) {
                          playTrack(player.currentTrack);
                        }
                      }
                }
              >
                {player.isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full text-[#5d5e5f] hover:text-[#78797a] active:bg-black/15"
                onClick={() => skipTrack("next")}
              >
                <SkipForward className="h-5 w-5" />
              </Button>

              <div className="text-sm text-[#5d5e5f] px-2.5">
                {Math.floor(player.currentTime / 60)}:
                {String(Math.floor(player.currentTime % 60)).padStart(2, "0")} /{" "}
                {Math.floor(player.duration / 60)}:
                {String(Math.floor(player.duration % 60)).padStart(2, "0")}
              </div>
            </div>

            <div className="flex items-center max-w-[50%] overflow-hidden">
              <div className="truncate px-2.5">
                <div className="text-sm font-medium truncate">
                  {player.currentTrack.title || "Unknown Track"}
                </div>
                <div className="text-xs text-[#78797a] truncate">
                  {player.currentTrack.user?.username || "Unknown Artist"}
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <Volume2 className="h-4 w-4 text-[#5d5e5f] mr-2" />
              <div
                ref={volumeRef}
                className="w-24 h-1 bg-[#3a3b3c] cursor-pointer"
                onClick={handleVolumeClick}
              >
                <div
                  className="h-full bg-[#aaabac]"
                  style={{ width: `${player.volume * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
