import { SoundCloudPlayer } from "./SouncloudPlayer";

export const PlayerDemo = () => {
  const sampleTrack = {
    id: "1",
    title: "F For You [5TUIciKQzxI].mp3",
    artist: "Disclosure",
    duration: 250,
    audioUrl: "/tracks/Disclosure - F For You [5TUIciKQzxI].mp3",
    artwork: "/images/disclosure.jpg",
  };

  return (
    <div className="container mx-auto">
      <div className="max-w-4xl mx-auto">
        <SoundCloudPlayer
          track={sampleTrack}
          onTrackEnd={() => console.log("Track ended")}
        />
      </div>
    </div>
  );
};
