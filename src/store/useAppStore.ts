import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface User {
  id?: number;
  username: string;
  avatar_url?: string;
}

export interface Track {
  id: number | string;
  title: string;
  user?: User;
  artwork_url?: string;
  duration?: number;
  stream_url?: string;
  playback_count?: number;
  favoritings_count?: number;
  fileName?: string;
}

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  audioRef: HTMLAudioElement | null;
}

interface TracksState {
  items: Track[];
  isLoading: boolean;
  error: string | null;
}

interface AppState {
  player: PlayerState;
  tracks: TracksState;

  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  setCurrentTime: (time: number) => void;
  setVolume: (volume: number) => void;
  setAudioRef: (audio: HTMLAudioElement | null) => void;
  stopTrack: () => void;
  skipTrack: (direction: "next" | "previous") => void;

  setTracks: (tracks: Track[]) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => {
        return {
          player: {
            currentTrack: null,
            isPlaying: false,
            currentTime: 0,
            duration: 0,
            volume: 1,
            audioRef: null,
          },
          tracks: {
            items: [],
            isLoading: false,
            error: null,
          },

          playTrack: (track: Track) => {
            const { player } = get();

            if (player.currentTrack?.id === track.id && !player.isPlaying) {
              if (player.audioRef) {
                player.audioRef.play();
              }
              set((prev) => ({
                player: {
                  ...prev.player,
                  isPlaying: true,
                },
              }));
              return;
            }

            let audio = player.audioRef;
            if (!audio) {
              if (typeof window !== "undefined") {
                audio = new Audio();
                audio.volume = player.volume;
                set((prev) => ({
                  player: {
                    ...prev.player,
                    audioRef: audio,
                  },
                }));
              } else {
                console.error(
                  "Audio element cannot be created on the server side"
                );
                return;
              }
            }

            if (audio) {
              const trackUrl = track.stream_url || `/tracks/${track.fileName}`;
              audio.src = trackUrl;

              audio.onloadeddata = () => {
                set((prev) => ({
                  player: {
                    ...prev.player,
                    currentTrack: track,
                    isPlaying: true,
                    duration: isNaN(audio.duration)
                      ? track.duration || 0
                      : audio.duration,
                    currentTime: 0,
                  },
                }));
                audio.play();
              };

              audio.ontimeupdate = () => {
                set((prev) => ({
                  player: {
                    ...prev.player,
                    currentTime: audio.currentTime,
                  },
                }));
              };

              audio.onended = () => {
                set((prev) => ({
                  player: {
                    ...prev.player,
                    isPlaying: false,
                  },
                }));
              };

              audio.onerror = () => {
                console.error("Error playing audio:", audio.error);
              };

              audio.volume = player.volume;
            }
          },
          pauseTrack: () => {
            const { player } = get();
            if (player.audioRef) {
              player.audioRef.pause();
            }
            set((prev) => ({
              player: {
                ...prev.player,
                isPlaying: false,
              },
            }));
          },
          stopTrack: () => {
            const { player } = get();
            if (player.audioRef) {
              player.audioRef.pause();
              player.audioRef.currentTime = 0;
            }
            set((prev) => ({
              player: {
                ...prev.player,
                isPlaying: false,
                currentTime: 0,
              },
            }));
          },
          setCurrentTime: (time: number) => {
            const { player } = get();
            if (player.audioRef) {
              player.audioRef.currentTime = time;
            }
            set((prev) => ({
              player: {
                ...prev.player,
                currentTime: time,
              },
            }));
          },
          setVolume: (volume: number) => {
            const { player } = get();
            if (player.audioRef) {
              player.audioRef.volume = volume;
            }
            set((prev) => ({
              player: {
                ...prev.player,
                volume,
              },
            }));
          },
          setAudioRef: (audio: HTMLAudioElement | null) =>
            set((prev) => ({
              player: {
                ...prev.player,
                audioRef: audio,
              },
            })),
          skipTrack: (direction: "next" | "previous") => {
            const { player, tracks } = get();
            if (
              !player.currentTrack ||
              !tracks.items ||
              tracks.items.length === 0
            )
              return;

            const currentIndex = tracks.items.findIndex(
              (track) => track.id === player.currentTrack?.id
            );
            if (currentIndex === -1) return;

            let nextIndex: number;
            if (direction === "next") {
              nextIndex = (currentIndex + 1) % tracks.items.length;
            } else {
              nextIndex =
                (currentIndex - 1 + tracks.items.length) % tracks.items.length;
            }

            if (nextIndex >= 0 && nextIndex < tracks.items.length) {
              const nextTrack = tracks.items[nextIndex];
              const { playTrack } = get();
              playTrack(nextTrack);
            }
          },

          setTracks: (tracks) =>
            set((prev) => ({
              tracks: {
                ...prev.tracks,
                items: tracks,
              },
            })),
        };
      },
      {
        name: "soundcloud-storage",
        partialize: (state) => {
          const { audioRef, ...playerRest } = state.player;
          return {
            ...state,
            player: playerRest,
          };
        },
      }
    )
  )
);
