import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Layers, Sparkles, Move3d, RotateCcw, Eye, Play, Pause } from 'lucide-react';
const bgImg = '/bg.png';
const girlImg = '/girl.png';

interface ParallaxPoster3DProps {
  className?: string;
}

export default function ParallaxPoster3D({ className = '' }: ParallaxPoster3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Target normalized coords (-1 to 1)
  const targetPos = useRef({ x: 0, y: 0 });
  // Interpolated smooth position (-1 to 1)
  const [smoothPos, setSmoothPos] = useState({ x: 0, y: 0 });

  const [isHovered, setIsHovered] = useState(false);
  const [isAutoOrbit, setIsAutoOrbit] = useState(false);
  const [sensitivity, setSensitivity] = useState<'subtle' | 'balanced' | 'extreme'>('balanced');
  
  // Layer visibility toggles for 2-layer system
  const [showBg, setShowBg] = useState(true);
  const [showSubject, setShowSubject] = useState(true);

  // Sensitivity configuration for 2 layers
  // Background moves least, Subject moves most
  const sensitivityConfig = {
    subtle: { maxTilt: 12, bgOffset: 8, subjectOffset: 30, bgZ: 0, subjectZ: 60 },
    balanced: { maxTilt: 20, bgOffset: 14, subjectOffset: 55, bgZ: 0, subjectZ: 100 },
    extreme: { maxTilt: 30, bgOffset: 22, subjectOffset: 85, bgZ: 0, subjectZ: 140 },
  }[sensitivity];

  // Image URLs for 3D Parallax Poster
  const bgUrl = bgImg || "/bg.png";
  const subjectUrl = girlImg || "/girl.png";

  // Smooth lerp physics animation loop
  useEffect(() => {
    let animId: number;
    let angle = 0;

    const updatePhysics = () => {
      if (isAutoOrbit) {
        angle += 0.02;
        targetPos.current = {
          x: Math.sin(angle) * 0.8,
          y: Math.cos(angle * 0.7) * 0.5,
        };
      }

      setSmoothPos((prev) => {
        // Lerp factor 0.08 ensures smooth movement following mouse
        const lerpFactor = 0.08;
        const dx = targetPos.current.x - prev.x;
        const dy = targetPos.current.y - prev.y;

        if (!isHovered && !isAutoOrbit && Math.abs(dx) < 0.0005 && Math.abs(dy) < 0.0005) {
          return { x: 0, y: 0 };
        }

        return {
          x: prev.x + dx * lerpFactor,
          y: prev.y + dy * lerpFactor,
        };
      });

      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animId);
  }, [isHovered, isAutoOrbit]);

  // Mouse Move Handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isAutoOrbit || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Normalize coordinates (-1 to 1)
    const nx = (e.clientX - centerX) / (rect.width / 2);
    const ny = (e.clientY - centerY) / (rect.height / 2);

    targetPos.current = {
      x: Math.max(-1, Math.min(1, nx)),
      y: Math.max(-1, Math.min(1, ny)),
    };
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!isAutoOrbit) {
      targetPos.current = { x: 0, y: 0 };
    }
  };

  // Calculated 3D Tilt Angles
  const rotateX = -smoothPos.y * sensitivityConfig.maxTilt;
  const rotateY = smoothPos.x * sensitivityConfig.maxTilt;

  return (
    <div className={`relative w-full max-w-5xl mx-auto my-12 px-4 sm:px-6 ${className}`}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#753fec] shadow-[0_0_12px_#753fec] animate-pulse" />
            <h3 className="font-display text-xl sm:text-2xl tracking-wider text-white uppercase flex items-center gap-2">
              3D Parallax Poster <span className="text-xs font-mono text-[#753fec] bg-[#753fec]/10 px-2 py-0.5 rounded border border-[#753fec]/30">2-LAYER TILT</span>
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 font-mono">
            双图层 3D 视差海报 / 背景 (bg.png) · 主体人物前景 (girl&amp;glasses.png)
          </p>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Auto Orbit Button */}
          <button
            onClick={() => setIsAutoOrbit(!isAutoOrbit)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 border ${
              isAutoOrbit
                ? 'bg-[#753fec] text-black font-bold border-[#753fec] shadow-[0_0_15px_rgba(0,210,96,0.3)]'
                : 'bg-neutral-900/80 text-neutral-300 border-neutral-700 hover:border-neutral-500'
            }`}
          >
            {isAutoOrbit ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isAutoOrbit ? '自动巡航中' : '自动巡航'}
          </button>

          {/* Sensitivity Selector */}
          <div className="flex items-center bg-neutral-900/80 border border-neutral-800 rounded-lg p-1 text-xs font-mono">
            {(['subtle', 'balanced', 'extreme'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setSensitivity(mode)}
                className={`px-2.5 py-1 rounded capitalize transition-all ${
                  sensitivity === mode
                    ? 'bg-neutral-700 text-white font-bold shadow'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {mode === 'subtle' ? '柔和' : mode === 'balanced' ? '平衡' : '强视差'}
              </button>
            ))}
          </div>

          {/* Reset Button */}
          <button
            onClick={() => {
              setIsAutoOrbit(false);
              targetPos.current = { x: 0, y: 0 };
            }}
            className="p-2 rounded-lg bg-neutral-900/80 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition"
            title="重置视角"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Parallax Display Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Poster Stage (8 cols) */}
        <div className="lg:col-span-8 flex justify-center items-center">
          <div
            className="relative w-full max-w-[480px] aspect-[3/4] cursor-grab active:cursor-grabbing select-none"
            style={{ perspective: '1200px' }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={containerRef}
          >
            {/* Outer Glow Halo */}
            <div 
              className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-[#753fec]/20 via-purple-500/10 to-teal-500/20 blur-xl opacity-60 transition-opacity duration-500 pointer-events-none"
              style={{
                transform: `translate3d(${smoothPos.x * 15}px, ${smoothPos.y * 15}px, 0px)`
              }}
            />

            {/* 3D Tilted Card Outer Container */}
            <div
              className="relative w-full h-full rounded-2xl overflow-hidden border border-neutral-700/60 shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-neutral-950 transition-shadow duration-300"
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                boxShadow: isHovered || isAutoOrbit
                  ? '0 30px 60px -12px rgba(0, 0, 0, 0.95), 0 0 30px rgba(0,210,96,0.15)'
                  : '0 20px 40px -15px rgba(0, 0, 0, 0.8)',
              }}
            >
              {/* LAYER 1: Background Layer (bg.png) - MOVES LEAST */}
              {showBg && (
                <div
                  className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: `translate3d(${smoothPos.x * sensitivityConfig.bgOffset}px, ${smoothPos.y * sensitivityConfig.bgOffset}px, ${sensitivityConfig.bgZ}px) scale(1.12)`,
                  }}
                >
                  <img
                    src={bgUrl}
                    alt="3D Background Layer"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.attempt) {
                        target.dataset.attempt = '1';
                        target.src = '/bg.png';
                      }
                    }}
                    className="w-full h-full object-cover select-none"
                  />
                </div>
              )}

              {/* LAYER 2: Subject Layer (girl&glasses.png) - MOVES MOST */}
              {showSubject && (
                <div
                  className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300 flex items-center justify-center"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: `translate3d(${smoothPos.x * sensitivityConfig.subjectOffset}px, ${smoothPos.y * sensitivityConfig.subjectOffset}px, ${sensitivityConfig.subjectZ}px) scale(1.05)`,
                  }}
                >
                  <img
                    src={subjectUrl}
                    alt="3D Subject Girl with Glasses Layer"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.attempt) {
                        target.dataset.attempt = '1';
                        target.src = '/girl.png';
                      }
                    }}
                    className="w-full h-full object-contain select-none filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)]"
                  />
                </div>
              )}

              {/* Dynamic Glare Reflection Overlay */}
              <div
                className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300"
                style={{
                  opacity: Math.min(0.35, (Math.abs(smoothPos.x) + Math.abs(smoothPos.y)) * 0.25),
                  transform: `translate3d(${-smoothPos.x * 40}px, ${-smoothPos.y * 40}px, 150px)`,
                }}
              />

              {/* HUD Frame Elements */}
              <div className="absolute top-3 left-3 right-3 flex justify-between items-center text-[10px] font-mono text-white/60 pointer-events-none" style={{ transform: 'translateZ(120px)' }}>
                <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 flex items-center gap-1">
                  <Move3d className="w-3 h-3 text-[#753fec]" /> DUAL-LAYER PARALLAX
                </span>
                <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 text-[#753fec]">
                  FPS: 60
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-[10px] font-mono text-white/70 pointer-events-none" style={{ transform: 'translateZ(120px)' }}>
                <div className="bg-black/70 backdrop-blur-md px-2.5 py-1 rounded border border-white/10">
                  <div className="text-white font-bold text-xs">AESTHETIC POSTER</div>
                  <div className="text-neutral-400 text-[9px]">bg.png + girl&amp;glasses.png</div>
                </div>
                <div className="bg-black/70 backdrop-blur-md px-2 py-1 rounded border border-white/10 text-right">
                  <div>X: {rotateY.toFixed(1)}°</div>
                  <div>Y: {rotateX.toFixed(1)}°</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info & Telemetry Panel (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Layer Controls Box */}
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md">
            <h4 className="font-mono text-xs text-[#753fec] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4" /> 图层位移与深度参数
            </h4>

            <div className="space-y-3 font-mono text-xs">
              {/* Subject Layer Row */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setShowSubject(!showSubject)}
                    className={`p-1.5 rounded transition ${showSubject ? 'text-[#753fec] bg-[#753fec]/10' : 'text-neutral-600 bg-neutral-900'}`}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <div>
                    <div className="text-white font-bold">主体人物前景</div>
                    <div className="text-[10px] text-neutral-400">girl&amp;glasses.png</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#753fec] bg-[#753fec]/10 px-2 py-0.5 rounded border border-[#753fec]/20 block">位移最大</span>
                  <span className="text-[9px] text-neutral-400 mt-0.5 block">{sensitivityConfig.subjectOffset}px / Z:{sensitivityConfig.subjectZ}px</span>
                </div>
              </div>

              {/* BG Layer Row */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setShowBg(!showBg)}
                    className={`p-1.5 rounded transition ${showBg ? 'text-[#753fec] bg-[#753fec]/10' : 'text-neutral-600 bg-neutral-900'}`}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <div>
                    <div className="text-white font-bold">背景图层</div>
                    <div className="text-[10px] text-neutral-400">bg.png</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded border border-teal-400/20 block">位移最少</span>
                  <span className="text-[9px] text-neutral-400 mt-0.5 block">{sensitivityConfig.bgOffset}px / Z:{sensitivityConfig.bgZ}px</span>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Implementation Summary */}
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md">
            <h4 className="font-mono text-xs text-neutral-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#753fec]" /> 交互说明
            </h4>
            <ul className="text-xs text-neutral-400 space-y-2 font-mono leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-[#753fec] font-bold">·</span>
                <span><b>3D Tilt 倾斜</b>: 鼠标移动时卡片倾斜度最高 ±{sensitivityConfig.maxTilt}°。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#753fec] font-bold">·</span>
                <span><b>平滑插值 (Lerp)</b>: 采用 0.08 平滑阻尼，避免跳变。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#753fec] font-bold">·</span>
                <span><b>速度差异</b>: 主体 ({sensitivityConfig.subjectOffset}px) 远快于背景 ({sensitivityConfig.bgOffset}px)。</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
