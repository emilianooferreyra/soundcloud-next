import { Track } from "@/store/useAppStore";

export const getTracksFromDirectory = (): Track[] => {
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