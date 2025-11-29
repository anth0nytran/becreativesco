"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import LeadCapture from '@/components/LeadCapture';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { Mail, Phone, MapPin, Linkedin, Instagram, Twitter } from 'lucide-react';

const contactInfo = [
  {
    icon: <Mail className="w-6 h-6" />,
    label: 'Email',
    value: 'brian@becreativesco.com',
    href: 'mailto:brian@becreativesco.com',
  },
  {
    icon: <Phone className="w-6 h-6" />,
    label: 'Phone',
    value: '+1 (617) 708-5088',
    href: 'tel:+16177085088',
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    label: 'Location',
    value: 'Boston, MA',
    href: '#',
  },
];

type HeroSegment = {
  text: string;
  accent?: boolean;
};

const heroLines: HeroSegment[][] = [
  [
    { text: "Let’s Build ", accent: false },
    { text: "Content", accent: true },
  ],
  [
    { text: "That Actually ", accent: false },
    { text: "Converts", accent: true },
  ],
];

const heroLineLengths = heroLines.map((line) =>
  line.reduce((total, segment) => total + segment.text.length, 0),
);

const socialLinks = [
  { icon: <Instagram className="w-5 h-5" />, href: '#', label: 'Instagram' },
  { icon: <Linkedin className="w-5 h-5" />, href: '#', label: 'LinkedIn' },
  { icon: <Twitter className="w-5 h-5" />, href: '#', label: 'Twitter' },
];

export default function Contact() {
  const [lineProgress, setLineProgress] = useState(() => heroLineLengths.map(() => 0));
  const [activeCaretLine, setActiveCaretLine] = useState(0);
  const [caretVisible, setCaretVisible] = useState(true);
  const [shouldShowCaret, setShouldShowCaret] = useState(true);

  useEffect(() => {
    const typingSpeed = 90;
    const lineDelay = 450;
    let timeout: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const typeLine = (lineIndex: number, charIndex: number) => {
      if (cancelled) return;

      if (lineIndex >= heroLines.length) {
        setShouldShowCaret(false);
        setActiveCaretLine(heroLines.length - 1);
        return;
      }

      setActiveCaretLine(lineIndex);
      const targetLength = heroLineLengths[lineIndex];

      if (charIndex <= targetLength) {
        setLineProgress((prev) => {
          const next = [...prev];
          next[lineIndex] = charIndex;
          return next;
        });

        timeout = setTimeout(() => typeLine(lineIndex, charIndex + 1), typingSpeed);
      } else {
        timeout = setTimeout(() => typeLine(lineIndex + 1, 1), lineDelay);
      }
    };

    typeLine(0, 1);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (!shouldShowCaret) {
      setCaretVisible(false);
      return;
    }

    const blink = setInterval(() => {
      setCaretVisible((prev) => !prev);
    }, 550);

    return () => clearInterval(blink);
  }, [shouldShowCaret]);

  const heroAnnouncement = heroLines
    .map((line) => line.map((segment) => segment.text).join(''))
    .join(' ');

  const renderLine = (segments: HeroSegment[], visibleChars: number) => {
    let remaining = visibleChars;

    return segments.map((segment, index) => {
      if (remaining <= 0) {
        return (
          <span key={`${segment.text}-${index}`} aria-hidden="true">
            {' '}
          </span>
        );
      }

      const visibleCount = Math.min(segment.text.length, remaining);
      remaining -= visibleCount;

      const text = segment.text.slice(0, visibleCount);
      const accentClass = segment.accent
        ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#4A90E2] via-[#18CCFC] to-[#7CF9FF] drop-shadow-[0_0_18px_rgba(76,196,255,0.32)]'
        : '';

      return (
        <span key={`${segment.text}-${index}`} className={accentClass} aria-hidden="true">
          {text}
        </span>
      );
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-950">
      <BackgroundBeams className="fixed inset-0 z-0" />

      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center px-4 pt-32">
        <div className="max-w-7xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-block mb-6 px-6 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
            >
              <span className="text-sm font-medium text-white">Get In Touch</span>
            </motion.div>

            <h1
              className="px-4 text-4xl font-bold text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
              aria-label={heroAnnouncement}
            >
              {heroLines.map((line, idx) => (
                <span key={idx} className="block leading-[1.05]">
                  {renderLine(line, lineProgress[idx])}
                  {shouldShowCaret && caretVisible && activeCaretLine === idx && (
                    <span
                      aria-hidden="true"
                      className="ml-2 inline-block h-[1em] w-[2px] align-middle rounded-full bg-gradient-to-b from-white/80 to-white/20"
                    />
                  )}
                </span>
              ))}
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto px-4">
              Whether you need launch videos, ongoing social content, or full campaign coverage, our team creates strategic visuals built to attract, engage, and convert your ideal clients.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="relative py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16 px-4">
            {contactInfo.map((info, index) => (
              <motion.a
                key={info.label}
                href={info.href}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative bg-dark-card/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 border border-white/20 mb-4 text-white">
                    {info.icon}
                  </div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">{info.label}</h3>
                  <p className="text-lg font-semibold text-white">{info.value}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Capture Form */}
      <section className="relative py-16 px-4 pb-32">
        <div className="max-w-7xl mx-auto">
          <LeadCapture />
        </div>
      </section>

      {/* Social Links */}
      <section className="relative py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-gray-400 mb-6">Follow us on social media</p>
            <div className="flex items-center justify-center gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-full bg-dark-card/50 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
