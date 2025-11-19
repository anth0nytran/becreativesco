"use client";

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const ShaderBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create animated gradient mesh
      const gradient = ctx.createLinearGradient(
        canvas.width / 2 + Math.sin(time) * 200,
        canvas.height / 2 + Math.cos(time) * 200,
        canvas.width / 2 - Math.sin(time) * 200,
        canvas.height / 2 - Math.cos(time) * 200
      );

      gradient.addColorStop(0, 'rgba(74, 144, 226, 0.05)');
      gradient.addColorStop(0.5, 'rgba(123, 138, 139, 0.03)');
      gradient.addColorStop(1, 'rgba(74, 144, 226, 0.05)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw animated particles
      for (let i = 0; i < 50; i++) {
        const x = (canvas.width / 2) + Math.sin(time + i) * (200 + Math.sin(time * 2) * 100);
        const y = (canvas.height / 2) + Math.cos(time + i) * (200 + Math.cos(time * 2) * 100);
        const size = 2 + Math.sin(time * 2 + i) * 1;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(74, 144, 226, ${0.2 + Math.sin(time + i) * 0.1})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 opacity-30"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default ShaderBackground;

