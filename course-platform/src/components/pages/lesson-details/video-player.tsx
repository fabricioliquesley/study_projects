// Base styles for media player and provider (~400B).
import "@vidstack/react/player/styles/base.css";
import "@vidstack/react/player/styles/plyr/theme.css";

import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  PlyrLayout,
  plyrLayoutIcons,
} from "@vidstack/react/player/layouts/plyr";

interface VideoPlayerProps {
  videoId: string;
  autoplay: boolean;
  onEnd?: () => void;
}

function VideoPlayer({ videoId, autoplay, onEnd }: VideoPlayerProps) {
  const userAlreadyInteracted = navigator.userActivation.hasBeenActive;

  return (
    <MediaPlayer
      title="class video"
      src={`https://www.youtube.com/${videoId}`}
      autoPlay={autoplay && userAlreadyInteracted}
      onEnd={onEnd}
    >
      <MediaProvider />
      <PlyrLayout icons={plyrLayoutIcons} />
    </MediaPlayer>
  );
}

export default VideoPlayer;
