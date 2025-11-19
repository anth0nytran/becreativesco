"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Briefcase, Mail } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Prevent body scroll when mobile menu is open
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { label: 'Home', href: '/', icon: <Home className="w-4 h-4" /> },
    { label: 'Portfolio', href: '/portfolio', icon: <Briefcase className="w-4 h-4" /> },
    { label: 'Contact', href: '/contact', icon: <Mail className="w-4 h-4" /> },
  ];

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: '100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.07,
        delayChildren: 0.1,
      },
    },
  };

  const mobileItemVariants = {
    closed: { x: 50, opacity: 0 },
    open: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  return (
    <>
      <motion.nav
        initial="hidden"
        animate="visible"
        variants={navVariants}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-dark-surface/95 backdrop-blur-xl border-b border-white/10 shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <motion.div
              variants={itemVariants}
              className="flex items-center space-x-2"
            >
              <Link href="/" className="flex items-center space-x-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-accent-primary/10 blur-xl rounded-full" />
                  <div className="relative w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-white/20">
                    <span className="text-black font-bold text-lg">
                      BE
                    </span>
                  </div>
                </div>
                <span className="text-xl font-bold text-white">
                  BE CREATIVES CO.
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div key={item.label} variants={itemVariants}>
                    <Link
                      href={item.href}
                      className="relative group"
                    >
                      <div
                      className={`px-0 py-2 flex items-center space-x-2 transition-all duration-300 ${
                        isActive
                          ? 'text-white'
                          : 'text-gray-500 hover:text-white'
                      }`}
                      >
                        <span className="text-sm sm:text-base font-medium uppercase tracking-wider">{item.label}</span>
                      </div>

                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeSection"
                          className="absolute bottom-0 left-0 right-0 h-[2px] bg-white -z-10"
                          transition={{
                            type: 'spring',
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA Button */}
            <motion.div
              variants={itemVariants}
              className="hidden md:block"
            >
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="relative overflow-hidden group border-white/30 hover:bg-white hover:text-black text-white"
                >
                  <span className="relative z-10">Contact</span>
                </Button>
              </Link>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.div variants={itemVariants} className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Animated border bottom */}
        {isScrolled && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className="h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
        )}
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-dark-bg/80 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-dark-surface/95 backdrop-blur-xl border-l border-white/10 z-50 md:hidden shadow-2xl"
            >
              <div className="flex flex-col h-full p-6 pt-24">
                {/* Mobile Menu Items */}
                <div className="flex flex-col space-y-2">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <motion.div key={item.label} variants={mobileItemVariants}>
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                        className={`group relative flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-300 ${
                          isActive
                            ? 'bg-white/10 text-white border border-white/20'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                        >
                          <span className="transition-transform duration-300 group-hover:scale-110">
                            {item.icon}
                          </span>
                          <span className="text-base font-medium">{item.label}</span>

                          {/* Active glow effect */}
                          {isActive && (
                            <div className="absolute inset-0 rounded-xl bg-white/5 blur-xl -z-10" />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;

