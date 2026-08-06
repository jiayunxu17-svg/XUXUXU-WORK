import React from 'react';
import { ArrowUp } from 'lucide-react';
import GridLines, { GridIntersectionNode } from './GridLines';

interface FooterProps {
  onScrollToSection: (sectionId: string) => void;
  onOpenVideoPackager?: () => void;
}

export default function Footer({ onScrollToSection, onOpenVideoPackager }: FooterProps) {
  const handleBackToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    onScrollToSection('hero');
  };

  return (
    <footer className="relative bg-[#070707] border-t border-neutral-900/60 pt-16 overflow-hidden">
      <GridLines />

      {/* Decorative top grid intersection */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-neutral-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <GridIntersectionNode position="left" />
          <GridIntersectionNode position="left-25" />
          <GridIntersectionNode position="left-50" />
          <GridIntersectionNode position="left-75" />
          <GridIntersectionNode position="right" />
        </div>
      </div>

      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Back to Top / 回到首页 Arrow Button Section */}
        <div className="flex flex-col items-center justify-center py-10 border-b border-neutral-900/60">
          <button
            onClick={handleBackToTop}
            className="group flex flex-col items-center gap-3 px-8 py-5 rounded-full bg-transparent hover:bg-neutral-900/50 text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-600 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full border border-neutral-800 group-hover:border-neutral-500 flex items-center justify-center transition-colors">
              <ArrowUp className="w-5 h-5 text-neutral-400 group-hover:text-white group-hover:-translate-y-1 transition-all duration-300" />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm font-bold tracking-wider uppercase font-sans">回到首页</span>
              <span className="text-[10px] font-mono text-neutral-500 group-hover:text-neutral-300 tracking-[0.2em]">BACK TO TOP</span>
            </div>
          </button>
        </div>

        {/* Bottom copyright segment */}
        <div className="py-8 flex flex-col md:flex-row gap-4 items-center justify-between text-[11px] font-mono text-neutral-500">
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <span>© Copyright 2026.</span>
            <span className="text-neutral-400">Xu Jiayun Portfolio</span>
            <span>• Powered by AI Studio Build</span>
          </div>

          <div className="flex gap-4">
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Climate Statement</a>
            <span className="text-neutral-800">•</span>
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Privacy Policy</a>
            <span className="text-neutral-800">•</span>
            <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Terms & Conditions</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
