"use client";

import { useState, useRef, useEffect, memo } from 'react';

interface OptimizedVideoProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  priority?: boolean;
  lazy?: boolean;
}

const OptimizedVideo = memo(({
  src,
  poster,
  className = '',
  autoPlay = false,
  loop = true,
  muted = true,
  playsInline = true,
  controls = false,
  priority = false,
  lazy = false,
}: OptimizedVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(!lazy || priority);
  const [isPlaying, setIsPlaying] = useState(false);

  // Intersection Observer for lazy loading - start loading when near viewport
  useEffect(() => {
    if (!lazy || priority || shouldLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '400px 0px 400px 0px', // Start loading earlier
        threshold: 0,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, priority, shouldLoad]);

  // Visibility observer - play/pause based on visibility
  useEffect(() => {
    if (!shouldLoad) return;
    
    const el = containerRef.current;
    if (!el) return;

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const visible = entry.isIntersecting && entry.intersectionRatio >= 0.3;
          setIsVisible(visible);
        });
      },
      {
        threshold: [0, 0.3, 0.5, 1],
      }
    );

    visibilityObserver.observe(el);
    return () => visibilityObserver.disconnect();
  }, [shouldLoad]);

  // Play/pause based on visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;

    if (isVisible && autoPlay) {
      // Try to play
      video.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay blocked, that's okay
        setIsPlaying(false);
      });
    } else if (!isVisible && isPlaying) {
      video.pause();
      setIsPlaying(false);
    }
  }, [isVisible, autoPlay, shouldLoad, isPlaying]);

  // Pause when tab is hidden
  useEffect(() => {
    const onVisibility = () => {
      const video = videoRef.current;
      if (document.hidden && video) {
        video.pause();
        setIsPlaying(false);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  if (hasError) {
    return (
      <div className={`bg-gradient-to-br from-gray-900 via-black to-gray-900 ${className}`} />
    );
  }

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {shouldLoad && (
        <video
          ref={videoRef}
          src={src}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          controls={controls}
          preload="auto"
          // @ts-ignore - WebKit-specific attributes for mobile autoplay
          webkit-playsinline="true"
          // @ts-ignore
          x-webkit-airplay="allow"
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        >
          Your browser does not support the video tag.
        </video>
      )}
      {/* Show loading state only when not loaded yet */}
      {!shouldLoad && (
        <div className="absolute inset-0 bg-gray-900" />
      )}
    </div>
  );
});

OptimizedVideo.displayName = 'OptimizedVideo';

export default OptimizedVideo;
