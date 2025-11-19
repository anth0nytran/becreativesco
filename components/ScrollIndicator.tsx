"use client";

import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const ScrollIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 1.5 }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
    >
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="flex flex-col items-center gap-2"
      >
        <span className="text-sm text-gray-400 uppercase tracking-wider">Scroll</span>
        <ArrowDown className="w-6 h-6 text-white" />
      </motion.div>
    </motion.div>
  );
};

export default ScrollIndicator;

