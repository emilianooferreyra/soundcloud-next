"use client";

import { AppLayout } from "@/components/AppLayout";
import { PlayerDemo } from "@/components/PlayerDemo";
import { TrackCard } from "@/components/TrackCard";
import { Track, useAppStore } from "@/store/useAppStore";
import { useEffect } from "react";

const getTracksFromDirectory = (): Track[] => {
  return [
    {
      id: 1,
      title: "F For You",
      user: {
        username: "Disclosure",
      },
      playback_count: 12345,
      favoritings_count: 987,
      fileName: "Disclosure - F For You [5TUIciKQzxI].mp3",
      artwork_url: "/images/disclosure.jpg",
      duration: 213,
    },
    {
      id: 2,
      title: "Hollywood (Feat. Penguin Prison)",
      user: {
        username: "RAC",
      },
      playback_count: 54321,
      favoritings_count: 2109,
      fileName: "RAC- Hollywood (Feat. Penguin Prison) [dw27mptBlyY].mp3",
      artwork_url: "/images/rac.jpg",
      duration: 198,
    },
    {
      id: 3,
      title: "HEAVEN (Live)",
      user: {
        username: "The Blaze",
      },
      playback_count: 98765,
      favoritings_count: 5432,
      fileName: "The Blaze - HEAVEN (Live) [5W4CIkrq4PM].mp3",
      artwork_url: "/images/blaze.jpg",
      duration: 267,
    },
  ];
};

export default function Home() {
  const tracks = getTracksFromDirectory();
  const { setTracks, tracks: storeTracks } = useAppStore();

  useEffect(() => {
    if (!storeTracks.items || storeTracks.items.length === 0) {
      setTracks(tracks);
    }
  }, [setTracks, storeTracks.items]);

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <h1 className="text-2xl font-bold text-white mb-6">
          Discover New Music
        </h1>

        <div className="space-y-3">
          {tracks.map((track) => (
            <TrackCard key={track.id} track={track} layout="full" />
          ))}
        </div>

        <PlayerDemo />
      </div>
    </AppLayout>
  );
}
