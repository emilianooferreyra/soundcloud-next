"use client";

import { AppLayout } from "@/components/AppLayout";
import { TrackCard } from "@/components/TrackCard";
import { getTracksFromDirectory } from "@/services/trackService";
import { useAppStore } from "@/store/useAppStore";
import { useEffect } from "react";

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
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <h1 className="text-2xl font-bold text-white mb-6">
          Discover New Music
        </h1>

        <div>
          {tracks.map((track) => (
            <TrackCard key={track.id} track={track} layout="full" />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
