"use client";

import { motion } from 'framer-motion';
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
import { Suspense, memo } from 'react';

// Portfolio items with actual assets
const portfolioItems = [
  {
    id: 1,
    title: 'F1 Arcade Grand Opening',
    category: 'Commercial',
    description: 'Cinematic showcase reel for F1 Arcade grand opening event.',
    video: '/assets/videos/F1Arcade_NowOpenReel_(1080x1920)_v3.mp4',
    image: '/assets/photos/untitled-2.jpg',
    icon: <Play className="w-5 h-5" />,
  },
  {
    id: 2,
    title: 'Central Cee Recap',
    category: 'Music Video',
    description: 'High-energy recap video for Central Cee grand event.',
    video: '/assets/videos/CentralCee_GrandRecap_1920x1080.mp4',
    image: '/assets/photos/untitled-5.jpg',
    icon: <Play className="w-5 h-5" />,
  },
  {
    id: 3,
    title: 'Mystique Food Shoot - Wagyu',
    category: 'Commercial',
    description: 'Premium food cinematography featuring Wagyu Toast.',
    video: '/assets/videos/3.6.25_MystiqueFoodShoot_WagyuToast.mp4',
    image: '/assets/photos/untitled-10.jpg',
    icon: <Play className="w-5 h-5" />,
  },
  {
    id: 4,
    title: 'Matroda Boat Cruise',
    category: 'Music Video',
    description: 'Dynamic recap of Matroda boat cruise event.',
    video: '/assets/videos/MATRODA_BOATCRUISERecap.mp4',
    image: '/assets/photos/untitled-11.jpg',
    icon: <Play className="w-5 h-5" />,
  },
  {
    id: 5,
    title: 'Encore BH Red8 Sashimi',
    category: 'Commercial',
    description: 'Elegant food photography showcasing premium sashimi platter.',
    video: '/assets/videos/EncoreBH_Red8_SashimiPlatter.mp4',
    image: '/assets/photos/untitled-12.jpg',
    icon: <Play className="w-5 h-5" />,
  },
  {
    id: 6,
    title: 'A Boogie Grand Event',
    category: 'Music Video',
    description: 'Epic recap video for A Boogie With The Hoodie grand event.',
    video: '/assets/videos/AboogieGrand_1920x1080copy.mp4',
    image: '/assets/photos/untitled-13.jpg',
    icon: <Play className="w-5 h-5" />,
  },
  {
    id: 7,
    title: 'Charmalagne Memoire',
    category: 'Commercial',
    description: 'Artistic showcase of Charmalagne Memoire project.',
    video: '/assets/videos/CharmalagneMemoire_1920x1080.mp4',
    image: '/assets/photos/untitled-16.jpg',
    icon: <Play className="w-5 h-5" />,
  },
  {
    id: 8,
    title: 'HV Pool Shoot',
    category: 'Commercial',
    description: 'Summer vibes captured in HV pool shoot event.',
    video: '/assets/videos/HV_POOLSHOOT_HVPRE-ROLLSJULY4TH_1920X1080.mp4',
    image: '/assets/photos/untitled-21.jpg',
    icon: <Play className="w-5 h-5" />,
  },
  {
    id: 9,
    title: 'Mystique Chicken Wings',
    category: 'Commercial',
    description: 'Food cinematography featuring crispy chicken wings.',
    video: '/assets/videos/3.6.25_MystiqueFoodShoot_ChickenWings.mp4',
    image: '/assets/photos/untitled-26.jpg',
    icon: <Play className="w-5 h-5" />,
  },
];

// Local gallery images from public/assets/photos
const galleryImages = [
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

const Home = memo(function Home() {

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <ShaderBackground />
      <DepthLayers />
      
      {/* Scroll Expansion Hero Section */}
      <ScrollExpandMedia
        mediaType="video"
        mediaSrc="/assets/videos/longerdemoreel.mp4"
        bgImageSrc="/assets/photos/untitled-2.jpg"
        title="Stories that stand out"
        date="Featured Work"
        scrollToExpand="Scroll to expand"
        textBlend={false}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white">
            Crafting Visual Narratives
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
            We don't just create content—we build full-scale brand ecosystems powered by strategy, storytelling, and consistency.
          </p>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed">
            At BE CREATIVES CO., we transform ideas into compelling visual stories that resonate with audiences and elevate brands.
          </p>
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
                  src="/assets/videos/F1Arcade_NowOpenReel_(1080x1920)_v3.mp4"
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
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4">Brand Films</h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-4 md:mb-6">Cinematic storytelling that elevates your brand</p>
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
                  src="/assets/videos/CentralCee_GrandRecap_1920x1080.mp4"
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
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4">Commercial Work</h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-4 md:mb-6">High-impact campaigns that drive results</p>
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
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 max-w-3xl mx-auto px-4">
              Explore our collection of creative projects
            </p>
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
        <section className="relative py-0 bg-black border-t border-white/10">
          <ImageAutoSlider images={galleryImages} imageSize="lg" speed={30} />
        </section>
      </Section3DTransition>

      {/* Lead Capture Section */}
      <Section3DTransition depth={150}>
        <section className="relative py-32 px-4 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl font-bold mb-6 md:mb-8 text-white leading-tight px-4">
              Ready to
              <br />
              <span className="text-accent-primary">Elevate</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 max-w-3xl mx-auto px-4">
              Let's discuss how we can bring your vision to life with creative storytelling
            </p>
          </motion.div>

          <LeadCapture />
        </div>
      </section>
      </Section3DTransition>

      {/* Story Section */}
      <Section3DTransition depth={100}>
        <section className="relative py-32 px-4 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-block mb-8 px-4 py-2 rounded-full bg-white/10 border border-white/20">
                  <span className="text-sm font-medium text-white">Our Story</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 md:mb-8 text-white leading-tight">
                  Crafting Visual
                  <br />
                  <span className="text-accent-primary">Narratives</span>
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed mb-4 md:mb-6">
                  At BE CREATIVES CO., we believe every brand has a unique story waiting to be told. 
                  Our team of creative professionals merges technical expertise with artistic vision 
                  to create compelling visual narratives that resonate with audiences.
                </p>
                <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed">
                  From concept to execution, we're committed to delivering excellence that elevates 
                  your brand and leaves a lasting impression. Let's create something extraordinary together.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-square rounded-xl md:rounded-2xl bg-gradient-to-br from-white/5 to-black border border-white/10 p-1">
                <div className="w-full h-full rounded-xl md:rounded-2xl bg-black flex items-center justify-center">
                  <div className="text-center p-6 sm:p-8 md:p-12">
                    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12 mb-6 sm:mb-8 md:mb-12">
                      {[
                        { number: '150+', label: 'Projects' },
                        { number: '50+', label: 'Clients' },
                        { number: '15', label: 'Awards' },
                        { number: '10+', label: 'Years' },
                      ].map((stat, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                          className="text-center"
                        >
                          <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-1 md:mb-2">
                            {stat.number}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider">{stat.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
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
