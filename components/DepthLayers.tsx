"use client";

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

const DepthLayers = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Cleaner, more subtle parallax layers with smooth easing
  const layer1 = useTransform(scrollYProgress, [0, 1], [0, -150], {
    clamp: false
  });
  const layer2 = useTransform(scrollYProgress, [0, 1], [0, -250], {
    clamp: false
  });
  const layer3 = useTransform(scrollYProgress, [0, 1], [0, -350], {
    clamp: false
  });

  // Subtle opacity changes with clamping
  const opacity1 = useTransform(scrollYProgress, [0, 0.5, 1], [0.08, 0.12, 0.08], {
    clamp: true
  });
  const opacity2 = useTransform(scrollYProgress, [0, 0.5, 1], [0.05, 0.08, 0.05], {
    clamp: true
  });
  const opacity3 = useTransform(scrollYProgress, [0, 0.5, 1], [0.03, 0.05, 0.03], {
    clamp: true
  });

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Layer 1 - Subtle background glow */}
      <motion.div
        style={{ y: layer1, opacity: opacity1 }}
        className="absolute inset-0"
      >
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-primary/6 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-white/4 rounded-full blur-[140px]" />
      </motion.div>

      {/* Layer 2 - Mid depth */}
      <motion.div
        style={{ y: layer2, opacity: opacity2 }}
        className="absolute inset-0"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-primary/4 rounded-full blur-[180px]" />
      </motion.div>

      {/* Layer 3 - Deep background */}
      <motion.div
        style={{ y: layer3, opacity: opacity3 }}
        className="absolute inset-0"
      >
        <div className="absolute bottom-1/3 left-1/3 w-[700px] h-[700px] bg-white/3 rounded-full blur-[200px]" />
      </motion.div>
    </div>
  );
};

export default DepthLayers;

