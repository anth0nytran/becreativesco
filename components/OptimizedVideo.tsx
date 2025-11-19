"use client";

import { useState, useRef, useEffect, useCallback, memo } from 'react';

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
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(!lazy || priority);
  const [isInView, setIsInView] = useState(false);
  const playAttemptedRef = useRef(false);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority || shouldLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      {
        // Preload a bit before it becomes visible for smoothness
        rootMargin: '200px 0px 200px 0px',
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [lazy, priority, shouldLoad]);

  // Video loading and playback logic
  useEffect(() => {
    if (!shouldLoad) return;

    const video = videoRef.current;
    if (!video) return;

    // Set up video properties
    video.muted = muted;
    video.playsInline = playsInline;
    video.preload = priority ? 'auto' : 'metadata';

    const handleCanPlay = () => {
      setIsLoaded(true);
      // Only attempt autoplay if the video is in viewport
      if (autoPlay && isInView && !playAttemptedRef.current) {
        playAttemptedRef.current = true;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay prevented - will retry on next intersection
            playAttemptedRef.current = false;
          });
        }
      }
    };

    const handleLoadedData = () => {
      setIsLoaded(true);
    };

    const handleError = () => {
      setHasError(true);
      setIsLoaded(true);
    };

    // Add event listeners
    video.addEventListener('canplaythrough', handleCanPlay);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('canplaythrough', handleCanPlay);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, [shouldLoad, autoPlay, muted, playsInline, priority, isInView]);

  // Separate observer to control playback (play when sufficiently visible, pause when not)
  useEffect(() => {
    if (!shouldLoad) return;
    const el = containerRef.current;
    const video = videoRef.current;
    if (!el || !video) return;

    const playbackObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const visible = entry.isIntersecting && entry.intersectionRatio >= 0.6;
          setIsInView(visible);
          if (visible) {
            if (autoPlay) {
              const playPromise = video.play();
              if (playPromise !== undefined) {
                playPromise.catch(() => {
                  // ignore
                });
              }
            }
          } else {
            // Pause when out of view to save resources
            video.pause();
          }
        });
      },
      {
        root: null,
        threshold: [0, 0.25, 0.5, 0.6, 0.75, 1],
      }
    );

    playbackObserver.observe(el);
    return () => playbackObserver.disconnect();
  }, [shouldLoad, autoPlay]);

  // Pause all videos when tab loses visibility
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        const video = videoRef.current;
        if (video) video.pause();
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
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-900 animate-pulse z-10" />
      )}
      {shouldLoad && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          controls={controls}
          preload={priority ? 'auto' : 'metadata'}
          // @ts-ignore - WebKit-specific attributes for mobile autoplay
          webkit-playsinline="true"
          // @ts-ignore
          x-webkit-airplay="allow"
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoadedData={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            willChange: 'opacity',
          }}
        >
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
});

OptimizedVideo.displayName = 'OptimizedVideo';

export default OptimizedVideo;
