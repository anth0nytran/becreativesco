"use client";

import { motion, useInView } from 'framer-motion';
import dynamic from 'next/dynamic';
import OptimizedVideo from '@/components/OptimizedVideo';
import { Play, ExternalLink, Film, Camera, Sparkles } from 'lucide-react';
import { memo, useDeferredValue, useMemo, useState, useEffect, useRef } from 'react';
import { useProjectsMedia, MediaItem } from '@/hooks/useMedia';

const LazyShaderBackground = dynamic(() => import('@/components/ShaderBackground'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 -z-10 bg-black" aria-hidden="true" />,
});

// Portfolio metadata (titles, categories, icons) - URLs will come from R2
const portfolioMetadata = [
  {
    id: 1,
    title: 'F1 Arcade - Las Vegas',
    category: 'Branding',
    description: '',
    icon: <Film className="w-5 h-5" />,
  },
  {
    id: 2,
    title: 'Encore Boston Harbor - On Deck',
    category: 'Music Video',
    description: '',
    icon: <Film className="w-5 h-5" />,
  },
  {
    id: 3,
    title: 'Big Night Fitness - FitFest',
    category: 'Commercial',
    description: '',
    icon: <Camera className="w-5 h-5" />,
  },
  {
    id: 4,
    title: 'The Grand Boston - Catdealers',
    category: 'Music Video',
    description: '',
    icon: <Film className="w-5 h-5" />,
  },
  {
    id: 5,
    title: 'Happy Valley',
    category: 'Commercial',
    description: '',
    icon: <Camera className="w-5 h-5" />,
  },
  {
    id: 6,
    title: 'Reebook',
    category: 'Music Video',
    description: '',
    icon: <Film className="w-5 h-5" />,
  },
  {
    id: 7,
    title: 'F1 Arcade - Denver',
    category: 'Commercial',
    description: '',
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    id: 8,
    title: 'Univ. Of Mass - Lowell Mens Volleyball',
    category: 'Commercial',
    description: '',
    icon: <Camera className="w-5 h-5" />,
  },
  {
    id: 9,
    title: 'Boatcruise Boston',
    category: 'Commercial',
    description: '',
    icon: <Camera className="w-5 h-5" />,
  },
  {
    id: 10,
    title: 'The Grand Boston - Central Cee',
    category: 'Commercial',
    description: '',
    icon: <Camera className="w-5 h-5" />,
  },
  {
    id: 11,
    title: 'SSRI Clothing',
    category: 'Music Video',
    description: '',
    icon: <Film className="w-5 h-5" />,
  },
  {
    id: 12,
    title: 'Big Night Live x Happy Valley',
    category: 'Commercial',
    description: '',
    icon: <Camera className="w-5 h-5" />,
  },
];

// Fallback local media
const fallbackProjectsMedia = [
  { video: '/assets/videos/F1Arcade_NowOpenReel_(1080x1920)_v3.mp4', image: '/assets/photos/untitled-2.jpg' },
  { video: '/assets/videos/CentralCee_GrandRecap_1920x1080.mp4', image: '/assets/photos/untitled-5.jpg' },
  { video: '/assets/videos/3.6.25_MystiqueFoodShoot_WagyuToast.mp4', image: '/assets/photos/untitled-10.jpg' },
  { video: '/assets/videos/MATRODA_BOATCRUISERecap.mp4', image: '/assets/photos/untitled-11.jpg' },
  { video: '/assets/videos/EncoreBH_Red8_SashimiPlatter.mp4', image: '/assets/photos/untitled-12.jpg' },
  { video: '/assets/videos/AboogieGrand_1920x1080copy.mp4', image: '/assets/photos/untitled-13.jpg' },
  { video: '/assets/videos/CharmalagneMemoire_1920x1080.mp4', image: '/assets/photos/untitled-16.jpg' },
  { video: '/assets/videos/HV_POOLSHOOT_HVPRE-ROLLSJULY4TH_1920X1080.mp4', image: '/assets/photos/untitled-21.jpg' },
  { video: '/assets/videos/3.6.25_MystiqueFoodShoot_ChickenWings.mp4', image: '/assets/photos/untitled-26.jpg' },
  { video: '/assets/videos/3.6.25_MystiqueFoodShoot_TiktokChicken.mp4', image: '/assets/photos/untitled-30copy.jpg' },
  { video: '/assets/videos/Matroda_Recap.mp4', image: '/assets/photos/untitled-45.jpg' },
  { video: '/assets/videos/EncoreBH__Red8_SoftShellCrab.mp4', image: '/assets/photos/untitled-47.jpg' },
];

interface PortfolioItemData {
  id: number;
  title: string;
  category: string;
  description: string;
  video: string;
  image: string;
  icon: React.ReactNode;
}

const PortfolioItem = memo(({ item, index }: { item: PortfolioItemData; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { margin: '-10% 0px -10% 0px', amount: 0.35 });
  const [shouldRenderVideo, setShouldRenderVideo] = useState(index < 3);

  useEffect(() => {
    if (inView) {
      setShouldRenderVideo(true);
    }
  }, [inView]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative aspect-[4/5] overflow-hidden rounded-2xl cursor-pointer border border-white/10 will-change-transform will-change-opacity bg-black/40"
    >
      {/* Video Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {shouldRenderVideo ? (
          <OptimizedVideo
            src={item.video}
            poster={item.image}
            autoPlay
            loop
            muted
            playsInline
            lazy
            priority={index < 2}
            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
          />
        ) : (
          <div
            className="w-full h-full bg-cover bg-center opacity-40"
            style={{ backgroundImage: `url(${item.image})` }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/80 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <div className="translate-y-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 will-change-transform will-change-opacity">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            {item.icon}
            <span className="text-xs font-medium text-white">{item.category}</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{item.title}</h3>
          <p className="text-base text-gray-400 mb-4">{item.description}</p>
          <div className="flex items-center gap-2 text-white group-hover:text-accent-primary transition-colors">
            <Play className="w-5 h-5" />
            <span className="text-base font-medium">View Project</span>
            <ExternalLink className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent blur-xl -z-10 opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
    </motion.div>
  );
});

PortfolioItem.displayName = 'PortfolioItem';

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const deferredCategory = useDeferredValue(selectedCategory);
  const [hasMounted, setHasMounted] = useState(false);

  // Fetch media from R2
  const { data: projectsData, loading: projectsLoading } = useProjectsMedia();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Only use R2 data after mount to avoid hydration mismatch
  const useR2Data = hasMounted && !projectsLoading;

  // Build portfolio items with R2 URLs or fallback
  const portfolioItems: PortfolioItemData[] = useMemo(() => {
    return portfolioMetadata.map((meta, idx) => {
      const r2Video = useR2Data ? projectsData?.items?.[idx] : null;
      const fallback = fallbackProjectsMedia[idx];
      return {
        ...meta,
        video: r2Video?.url || fallback?.video || '',
        image: fallback?.image || '', // Poster images from fallback for now
      };
    });
  }, [projectsData, useR2Data]);

  const filteredItems = useMemo(() => {
    if (deferredCategory === 'All') return portfolioItems;
    return portfolioItems.filter((item) => item.category === deferredCategory);
  }, [deferredCategory, portfolioItems]);

  const categories = [
    'All',
    'Hospitality & Events',
    'Nightlife & Concerts',
    'Real Estate & Development',
    'Branding',
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <LazyShaderBackground />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-4 pt-32">
        <div className="max-w-7xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-[10rem] font-bold mb-6 md:mb-8 text-white leading-[0.9] tracking-tight px-4">
              Featured
              <br />
              <span className="text-accent-primary">Projects</span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 max-w-3xl mx-auto px-4"
            >
              {/* A collection of our finest creative work */}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="relative py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 px-4"
          >
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className={`group relative inline-flex items-center rounded-full px-5 sm:px-7 py-2.5 sm:py-3 text-sm font-semibold tracking-wide transition-all duration-200 whitespace-nowrap border ${
                    isActive
                      ? 'border-transparent bg-white text-black shadow-[0_8px_25px_rgba(255,255,255,0.15)]'
                      : 'border-white/10 bg-white/5 text-gray-300 hover:text-white hover:border-white/30 hover:bg-white/10'
                  }`}
                >
                  <span className="relative z-10">{category}</span>
                  {!isActive && (
                    <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="relative py-32 px-4 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {filteredItems.map((item, index) => (
              <PortfolioItem key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
