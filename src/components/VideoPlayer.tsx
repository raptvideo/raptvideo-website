import React from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import Player from 'video.js/dist/types/player';
import 'videojs-contrib-dash'; 


interface VideoPlayerProps {
    options: any;
    onReady: (player: Player) => void;
    onTimeUpdate?: (currentTime: number) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = React.memo(( props ) => {
  const videoRef = React.useRef<HTMLDivElement | null>(null);
  const playerRef = React.useRef<Player | null>(null);
  const { options, onReady, onTimeUpdate } = props;

  React.useEffect(() => {

    // Make sure Video.js player is only initialized once
    if (!playerRef.current && videoRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode. 
      const videoElement = document.createElement("video-js");

      videoElement.classList.add('vjs-big-play-centered');

      videoRef.current!.appendChild(videoElement);

      const player = playerRef.current = videojs(videoElement, options, () => {
        videojs.log('player is ready');
        onReady && onReady(player);
      });

      if (onTimeUpdate) {
        player.on('timeupdate', () => {
          const currentTime = player.currentTime()!;  // Get the current playback time
          onTimeUpdate(currentTime);  // Pass the current time to the parent component
        });
      }

    } else if (playerRef.current) {
        // Update player options (like autoplay and source) if props change
        const player = playerRef.current;
        player.autoplay(options.autoplay);
        player.src(options.sources);
    }

    return () => {
        // Cleanup on unmount
        if (playerRef.current) {
          playerRef.current.dispose();
          playerRef.current = null;
        }
    };

  }, [options, videoRef, onTimeUpdate]);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
});

export default VideoPlayer;
