import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, Play, Pause, Volume2, VolumeX, X, LayoutGrid, Eye, Trash2, RefreshCw, Archive, Download } from 'lucide-react';
import { ModelData } from '../types';
import GridLines, { GridIntersectionNode } from './GridLines';
import HoverImageReveal, { HoverItem } from './HoverImageReveal';
import ProjectDetails from './ProjectDetails';
const E01Img = '/E01.jpg';
const PHUD1Img = '/PHUD1.jpg';
const yuyinjinglImg = '/yuyinjingl.jpg';
const deepalOSImg = '/DEEPALOS.jpg';
const title02Img = '/02-title.jpg';
const PICKUP0Img = '/PICKUP0.jpg';

interface GallerySectionProps {
  model: ModelData;
  onOpenVideoPackager?: () => void;
}

export default function GallerySection({ model, onOpenVideoPackager }: GallerySectionProps) {
  const [activeLightbox, setActiveLightbox] = useState<{
    type: 'image' | 'video';
    src: string;
    poster?: string;
  } | null>(null);

  const [mutedVideos, setMutedVideos] = useState<{ [key: string]: boolean }>({});
  const [viewMode, setViewMode] = useState<'curated' | 'raw'>('curated');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const toggleMute = (src: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering lightbox
    setMutedVideos(prev => ({
      ...prev,
      [src]: !prev[src]
    }));
  };

  const [portfolioItems, setPortfolioItems] = useState<HoverItem[]>([
    {
      id: "01",
      title: "重点项目 - 全球 D 级皮卡智能座舱 HMI 体验与视觉策略",
      subtitle: "面向越野、装载、露营与全球化复杂环境的座舱信息架构、交互策略与视觉系统定义",
      category: "GLOBAL PICKUP TRUCK / HMI UI STRATEGY",
      year: "2023 - 2025",
      imageSrc: "https://b4ca62ea3b5c48218ab14dbc609f2c16.gz5.agentos-app.net/Frame_1739333640.jpg",
      techs: ["HMI UI STRATEGY", "INTELLIGENT COCKPIT", "D-CLASS PICKUP", "VISUAL SYSTEM"]
    },
    {
      id: "02",
      title: "重点项目 - SUV旗舰车型UI设计视觉迭代策略",
      category: "FLAGSHIP SUV / UI ITERATION STRATEGY",
      year: "2024 - 至今",
      imageSrc: "https://b4ca62ea3b5c48218ab14dbc609f2c16.gz5.agentos-app.net/Frame_1739333642.jpg",
      techs: ["FLAGSHIP SUV", "UI ITERATION", "DIGITAL COCKPIT", "DESIGN SYSTEM"]
    },
    {
      id: "03",
      title: "落地项目 - 启源E0语音精灵",
      category: "VOICE ELF / MASS PRODUCTION",
      year: "2022 - 2023",
      imageSrc: "https://b4ca62ea3b5c48218ab14dbc609f2c16.gz5.agentos-app.net/Frame_1739333643.jpg",
      techs: ["VOICE ASSISTANT", "3D PARTICLES", "MOTION", "EMOTION ENGINE"]
    },
    {
      id: "04",
      title: "落地项目 - 深蓝DEEPAL OS 3.0UI设计",
      category: "DEEPAL OS 3.0 / MASS PRODUCTION",
      year: "2023",
      imageSrc: "https://b4ca62ea3b5c48218ab14dbc609f2c16.gz5.agentos-app.net/Frame_1739333641.jpg",
      techs: ["INFOTAINMENT", "CANVAS ENGINE", "MICRO-INTERACTION", "HMI"]
    },
    {
      id: "05",
      title: "AI概念产品 - HMI UI设计师提效工具思考",
      subtitle: "探索生成式AI与Agent工作流在智能座舱HMI体验设计、资产生成与工程协同中的提效体系",
      category: "AI CONCEPT / DESIGN EFFICIENCY TOOL",
      year: "2024 - 至今",
      imageSrc: "https://f75d3d355ae042e5960a8262010ed6b2.app.workbuddy.link/images/3.jpg",
      techs: ["AI DESIGN COPILOT", "HMI WORKFLOW", "PROMPT ENGINEERING", "EFFICIENCY THINKING"]
    },
    {
      id: "06",
      title: "概念项目 - PHUD整舱视觉概念设计",
      category: "PANORAMIC HUD / CONCEPT DESIGN",
      year: "2025 - 至今",
      imageSrc: "https://b4ca62ea3b5c48218ab14dbc609f2c16.gz5.agentos-app.net/photo10.jpg",
      techs: ["PANORAMIC HUD", "AMBIENT SYNC", "AR PROJECTION", "CONCEPT"]
    },
    {
      id: "07",
      title: "概念项目 - 启源E0HMI UI视觉概念设计",
      category: "QIYUAN E0 / HMI UI CONCEPT",
      year: "2022 - 2025",
      imageSrc: "https://b4ca62ea3b5c48218ab14dbc609f2c16.gz5.agentos-app.net/photo15.jpg",
      techs: ["CONCEPT DESIGN", "HMI UI", "NEXT-GEN COCKPIT", "UI SYSTEM"]
    },
    {
      id: "08",
      title: "实习项目 - 小鹏公众号广宣视频",
      category: "XPENG / PROMOTIONAL VIDEO",
      year: "2021",
      imageSrc: "https://b4ca62ea3b5c48218ab14dbc609f2c16.gz5.agentos-app.net/Frame_1739333645_1.jpg",
      techs: ["XPENG MOTORS", "PROMOTIONAL VIDEO", "MOTION GRAPHICS", "OFFICIAL ACCOUNT"]
    }
  ]);

  const handleDeleteItem = (itemToDelete: HoverItem) => {
    setPortfolioItems(prev => prev.filter(item => item.id !== itemToDelete.id));
  };

  // State for raw gallery media items
  const [rawMediaList, setRawMediaList] = useState(() => {
    try {
      const saved = localStorage.getItem(`raw_media_${model.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const updated = parsed.map((m: { type: string; src: string; poster?: string }) => {
            if (m.src && (m.src.includes('roadster_homepage_4.mp4') || m.src.includes('video2/'))) {
              return { ...m, src: 'https://e41e5de1dfec4f20b8f5f9df2754e51a.bj6.agentos-app.net/' };
            }
            return m;
          });
          return updated.filter((item: { type: string; src: string }, index: number, self: any[]) =>
            index === self.findIndex((t) => t.src === item.src && t.type === item.type)
          );
        }
      }
    } catch {
      // ignore
    }
    return model.galleryMedia;
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`raw_media_${model.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const updated = parsed.map((m: { type: string; src: string; poster?: string }) => {
            if (m.src && (m.src.includes('roadster_homepage_4.mp4') || m.src.includes('video2/'))) {
              return { ...m, src: 'https://e41e5de1dfec4f20b8f5f9df2754e51a.bj6.agentos-app.net/' };
            }
            return m;
          });
          const deduplicated = updated.filter((item: { type: string; src: string }, index: number, self: any[]) =>
            index === self.findIndex((t) => t.src === item.src && t.type === item.type)
          );
          setRawMediaList(deduplicated);
          return;
        }
      }
    } catch {
      // ignore
    }
    setRawMediaList(model.galleryMedia);
  }, [model.id, model.galleryMedia]);

  const handleDeleteRawMedia = (indexToDelete: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setRawMediaList(prev => {
      const updated = prev.filter((_, idx) => idx !== indexToDelete);
      try {
        localStorage.setItem(`raw_media_${model.id}`, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleResetRawMedia = () => {
    setRawMediaList(model.galleryMedia);
    try {
      localStorage.removeItem(`raw_media_${model.id}`);
    } catch {
      // ignore
    }
  };

  return (
    <section id="gallery" className="relative py-24 bg-[#0a0a0a] border-b border-neutral-900/60">
      <GridLines />

      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs text-[#753fec] uppercase tracking-widest font-medium">.creative creations dossier</span>
            <h2 className="font-display text-4xl sm:text-5xl text-white tracking-wider uppercase">
              作品集 PORTFOLIO
            </h2>
          </div>
        </div>

        {/* Dynamic View Modes */}
        <AnimatePresence mode="wait">
          {viewMode === 'curated' ? (
            <motion.div
              key="curated-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <HoverImageReveal 
                items={portfolioItems} 
                onItemClick={(item) => setSelectedProjectId(item.id)} 
                onItemDelete={(item) => handleDeleteItem(item)}
              />
            </motion.div>
          ) : (
            <div className="flex flex-col gap-6">
              {rawMediaList.length < model.galleryMedia.length && (
                <div className="flex justify-end">
                  <button
                    onClick={handleResetRawMedia}
                    className="flex items-center gap-1.5 font-mono text-[10px] text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 px-3 py-1.5 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3 text-[#FF6B00]" />
                    重置默认图集 RESTORE DEFAULT GALLERY
                  </button>
                </div>
              )}
              
              <motion.div
                key="raw-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {rawMediaList.map((media, idx) => {
                  const isWebUrl = media.src.startsWith('http') && !media.src.match(/\.(mp4|webm|ogg|mov|jpg|png|webp|gif|jpeg)($|\?)/i);
                  const isVideo = media.type === 'video' && !isWebUrl;
                  const isMuted = mutedVideos[media.src] !== false; // Default to muted

                  return (
                    <motion.div
                      key={media.src + idx}
                      onClick={() => setActiveLightbox(media)}
                      className="group relative aspect-[16/10] bg-neutral-950 border border-neutral-900 overflow-hidden cursor-pointer"
                    >
                      {/* Tech Overlays */}
                      <div className="absolute top-3 left-3 font-mono text-[9px] text-neutral-500 tracking-wider z-10 uppercase bg-[#0b0b0b]/80 px-2 py-0.5 border border-neutral-900">
                        .{model.name}_cam_{idx + 1}
                      </div>

                      <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5">
                        <button
                          onClick={(e) => handleDeleteRawMedia(idx, e)}
                          className="p-2 bg-black/80 hover:bg-red-950/80 border border-neutral-800 hover:border-red-600/60 text-neutral-400 hover:text-red-400 transition-all rounded-none cursor-pointer"
                          title="删除此渲染图"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="p-2 bg-black/70 border border-neutral-800 text-white rounded-none">
                          <Maximize2 className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      {/* Main Media Render */}
                      <div className="w-full h-full overflow-hidden relative">
                        {isWebUrl ? (
                          <div className="w-full h-full relative bg-neutral-950">
                            <iframe
                              src={media.src}
                              title={`${model.name} demo ${idx}`}
                              className="w-full h-full border-0 pointer-events-none group-hover:scale-[1.02] transition-transform duration-[2s] ease-out filter brightness-[0.9]"
                            />
                            <div className="absolute inset-0 bg-transparent" />
                          </div>
                        ) : isVideo ? (
                          <div className="w-full h-full relative">
                            <video
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              playsInline
                              muted={isMuted}
                              loop
                              autoPlay
                              poster={media.poster}
                              className="group-hover:scale-105 transition-transform duration-[2s] ease-out filter brightness-[0.8] group-hover:brightness-[0.95]"
                            >
                              <source src={media.src} type="video/mp4" />
                            </video>

                            {/* Mute/Unmute Quick Toggle */}
                            <button
                              onClick={(e) => toggleMute(media.src, e)}
                              className="absolute bottom-3 right-3 z-20 p-2 bg-[#0b0b0b]/80 border border-neutral-900 hover:border-neutral-700 text-neutral-400 hover:text-white transition-all rounded-none"
                            >
                              {isMuted ? (
                                <VolumeX className="w-3.5 h-3.5" />
                              ) : (
                                <Volume2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <img
                            src={media.src}
                            alt={`${model.name} capture`}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (!target.dataset.fallback) {
                                target.dataset.fallback = 'true';
                                target.src = '/PICKUP0.jpg';
                              }
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out filter brightness-[0.75] group-hover:brightness-[0.9]"
                          />
                        )}
                      </div>

                      {/* Subtle Hover Gradient Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-65 pointer-events-none"></div>

                      {/* Bottom title bar */}
                      <div className="absolute bottom-3 left-3 z-10">
                        <span className="font-serif italic text-xs text-neutral-300 capitalize">
                          {model.name} Design Details
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>

      {/* LIGHTBOX THEATER MODAL */}
      <AnimatePresence>
        {activeLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveLightbox(null)}
              className="absolute top-6 right-6 p-3 bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-800 transition-colors z-50"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Media Body */}
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative max-w-5xl w-full aspect-[16/10] bg-neutral-950 border border-neutral-900 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {activeLightbox.src.startsWith('http') && !activeLightbox.src.match(/\.(mp4|webm|ogg|mov|jpg|png|webp|gif|jpeg)($|\?)/i) ? (
                <iframe
                  src={activeLightbox.src}
                  title="Interactive Prototype"
                  className="w-full h-full border-0 bg-black"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : activeLightbox.type === 'video' ? (
                <video
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  controls
                  autoPlay
                  poster={activeLightbox.poster}
                  src={activeLightbox.src}
                  className="w-full h-full"
                />
              ) : (
                <img
                  src={activeLightbox.src}
                  alt="Expanded capture"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.fallback) {
                      target.dataset.fallback = 'true';
                      target.src = '/PICKUP0.jpg';
                    }
                  }}
                  className="w-full h-full object-contain"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProjectId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99999]"
          >
            <ProjectDetails 
              projectId={selectedProjectId}
              onClose={() => setSelectedProjectId(null)}
              onNavigate={(nextId) => setSelectedProjectId(nextId)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
