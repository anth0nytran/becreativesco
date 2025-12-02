'use client';

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode,
  TouchEvent,
  WheelEvent,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  children?: ReactNode;
}

const ScrollExpandMedia = ({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
  children,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
  const [touchStartY, setTouchStartY] = useState<number>(0);
  const [isMobileState, setIsMobileState] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const wasActiveRef = useRef<boolean>(false);
  const hadUserInteractionRef = useRef<boolean>(false);

  // Track user interaction to know if we need to simulate focus
  useEffect(() => {
    const markInteraction = () => {
      hadUserInteractionRef.current = true;
    };
    
    window.addEventListener('click', markInteraction, { once: true });
    window.addEventListener('keydown', markInteraction, { once: true });
    
    return () => {
      window.removeEventListener('click', markInteraction);
      window.removeEventListener('keydown', markInteraction);
    };
  }, []);

  // When hero becomes active after being inactive, ensure document can capture wheel events
  useEffect(() => {
    if (isActive && !wasActiveRef.current) {
      if (!hadUserInteractionRef.current && sectionRef.current) {
        const fakeClick = () => document.body.click();
        fakeClick();
        document.body.focus();
        window.scrollTo({ top: window.scrollY, behavior: 'instant' as ScrollBehavior });
      }
    }
    wasActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    setScrollProgress(0);
    setShowContent(false);
    setMediaFullyExpanded(false);
  }, [mediaType]);

  useEffect(() => {
    const target = sectionRef.current;
    if (!target) return;

    const evaluateInitialVisibility = () => {
      const rect = target.getBoundingClientRect();
      const height = Math.max(rect.height, 1);
      const visible = Math.max(
        0,
        Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0),
      );
      const ratio = visible / height;
      const active = ratio > 0.3;
      setIsActive(active);
      if (!active && !mediaFullyExpanded && rect.top < 0) {
        setMediaFullyExpanded(true);
        setShowContent(true);
        setScrollProgress(1);
      }
    };

    evaluateInitialVisibility();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const active = entry.isIntersecting && entry.intersectionRatio > 0.3;
          setIsActive(active);
          if (!entry.isIntersecting && !mediaFullyExpanded) {
            setMediaFullyExpanded(true);
            setShowContent(true);
            setScrollProgress(1);
          }
        });
      },
      { threshold: [0, 0.3, 0.6, 1], rootMargin: '-20% 0px -20% 0px' },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [mediaFullyExpanded]);

  // Use refs to always have latest values in event handlers without re-attaching listeners
  const stateRef = useRef({ scrollProgress, mediaFullyExpanded, touchStartY, isActive });
  useEffect(() => {
    stateRef.current = { scrollProgress, mediaFullyExpanded, touchStartY, isActive };
  }, [scrollProgress, mediaFullyExpanded, touchStartY, isActive]);

  // Stable event handlers that read from refs
  const handleWheel = useCallback((e: globalThis.WheelEvent) => {
    const { isActive: active, mediaFullyExpanded: expanded, scrollProgress: progress } = stateRef.current;
    
    if (!active) return;

    if (expanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
    } else if (!expanded) {
        e.preventDefault();
        const scrollDelta = e.deltaY * 0.0009;
      const newProgress = Math.min(Math.max(progress + scrollDelta, 0), 1);
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
      }
  }, []);

  const handleTouchStart = useCallback((e: globalThis.TouchEvent) => {
    if (!stateRef.current.isActive) return;
      setTouchStartY(e.touches[0].clientY);
  }, []);

  const handleTouchMove = useCallback((e: globalThis.TouchEvent) => {
    const { isActive: active, mediaFullyExpanded: expanded, scrollProgress: progress, touchStartY: touchStart } = stateRef.current;

    if (!active || !touchStart) return;

      const touchY = e.touches[0].clientY;
    const deltaY = touchStart - touchY;

    if (expanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
    } else if (!expanded) {
        e.preventDefault();
      const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
        const scrollDelta = deltaY * scrollFactor;
      const newProgress = Math.min(Math.max(progress + scrollDelta, 0), 1);
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }

        setTouchStartY(touchY);
      }
  }, []);

  const handleTouchEnd = useCallback(() => {
      setTouchStartY(0);
  }, []);

  // Attach event listeners once and never remove them - they check isActive internally
  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Removed hard reset on scroll-to-top so the animation can reverse naturally

  useEffect(() => {
    const checkIfMobile = (): void => {
      setIsMobileState(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const mediaWidth = 300 + scrollProgress * (isMobileState ? 650 : 1250);
  const mediaHeight = 400 + scrollProgress * (isMobileState ? 200 : 400);
  const textTranslateX = scrollProgress * (isMobileState ? 180 : 150);

  const firstWord = title ? title.split(' ')[0] : '';
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : '';

  return (
    <div
      ref={sectionRef}
      className='transition-colors duration-700 ease-in-out overflow-x-hidden bg-black'
    >
      <section className='relative flex flex-col items-center justify-start min-h-[100dvh]'>
        <div className='relative w-full flex flex-col items-center min-h-[100dvh]'>
          <motion.div
            className='absolute inset-0 z-0 h-full'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - scrollProgress }}
            transition={{ duration: 0.1 }}
          >
            <img
              src={bgImageSrc}
              alt='Background'
              className='w-screen h-screen object-cover'
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
              }}
              loading="eager"
            />
            <div className='absolute inset-0 bg-black/40' />
          </motion.div>

          <div className='container mx-auto flex flex-col items-center justify-start relative z-10'>
            <div className='flex flex-col items-center justify-center w-full h-[100dvh] relative'>
              {/* Centered media + scroll indicator stack */}
              <div className='relative flex flex-col items-center'>
              <div
                  className='transition-none rounded-2xl overflow-hidden'
                style={{
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  maxWidth: '95vw',
                  maxHeight: '85vh',
                  boxShadow: '0px 0px 50px rgba(0, 0, 0, 0.5)',
                }}
              >
                {mediaType === 'video' ? (
                  mediaSrc.includes('youtube.com') ? (
                    <div className='relative w-full h-full pointer-events-none'>
                      <iframe
                        width='100%'
                        height='100%'
                        src={
                          mediaSrc.includes('embed')
                            ? mediaSrc +
                              (mediaSrc.includes('?') ? '&' : '?') +
                              'autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1'
                            : mediaSrc.replace('watch?v=', 'embed/') +
                              '?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playlist=' +
                              mediaSrc.split('v=')[1]
                        }
                        className='w-full h-full rounded-xl'
                        frameBorder='0'
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                        allowFullScreen
                      />
                      <div
                        className='absolute inset-0 z-10'
                        style={{ pointerEvents: 'none' }}
                      ></div>

                      <motion.div
                        className='absolute inset-0 bg-black/30 rounded-xl'
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  ) : (
                    <div className='relative w-full h-full pointer-events-none'>
                      <video
                        src={mediaSrc}
                        poster={posterSrc}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload='auto'
                        className='w-full h-full object-cover rounded-xl'
                        controls={false}
                        disablePictureInPicture
                        disableRemotePlayback
                      />
                      <div
                        className='absolute inset-0 z-10'
                        style={{ pointerEvents: 'none' }}
                      ></div>

                      <motion.div
                        className='absolute inset-0 bg-black/30 rounded-xl'
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  )
                ) : (
                  <div className='relative w-full h-full'>
                    <img
                      src={mediaSrc}
                      alt={title || 'Media content'}
                      className='w-full h-full object-cover rounded-xl'
                      loading="lazy"
                    />

                    <motion.div
                      className='absolute inset-0 bg-black/50 rounded-xl'
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 0.7 - scrollProgress * 0.3 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                )}

                <div className='flex flex-col items-center text-center relative z-10 mt-4 transition-none'>
                  {date && (
                    <p
                      className='text-sm sm:text-base md:text-lg lg:text-xl text-accent-primary font-medium'
                      style={{ transform: `translateX(-${textTranslateX}vw)` }}
                    >
                      {date}
                    </p>
                  )}
                </div>
                </div>
              </div>

              {/* Scroll Indicator - directly under media */}
              <AnimatePresence>
                {scrollProgress < 0.1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className='mt-6 flex flex-col items-center'
                  >
                    <motion.div
                      animate={{ y: [0, 6, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className='flex flex-col items-center'
                    >
                      <span className='text-xs font-medium text-white/80 mb-3 tracking-[0.2em] uppercase drop-shadow-lg'>
                        Scroll to explore
                      </span>
                      {/* <div className='w-[1px] h-8 bg-gradient-to-b from-white/60 to-transparent' /> */}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div
                className={`flex items-center justify-center text-center gap-4 w-full relative z-10 transition-none flex-col ${
                  textBlend ? 'mix-blend-difference' : 'mix-blend-normal'
                }`}
              >
                <motion.h2
                  className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white transition-none'
                  style={{ transform: `translateX(-${textTranslateX}vw)` }}
                >
                  {firstWord}
                </motion.h2>
                <motion.h2
                  className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-center text-white transition-none'
                  style={{ transform: `translateX(${textTranslateX}vw)` }}
                >
                  {restOfTitle}
                </motion.h2>
              </div>
            </div>

            <motion.section
              className='flex flex-col w-full px-8 py-10 md:px-16 lg:py-20'
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              {children}
            </motion.section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;

