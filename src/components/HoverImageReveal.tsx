import React, { useRef, useState, type CSSProperties } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  type Transition as MotionTransition,
} from "motion/react";
import { Trash2 } from "lucide-react";

export interface HoverItem {
  title: string;
  category: string;
  id: string;
  imageSrc: string;
  year: string;
  techs: string[];
}

interface HoverImageRevealProps {
  items: HoverItem[];
  rowGap?: number;
  imageWidth?: number;
  imageHeight?: number;
  rounded?: number;
  offsetX?: number;
  offsetY?: number;
  followStrength?: number;
  onItemClick?: (item: HoverItem) => void;
  onItemDelete?: (item: HoverItem, e: React.MouseEvent) => void;
}

const DEFAULT_TRANSITION: MotionTransition = {
  type: "spring",
  stiffness: 350,
  damping: 35,
  mass: 0.8,
};

export default function HoverImageReveal({
  items,
  rowGap = 20,
  imageWidth = 460,
  imageHeight = 280,
  rounded = 4,
  offsetX = 40,
  offsetY = -140,
  followStrength = 4,
  onItemClick,
  onItemDelete,
}: HoverImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const exactX = useMotionValue(0);
  const exactY = useMotionValue(0);

  const stiffness = 80 + followStrength * 6;
  const springCfg = { stiffness, damping: 30, mass: 0.6 };
  const cursorSpringCfg = { stiffness: 450, damping: 28 };

  const x = useSpring(rawX, springCfg);
  const y = useSpring(rawY, springCfg);
  const cursorX = useSpring(exactX, cursorSpringCfg);
  const cursorY = useSpring(exactY, cursorSpringCfg);

  const anyActive = hovered !== null;

  const onMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    
    // Exact position for custom cursor follower
    exactX.set(mx);
    exactY.set(my);

    // Position the hover image to follow cursor with offset
    rawX.set(mx + offsetX);
    rawY.set(my + offsetY);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={onMove}
      onMouseLeave={() => setHovered(null)}
      className="relative w-full overflow-hidden select-none cursor-pointer"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        boxSizing: "border-box",
        cursor: "pointer",
      }}
    >
      {/* Custom Interactive Floating Mouse Cursor Badge */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          x: cursorX,
          y: cursorY,
          pointerEvents: "none",
          zIndex: 50,
          willChange: "transform",
        }}
        animate={{ opacity: anyActive ? 1 : 0, scale: anyActive ? 1 : 0.6 }}
        transition={{ duration: 0.12 }}
        className="flex items-center gap-2 transform -translate-x-1/2 -translate-y-1/2"
      >
        {/* Glowing Cursor Ring & Center Dot */}
        <div className="relative flex items-center justify-center w-7 h-7 rounded-full border border-[#753fec] bg-[#753fec]/30 backdrop-blur-md shadow-[0_0_20px_rgba(117,63,236,0.8)]">
          <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
        </div>
        {/* Dynamic Action Tag */}
        <div className="font-mono text-[10px] font-bold text-white bg-black/90 border border-[#753fec]/80 px-2.5 py-1 rounded shadow-2xl uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
          <span>点击查看 VIEW</span>
        </div>
      </motion.div>
      {/* Absolute floating preview image container */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          x,
          y,
          width: imageWidth,
          height: imageHeight,
          borderRadius: rounded,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 40,
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
          willChange: "transform",
        }}
        animate={{ opacity: anyActive ? 1 : 0, scale: anyActive ? 1 : 0.9 }}
        transition={DEFAULT_TRANSITION}
      >
        {items.map((item, i) => {
          const isCurrent = hovered === i;
          return (
            <motion.div
              key={i}
              initial={false}
              animate={{
                opacity: isCurrent ? 1 : 0,
                y: hovered === null ? "10%" : i < hovered ? "-15%" : i > hovered ? "15%" : "0%",
              }}
              transition={DEFAULT_TRANSITION}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                overflow: "hidden",
                willChange: "transform, opacity",
              }}
            >
              <img
                src={item.imageSrc}
                alt={item.title}
                decoding="async"
                loading="eager"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  const filename = item.imageSrc?.split('/').pop();
                  if (!target.dataset.attempt) {
                    target.dataset.attempt = '1';
                    if (filename) target.src = '/' + filename;
                  } else if (target.dataset.attempt === '1') {
                    target.dataset.attempt = '2';
                    if (filename) target.src = '/assets/images/' + filename;
                  } else if (target.dataset.attempt === '2') {
                    target.dataset.attempt = '3';
                    target.src = '/PICKUP0.jpg';
                  }
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              {/* Corner badge on image preview */}
              <div className="absolute bottom-4 left-4 font-mono text-[9px] tracking-widest text-white/80 bg-black/75 px-2.5 py-1 uppercase border border-white/10 rounded-sm">
                PROJECT {item.id} // {item.year}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* List items representation */}
      <div className="flex flex-col w-full border-t border-neutral-900">
        {items.map((item, i) => {
          const isHovered = hovered === i;
          const isAnyHovered = hovered !== null;
          
          return (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onClick={() => onItemClick?.(item)}
              className="group relative flex flex-col md:flex-row md:items-center justify-between py-8 px-6 md:px-10 border-b border-neutral-900 transition-colors duration-300 hover:bg-neutral-950/40 cursor-none"
            >
              {/* Active list background slide line */}
              <div 
                className={`absolute left-0 bottom-0 h-[1.5px] bg-[#753fec] transition-all duration-300 ${
                  isHovered ? "w-full" : "w-0"
                }`} 
              />

              {/* Title & Metadata Left */}
              <div className="flex items-center gap-6 md:gap-10 relative z-10">
                <span className={`font-mono text-xs transition-colors duration-300 ${
                  isHovered ? "text-[#753fec]" : "text-neutral-600"
                }`}>
                  {item.id}
                </span>

                <div className="flex flex-col gap-1.5">
                  <h3 
                    className={`font-display uppercase tracking-wider transition-all duration-500 ease-out origin-left ${
                      isHovered 
                        ? "text-2xl sm:text-4xl md:text-5xl font-extrabold text-white" 
                        : "text-lg sm:text-2xl md:text-3xl font-normal text-white/80"
                    }`}
                    style={{
                      opacity: isHovered ? 1.0 : (isAnyHovered ? 0.35 : 0.8),
                      fontFamily: item.title.includes("SUV") ? '"PingFang SC", "Helvetica Neue", Arial, sans-serif' : undefined
                    }}
                  >
                    {item.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-0.5">
                    <span className="font-mono text-[11px] text-neutral-400 uppercase tracking-widest">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Technologies & Actions Right */}
              <div className="flex items-center gap-3.5 mt-4 md:mt-0 relative z-10 justify-start md:justify-end">
                {/* Far Right Year Small Text Badge */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`font-mono text-xs px-2.5 py-1 rounded-sm border tracking-widest uppercase transition-all duration-300 ${
                    isHovered
                      ? "bg-[#753fec]/20 text-[#9e80ed] border-[#753fec]/60 font-medium"
                      : "bg-neutral-900/80 text-neutral-400 border-neutral-800"
                  }`}>
                    {item.year}
                  </span>

                  {onItemDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onItemDelete(item, e);
                      }}
                      className="p-2 text-neutral-500 hover:text-red-400 hover:bg-neutral-900 rounded-md transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                      title="删除此项目"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
