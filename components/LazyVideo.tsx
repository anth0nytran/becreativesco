"use client";

import { memo } from 'react';
import OptimizedVideo from './OptimizedVideo';

interface LazyVideoProps {
  src: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  priority?: boolean;
  lazy?: boolean;
}

// Lazy-loaded video component for below-the-fold content
const LazyVideo = memo(({
  src,
  className = '',
  autoPlay = false,
  loop = true,
  muted = true,
  playsInline = true,
  priority = false,
  lazy = true,
}: LazyVideoProps) => {
  return (
    <OptimizedVideo
      src={src}
      className={className}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      lazy={lazy}
      priority={priority}
    />
  );
});

LazyVideo.displayName = 'LazyVideo';

export default LazyVideo;

