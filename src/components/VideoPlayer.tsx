
import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  videoUrl: string;
  posterUrl?: string;
  autoplay?: boolean;
  controls?: boolean;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  posterUrl,
  autoplay = false,
  controls = true,
  className
}) => {
  const videoRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    if (playerRef.current) {
      playerRef.current.dispose();
    }

    const videoOptions = {
      autoplay,
      controls,
      responsive: true,
      fluid: true,
      sources: [{
        src: videoUrl,
        type: 'video/mp4'
      }]
    };

    if (posterUrl) {
      Object.assign(videoOptions, { poster: posterUrl });
    }

    const player = videojs(videoRef.current.querySelector('video'), videoOptions);
    playerRef.current = player;

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [videoUrl, posterUrl, autoplay, controls]);

  return (
    <div className={cn("video-js-container", className)}>
      <div ref={videoRef} data-vjs-player>
        <video className="video-js vjs-big-play-centered" />
      </div>
    </div>
  );
};

export default VideoPlayer;
