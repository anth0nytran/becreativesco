"use client";

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef, useEffect, useState, memo, useMemo } from 'react';

interface Section3DTransitionProps {
  children: React.ReactNode;
  className?: string;
  depth?: number;
}

const Section3DTransition = memo(({ 
  children, 
  className = '',
  depth = 400 
}: Section3DTransitionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    
    const resizeHandler = () => checkMobile();
    window.addEventListener('resize', resizeHandler, { passive: true });
    
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  // Intersection Observer to only enable effects when visible
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      {
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center", "end start"]
  });

  // Memoize transforms to prevent recalculation
  const adjustedDepth = useMemo(() => isMobile ? depth * 0.3 : depth, [isMobile, depth]);
  
  const translateZ = useTransform(
    scrollYProgress, 
    [0, 0.5, 1], 
    [adjustedDepth, 0, -adjustedDepth * 0.5], 
    { clamp: false }
  );
  
  const translateY = useTransform(
    scrollYProgress, 
    [0, 0.5, 1], 
    [isMobile ? 30 : 100, 0, isMobile ? -15 : -50], 
    { clamp: false }
  );
  
  const opacity = useTransform(
    scrollYProgress, 
    [0, 0.2, 0.8, 1], 
    [0, 1, 1, 0.5], 
    { clamp: true }
  );
  
  const scale = useTransform(
    scrollYProgress, 
    [0, 0.5, 1], 
    [0.95, 1, 0.98], 
    { clamp: true }
  );

  // Only apply 3D transforms when visible for better performance
  const transformStyle = isVisible ? {
    translateZ,
    translateY,
    opacity,
    scale,
    transformStyle: "preserve-3d" as const,
    WebkitFontSmoothing: "subpixel-antialiased" as const,
    MozOsxFontSmoothing: "grayscale" as const,
  } : {
    opacity: 1,
  };

  return (
    <div ref={sectionRef} className={`relative ${className}`}>
      <motion.div
        style={transformStyle}
        className="relative will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
});

Section3DTransition.displayName = 'Section3DTransition';

export default Section3DTransition;
