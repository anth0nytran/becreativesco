"use client";

import { motion, useInView } from 'framer-motion';
import OptimizedVideo from '@/components/OptimizedVideo';
import StreamPlayer from '@/components/StreamPlayer';
import VideoPlayerModal from '@/components/VideoPlayerModal';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { Play, ExternalLink, Film, Camera, Sparkles } from 'lucide-react';
import { memo, useDeferredValue, useMemo, useState, useEffect, useRef, ReactNode, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProjectsMedia, MediaItem } from '@/hooks/useMedia';

type PortfolioCategory =
  | 'Hospitality & Events'
  | 'Nightlife & Concerts'
  | 'Real Estate & Development'
  | 'Branding';

interface PortfolioMetadataItem {
  id: number;
  title: string;
  category: PortfolioCategory;
  description: string;
  icon: ReactNode;
  streamId?: string;
}

// Portfolio metadata (titles, categories, icons) - URLs will come from R2 or Cloudflare Stream
const portfolioMetadata: PortfolioMetadataItem[] = [
  {
    id: 1,
    title: 'F1 Arcade - Las Vegas',
    category: 'Hospitality & Events',
    description: '',
    icon: <Film className="w-5 h-5" />,
    streamId: '30a99686d143d7eea9822a2cf63392ba',
  },
  {
    id: 2,
    title: 'Encore Boston Harbor - On Deck',
    category: 'Hospitality & Events',
    description: '',
    icon: <Film className="w-5 h-5" />,
    streamId: '732c314ae8de17112e6f7846ad31c19a',
  },
  {
    id: 3,
    title: 'Big Night Fitness - FitFest',
    category: 'Hospitality & Events',
    description: '',
    icon: <Camera className="w-5 h-5" />,
    streamId: 'a2d1b310729bec3b8844df8082f5f5a8',
  },
  {
    id: 4,
    title: 'The Grand Boston - Catdealers',
    category: 'Nightlife & Concerts',
    description: '',
    icon: <Film className="w-5 h-5" />,
    streamId: 'cbbfdcb3d23532c724140c1d7d4f6d1d',
  },
  {
    id: 5,
    title: 'Happy Valley',
    category: 'Branding',
    description: '',
    icon: <Camera className="w-5 h-5" />,
    streamId: '9b4f6fd0febf4d83297232cda8acbaef',
  },
  {
    id: 6,
    title: 'Reebook',
    category: 'Branding',
    description: '',
    icon: <Film className="w-5 h-5" />,
    streamId: '79fd8ecb0ca4cdd531ecee13962e9142',
  },
  {
    id: 7,
    title: 'F1 Arcade - Denver',
    category: 'Hospitality & Events',
    description: '',
    icon: <Sparkles className="w-5 h-5" />,
    streamId: 'dc60a2c17877eba137c2d7b402f1cce8',
  },
  {
    id: 8,
    title: 'Univ. Of Mass - Lowell Mens Volleyball',
    category: 'Hospitality & Events',
    description: '',
    icon: <Camera className="w-5 h-5" />,
    streamId: '0441e6621a8fcf4ce00b1a3bd6821746',
  },
  {
    id: 9,
    title: 'Boatcruise Boston',
    category: 'Nightlife & Concerts',
    description: '',
    icon: <Camera className="w-5 h-5" />,
    streamId: '4a98c0f5b4cdca6122e47f6584f71f15',
  },
  {
    id: 10,
    title: 'The Grand Boston - Central Cee',
    category: 'Nightlife & Concerts',
    description: '',
    icon: <Camera className="w-5 h-5" />,
    streamId: '65d78a6cc9cc69183699402d9e19440e',
  },
  {
    id: 11,
    title: 'SSRI Clothing',
    category: 'Branding',
    description: '',
    icon: <Film className="w-5 h-5" />,
    streamId: '837925b86af152ab6500ff0cc64747f1',
  },
  {
    id: 12,
    title: 'Big Night Live x Happy Valley',
    category: 'Hospitality & Events',
    description: '',
    icon: <Camera className="w-5 h-5" />,
    streamId: '2dfc31793c1a2d76f973b4beb8e8401e',
  },
  {
    id: 13,
    title: 'Access Boston Living',
    category: 'Real Estate & Development',
    description: '',
    icon: <Camera className="w-5 h-5" />,
    streamId: 'c9bae1178b2d2bd68de805959df7355f',
  },
  {
    id: 14,
    title: 'Grand Boston - Night Pulse',
    category: 'Nightlife & Concerts',
    description: '',
    icon: <Camera className="w-5 h-5" />,
    streamId: '4e284ec992e64d442cb8b22158fa7ecf',
  },
  {
    id: 15,
    title: 'Big Night Life - Cheatcodes',
    category: 'Nightlife & Concerts',
    description: '',
    icon: <Camera className="w-5 h-5" />,
    streamId: '9934047f261fa18cbac6fa0f62dededc',
  },
  {
    id: 16,
    title: 'Happy Valley',
    category: 'Branding',
    description: '',
    icon: <Camera className="w-5 h-5" />,
    streamId: '63eef3c7ae27733273f1f4834b017ad6',
  },
];

// Fallback local media
const fallbackProjectsMedia = [
  { video: '/assets/videos/F1Arcade_NowOpenReel_(1080x1920)_v3.mp4' },
  { video: '/assets/videos/CentralCee_GrandRecap_1920x1080.mp4' },
  { video: '/assets/videos/3.6.25_MystiqueFoodShoot_WagyuToast.mp4' },
  { video: '/assets/videos/MATRODA_BOATCRUISERecap.mp4' },
  { video: '/assets/videos/EncoreBH_Red8_SashimiPlatter.mp4' },
  { video: '/assets/videos/AboogieGrand_1920x1080copy.mp4' },
  { video: '/assets/videos/CharmalagneMemoire_1920x1080.mp4' },
  { video: '/assets/videos/HV_POOLSHOOT_HVPRE-ROLLSJULY4TH_1920X1080.mp4' },
  { video: '/assets/videos/3.6.25_MystiqueFoodShoot_ChickenWings.mp4' },
  { video: '/assets/videos/3.6.25_MystiqueFoodShoot_TiktokChicken.mp4' },
  { video: '/assets/videos/Matroda_Recap.mp4' },
  { video: '/assets/videos/EncoreBH__Red8_SoftShellCrab.mp4' },
  { video: '' },
  { video: '' },
  { video: '' },
  { video: '' },
];

interface PortfolioItemData extends PortfolioMetadataItem {
  video: string;
}

interface PortfolioItemProps {
  item: PortfolioItemData;
  index: number;
  onSelect: (item: PortfolioItemData) => void;
}

const PortfolioItem = memo(({ item, index, onSelect }: PortfolioItemProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { margin: '-10% 0px -10% 0px', amount: 0.35 });
  const [shouldRenderVideo, setShouldRenderVideo] = useState(index < 3);

  useEffect(() => {
    if (inView) {
      setShouldRenderVideo(true);
    }
  }, [inView]);

  const handleClick = useCallback(() => {
    onSelect(item);
  }, [item, onSelect]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onClick={handleClick}
      className="group relative aspect-[4/5] overflow-hidden rounded-2xl cursor-pointer border border-white/10 will-change-transform will-change-opacity bg-black/40"
    >
      {/* Video Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {shouldRenderVideo ? (
          item.streamId ? (
            <StreamPlayer
              uid={item.streamId}
              autoPlay
              loop
              muted
              className="w-full h-full object-cover object-center opacity-60 group-hover:opacity-100 transition-opacity duration-700"
            />
          ) : (
            <OptimizedVideo
              src={item.video}
              autoPlay
              loop
              muted
              playsInline
              lazy
              priority={index < 2}
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
            />
          )
        ) : (
          <div
            className="w-full h-full bg-gradient-to-br from-gray-800 via-black to-black opacity-60 animate-pulse"
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
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{item.title}</h3>
          <p className="text-base text-gray-400 mb-4">{item.description}</p>
          <div className="flex items-center gap-2 text-accent-primary transition-colors">
            <Play className="w-5 h-5" />
            <span className="text-base font-medium">Watch Full Video</span>
          </div>
        </div>
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent blur-xl -z-10 opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
    </motion.div>
  );
});

PortfolioItem.displayName = 'PortfolioItem';

function PortfolioContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const deferredCategory = useDeferredValue(selectedCategory);
  const [hasMounted, setHasMounted] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<PortfolioItemData | null>(null);

  // Fetch media from R2
  const { data: projectsData, loading: projectsLoading } = useProjectsMedia();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleSelectVideo = useCallback((item: PortfolioItemData) => {
    setSelectedVideo(item);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedVideo(null);
  }, []);

  // Only use R2 data after mount to avoid hydration mismatch
  const useR2Data = hasMounted && !projectsLoading;

  // Build portfolio items with R2 URLs or fallback
  const portfolioItems: PortfolioItemData[] = useMemo(() => {
    return portfolioMetadata.map((meta, idx) => {
      const r2Video = useR2Data ? projectsData?.items?.[idx] : null;
      const fallback = fallbackProjectsMedia[idx] ?? { video: '' };
      return {
        ...meta,
        video: r2Video?.url || fallback?.video || '',
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
    <div className="relative min-h-screen overflow-hidden bg-neutral-950">
      <BackgroundBeams className="fixed inset-0 z-0" />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-4 pt-32">
        <div className="max-w-7xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="heading-font text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-[6.5rem] font-bold mb-6 md:mb-8 text-white leading-[0.9] tracking-[0.08em] px-4">
              Featured
              <br />
              <span className="accent-gradient">Projects</span>
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
              <PortfolioItem
                key={item.id}
                item={item}
                index={index}
                onSelect={handleSelectVideo}
              />
            ))}
          </div>
        </div>
      </section>

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
}

export default function PortfolioPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          Loading portfolio…
        </div>
      }
    >
      <PortfolioContent />
    </Suspense>
  );
}