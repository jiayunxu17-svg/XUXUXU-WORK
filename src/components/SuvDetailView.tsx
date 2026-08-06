import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Layers, Sparkles } from 'lucide-react';
import { ProjectExtendedDetails } from '../types';
const suvPicImg = '/SUV pic.jpg';

interface SuvDetailViewProps {
  detail: ProjectExtendedDetails;
  heroVideoUrl?: string;
}

export const SuvDetailView: React.FC<SuvDetailViewProps> = () => {
  return (
    <div className="w-full bg-[#050507] text-white font-sans selection:bg-[#753fec] selection:text-white min-h-screen">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. IMMERSIVE HERO SECTION (沉浸式首屏)                        */}
      {/* ------------------------------------------------------------- */}
      <section className="relative w-full h-[88vh] min-h-[640px] max-h-[1080px] flex items-center justify-center overflow-hidden border-b border-neutral-900">
        
        {/* Background Looping Video (~5s loop) */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden select-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-105 filter brightness-90 contrast-110"
          >
            <source src="https://a566e28db74b41bebfdfab6ad1c9bbff.gz2.agentos-app.net/video10.mp4" type="video/mp4" />
          </video>

          {/* Dark Vignette & Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/65 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050507]/90 via-transparent to-[#050507]/90" />
          
          {/* Subtle Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 w-full pt-16 flex flex-col items-start justify-center">
          
          {/* Tag Pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/80 backdrop-blur-md border border-[#753fec]/40 mb-6 shadow-[0_0_20px_rgba(117,63,236,0.25)]"
          >
            <span className="w-2 h-2 rounded-full bg-[#9e80ed] animate-pulse" />
            <span className="font-mono text-xs text-neutral-300 uppercase tracking-widest font-semibold">
              FLAGSHIP SUV // DIGITAL COCKPIT UI ITERATION
            </span>
          </motion.div>

          {/* Massive Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-white mb-6"
            style={{
              fontFamily: '".New York", "New York", "FZXiaoBiaoSong-B05S", "FZXiaoBiaoSong", "STSong", "SimSun", serif'
            }}
          >
            <span 
              className="text-sm sm:text-base md:text-lg font-mono text-[#9e80ed] block mb-2 font-normal tracking-widest"
              style={{ fontFamily: '".New York", "New York", "Geist Mono", Georgia, serif' }}
            >
              2024-
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-purple-200" style={{ fontFamily: '"PingFang SC", "Helvetica Neue", Arial, sans-serif' }}>
              SUV旗舰车型UI设计视觉迭代策略
            </span>
          </motion.h1>

          {/* Breathable Subheader */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-xl md:text-2xl text-neutral-300 font-normal leading-relaxed max-w-3xl mb-10 tracking-wide font-sans"
          >
            传统燃油车屏幕大换代，打通前瞻科技和传统美学的界限，定义新一代SUV智驾交互新美学
          </motion.p>

        </div>

        {/* Scroll down prompt */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
          <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">SCROLL TO EXPLORE</span>
          <div className="w-[1px] h-6 bg-gradient-to-b from-[#9e80ed] to-transparent animate-bounce" />
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. FULL-WIDTH TILED IMAGE SECTION                             */}
      {/* ------------------------------------------------------------- */}
      <div className="w-full relative pb-16 bg-black flex flex-col items-center justify-start space-y-6 pt-16">
        {/* 2.0 UI 1 */}
        <div className="w-full max-w-[1920px] mx-auto bg-black flex justify-center overflow-hidden">
          <img
            src="https://b4ca62ea3b5c48218ab14dbc609f2c16.gz5.agentos-app.net/photo9.jpg"
            alt="SUV旗舰车型 2.0 UI 策略展示 1"
            referrerPolicy="no-referrer"
            className="w-full h-auto object-contain max-w-[1920px] mx-auto block shadow-2xl"
          />
        </div>

        {/* 2.0 UI 2 */}
        <div className="w-full max-w-[1920px] mx-auto bg-black flex justify-center overflow-hidden">
          <img
            src="https://b4ca62ea3b5c48218ab14dbc609f2c16.gz5.agentos-app.net/photo8.jpg"
            alt="SUV旗舰车型 2.0 UI 策略展示 2"
            referrerPolicy="no-referrer"
            className="w-full h-auto object-contain max-w-[1920px] mx-auto block shadow-2xl"
          />
        </div>
      </div>

    </div>
  );
};

export default SuvDetailView;
