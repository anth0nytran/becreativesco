"use client";

import { motion } from 'framer-motion';
import ShaderBackground from '@/components/ShaderBackground';
import OptimizedVideo from '@/components/OptimizedVideo';
import OptimizedImage from '@/components/OptimizedImage';
import { Play, ExternalLink, Film, Camera, Sparkles } from 'lucide-react';
import { useState } from 'react';

const portfolioItems = [
  {
    id: 1,
    title: 'F1 Arcade Grand Opening',
    category: 'Commercial',
    description: 'Cinematic showcase reel for F1 Arcade grand opening event.',
    video: '/assets/videos/F1Arcade_NowOpenReel_(1080x1920)_v3.mp4',
    image: '/assets/photos/untitled-2.jpg',
    icon: <Film className="w-5 h-5" />,
  },
  {
    id: 2,
    title: 'Central Cee Recap',
    category: 'Music Video',
    description: 'High-energy recap video for Central Cee grand event.',
    video: '/assets/videos/CentralCee_GrandRecap_1920x1080.mp4',
    image: '/assets/photos/untitled-5.jpg',
    icon: <Film className="w-5 h-5" />,
  },
  {
    id: 3,
    title: 'Mystique Food Shoot - Wagyu',
    category: 'Commercial',
    description: 'Premium food cinematography featuring Wagyu Toast.',
    video: '/assets/videos/3.6.25_MystiqueFoodShoot_WagyuToast.mp4',
    image: '/assets/photos/untitled-10.jpg',
    icon: <Camera className="w-5 h-5" />,
  },
  {
    id: 4,
    title: 'Matroda Boat Cruise',
    category: 'Music Video',
    description: 'Dynamic recap of Matroda boat cruise event.',
    video: '/assets/videos/MATRODA_BOATCRUISERecap.mp4',
    image: '/assets/photos/untitled-11.jpg',
    icon: <Film className="w-5 h-5" />,
  },
  {
    id: 5,
    title: 'Encore BH Red8 Sashimi',
    category: 'Commercial',
    description: 'Elegant food photography showcasing premium sashimi platter.',
    video: '/assets/videos/EncoreBH_Red8_SashimiPlatter.mp4',
    image: '/assets/photos/untitled-12.jpg',
    icon: <Camera className="w-5 h-5" />,
  },
  {
    id: 6,
    title: 'A Boogie Grand Event',
    category: 'Music Video',
    description: 'Epic recap video for A Boogie With The Hoodie grand event.',
    video: '/assets/videos/AboogieGrand_1920x1080copy.mp4',
    image: '/assets/photos/untitled-13.jpg',
    icon: <Film className="w-5 h-5" />,
  },
  {
    id: 7,
    title: 'Charmalagne Memoire',
    category: 'Commercial',
    description: 'Artistic showcase of Charmalagne Memoire project.',
    video: '/assets/videos/CharmalagneMemoire_1920x1080.mp4',
    image: '/assets/photos/untitled-16.jpg',
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    id: 8,
    title: 'HV Pool Shoot',
    category: 'Commercial',
    description: 'Summer vibes captured in HV pool shoot event.',
    video: '/assets/videos/HV_POOLSHOOT_HVPRE-ROLLSJULY4TH_1920X1080.mp4',
    image: '/assets/photos/untitled-21.jpg',
    icon: <Camera className="w-5 h-5" />,
  },
  {
    id: 9,
    title: 'Mystique Chicken Wings',
    category: 'Commercial',
    description: 'Food cinematography featuring crispy chicken wings.',
    video: '/assets/videos/3.6.25_MystiqueFoodShoot_ChickenWings.mp4',
    image: '/assets/photos/untitled-26.jpg',
    icon: <Camera className="w-5 h-5" />,
  },
  {
    id: 10,
    title: 'Mystique TikTok Chicken',
    category: 'Commercial',
    description: 'Viral-worthy food content for social media.',
    video: '/assets/videos/3.6.25_MystiqueFoodShoot_TiktokChicken.mp4',
    image: '/assets/photos/untitled-30copy.jpg',
    icon: <Camera className="w-5 h-5" />,
  },
  {
    id: 11,
    title: 'Matroda Recap',
    category: 'Music Video',
    description: 'Event recap highlighting Matroda performance.',
    video: '/assets/videos/Matroda_Recap.mp4',
    image: '/assets/photos/untitled-45.jpg',
    icon: <Film className="w-5 h-5" />,
  },
  {
    id: 12,
    title: 'Encore BH Soft Shell Crab',
    category: 'Commercial',
    description: 'Culinary showcase of soft shell crab dish.',
    video: '/assets/videos/EncoreBH__Red8_SoftShellCrab.mp4',
    image: '/assets/photos/untitled-47.jpg',
    icon: <Camera className="w-5 h-5" />,
  },
];

const PortfolioItem = ({ item, index }: { item: typeof portfolioItems[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative aspect-[4/5] overflow-hidden rounded-2xl cursor-pointer border border-white/10"
    >
      {/* Video Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <OptimizedVideo
          src={item.video}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
        />
      </div>

      {/* Overlay */}
      <motion.div
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/80 to-transparent"
      />

      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <motion.div
          animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
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
        </motion.div>
      </div>

      {/* Glow Effect */}
      <motion.div
        animate={{ opacity: isHovered ? 0.3 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent blur-xl -z-10"
      />
    </motion.div>
  );
};

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Commercial', 'Photography', 'Music Video', 'Film'];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ShaderBackground />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-4 pt-32">
        <div className="max-w-7xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl xl:text-[12rem] font-bold mb-6 md:mb-8 text-white leading-[0.9] tracking-tight px-4">
              Our
              <br />
              <span className="text-accent-primary">Work</span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 max-w-3xl mx-auto px-4"
            >
              A collection of our finest creative work
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
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 text-sm sm:text-base ${
                  selectedCategory === category
                    ? 'bg-white text-black'
                    : 'bg-dark-card/50 text-gray-400 hover:text-white border border-white/10 hover:border-white/30'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="relative py-32 px-4 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {portfolioItems
              .filter((item) => selectedCategory === 'All' || item.category === selectedCategory)
              .map((item, index) => (
                <PortfolioItem key={item.id} item={item} index={index} />
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
