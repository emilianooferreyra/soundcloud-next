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

interface BrowserState {
  isMobile: boolean;
  isTablet: boolean;
}

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  audioRef: HTMLAudioElement | null;
}

interface SearchState {
  query: string;
  results: Track[];
  isLoading: boolean;
  error: string | null;
}

interface TracklistsState {
  tracks: Track[];
  isLoading: boolean;
  error: string | null;
}

interface TracksState {
  items: Track[];
  isLoading: boolean;
  error: string | null;
}

interface UsersState {
  profile: User | null;
  isLoading: boolean;
  error: string | null;
}

interface AppState {
  // State slices
  browser: BrowserState;
  player: PlayerState;
  search: SearchState;
  tracklists: TracklistsState;
  tracks: TracksState;
  users: UsersState;

  // Actions
  // Browser actions
  setBrowserState: (state: Partial<BrowserState>) => void;

  // Player actions
  setPlayerState: (state: Partial<PlayerState>) => void;
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  setAudioRef: (audio: HTMLAudioElement | null) => void;
  stopTrack: () => void;
  skipTrack: (direction: "next" | "previous") => void;

  // Search actions
  setSearchState: (state: Partial<SearchState>) => void;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: Track[]) => void;

  // Tracklists actions
  setTracklistsState: (state: Partial<TracklistsState>) => void;

  // Tracks actions
  setTracksState: (state: Partial<TracksState>) => void;
  setTracks: (tracks: Track[]) => void;

  // Users actions
  setUsersState: (state: Partial<UsersState>) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => {
        return {
          // Initial state
          browser: {
            isMobile: false,
            isTablet: false,
          },
          player: {
            currentTrack: null,
            isPlaying: false,
            currentTime: 0,
            duration: 0,
            volume: 1,
            audioRef: null, // Initialize as null, will be set by Player component
          },
          search: {
            query: "",
            results: [],
            isLoading: false,
            error: null,
          },
          tracklists: {
            tracks: [],
            isLoading: false,
            error: null,
          },
          tracks: {
            items: [],
            isLoading: false,
            error: null,
          },
          users: {
            profile: null,
            isLoading: false,
            error: null,
          },

          // Actions
          // Browser actions
          setBrowserState: (state) =>
            set((prev) => ({
              browser: { ...prev.browser, ...state },
            })),

          // Player actions
          setPlayerState: (state) =>
            set((prev) => ({
              player: { ...prev.player, ...state },
            })),
          playTrack: (track: Track) => {
            const { player } = get();

            // If the same track is being played, just resume
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

            // Create audio element if it doesn't exist
            let audio = player.audioRef;
            if (!audio) {
              // Only create audio element on client side
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

            // If a different track is being played, load the new track
            if (audio) {
              // Load the track via its stream_url or construct from filename
              const trackUrl = track.stream_url || `/tracks/${track.fileName}`;
              audio.src = trackUrl;

              // Once audio is loaded, play it
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

              // Update time as audio plays
              audio.ontimeupdate = () => {
                set((prev) => ({
                  player: {
                    ...prev.player,
                    currentTime: audio.currentTime,
                  },
                }));
              };

              // Handle when audio ends
              audio.onended = () => {
                set((prev) => ({
                  player: {
                    ...prev.player,
                    isPlaying: false,
                  },
                }));
              };

              // Handle errors
              audio.onerror = () => {
                console.error("Error playing audio:", audio.error);
              };

              // Set volume
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
          setDuration: (duration: number) =>
            set((prev) => ({
              player: {
                ...prev.player,
                duration,
              },
            })),
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

          // Search actions
          setSearchState: (state) =>
            set((prev) => ({
              search: { ...prev.search, ...state },
            })),
          setSearchQuery: (query) =>
            set((prev) => ({
              search: { ...prev.search, query },
            })),
          setSearchResults: (results) =>
            set((prev) => ({
              search: { ...prev.search, results, isLoading: false },
            })),

          // Tracklists actions
          setTracklistsState: (state) =>
            set((prev) => ({
              tracklists: { ...prev.tracklists, ...state },
            })),

          // Tracks actions
          setTracksState: (state) =>
            set((prev) => ({
              tracks: { ...prev.tracks, ...state },
            })),
          setTracks: (tracks) =>
            set((prev) => ({
              tracks: {
                ...prev.tracks,
                items: tracks,
              },
            })),

          // Users actions
          setUsersState: (state) =>
            set((prev) => ({
              users: { ...prev.users, ...state },
            })),
        };
      },
      {
        name: "soundcloud-storage", // Name for localStorage key
      }
    )
  )
);
