import { SoundCloudPlayer } from "./SouncloudPlayer";

export const PlayerDemo = () => {
  const sampleTrack = {
    id: "1",
    title: "Disclosure - F For You",
    artist: "Disclosure",
    duration: 213, // 4:04 in seconds
    audioUrl: "/tracks/Disclosure - F For You [5TUIciKQzxI].mp3",
    artwork: "/images/disclosure-cover.jpg",
  };

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto">
        <SoundCloudPlayer
          track={sampleTrack}
          onTrackEnd={() => console.log("Track ended")}
        />
      </div>
    </div>
  );
};
