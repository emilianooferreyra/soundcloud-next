"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, Headphones, Heart, Share } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import Image from "next/image";

interface TrackCardProps {
  track: any;
  layout?: "compact" | "full";
}

export const TrackCard = ({ track, layout = "compact" }: TrackCardProps) => {
  const { player, playTrack, pauseTrack } = useAppStore();

  const isCurrentlyPlaying =
    player.currentTrack?.id === track.id && player.isPlaying;

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

  if (layout === "compact") {
    return (
      <Card className="mb-[30px] pt-5 bg-[#1d1e1f]">
        <div className="relative h-40 bg-[#171819]">
          {track.artwork_url ? (
            <Image
              src={track.artwork_url}
              alt={track.title}
              className="absolute w-full h-full object-cover"
            />
          ) : (
            <div className="absolute w-full h-full bg-gray-800 flex items-center justify-center">
              <div className="bg-gray-700 rounded-xl w-16 h-16" />
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="text-[#7d7e7f] text-sm overflow-hidden text-ellipsis whitespace-nowrap">
            {track.user?.username}
          </div>
          <div className="text-[#bdbebf] text-[14px] mt-0 mb-2 leading-[20px/14px] overflow-hidden text-ellipsis whitespace-nowrap">
            {track.title}
          </div>

          <div className="flex items-center h-10 text-[#5d5e5f] fill-[#4d4e4f] text-[13px]">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-none text-[#4d4e4f] hover:text-[#78797a] active:bg-black/20"
                onClick={handlePlay}
              >
                {isCurrentlyPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <span className="ml-1.5">Play</span>
            </div>

            <div className="flex items-center ml-4">
              <Headphones className="h-4 w-4 mr-1.5 text-[#5d5e5f]" />
              <span>{track.playback_count || 0}</span>
            </div>

            <div className="flex items-center ml-4">
              <Heart className="h-4 w-4 mr-1.5 text-[#5d5e5f]" />
              <span>{track.favoritings_count || 0}</span>
            </div>

            <div className="flex items-center ml-auto">
              <Share className="h-4 w-4 text-[#5d5e5f]" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-[16px] bg-[#1d1e1f] overflow-hidden flex flex-row ">
      <div className="relative w-[220px] bg-[#171819] flex-shrink-0">
        <Image
          width="100"
          height="100"
          src={track.artwork_url}
          alt={track.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1  p-4 pl-6 overflow-hidden">
        <div className="text-[#7d7e7f] text-sm overflow-hidden text-ellipsis whitespace-nowrap">
          {track.user?.username}
        </div>
        <div className="text-[#bdbebf] text-[15px] mb-4 overflow-hidden text-ellipsis whitespace-nowrap">
          {track.title}
        </div>

        <div className="flex items-center text-[#777879] fill-[#4d4e4f] text-[13px]">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-[#4d4e4f] hover:text-[#78797a] active:bg-black/20"
              onClick={handlePlay}
            >
              {isCurrentlyPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="flex items-center ml-6">
            <Headphones className="h-4 w-4 mr-1.5 text-[#777879]" />
            <span>{track.playback_count || 0}</span>
          </div>

          <div className="flex items-center ml-6">
            <Heart className="h-4 w-4 mr-1.5 text-[#777879]" />
            <span>{track.favoritings_count || 0}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
