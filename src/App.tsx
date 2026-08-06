import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { Compass, Sparkles, Key } from 'lucide-react';
import { MODELS } from './data';
import { CustomizationState } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import SpecsSection from './components/SpecsSection';
import GallerySection from './components/GallerySection';
import ReservationSection from './components/ReservationSection';
import CapabilitiesSection from './components/CapabilitiesSection';
import Footer from './components/Footer';
import VideoPackagerModal from './components/VideoPackagerModal';

export default function App() {
  const [modelId, setModelId] = useState<string>('roadster');
  const [loading, setLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [isVideoPackagerOpen, setIsVideoPackagerOpen] = useState<boolean>(false);

  // Customize options state
  const [customization, setCustomization] = useState<CustomizationState>({
    color: 'liquid_silver',
    wheels: 'aero',
    interior: 'obsidian'
  });

  // Scroll animations for smooth parallax effect without spring jitter
  const { scrollY } = useScroll();

  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.35]);
  const heroY = useTransform(scrollY, [0, 500], [0, 50]);

  // Find active model details
  const currentModel = MODELS.find(m => m.id === modelId) || MODELS[0];

  // Reset customization defaults when model changes
  useEffect(() => {
    setCustomization({
      color: 'liquid_silver',
      wheels: 'aero',
      interior: 'obsidian'
    });
  }, [modelId]);

  // Premium preloader simulation for first-load
  useEffect(() => {
    let currentProgress = 0;
    const duration = 2000;
    const intervalTime = 30;
    const increment = (100 / (duration / intervalTime));

    const progressInterval = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(progressInterval);
      }
      setProgress(Math.floor(currentProgress));
    }, intervalTime);

    const timer = setTimeout(() => {
      setLoading(false);
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, []);

  const handleCustomizeChange = (key: keyof CustomizationState, value: string) => {
    setCustomization(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'hero' || sectionId === 'top') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const handleProceedToReserve = () => {
    scrollToSection('reserve');
  };

  return (
    <div className="min-h-screen bg-[#070709] text-neutral-100 font-sans selection:bg-white selection:text-black">
      
      {/* 1. LUXURY PRELOADER */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 bg-[#080808] flex flex-col items-center justify-center gap-6"
          >
            {/* Tech line grids */}
            <div className="absolute inset-x-0 h-[1px] bg-neutral-900/40 top-[40%]"></div>
            <div className="absolute inset-x-0 h-[1px] bg-neutral-900/40 top-[60%]"></div>
            <div className="absolute inset-y-0 w-[1px] bg-neutral-900/40 left-[40%]"></div>
            <div className="absolute inset-y-0 w-[1px] bg-neutral-900/40 left-[60%]"></div>

            <div className="relative flex flex-col items-center gap-6 z-10">
              {/* Spinning minimalist tech compass indicator */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                className="w-14 h-14 border border-neutral-800 flex items-center justify-center p-3 rounded-none relative"
              >
                <Compass className="w-6 h-6 text-neutral-400" />
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-white"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white"></div>
              </motion.div>

              <div className="flex flex-col items-center gap-1.5 text-center">
                <h2 className="font-display text-3xl tracking-[0.3em] text-white uppercase">
                  WELCOME
                </h2>
                <span className="font-mono text-[9px] tracking-[0.25em] text-neutral-500 uppercase">
                  .loading aerospace carbon build
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 mt-4 w-48">
                <div className="w-full h-[2px] bg-neutral-900 overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="font-mono text-[10px] text-neutral-400">
                  {progress}%
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. CORE PORTFOLIO APPLICATION LAYOUT */}
      {!loading && (
        <div className="flex flex-col">
          
          {/* Custom Ambient Header */}
          <Header
            currentModel={currentModel}
            onModelSelect={setModelId}
            onScrollToSection={scrollToSection}
            onOpenVideoPackager={() => setIsVideoPackagerOpen(true)}
          />

          <main className="flex-1 relative">
            
            {/* Hero Stage presentation with receding parallax depth */}
            <motion.div 
              style={{ opacity: heroOpacity, y: heroY }}
              className="sticky top-0 h-screen w-full z-0 overflow-hidden origin-top"
            >
              <Hero
                model={currentModel}
                onBuildClick={() => scrollToSection('gallery')}
              />
            </motion.div>

            {/* Overlapping Sheet Section */}
            <div 
              className="relative z-10 bg-[#0b0b0b] rounded-t-[32px] sm:rounded-t-[48px] border-t border-neutral-800/90 shadow-[0_-30px_100px_rgba(0,0,0,0.95)] overflow-hidden"
            >
              {/* Subtle top indicator bar */}
              <div className="w-full flex justify-center pt-3 pb-1">
                <div className="w-14 h-1 bg-neutral-800 rounded-full opacity-60"></div>
              </div>

              {/* Performance Specifications Cards Grid */}
              <SpecsSection
                model={currentModel}
              />

              {/* Cinematic Multimedia Gallery and Lightbox */}
              <GallerySection
                model={currentModel}
                onOpenVideoPackager={() => setIsVideoPackagerOpen(true)}
              />

              {/* Refundable Reservation slot secure check-out and Unique Pass certificate generation */}
              <ReservationSection
                model={currentModel}
                customization={customization}
              />

              {/* "I can help you with" Capabilities Section */}
              <CapabilitiesSection />
            </div>
          </main>

          <div className="relative z-10 bg-[#0b0b0b]">
            {/* Footer Component */}
            <Footer
              onScrollToSection={scrollToSection}
              onOpenVideoPackager={() => setIsVideoPackagerOpen(true)}
            />
          </div>

          {/* Video Packager Modal */}
          <VideoPackagerModal
            isOpen={isVideoPackagerOpen}
            onClose={() => setIsVideoPackagerOpen(false)}
          />

        </div>
      )}

    </div>
  );
}
