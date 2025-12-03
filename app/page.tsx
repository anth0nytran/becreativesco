"use client";

import { motion, useInView } from 'framer-motion';
import ShaderBackground from '@/components/ShaderBackground';
import DepthLayers from '@/components/DepthLayers';
import Section3DTransition from '@/components/Section3DTransition';
import LeadCapture from '@/components/LeadCapture';
import VideoPlayer from '@/components/VideoPlayer';
import OptimizedVideo from '@/components/OptimizedVideo';
import LazyVideo from '@/components/LazyVideo';
import OptimizedImage from '@/components/OptimizedImage';
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';
import ImageAutoSlider from '@/components/ui/image-auto-slider';
import { ArrowDown, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Suspense, memo, useEffect, useRef, useState, ReactNode, useCallback } from 'react';
import { useHeroMedia, useGalleryMedia, useGridMedia, usePortfolioMedia } from '@/hooks/useMedia';
import StreamPlayer from '@/components/StreamPlayer';
import VideoPlayerModal from '@/components/VideoPlayerModal';

// Fallback local paths (used when R2 is not configured or fails)
const FALLBACK_HERO_VIDEO = '/assets/videos/longerdemoreel.mp4';
const HERO_POSTER_URL = process.env.NEXT_PUBLIC_R2_ASSET_BASE_URL
  ? `${process.env.NEXT_PUBLIC_R2_ASSET_BASE_URL}/photos/photos/untitled-2.jpg`
  : '/assets/photos/untitled-2.jpg';

// Portfolio metadata (titles, categories, icons) - URLs will come from R2
type PortfolioMetadataItem = {
  id: number;
  title: string;
  category: string;
  description: string;
  icon: ReactNode;
  streamId?: string;
};

const portfolioMetadata: PortfolioMetadataItem[] = [
  {
    id: 1,
    title: 'F1 Arcade - Las Vegas',
    category: 'Hospitality & Events',
    description: '',
    icon: <Play className="w-5 h-5" />,
  streamId: '2e95cbc8ca3b3bb719ded77afa7f5950',
  },
  {
    id: 2,
    title: 'The Grand Boston',
    category: 'Nightlife & Concerts',
    description: '',
    icon: <Play className="w-5 h-5" />,
    streamId: '4e284ec992e64d442cb8b22158fa7ecf',
  },
  {
    id: 3,
    title: 'The Mystique Boston',
    category: 'Hospitality & Events',
    description: '',
    icon: <Play className="w-5 h-5" />,
    streamId: 'f1524e7ef25164b94b3ebb808ea9fd8a',
  },
  {
    id: 4,
    title: 'Cardvault By Tom Brady',
    category: 'Hospitality & Events',
    description: '',
    icon: <Play className="w-5 h-5" />,
    streamId: '20422e0a26ed378d2c59b7caef9800e8',
  },
  {
    id: 5,
    title: 'Encore Boston Harbor - Red8',
    category: 'Hospitality & Events',
    description: '',
    icon: <Play className="w-5 h-5" />,
    streamId: 'a6e21326610b2f4ed62830faffb8d2a7',
  },
  {
    id: 6,
    title: 'The Grand Boston - Catdealers',
    category: 'Nightlife & Concerts',
    description: '',
    icon: <Play className="w-5 h-5" />,
    streamId: 'cbbfdcb3d23532c724140c1d7d4f6d1d',
  },
  {
    id: 7,
    title: 'Lisa’s Book Club x Memorie',
    category: 'Hospitality & Events',
    description: '',
    icon: <Play className="w-5 h-5" />,
    streamId: '4bc7f89590d2dafd42a18ca84a992805',
  },
  {
    id: 8,
    title: 'Happy Valley',
    category: 'Branding',
    description: '',
    icon: <Play className="w-5 h-5" />,
    streamId: '63eef3c7ae27733273f1f4834b017ad6',
  },
  {
    id: 9,
    title: 'Big Night Life - Cheatcodes',
    category: 'Nightlife & Concerts',
    description: '',
    icon: <Play className="w-5 h-5" />,
    streamId: '9934047f261fa18cbac6fa0f62dededc',
  },
];

// Grid section metadata
const gridMetadata = [
  { id: 1, title: 'Hospitality & Events', number: '01', position: 'left', category: 'Hospitality & Events' },
  { id: 2, title: 'Nightlife & Concerts', number: '02', position: 'right', category: 'Nightlife & Concerts' },
  { id: 3, title: 'Real Estate & Development', number: '03', position: 'left', category: 'Real Estate & Development' },
  { id: 4, title: 'Branding', number: '04', position: 'right', category: 'Branding' },
];

// Fallback local gallery images
const fallbackGalleryImages = [
  '/assets/photos/untitled-2.jpg',
  '/assets/photos/untitled-5.jpg',
  '/assets/photos/untitled-8.jpg',
  '/assets/photos/untitled-10.jpg',
  '/assets/photos/untitled-11.jpg',
  '/assets/photos/untitled-12.jpg',
  '/assets/photos/untitled-13.jpg',
  '/assets/photos/untitled-16.jpg',
  '/assets/photos/untitled-21.jpg',
  '/assets/photos/untitled-26.jpg',
  '/assets/photos/untitled-30copy.jpg',
  '/assets/photos/untitled-45.jpg',
  '/assets/photos/untitled-47.jpg',
  '/assets/photos/Screenshot.png',
  '/assets/photos/Screenshot2.png',
];

// Fallback grid videos
const fallbackGridVideos = [
  '/assets/videos/F1Arcade_NowOpenReel_(1080x1920)_v3.mp4',
  '/assets/videos/CentralCee_GrandRecap_1920x1080.mp4',
  '/assets/videos/F1Arcade_NowOpenReel_(1080x1920)_v3.mp4',
  '/assets/videos/CentralCee_GrandRecap_1920x1080.mp4',
];

// Fallback portfolio videos and posters
const fallbackPortfolioMedia = [
  { video: '/assets/videos/F1Arcade_NowOpenReel_(1080x1920)_v3.mp4' },
  { video: '/assets/videos/R3hab_GRANDRecap.mp4' },
  { video: '/assets/videos/3.6.25_MystiqueFoodShoot_WagyuToast.mp4' },
  { video: '/assets/videos/ToppsRIpNightRecap_(PaytonPritchard)_v2.mp4' },
  { video: '/assets/videos/EncoreBH_Red8_SashimiPlatter.mp4' },
  { video: '/assets/videos/12.20.24_CatDealers_GRAND(1920x1080).mp4' },
  { video: '/assets/videos/CharmalagneMemoire_1920x1080.mp4' },
  { video: '/assets/videos/HV_POOLSHOOT_HVPRE-ROLLSJULY4TH_1920X1080.mp4' },
  { video: '/assets/videos/11.30.24_CheatcodesRecap.mp4' },
];

const HERO_STREAM_ID = '5ce0fd954f2b3a8d04a1f994581c3425';
const GRID_STREAM_IDS = [
  '2e95cbc8ca3b3bb719ded77afa7f5950', // Hospitality & Events
  '4e284ec992e64d442cb8b22158fa7ecf', // Nightlife & Concerts
  'c9bae1178b2d2bd68de805959df7355f', // Real Estate & Development
  '9b4f6fd0febf4d83297232cda8acbaef', // Branding
];

const heroStats = [
  { value: 150, suffix: '+', label: 'Projects' },
  { value: 50, suffix: '+', label: 'Clients' },
  { value: 10, suffix: '+', label: 'Years' },
];

const AnimatedStat = ({ value, suffix, label }: { value: number; suffix?: string; label: string }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1500;
    const start = performance.now();
    let frameId: number;

    const updateCount = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.round(progress * value));
      if (progress < 1) {
        frameId = requestAnimationFrame(updateCount);
      }
    };

    frameId = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(frameId);
  }, [isInView, value]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-4xl sm:text-5xl md:text-6xl font-bold text-white"
      >
        {count}
        {suffix}
      </motion.div>
      <span className="mt-2 text-xs sm:text-sm uppercase tracking-[0.3em] text-gray-400">
        {label}
      </span>
    </div>
  );
};

// Type for selected video in modal
type SelectedVideoItem = {
  title: string;
  category: string;
  streamId?: string;
  video: string;
};

const Home = memo(function Home() {
  // Track if component has mounted (for hydration safety)
  const [hasMounted, setHasMounted] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<SelectedVideoItem | null>(null);
  
  // Fetch media from R2
  const { data: heroData, loading: heroLoading } = useHeroMedia();
  const { data: galleryData, loading: galleryLoading } = useGalleryMedia();
  const { data: gridData, loading: gridLoading } = useGridMedia();
  const { data: portfolioData, loading: portfolioLoading } = usePortfolioMedia();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleSelectVideo = useCallback((item: SelectedVideoItem) => {
    setSelectedVideo(item);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedVideo(null);
  }, []);

  // Always use fallbacks on server and during initial client render
  // Only switch to R2 data after mount to avoid hydration mismatch
  const useR2Data = hasMounted && !heroLoading && !galleryLoading && !gridLoading && !portfolioLoading;

  // Resolve hero media (R2 or fallback)
const heroFallbackVideo =
    (useR2Data && heroData?.item?.url) || FALLBACK_HERO_VIDEO;
  const heroPosterSrc = HERO_POSTER_URL;

  // Resolve gallery images (R2 or fallback)
  const galleryImages = (useR2Data && galleryData?.items?.length)
    ? galleryData.items.map((item) => item.url)
    : fallbackGalleryImages;

  // Resolve grid videos (R2 or fallback)
  const gridVideos = (useR2Data && gridData?.items?.length)
    ? gridData.items.map((item) => item.url)
    : fallbackGridVideos;

  // Build portfolio items with R2 URLs or fallback
const portfolioItems = portfolioMetadata.map((meta, idx) => {
    const r2Video = useR2Data ? portfolioData?.items?.[idx] : null;
    const fallback = fallbackPortfolioMedia[idx];
    return {
      ...meta,
      streamId: meta.streamId,
      video: meta.streamId ? '' : r2Video?.url || fallback?.video || '',
    };
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <ShaderBackground />
      <DepthLayers />
      
      {/* Scroll Expansion Hero Section */}
      <ScrollExpandMedia
        mediaType="video"
        mediaSrc={heroFallbackVideo}
        streamId={HERO_STREAM_ID}
        bgImageSrc={heroPosterSrc}
        title=""
        date="Featured Work"
        textBlend={false}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="heading-font text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-white tracking-[0.08em]">
            Building Brands Through Visual Storytelling
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 leading-relaxed">
            At BE CREATIVES CO., we transform raw ideas into high-impact visual content, brand assets, and campaigns that resonate with your audience and drive measurable results.
          </p>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed">
            We create end-to-end brand ecosystems—from strategy and messaging to content production and social media visuals—so every touchpoint tells the same powerful story and moves customers closer to working with you.
          </p>
          <div className="mt-10 flex justify-center">
            <Button
              asChild
              variant="outline"
              size="default"
              className="rounded-full border-white/40 bg-white/5 px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-[0_0_25px_rgba(255,255,255,0.12)] transition hover:border-white hover:bg-white/15"
            >
              <Link href="/contact" className="flex items-center justify-center px-4 text-center">
                Book your free creative strategy call now
              </Link>
            </Button>
          </div>
        </div>
      </ScrollExpandMedia>

      {/* Large Content Showcase - Two Column Video Blocks */}
      <Section3DTransition depth={300}>
        <section className="relative py-0 px-0 bg-black">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 min-h-[50vh] md:min-h-screen">
            {/* Left Video Block */}
            <Link
              href={{ pathname: '/portfolio', query: { category: gridMetadata[0].category } }}
              className="block group"
            >
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative cursor-pointer overflow-hidden min-h-[50vh] md:min-h-screen"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
                  <Suspense fallback={<div className="w-full h-full bg-gray-900 animate-pulse" />}>
                    {GRID_STREAM_IDS[0] ? (
                      <StreamPlayer
                        uid={GRID_STREAM_IDS[0]}
                        autoPlay
                        loop
                        muted
                        className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                      />
                    ) : (
                      <OptimizedVideo
                        src={gridVideos[0] || fallbackGridVideos[0]}
                        autoPlay
                        loop
                        muted
                        playsInline
                        priority={false}
                        lazy
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                      />
                    )}
                  </Suspense>
                </div>
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-700 z-[1]" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-[2]">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-4">{gridMetadata[0].title}</h3>
                    <span className="inline-flex items-center gap-2 text-white transition-colors group-hover:text-[#18CCFC]">
                      <span className="text-lg font-medium">View Project</span>
                      <ArrowDown className="w-5 h-5 rotate-[-45deg]" />
                    </span>
                  </motion.div>
                </div>
                <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10">
                  <span className="text-xs md:text-sm text-gray-400">{gridMetadata[0].number}</span>
                </div>
              </motion.div>
            </Link>

            {/* Right Video Block */}
            <Link
              href={{ pathname: '/portfolio', query: { category: gridMetadata[1].category } }}
              className="block group"
            >
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative cursor-pointer overflow-hidden min-h-[50vh] md:min-h-screen"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
                  <Suspense fallback={<div className="w-full h-full bg-gray-900 animate-pulse" />}>
                    {GRID_STREAM_IDS[1] ? (
                      <StreamPlayer
                        uid={GRID_STREAM_IDS[1]}
                        autoPlay
                        loop
                        muted
                        className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                      />
                    ) : (
                      <OptimizedVideo
                        src={gridVideos[1] || fallbackGridVideos[1]}
                        autoPlay
                        loop
                        muted
                        playsInline
                        priority={false}
                        lazy
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                      />
                    )}
                  </Suspense>
                </div>
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-700 z-[1]" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-[2]">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-4">{gridMetadata[1].title}</h3>
                    <span className="inline-flex items-center gap-2 text-white transition-colors group-hover:text-[#18CCFC]">
                      <span className="text-lg font-medium">View Project</span>
                      <ArrowDown className="w-5 h-5 rotate-[-45deg]" />
                    </span>
                  </motion.div>
                </div>
                <div className="absolute top-4 right-4 md:top-8 md:right-8 z-10">
                  <span className="text-xs md:text-sm text-gray-400">{gridMetadata[1].number}</span>
                </div>
              </motion.div>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 min-h-[50vh] md:min-h-screen">
            {/* Left Video Block */}
            <Link
              href={{ pathname: '/portfolio', query: { category: gridMetadata[2].category } }}
              className="block group"
            >
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative cursor-pointer overflow-hidden min-h-[50vh] md:min-h-screen"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
                  <Suspense fallback={<div className="w-full h-full bg-gray-900 animate-pulse" />}>
                    {GRID_STREAM_IDS[2] ? (
                      <StreamPlayer
                        uid={GRID_STREAM_IDS[2]}
                        autoPlay
                        loop
                        muted
                        className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                      />
                    ) : (
                      <OptimizedVideo
                        src={gridVideos[2] || fallbackGridVideos[2]}
                        autoPlay
                        loop
                        muted
                        playsInline
                        priority={false}
                        lazy
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                      />
                    )}
                  </Suspense>
                </div>
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-700 z-[1]" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-[2]">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-4">{gridMetadata[2].title}</h3>
                    <span className="inline-flex items-center gap-2 text-white transition-colors group-hover:text-[#18CCFC]">
                      <span className="text-lg font-medium">View Project</span>
                      <ArrowDown className="w-5 h-5 rotate-[-45deg]" />
                    </span>
                  </motion.div>
                </div>
                <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10">
                  <span className="text-xs md:text-sm text-gray-400">{gridMetadata[2].number}</span>
                </div>
              </motion.div>
            </Link>

            {/* Right Video Block */}
            <Link
              href={{ pathname: '/portfolio', query: { category: gridMetadata[3].category } }}
              className="block group"
            >
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative cursor-pointer overflow-hidden min-h-[50vh] md:min-h-screen"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
                  <Suspense fallback={<div className="w-full h-full bg-gray-900 animate-pulse" />}>
                    {GRID_STREAM_IDS[3] ? (
                      <StreamPlayer
                        uid={GRID_STREAM_IDS[3]}
                        autoPlay
                        loop
                        muted
                        className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                      />
                    ) : (
                      <OptimizedVideo
                        src={gridVideos[3] || fallbackGridVideos[3]}
                        autoPlay
                        loop
                        muted
                        playsInline
                        priority={false}
                        lazy
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                      />
                    )}
                  </Suspense>
                </div>
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-700 z-[1]" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-[2]">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-4">{gridMetadata[3].title}</h3>
                    <span className="inline-flex items-center gap-2 text-white transition-colors group-hover:text-[#18CCFC]">
                      <span className="text-lg font-medium">View Project</span>
                      <ArrowDown className="w-5 h-5 rotate-[-45deg]" />
                    </span>
                  </motion.div>
                </div>
                <div className="absolute top-4 right-4 md:top-8 md:right-8 z-10">
                  <span className="text-xs md:text-sm text-gray-400">{gridMetadata[3].number}</span>
                </div>
              </motion.div>
            </Link>
          </div>
        </section>
      </Section3DTransition>

      {/* Large Video Grid Section */}
      <Section3DTransition depth={200}>
        <section className="relative z-10 py-32 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <h2 className="heading-font text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold mb-6 md:mb-8 text-white leading-tight px-4 tracking-[0.08em]">
              Our
              <br />
              <span className="accent-gradient">Portfolio</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {portfolioItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => handleSelectVideo(item)}
                className="relative aspect-[4/5] rounded-xl overflow-hidden border border-white/10 group cursor-pointer pointer-events-auto will-change-transform will-change-opacity"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black pointer-events-none">
                  {item.streamId ? (
                    <StreamPlayer
                      uid={item.streamId}
                      className="h-full w-full object-cover object-center opacity-60 group-hover:opacity-100 transition-opacity duration-500 ease-out"
                      autoPlay
                      loop
                      muted
                    />
                  ) : (
                    <LazyVideo
                      src={item.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      priority={index < 3}
                      lazy={index >= 3}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 ease-out"
                    />
                  )}
                </div>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500 ease-out pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out pointer-events-none">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 ease-out">
                    {item.icon}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-400">{item.category}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      </Section3DTransition>

      {/* Image Auto Slider Section - Photos gallery */}
      <Section3DTransition depth={80}>
        <section className="relative py-0 bg-black">
          <ImageAutoSlider images={galleryImages} imageSize="lg" speed={55} />
        </section>
      </Section3DTransition>

      {/* Lead Capture Section */}
      <Section3DTransition depth={150}>
        <section className="relative py-32 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="heading-font text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold mb-6 md:mb-8 text-white leading-tight px-4 tracking-[0.08em]">
              Connect
              <span className="accent-gradient"> with us</span>
            </h2>
          </motion.div>

          <LeadCapture />
        </div>
      </section>
      </Section3DTransition>

      {/* Story Section */}
      <Section3DTransition depth={100}>
        <section className="relative py-32 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-12 md:gap-16 items-center"
          >
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              className="space-y-6"
              >
              <div className="inline-flex items-center gap-3 rounded-full bg-white/5 px-5 py-2 text-xs sm:text-sm font-medium text-white/80 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.12)] subtitle-font tracking-[0.35em]">
                OUR STORY
                </div>
              <div>
                <h2 className="heading-font text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight">
                  Crafting Visual
                </h2>
                <p className="heading-font text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-white to-accent-primary bg-clip-text text-transparent">
                  Narratives
                </p>
              </div>
              <div className="space-y-4 text-gray-300 text-lg md:text-xl leading-relaxed">
                <p>
                  At BE CREATIVES CO., we believe every brand has a unique story waiting
                  to be told. Our team of creative professionals merges technical
                  expertise with artistic vision to create compelling visual narratives
                  that resonate with audiences.
                </p>
                <p>
                  From concept to execution, we're committed to delivering excellence
                  that elevates your brand and leaves a lasting impression. Let's create
                  something extraordinary together.
                </p>
              </div>
              </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-white/5 via-white/2 to-transparent p-[1px] shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
                <div className="rounded-[30px] bg-black/80 backdrop-blur-md px-8 py-10 flex flex-col sm:flex-row gap-6 md:gap-10">
                  {heroStats.map((stat, idx) => (
                    <div
                      key={stat.label}
                      className="flex flex-col gap-2 text-left sm:text-center min-w-[120px]"
                    >
                      <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.12 }}
                        className="text-4xl sm:text-5xl font-semibold text-white tracking-tight"
                      >
                        {stat.value}
                        {stat.suffix}
                      </motion.span>
                      <span className="text-xs sm:text-sm uppercase tracking-[0.35em] text-gray-400">
                        {stat.label}
                      </span>
                    </div>
                    ))}
                  </div>
                </div>
              <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-accent-primary/20 blur-3xl" />
            </motion.div>
          </motion.div>
        </div>
      </section>
      </Section3DTransition>

      {/* Video Player Modal */}
      <VideoPlayerModal
        isOpen={!!selectedVideo}
        onClose={handleCloseModal}
        streamId={selectedVideo?.streamId}
        videoSrc={selectedVideo?.video}
        title={selectedVideo?.title || ''}
        category={selectedVideo?.category || ''}
      />
    </div>
  );
});

Home.displayName = 'Home';

export default Home;
