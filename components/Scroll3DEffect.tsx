"use client";

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef, useEffect, useState, memo, useMemo } from 'react';

interface Scroll3DEffectProps {
  children: React.ReactNode;
  className?: string;
}

const Scroll3DEffect = memo(({ children, className = '' }: Scroll3DEffectProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    
    const resizeHandler = () => checkMobile();
    window.addEventListener('resize', resizeHandler, { passive: true });
    
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Memoize transform values
  const translateY = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 50 : 150], {
    clamp: false
  });
  
  const translateZ = useTransform(scrollYProgress, [0, 1], [0, isMobile ? -50 : -200], {
    clamp: false
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.3], {
    clamp: true
  });

  // Subtle parallax for background elements - reduced for performance
  const bgY1 = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const bgY2 = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Subtle background depth layers - only render when needed */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          style={{ y: bgY1 }}
          className="absolute inset-0 opacity-20"
        >
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-primary/8 rounded-full blur-[120px]" />
        </motion.div>
        <motion.div
          style={{ y: bgY2 }}
          className="absolute inset-0 opacity-15"
        >
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-[120px]" />
        </motion.div>
      </div>

      {/* Main content with clean depth transform */}
      <motion.div
        style={{
          translateY,
          translateZ,
          opacity,
          transformStyle: "preserve-3d",
          WebkitFontSmoothing: "subpixel-antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
        className="relative will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
});

Scroll3DEffect.displayName = 'Scroll3DEffect';

export default Scroll3DEffect;
