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
import { getVideoUrl, getPhotoUrl } from '@/lib/media';
import { ArrowDown, ArrowUpRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Suspense, memo, useEffect, useRef, useState } from 'react';

// Portfolio items with actual assets
const portfolioItems = [
  {
    id: 1,
    title: 'F1 Arcade - Las Vegas',
    category: 'Branding',
    description: '',
    video: getVideoUrl('F1Arcade_NowOpenReel_(1080x1920)_v3.mp4'),
    image: getPhotoUrl('untitled-2.jpg'),
    icon: <Play className="w-5 h-5" />,
  },
  {
    id: 2,
    title: 'The Grand Boston',
    category: 'Hospitality & Events',
    description: '',
    video: getVideoUrl('R3hab_GRANDRecap.mp4'),
    image: getPhotoUrl('untitled-5.jpg'),
    icon: <Play className="w-5 h-5" />,
  },
  {
    id: 3,
    title: 'The Mystique Boston',
    category: 'Branding',
    description: '',
    video: getVideoUrl('3.6.25_MystiqueFoodShoot_WagyuToast.mp4'),
    image: getPhotoUrl('untitled-10.jpg'),
    icon: <Play className="w-5 h-5" />,
  },
  {
    id: 4,
    title: 'Cardvault By Tom Brady',
    category: 'Hospitality & Events',
    description: '',
    video: getVideoUrl('ToppsRIpNightRecap_(PaytonPritchard)_v2.mp4'),
    image: getPhotoUrl('untitled-11.jpg'),
    icon: <Play className="w-5 h-5" />,
  },
  {
    id: 5,
    title: 'Encore Boston Harbor - Red8',
    category: 'Commercial',
    description: '',
    video: getVideoUrl('EncoreBH_Red8_SashimiPlatter.mp4'),
    image: getPhotoUrl('untitled-12.jpg'),
    icon: <Play className="w-5 h-5" />,
  },
  {
    id: 6,
    title: 'The Grand Boston - Catdealers',
    category: 'Music Video',
    description: '',
    video: getVideoUrl('12.20.24_CatDealers_GRAND(1920x1080).mp4'),
    image: getPhotoUrl('untitled-13.jpg'),
    icon: <Play className="w-5 h-5" />,
  },
  {
    id: 7,
    title: 'Charmalagne Memoire',
    category: 'Commercial',
    description: 'Artistic showcase of Charmalagne Memoire project.',
    video: getVideoUrl('CharmalagneMemoire_1920x1080.mp4'),
    image: getPhotoUrl('untitled-16.jpg'),
    icon: <Play className="w-5 h-5" />,
  },
  {
    id: 8,
    title: 'Happy Vally',
    category: 'Branding',
    description: '',
    video: getVideoUrl('HV_POOLSHOOT_HVPRE-ROLLSJULY4TH_1920X1080.mp4'),
    image: getPhotoUrl('untitled-21.jpg'),
    icon: <Play className="w-5 h-5" />,
  },
  {
    id: 9,
    title: 'Big Night Life - Cheatcodes',
    category: 'Commercial',
    description: '',
    video: getVideoUrl('11.30.24_CheatcodesRecap.mp4'),
    image: getPhotoUrl('untitled-26.jpg'),
    icon: <Play className="w-5 h-5" />,
  },
];

// Local gallery images (via helper so they can come from Supabase or /public)
const galleryImages = [
  'untitled-2.jpg',
  'untitled-5.jpg',
  'untitled-8.jpg',
  'untitled-10.jpg',
  'untitled-11.jpg',
  'untitled-12.jpg',
  'untitled-13.jpg',
  'untitled-16.jpg',
  'untitled-21.jpg',
  'untitled-26.jpg',
  'untitled-30copy.jpg',
  'untitled-45.jpg',
  'untitled-47.jpg',
  'Screenshot.png',
  'Screenshot2.png',
].map(getPhotoUrl);

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

const Home = memo(function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <ShaderBackground />
      <DepthLayers />
      
      {/* Scroll Expansion Hero Section */}
      <ScrollExpandMedia
        mediaType="video"
        mediaSrc={getVideoUrl('longerdemoreel.mp4')}
        bgImageSrc={getPhotoUrl('untitled-2.jpg')}
        title=""
        date="Featured Work"
        textBlend={false}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white">
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
              size="lg"
              className="group rounded-full border-white/40 bg-white/5 px-8 py-6 text-base sm:text-lg font-semibold text-white shadow-[0_0_35px_rgba(255,255,255,0.15)] transition hover:border-white hover:bg-white/15"
            >
              <Link href="/contact" className="flex items-center gap-3">
                <span>Book your free creative strategy call now</span>
                <ArrowUpRight className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-1" />
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
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative group cursor-pointer overflow-hidden min-h-[50vh] md:min-h-screen"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
                <Suspense fallback={<div className="w-full h-full bg-gray-900 animate-pulse" />}>
                  <OptimizedVideo
                    src={getVideoUrl('F1Arcade_NowOpenReel_(1080x1920)_v3.mp4')}
                    autoPlay
                    loop
                    muted
                    playsInline
                    priority={false}
                    lazy={true}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                  />
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
                  <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4">Hospitality & Events</h3>
                  {/* <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-4 md:mb-6">Cinematic storytelling that elevates your brand</p> */}
                  <Link href="/portfolio" className="inline-flex items-center gap-2 text-white hover:text-accent-primary transition-colors">
                    <span className="text-lg font-medium">View Project</span>
                    <ArrowDown className="w-5 h-5 rotate-[-45deg]" />
                  </Link>
                </motion.div>
              </div>
              <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10">
                <span className="text-xs md:text-sm text-gray-400">01</span>
              </div>
            </motion.div>

            {/* Right Video Block */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative group cursor-pointer overflow-hidden min-h-[50vh] md:min-h-screen"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
                <Suspense fallback={<div className="w-full h-full bg-gray-900 animate-pulse" />}>
                  <OptimizedVideo
                    src={getVideoUrl('CentralCee_GrandRecap_1920x1080.mp4')}
                    autoPlay
                    loop
                    muted
                    playsInline
                    priority={false}
                    lazy={true}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                  />
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
                  <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4">Nightlife & Concerts</h3>
                  {/* <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-4 md:mb-6">High-impact campaigns that drive results</p> */}
                  <Link href="/portfolio" className="inline-flex items-center gap-2 text-white hover:text-accent-primary transition-colors">
                    <span className="text-lg font-medium">View Project</span>
                    <ArrowDown className="w-5 h-5 rotate-[-45deg]" />
                  </Link>
                </motion.div>
              </div>
              <div className="absolute top-4 right-4 md:top-8 md:right-8 z-10">
                <span className="text-xs md:text-sm text-gray-400">02</span>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 min-h-[50vh] md:min-h-screen">
            {/* Left Video Block */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative group cursor-pointer overflow-hidden min-h-[50vh] md:min-h-screen"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
                <Suspense fallback={<div className="w-full h-full bg-gray-900 animate-pulse" />}>
                  <OptimizedVideo
                    src={getVideoUrl('F1Arcade_NowOpenReel_(1080x1920)_v3.mp4')}
                    autoPlay
                    loop
                    muted
                    playsInline
                    priority={false}
                    lazy={true}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                  />
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
                  <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4">Real Estate & Development</h3>
                  {/* <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-4 md:mb-6">Cinematic storytelling that elevates your brand</p> */}
                  <Link href="/portfolio" className="inline-flex items-center gap-2 text-white hover:text-accent-primary transition-colors">
                    <span className="text-lg font-medium">View Project</span>
                    <ArrowDown className="w-5 h-5 rotate-[-45deg]" />
                  </Link>
                </motion.div>
              </div>
              <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10">
                <span className="text-xs md:text-sm text-gray-400">01</span>
              </div>
            </motion.div>

            {/* Right Video Block */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative group cursor-pointer overflow-hidden min-h-[50vh] md:min-h-screen"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
                <Suspense fallback={<div className="w-full h-full bg-gray-900 animate-pulse" />}>
                  <OptimizedVideo
                    src={getVideoUrl('CentralCee_GrandRecap_1920x1080.mp4')}
                    autoPlay
                    loop
                    muted
                    playsInline
                    priority={false}
                    lazy={true}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                  />
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
                  <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4">Branding</h3>
                  {/* <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-4 md:mb-6">High-impact campaigns that drive results</p> */}
                  <Link href="/portfolio" className="inline-flex items-center gap-2 text-white hover:text-accent-primary transition-colors">
                    <span className="text-lg font-medium">View Project</span>
                    <ArrowDown className="w-5 h-5 rotate-[-45deg]" />
                  </Link>
                </motion.div>
              </div>
              <div className="absolute top-4 right-4 md:top-8 md:right-8 z-10">
                <span className="text-xs md:text-sm text-gray-400">02</span>
              </div>
            </motion.div>
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
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl font-bold mb-6 md:mb-8 text-white leading-tight px-4">
              Our
              <br />
              <span className="text-accent-primary">Portfolio</span>
            </h2>
            {/* <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 max-w-3xl mx-auto px-4">
              Explore our collection of creative projects
            </p> */}
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {portfolioItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative aspect-[4/5] rounded-xl overflow-hidden border border-white/10 group cursor-pointer pointer-events-auto will-change-transform will-change-opacity"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black pointer-events-none">
                  <LazyVideo
                    src={item.video}
                  poster={item.image}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 ease-out"
                  />
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
          <ImageAutoSlider images={galleryImages} imageSize="lg" speed={30} />
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
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl font-bold mb-6 md:mb-8 text-white leading-tight px-4">
              Connect
              <br />
              <span className="text-accent-primary">with us</span>
            </h2>
            {/* <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 max-w-3xl mx-auto px-4">
              Let's discuss how we can bring your vision to life with creative storytelling
            </p> */}
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
              <div className="inline-flex items-center gap-3 rounded-full bg-white/5 px-5 py-2 text-sm font-medium text-white/80 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.12)]">
                Our Story
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight tracking-tight">
                  Crafting Visual
                </h2>
                <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-white to-accent-primary bg-clip-text text-transparent">
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
    </div>
  );
});

Home.displayName = 'Home';

export default Home;
