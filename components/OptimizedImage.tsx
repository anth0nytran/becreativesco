"use client";

import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  quality?: number;
}

const OptimizedImage = ({
  src,
  alt,
  className = '',
  fill = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  quality = 85,
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`bg-gradient-to-br from-gray-900 via-black to-gray-900 ${className}`} />
    );
  }

  return (
    <div className={`relative overflow-hidden ${className} ${fill ? 'absolute inset-0' : ''}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
    </div>
  );
};

export default OptimizedImage;

