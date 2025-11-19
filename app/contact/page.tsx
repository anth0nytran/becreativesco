"use client";

import { motion } from 'framer-motion';
import ShaderBackground from '@/components/ShaderBackground';
import LeadCapture from '@/components/LeadCapture';
import { Mail, Phone, MapPin, Linkedin, Instagram, Twitter } from 'lucide-react';

const contactInfo = [
  {
    icon: <Mail className="w-6 h-6" />,
    label: 'Email',
    value: 'hello@becreatives.co',
    href: 'mailto:hello@becreatives.co',
  },
  {
    icon: <Phone className="w-6 h-6" />,
    label: 'Phone',
    value: '+1 (555) 123-4567',
    href: 'tel:+15551234567',
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    label: 'Location',
    value: 'New York, NY',
    href: '#',
  },
];

const socialLinks = [
  { icon: <Instagram className="w-5 h-5" />, href: '#', label: 'Instagram' },
  { icon: <Linkedin className="w-5 h-5" />, href: '#', label: 'LinkedIn' },
  { icon: <Twitter className="w-5 h-5" />, href: '#', label: 'Twitter' },
];

export default function Contact() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <ShaderBackground />

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

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 text-white px-4">
              Let's Create
              <br />
              <span className="text-accent-primary">Together</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto px-4">
              Have a project in mind? Let's discuss how we can bring your vision to life.
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

