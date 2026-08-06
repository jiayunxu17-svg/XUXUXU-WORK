import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { ModelData } from '../types';
import GridLines, { GridIntersectionNode } from './GridLines';
import CrosshairCursor from './CrosshairCursor';
import DynamicWeightText from './DynamicWeightText';
import bgImg from '../assets/images/bg.png';
import girlImg from '../assets/images/girl.png';

interface HeroProps {
  model: ModelData;
  onBuildClick: () => void;
}

export default function Hero({ model, onBuildClick }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [dofIntensity, setDofIntensity] = useState<'standard' | 'deep'>('deep');
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  // Mouse normalized motion values (-0.5 to 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for fluid 3D parallax feel
  const springConfig = { damping: 26, stiffness: 110, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // 3D Card Tilt angles based on mouse normalized position (-0.5 to 0.5)
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-18, 18]);

  // Layer 1: Background Layer (bg.png) - MOVES EXTREMELY LITTLE
  const bgX = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);
  const bgY = useTransform(smoothY, [-0.5, 0.5], [-8, 8]);

  // Layer 2: Subject Foreground Layer (girl.png) - MOVES MOST
  const subjectX = useTransform(smoothX, [-0.5, 0.5], [-160, 160]);
  const subjectY = useTransform(smoothY, [-0.5, 0.5], [-160, 160]);
  const subjectScale = useTransform(smoothY, [-0.5, 0.5], [1.02, 1.15]);

  // Image URLs
  const bgImageSrc = bgImg;
  const subjectImageSrc = girlImg;

  // Track raw mouse movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    mouseX.set(x);
    mouseY.set(y);
    setCoords({ x: Math.round(x * 100), y: Math.round(y * 100) });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
    setCoords({ x: 0, y: 0 });
  };

  // Subtle auto-breathing loop when mouse is idle or touch device
  useEffect(() => {
    if (isHovered) return;
    let animationFrameId: number;
    let startTime = performance.now();

    const animateBreathing = (time: number) => {
      const elapsed = (time - startTime) / 1000;
      // Gentle sine wave breathing rotation
      const idleX = Math.sin(elapsed * 0.8) * 0.08;
      const idleY = Math.cos(elapsed * 0.6) * 0.08;
      mouseX.set(idleX);
      mouseY.set(idleY);
      animationFrameId = requestAnimationFrame(animateBreathing);
    };

    animationFrameId = requestAnimationFrame(animateBreathing);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, mouseX, mouseY]);

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative h-full w-full flex flex-col justify-between overflow-hidden pt-20 pb-12 bg-[#070709] select-none perspective-[1200px]"
      style={{ perspective: '1200px' }}
    >
      {/* ------------------------------------------------------------- */}
      {/* 3D PARALLAX STAGE (CARD TILT)                                 */}
      {/* ------------------------------------------------------------- */}
      <motion.div
        className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center pointer-events-none"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
          {/* LAYER 1: Background Layer (bg.png) - Moves Least */}
          <motion.div
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{
              x: bgX,
              y: bgY,
              scale: 1.12,
              transformStyle: 'preserve-3d',
            }}
          >
            <img
              src={bgImageSrc}
              alt="3D Background Layer"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center filter brightness-[0.9] contrast-[1.05]"
            />
          </motion.div>

          {/* LAYER 2: Subject Foreground Layer (girl&glasses.png) - Moves Most */}
          <motion.div
            className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center"
            style={{
              x: subjectX,
              y: subjectY,
              scale: subjectScale,
              transformStyle: 'preserve-3d',
              z: 80,
            }}
          >
            <img
              src={subjectImageSrc}
              alt="3D Subject Girl Layer"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)]"
            />
          </motion.div>

          {/* Dynamic Light Reflection Layer that shifts with mouse */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-[#753fec]/10 mix-blend-overlay pointer-events-none"
            style={{
              opacity: useTransform(smoothX, [-0.5, 0.5], [0.2, 0.6]),
            }}
          />
        </div>
      </motion.div>

      {/* ------------------------------------------------------------- */}
      {/* LAYER 3: Atmospheric Light & Vignette Overlay                 */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {/* Soft purple window light glow gradient */}
        <div className="absolute top-0 right-0 w-[60%] h-[80%] bg-gradient-to-bl from-[#753fec]/15 via-purple-900/10 to-transparent blur-[90px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-gradient-to-tr from-[#753fec]/15 via-purple-900/10 to-transparent blur-[80px]" />

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-[#070709]/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070709]/80 via-transparent to-[#070709]/50" />
      </div>

      {/* Axis Cursor Backdrop Layer */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        <CrosshairCursor
          verticalColor="rgba(255, 255, 255, 0.25)"
          horizontalColor="rgba(255, 255, 255, 0.25)"
          dotColor="#753fec"
          dotSize={7}
          showPosition={false}
        />
      </div>

      {/* Background Grid Lines */}
      <GridLines />

      {/* Decorative Top Accent Line */}
      <div className="w-full relative py-3 border-b border-neutral-900/40 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <GridIntersectionNode position="left" />
          <GridIntersectionNode position="left-25" />
          <GridIntersectionNode position="left-50" />
          <GridIntersectionNode position="left-75" />
          <GridIntersectionNode position="right" />
        </div>
      </div>

      {/* Main Content & Interactive HUD Overlay */}
      <div className="w-full px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-between relative z-20 py-8">
        
        {/* Top Header Row: 3D Interactive HUD Indicator */}
        <div className="flex items-center justify-between gap-6 z-30">
          {/* Interactive 3D Depth Status Widget */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 bg-neutral-950/90 border border-neutral-800 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-2xl"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#753fec] animate-ping" />
              <span className="font-mono text-[10px] text-white tracking-wider font-bold uppercase">
                PSEUDO-3D PARALLAX
              </span>
            </div>
            <span className="w-[1px] h-3 bg-neutral-800" />
            <div className="font-mono text-[10px] text-neutral-400">
              X:<span className="text-white font-bold">{coords.x > 0 ? `+${coords.x}` : coords.x}</span> Y:<span className="text-white font-bold">{coords.y > 0 ? `+${coords.y}` : coords.y}</span>
            </div>
            <span className="w-[1px] h-3 bg-neutral-800" />
            <button
              onClick={() => setDofIntensity(dofIntensity === 'deep' ? 'standard' : 'deep')}
              className="font-mono text-[9px] uppercase bg-neutral-900 hover:bg-[#753fec] text-neutral-300 hover:text-white px-2 py-0.5 rounded border border-neutral-700/50 transition-colors duration-200 cursor-pointer font-bold"
              title="Toggle Depth of Field Intensity"
            >
              DOF: {dofIntensity}
            </button>
          </motion.div>
        </div>

        {/* Immersive Center Area for Depth View */}
        <div className="flex-1 min-h-[30vh] md:min-h-[38vh]" />

        {/* Bottom Panel: Interactive Controls and Status Card */}
        <div className="flex flex-col md:flex-row md:items-end justify-start gap-6 relative mt-12 md:mt-0 pt-6 border-t border-neutral-900/50 backdrop-blur-[2px] z-30 w-full">
          
          {/* Left Bottom: Display Title & Explore Button aligned to far left */}
          <motion.div
            key={`${model.id}-title-bottom-left`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.0, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-start text-left relative z-30 mr-auto"
          >
            <div className="font-display text-5xl sm:text-7xl md:text-[7rem] lg:text-[9.5rem] xl:text-[12.5rem] tracking-tight uppercase select-none filter drop-shadow-[0_15px_40px_rgba(0,0,0,0.98)] leading-[0.82] flex flex-col items-start text-left text-white cursor-pointer">
              <DynamicWeightText text="DESIGN" color="#FFFFFF" fromWeight={200} toWeight={900} reach={450} />
              <DynamicWeightText text="PORTFOLIO" color="#753fec" fromWeight={200} toWeight={900} reach={450} />
            </div>
            
            {/* Scroll Trigger Button under DESIGN PORTFOLIO */}
            <motion.button
              whileHover={{ scale: 1.03, x: 2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 350, damping: 18 }}
              onClick={() => {
                const element = document.getElementById('specs');
                if (element) {
                  const headerOffset = 70;
                  const elementPosition = element.getBoundingClientRect().top;
                  const targetY = elementPosition + window.pageYOffset - headerOffset;
                  const startY = window.pageYOffset;
                  const distance = targetY - startY;
                  const duration = Math.min(1000, Math.max(500, Math.abs(distance) * 0.65));
                  let startTime: number | null = null;
                  const easeOutSpring = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
                  const animateScroll = (currentTime: number) => {
                    if (startTime === null) startTime = currentTime;
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    window.scrollTo(0, startY + distance * easeOutSpring(progress));
                    if (progress < 1) requestAnimationFrame(animateScroll);
                  };
                  requestAnimationFrame(animateScroll);
                }
              }}
              className="group flex flex-col items-start gap-2 mt-5 cursor-pointer focus:outline-none self-start"
              title="向下探索个人简介"
            >
              {/* Stacked English and Chinese Text */}
              <div className="flex flex-col items-start gap-0.5 text-left">
                <span className="font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase group-hover:text-[#753fec] transition-colors font-bold">
                  EXPLORE PROFILE
                </span>
                <span className="font-sans text-xs text-neutral-200 group-hover:text-white transition-colors font-medium">
                  向下探索个人简介
                </span>
              </div>

              {/* Chevron Arrow at the very bottom */}
              <div className="relative flex items-center justify-center mt-1 self-start">
                {/* Outer pulsing neon ring */}
                <div className="absolute -inset-2.5 rounded-full bg-gradient-to-r from-[#753fec]/40 via-purple-500/20 to-[#753fec]/40 blur-md opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500 animate-pulse" />
                
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="relative z-10 w-11 h-11 rounded-full border border-neutral-700/80 bg-neutral-950/90 group-hover:border-[#753fec] group-hover:bg-[#753fec]/20 flex items-center justify-center shadow-2xl backdrop-blur-md transition-all duration-300"
                >
                  <ChevronDown className="w-5 h-5 text-neutral-300 group-hover:text-[#753fec] transition-colors duration-300" />
                </motion.div>
              </div>
            </motion.button>
          </motion.div>

        </div>

      </div>

      {/* Bottom Grid Accents */}
      <div className="w-full relative py-2 border-t border-neutral-900/40 mt-4 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <GridIntersectionNode position="left" />
          <GridIntersectionNode position="left-25" />
          <GridIntersectionNode position="left-50" />
          <GridIntersectionNode position="left-75" />
          <GridIntersectionNode position="right" />
        </div>
      </div>

    </section>
  );
}
