"use client";

import { memo, useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { cn } from "@/lib/utils";

interface StreamPlayerProps {
  uid: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  lazy?: boolean;
  priority?: boolean;
  visibilityThreshold?: number;
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
    lazy = true,
    priority = false,
    visibilityThreshold = 0.45,
  }: StreamPlayerProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [shouldLoad, setShouldLoad] = useState(!lazy || priority);
    const [isVisible, setIsVisible] = useState(false);

    // Start loading once near viewport
    useEffect(() => {
      if (!lazy || priority || shouldLoad) return;
      const node = containerRef.current;
      if (!node) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setShouldLoad(true);
              observer.disconnect();
            }
          });
        },
        { rootMargin: "300px 0px 300px 0px" }
      );

      observer.observe(node);
      return () => observer.disconnect();
    }, [lazy, priority, shouldLoad]);

    // Track visibility to pause/resume playback
    useEffect(() => {
      if (!shouldLoad) return;
      const node = containerRef.current;
      if (!node) return;

      const normalizedThreshold = Math.min(
        Math.max(visibilityThreshold, 0),
        1
      );
      const thresholds =
        normalizedThreshold === 0 ? [0, 1] : [0, normalizedThreshold, 1];

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const visible =
              normalizedThreshold === 0
                ? entry.isIntersecting
                : entry.isIntersecting &&
                  entry.intersectionRatio >= normalizedThreshold;
            setIsVisible(visible);
          });
        },
        { threshold: thresholds }
      );

      observer.observe(node);
      return () => observer.disconnect();
    }, [shouldLoad, visibilityThreshold]);

    // Attach HLS once loading begins
    useEffect(() => {
      if (!shouldLoad) return;
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
        if (autoPlay && isVisible) {
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
    }, [uid, shouldLoad, autoPlay, isVisible]);

    // Pause when not visible
    useEffect(() => {
      if (!shouldLoad) return;
      const video = videoRef.current;
      if (!video) return;

      if (isVisible && autoPlay) {
        video.play().catch(() => {
          /* ignore autoplay rejection */
        });
      } else {
        video.pause();
      }
    }, [isVisible, autoPlay, shouldLoad]);

    if (!uid) return null;

    return (
      <div ref={containerRef} className="h-full w-full">
        {shouldLoad ? (
          <video
            ref={videoRef}
            autoPlay={false}
            loop={loop}
            muted={muted}
            controls={controls}
            playsInline
            className={cn(
              "h-full w-full object-cover object-center transition-opacity duration-300",
              className
            )}
            preload="metadata"
          />
        ) : (
          <div className="h-full w-full bg-black/40" aria-hidden="true" />
        )}
      </div>
    );
  }
);

StreamPlayer.displayName = "StreamPlayer";

export default StreamPlayer;

