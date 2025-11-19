"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Mail, User, Phone, Send, CheckCircle2 } from 'lucide-react';

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type LeadFormData = z.infer<typeof leadSchema>;

const LeadCapture = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
  });

  const onSubmit = async (data: LeadFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Lead captured:', data);
    setIsSubmitted(true);
    reset();
    
    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative max-w-2xl mx-auto"
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/2 to-white/5 rounded-3xl blur-3xl -z-10" />
      
      <div className="relative bg-dark-card/50 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl mx-4 sm:mx-0">
        {/* Animated border */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-block p-3 rounded-full bg-white/10 border border-white/20 mb-4"
            >
              <Mail className="w-6 h-6 text-white" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-white px-4">
              Let's Start a Conversation
            </h2>
            <p className="text-gray-400 text-base sm:text-lg px-4">
              Share your vision and let's bring it to life together
            </p>
          </div>

          {isSubmitted ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="inline-block p-4 rounded-full bg-white/10 border border-white/20 mb-4"
              >
                <CheckCircle2 className="w-12 h-12 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Thank You!
              </h3>
              <p className="text-gray-400">
                We'll get back to you soon.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <User className="w-5 h-5" />
                </div>
                <input
                  {...register('name')}
                  type="text"
                  placeholder="Your Name"
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-dark-surface/50 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all duration-300 text-sm sm:text-base"
                />
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-400"
                  >
                    {errors.name.message}
                  </motion.p>
                )}
              </div>

              {/* Email Field */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="your.email@example.com"
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-dark-surface/50 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all duration-300 text-sm sm:text-base"
                />
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-400"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </div>

              {/* Phone Field (Optional) */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  {...register('phone')}
                  type="tel"
                  placeholder="Phone Number (Optional)"
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-dark-surface/50 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all duration-300 text-sm sm:text-base"
                />
              </div>

              {/* Message Field */}
              <div className="relative">
                <textarea
                  {...register('message')}
                  placeholder="Tell us about your project..."
                  rows={5}
                  className="w-full px-4 py-3 sm:py-4 bg-dark-surface/50 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all duration-300 resize-none text-sm sm:text-base"
                />
                {errors.message && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-400"
                  >
                    {errors.message.message}
                  </motion.p>
                )}
              </div>

              {/* Submit Button */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full relative overflow-hidden group bg-white hover:bg-gray-100 text-black font-semibold py-6 text-lg"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </Button>
              </motion.div>
            </form>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LeadCapture;

