"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type ImageAutoSliderProps = {
  images: string[];
  speed?: number; // seconds per loop
  imageSize?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeToClasses: Record<NonNullable<ImageAutoSliderProps["imageSize"]>, string> = {
  sm: "w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80",
  md: "w-80 h-80 md:w-96 md:h-96 lg:w-[26rem] lg:h-[26rem]",
  lg: "w-96 h-96 md:w-[26rem] md:h-[26rem] lg:w-[30rem] lg:h-[30rem]",
};

function ImageAutoSlider({
  images,
  speed = 20,
  imageSize = "md",
  className = "",
}: ImageAutoSliderProps) {
  const duplicatedImages = useMemo(() => [...images, ...images], [images]);
  const cardSize = sizeToClasses[imageSize];
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  // Start animation when section enters viewport, pause when it leaves.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsActive(entry.isIntersecting && entry.intersectionRatio > 0.2);
        });
      },
      { threshold: [0, 0.2, 0.5, 1], rootMargin: "150px 0px 150px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Pause when tab hidden
  useEffect(() => {
    const onVisibility = () => {
      const track = trackRef.current;
      if (!track) return;
      track.style.animationPlayState = document.hidden ? "paused" : isActive ? "running" : "paused";
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [isActive]);

  useEffect(() => {
    images.forEach((src) => {
      const preload = new window.Image();
      preload.src = src;
    });
  }, [images]);

  return (
    <>
      <style>{`
        @keyframes bri-scroll-right {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .bri-infinite-scroll {
          animation: bri-scroll-right var(--bri-speed, 20s) linear infinite;
        }
        .bri-scroll-mask {
          mask: linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%);
          -webkit-mask: linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%);
        }
        /* Ensure animation still works inside this component when global reduce-motion styles exist */
        @media (prefers-reduced-motion: reduce) {
          .bri-allow-motion .bri-infinite-scroll {
            animation-duration: var(--bri-speed, 20s) !important;
            animation-iteration-count: infinite !important;
            animation-play-state: running !important;
          }
        }
      `}</style>

      <div ref={containerRef} className={`bri-allow-motion w-full relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />

        <div className="relative z-10 w-full flex items-center justify-center py-8">
          <div className="bri-scroll-mask w-screen max-w-none overflow-hidden">
            <div
              ref={trackRef}
              className="bri-infinite-scroll flex gap-6 w-max will-change-transform"
              style={{ ["--bri-speed" as any]: `${speed}s`, animationPlayState: isActive ? "running" : "paused" }}
              aria-hidden="true"
            >
              {duplicatedImages.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className={`image-item flex-shrink-0 ${cardSize} rounded-xl overflow-hidden shadow-2xl border border-white/10`}
                >
                  <img
                    src={image}
                    alt={`Gallery image ${(index % images.length) + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 ease-out will-change-transform hover:scale-105"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-20" />
      </div>
    </>
  );
}

export default ImageAutoSlider;


