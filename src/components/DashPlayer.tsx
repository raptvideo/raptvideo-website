import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-contrib-dash'; // DASH.js plugin for Video.js

interface DashPlayerProps {
  poster: string;  // URL for the poster image
  videoSrc: string; // URL for the DASH video (MPD)
}

const DashPlayer: React.FC<DashPlayerProps> = ({ poster, videoSrc }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<ReturnType<typeof videojs> | null>(null);  // Use inferred type

  useEffect(() => {
    if (videoRef.current && !playerRef.current) {
      // Initialize Video.js player
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        preload: 'auto',
        fluid: true, // responsive player
        poster: poster, // Set the poster image here
        techOrder: ['dash'], // Use the DASH.js plugin for DASH content
        sources: [{
          src: videoSrc,
          type: 'application/dash+xml'
        }]
      });
    }

    // Cleanup the player on component unmount
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [poster, videoSrc]);

  return (
    <div>
      <video
        ref={videoRef}
        className="video-js vjs-default-skin"
        controls
        preload="auto"
        width="100%"
        height="auto"
      />
    </div>
  );
};

export default DashPlayer;
