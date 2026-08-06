import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Compass, Mail } from 'lucide-react';
import { ModelData } from '../types';
import { MODELS } from '../data';
import VariableFontHoverByLetter from './VariableFontHoverByLetter';

interface HeaderProps {
  currentModel: ModelData;
  onModelSelect: (modelId: string) => void;
  onScrollToSection: (sectionId: string) => void;
  onOpenVideoPackager?: () => void;
}

export default function Header({ currentModel, onModelSelect, onScrollToSection, onOpenVideoPackager }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleModelClick = (id: string) => {
    onModelSelect(id);
    setIsOpen(false);
  };

  const handleLinkClick = (sectionId: string) => {
    onScrollToSection(sectionId);
    setIsOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-[#0b0b0b]/80 backdrop-blur-md border-b border-neutral-900/60 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative">
          
          {/* Left Grid Accents */}
          <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-neutral-900/50"></div>
          <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-neutral-900/50"></div>
          
          {/* Menu Hamburger Button */}
          <div className="flex items-center">
            <button
              onClick={toggleMenu}
              className="p-3 text-neutral-400 hover:text-white transition-colors duration-200 focus:outline-none flex items-center gap-3 group"
              aria-label="Toggle menu"
            >
              <div className="flex flex-col gap-1.5 justify-center items-center w-6 h-5">
                <span className={`block h-[1px] w-6 bg-current transform transition duration-300 ${isOpen ? 'rotate-45 translate-y-[7px]' : ''}`}></span>
                <span className={`block h-[1px] w-4 bg-current self-start transition duration-300 ${isOpen ? 'opacity-0' : 'group-hover:w-6'}`}></span>
                <span className={`block h-[1px] w-6 bg-current transform transition duration-300 ${isOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}></span>
              </div>
              <span className="hidden sm:inline font-mono text-xs tracking-wider uppercase text-neutral-400 group-hover:text-white transition-colors">
                {isOpen ? '.close' : '.menu'}
              </span>
            </button>
          </div>

          {/* Center Brand Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
            <a 
              href="#hero" 
              onClick={(e) => {
                e.preventDefault();
                onScrollToSection('hero');
              }}
              className="flex items-center justify-center tracking-[0.25em] text-white uppercase select-none py-1"
            >
              <VariableFontHoverByLetter
                label="XU JIAYUN"
                fontSize="1.75rem"
                color="#FFFFFF"
                fromWeight={400}
                toWeight={900}
                staggerDuration={29}
                staggerFrom="first"
              />
            </a>
          </div>

          {/* Right Action Area */}
          <div className="flex items-center gap-2.5">
          </div>
        </div>
      </header>

      {/* Slide-down Full Screen Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className="fixed inset-0 z-40 bg-[#0c0c0cd9] backdrop-blur-xl pt-24 overflow-y-auto"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-12 lg:gap-16 min-h-[calc(100vh-6rem)]">
              
              {/* Left Side: Models Select Panels */}
              <div className="flex-1 flex flex-col gap-6">
                <div className="border-b border-neutral-800/80 pb-4">
                  <h3 className="font-mono text-xs tracking-widest text-neutral-500 uppercase">.select vehicle model</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {MODELS.map((m) => {
                    const isActive = m.id === currentModel.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => handleModelClick(m.id)}
                        className={`group relative cursor-pointer border overflow-hidden p-4 flex flex-col justify-between aspect-video md:aspect-[4/3] bg-neutral-950 transition-all duration-500 ${
                          isActive 
                            ? 'border-neutral-300 shadow-lg shadow-neutral-950' 
                            : 'border-neutral-900 hover:border-neutral-700'
                        }`}
                      >
                        {/* Background subtle image */}
                        <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700">
                          <img
                            src={m.heroImage}
                            alt={m.name}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (!target.dataset.fallback) {
                                target.dataset.fallback = 'true';
                                target.src = m.id === 'speedster' ? '/02-title.jpg' : '/PICKUP0.jpg';
                              }
                            }}
                            className="w-full h-full object-cover filter brightness-[0.4] grayscale"
                          />
                        </div>

                        {/* Top Indicator */}
                        <div className="relative z-10 flex justify-between items-start">
                          <span className="font-mono text-xs text-neutral-500 tracking-wider">
                            {isActive ? '.active' : '.available'}
                          </span>
                          <span className="font-mono text-[10px] text-neutral-400 bg-neutral-900 px-2 py-0.5 border border-neutral-800">
                            {m.price}
                          </span>
                        </div>

                        {/* Bottom Label */}
                        <div className="relative z-10 pt-16">
                          <p className="font-serif italic text-xs text-neutral-400 capitalize mb-1">{m.subtitle}</p>
                          <h4 className="font-display text-4xl text-white tracking-wider uppercase group-hover:translate-x-2 transition-transform duration-300">
                            {m.name}
                          </h4>
                        </div>

                        {/* Active Glow Accent */}
                        {isActive && (
                          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Middle: Quick Links */}
              <div className="w-full lg:w-80 flex flex-col gap-8 justify-between">
                <div>
                  <div className="border-b border-neutral-800/80 pb-4 mb-6">
                    <h3 className="font-mono text-xs tracking-widest text-neutral-500 uppercase">.navigation</h3>
                  </div>
                  <nav className="flex flex-col gap-5">
                    <button
                      onClick={() => handleLinkClick('specs')}
                      className="text-left flex flex-col group py-1"
                    >
                      <span className="font-display text-2xl text-white uppercase tracking-wider flex items-center justify-between">
                        <span>个人简介 <span className="text-neutral-500 font-sans text-sm ml-1">/</span> About Me</span>
                        <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-neutral-400" />
                      </span>
                    </button>
                    <button
                      onClick={() => handleLinkClick('gallery')}
                      className="text-left flex flex-col group py-1"
                    >
                      <span className="font-display text-2xl text-white uppercase tracking-wider flex items-center justify-between">
                        <span>作品集 <span className="text-neutral-500 font-sans text-sm ml-1">/</span> Portfolio</span>
                        <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-neutral-400" />
                      </span>
                    </button>
                    <button
                      onClick={() => handleLinkClick('reserve')}
                      className="text-left flex flex-col group py-1"
                    >
                      <span className="font-display text-2xl text-white uppercase tracking-wider flex items-center justify-between">
                        <span>联系我 <span className="text-neutral-500 font-sans text-sm ml-1">/</span> Contact Me</span>
                        <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-neutral-400" />
                      </span>
                    </button>
                  </nav>
                </div>

                {/* Footer and contacts inside menu */}
                <div className="border-t border-neutral-900 pt-6">
                  <div className="flex flex-col gap-2 font-mono text-xs text-neutral-500">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5" />
                      <a href="mailto:enquiries@longbowmotors.com" className="hover:text-white transition-colors">enquiries@longbowmotors.com</a>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Compass className="w-3.5 h-3.5" />
                      <span>London, United Kingdom</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
