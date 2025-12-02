"use client";

import { memo, useEffect, useRef } from "react";
import Hls from "hls.js";
import { cn } from "@/lib/utils";

interface StreamPlayerProps {
  uid: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  poster?: string;
}

const getHlsUrl = (uid: string) =>
  `https://videodelivery.net/${uid}/manifest/video.m3u8`;
const getMp4Url = (uid: string) =>
  `https://videodelivery.net/${uid}/downloads/default.mp4`;

const StreamPlayer = memo(
  ({
    uid,
    className,
    autoPlay = true,
    loop = true,
    muted = true,
    controls = false,
    poster,
  }: StreamPlayerProps) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
      const video = videoRef.current;
      if (!video || !uid) return;

      let hls: Hls | null = null;
      const hlsUrl = getHlsUrl(uid);
      const mp4Url = getMp4Url(uid);

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = hlsUrl;
      } else if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hls.loadSource(hlsUrl);
        hls.attachMedia(video);
      } else {
        video.src = mp4Url;
      }

      const handleLoaded = () => {
        if (autoPlay) {
          video.play().catch(() => {
            /* ignore autoplay rejection */
          });
        }
      };

      video.addEventListener("loadedmetadata", handleLoaded);

      return () => {
        video.removeEventListener("loadedmetadata", handleLoaded);
        if (hls) {
          hls.destroy();
        }
      };
    }, [uid, autoPlay]);

    if (!uid) return null;

    return (
      <video
        ref={videoRef}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        controls={controls}
        playsInline
        poster={poster}
        className={cn(
          "h-full w-full object-cover object-center rounded-xl transition-opacity duration-300",
          className
        )}
        preload="auto"
      />
    );
  }
);

StreamPlayer.displayName = "StreamPlayer";

export default StreamPlayer;

