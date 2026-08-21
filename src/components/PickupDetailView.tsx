import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
const longHeaderBannerImg = '';
const afterVideo1Img = '';
const afterVideo2Img = '';
import { 
  Play, Pause, Volume2, VolumeX, Upload, Link as LinkIcon, 
  RefreshCw, Maximize2, RefreshCcw
} from 'lucide-react';

interface ProjectExtendedDetails {
  id: string;
  title: string;
  subtitle?: string;
  titleEn?: string;
  role?: string;
  category: string;
  year: string;
  imageSrc: string;
  subImageSrc: string;
  techs: string[];
  backgroundIntro: string;
  dimensions: { title: string; desc: string }[];
  breakthroughs: string[];
  designSystem: { title: string; detail: string; accent: string };
}

interface ConceptMediaSlide {
  id: string;
  title: string;
  desc: string;
  techs: string[];
  type: 'image' | 'video';
  url: string;
}

const DELETED_FILES = [
  'pickup-title.jpg',
  'pickup_project_1784513258652.jpg',
  'pickup_sandmode_hmi_1784711338035.jpg',
  'pickup_dusk_front_1785046916277.jpg',
  'pickup_hmi_strategy_1785045579249.jpg'
];

// Utility to safely format media URLs
const formatMediaUrl = (url: string | undefined | null) => {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;

  if (url.toLowerCase().includes('video1.mp4')) {
    return '/video/video1.mp4';
  }
  if (url.toLowerCase().includes('video3.mp4')) {
    return '/video/video3.mp4';
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    if (url.includes('ibb.co')) return '';
    return url;
  }

  let cleanUrl = url.trim();
  if (cleanUrl.includes('src/assets/images/')) {
    cleanUrl = '/' + cleanUrl.split('src/assets/images/').pop();
  } else if (cleanUrl.includes('assets/images/')) {
    cleanUrl = '/' + cleanUrl.split('assets/images/').pop();
  }
  if (!cleanUrl.startsWith('/')) {
    cleanUrl = '/' + cleanUrl;
  }
  const filename = cleanUrl.slice(1);
  if (DELETED_FILES.includes(filename)) {
    return '';
  }
  return cleanUrl;
};

interface PickupDetailViewProps {
  detail: ProjectExtendedDetails;
  heroVideoUrl: string;
  onResetAll?: () => void;
}

// Default Data for Concept A & Concept B & Hero
const DEFAULT_HERO_VID = "";
const DEFAULT_CONCEPT_A_VID = "";
const DEFAULT_CONCEPT_B_VID = "";

const INITIAL_CONCEPT_A_SLIDES: ConceptMediaSlide[] = [];

const INITIAL_CONCEPT_B_SLIDES: ConceptMediaSlide[] = [];

export default function PickupDetailView({ detail, heroVideoUrl, onResetAll }: PickupDetailViewProps) {
  // Hero Cover Media State
  const [heroMedia, setHeroMedia] = useState<{ type: 'image' | 'video'; url: string }>(() => {
    try {
      const saved = localStorage.getItem('pickup_hero_media');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.url && parsed.url !== '') {
          return parsed;
        }
      }
    } catch {}
    return { type: 'video', url: 'https://a566e28db74b41bebfdfab6ad1c9bbff.gz2.agentos-app.net/video5.mp4' };
  });

  // Concept A Cover Media
  const [conceptACover, setConceptACover] = useState<{ type: 'image' | 'video'; url: string }>(() => {
    try {
      const saved = localStorage.getItem('pickup_concept_a_cover');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { type: 'video', url: '' };
  });

  // Concept B Cover Media
  const [conceptBCover, setConceptBCover] = useState<{ type: 'image' | 'video'; url: string }>(() => {
    try {
      const saved = localStorage.getItem('pickup_concept_b_cover');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { type: 'video', url: '' };
  });

  const [conceptAMuted, setConceptAMuted] = useState(true);
  const [conceptAPlaying, setConceptAPlaying] = useState(true);
  const [conceptBMuted, setConceptBMuted] = useState(true);
  const [conceptBPlaying, setConceptBPlaying] = useState(true);

  // Concept A & B Slides
  const [conceptASlides, setConceptASlides] = useState<ConceptMediaSlide[]>(() => {
    try {
      const saved = localStorage.getItem('pickup_concept_a_slides');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CONCEPT_A_SLIDES;
  });

  const [conceptBSlides, setConceptBSlides] = useState<ConceptMediaSlide[]>(() => {
    try {
      const saved = localStorage.getItem('pickup_concept_b_slides');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CONCEPT_B_SLIDES;
  });

  // Fullscreen Lightbox Zoom Media State
  const [previewMedia, setPreviewMedia] = useState<{ type: 'image' | 'video'; url: string } | null>(null);

  // Video Refs
  const conceptAVideoRef = useRef<HTMLVideoElement>(null);
  const conceptBVideoRef = useRef<HTMLVideoElement>(null);

  // Hidden file input for uploads
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<{
    type: 'hero' | 'coverA' | 'coverB' | 'slideA' | 'slideB' | 'persona1' | 'persona2' | 'strategyDiag' | 'competitor' | 'dirA' | 'dirB' | 'insight' | 'video1' | 'videoMiddle' | 'video2';
    index?: number;
  } | null>(null);

  // Bottom Video 1, Video Middle & Video 2 States
  const [video1Media, setVideo1Media] = useState<{ type: 'video'; url: string }>(() => {
    try {
      const saved = localStorage.getItem('pickup_video1_media');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.url === 'string' && parsed.url.trim().length > 0 && !parsed.url.includes('agentos-app.net')) {
          return { type: 'video', url: formatMediaUrl(parsed.url) };
        }
      }
    } catch {}
    return { type: 'video', url: '' };
  });

  const [videoMiddleMedia, setVideoMiddleMedia] = useState<{ type: 'video' | 'image'; url: string }>(() => {
    try {
      const saved = localStorage.getItem('pickup_videomiddle_media');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.url === 'string' && parsed.url.trim().length > 0) {
          return parsed;
        }
      }
    } catch {}
    return { type: 'video', url: '' };
  });

  const [video2Media, setVideo2Media] = useState<{ type: 'video'; url: string }>(() => {
    try {
      const saved = localStorage.getItem('pickup_video2_media');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.url === 'string' && parsed.url.trim().length > 0 && !parsed.url.includes('agentos-app.net')) {
          return { type: 'video', url: formatMediaUrl(parsed.url) };
        }
      }
    } catch {}
    return { type: 'video', url: '' };
  });

  const [video1Muted, setVideo1Muted] = useState(true);
  const [video1Playing, setVideo1Playing] = useState(true);

  const [videoMiddleMuted, setVideoMiddleMuted] = useState(true);
  const [videoMiddlePlaying, setVideoMiddlePlaying] = useState(true);

  const [video2Muted, setVideo2Muted] = useState(true);
  const [video2Playing, setVideo2Playing] = useState(true);

  const video1Ref = useRef<HTMLVideoElement>(null);
  const videoMiddleRef = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);

  // Sync Video refs with play state & muted property
  useEffect(() => {
    if (video1Ref.current) {
      video1Ref.current.muted = video1Muted;
      if (video1Playing) {
        video1Ref.current.play().catch(() => {});
      } else {
        video1Ref.current.pause();
      }
    }
  }, [video1Media.url, video1Muted, video1Playing]);

  useEffect(() => {
    if (videoMiddleRef.current) {
      videoMiddleRef.current.muted = videoMiddleMuted;
      if (videoMiddlePlaying) {
        videoMiddleRef.current.play().catch(() => {});
      } else {
        videoMiddleRef.current.pause();
      }
    }
  }, [videoMiddleMedia.url, videoMiddleMuted, videoMiddlePlaying]);

  useEffect(() => {
    if (video2Ref.current) {
      video2Ref.current.muted = video2Muted;
      if (video2Playing) {
        video2Ref.current.play().catch(() => {});
      } else {
        video2Ref.current.pause();
      }
    }
  }, [video2Media.url, video2Muted, video2Playing]);

  // Persona 1 & Persona 2 Avatars/Media
  const [persona1Media, setPersona1Media] = useState<{ type: 'image' | 'video'; url: string }>(() => {
    try {
      const saved = localStorage.getItem('pickup_persona1_media');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.url) return { ...parsed, url: formatMediaUrl(parsed.url) };
      }
    } catch {}
    return { type: 'image', url: '' };
  });

  const [persona2Media, setPersona2Media] = useState<{ type: 'image' | 'video'; url: string }>(() => {
    try {
      const saved = localStorage.getItem('pickup_persona2_media');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.url) return { ...parsed, url: formatMediaUrl(parsed.url) };
      }
    } catch {}
    return { type: 'image', url: '' };
  });

  // Section 2 UI Strategy Diagram
  const [strategyDiagramMedia, setStrategyDiagramMedia] = useState<{ type: 'image' | 'video'; url: string }>(() => {
    try {
      const saved = localStorage.getItem('pickup_strategy_diag_media');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.url) return { ...parsed, url: formatMediaUrl(parsed.url) };
      }
    } catch {}
    return { type: 'image', url: '' };
  });

  // Section 3 Competitor Benchmark Diagram
  const [competitorMedia, setCompetitorMedia] = useState<{ type: 'image' | 'video'; url: string }>(() => {
    try {
      const saved = localStorage.getItem('pickup_competitor_media');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.url) return { ...parsed, url: formatMediaUrl(parsed.url) };
      }
    } catch {}
    return { type: 'image', url: '' };
  });

  // Section 4 Direction A & B Cards Media
  const [directionAMedia, setDirectionAMedia] = useState<{ type: 'image' | 'video'; url: string }>(() => {
    try {
      const saved = localStorage.getItem('pickup_dir_a_media');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.url) return { ...parsed, url: formatMediaUrl(parsed.url) };
      }
    } catch {}
    return { type: 'image', url: '' };
  });

  const [directionBMedia, setDirectionBMedia] = useState<{ type: 'image' | 'video'; url: string }>(() => {
    try {
      const saved = localStorage.getItem('pickup_dir_b_media');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.url) return { ...parsed, url: formatMediaUrl(parsed.url) };
      }
    } catch {}
    return { type: 'image', url: '' };
  });

  // Section 5 Insights Media (3 items)
  const [insightsMedia, setInsightsMedia] = useState<Array<{ type: 'image' | 'video'; url: string }>>(() => {
    try {
      const saved = localStorage.getItem('pickup_insights_media');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((item: { type: 'image' | 'video'; url: string }) => ({
            ...item,
            url: formatMediaUrl(item.url)
          }));
        }
      }
    } catch {}
    return [
      { type: 'image', url: '' },
      { type: 'image', url: '' },
      { type: 'image', url: '' },
    ];
  });

  // Sync state with LocalStorage
  useEffect(() => {
    localStorage.setItem('pickup_hero_media', JSON.stringify(heroMedia));
  }, [heroMedia]);

  useEffect(() => {
    localStorage.setItem('pickup_persona1_media', JSON.stringify(persona1Media));
  }, [persona1Media]);

  useEffect(() => {
    localStorage.setItem('pickup_persona2_media', JSON.stringify(persona2Media));
  }, [persona2Media]);

  useEffect(() => {
    localStorage.setItem('pickup_strategy_diag_media', JSON.stringify(strategyDiagramMedia));
  }, [strategyDiagramMedia]);

  useEffect(() => {
    localStorage.setItem('pickup_competitor_media', JSON.stringify(competitorMedia));
  }, [competitorMedia]);

  useEffect(() => {
    localStorage.setItem('pickup_dir_a_media', JSON.stringify(directionAMedia));
  }, [directionAMedia]);

  useEffect(() => {
    localStorage.setItem('pickup_dir_b_media', JSON.stringify(directionBMedia));
  }, [directionBMedia]);

  useEffect(() => {
    localStorage.setItem('pickup_insights_media', JSON.stringify(insightsMedia));
  }, [insightsMedia]);

  useEffect(() => {
    localStorage.setItem('pickup_concept_a_cover', JSON.stringify(conceptACover));
  }, [conceptACover]);

  useEffect(() => {
    localStorage.setItem('pickup_concept_b_cover', JSON.stringify(conceptBCover));
  }, [conceptBCover]);

  useEffect(() => {
    localStorage.setItem('pickup_concept_a_slides', JSON.stringify(conceptASlides));
  }, [conceptASlides]);

  useEffect(() => {
    localStorage.setItem('pickup_concept_b_slides', JSON.stringify(conceptBSlides));
  }, [conceptBSlides]);

  useEffect(() => {
    localStorage.setItem('pickup_video1_media', JSON.stringify(video1Media));
  }, [video1Media]);

  useEffect(() => {
    localStorage.setItem('pickup_videomiddle_media', JSON.stringify(videoMiddleMedia));
  }, [videoMiddleMedia]);

  useEffect(() => {
    localStorage.setItem('pickup_video2_media', JSON.stringify(video2Media));
  }, [video2Media]);

  // Video playback toggles
  const toggleConceptAPlay = () => {
    if (!conceptAVideoRef.current) return;
    if (conceptAPlaying) {
      conceptAVideoRef.current.pause();
    } else {
      conceptAVideoRef.current.play().catch(() => {});
    }
    setConceptAPlaying(!conceptAPlaying);
  };

  const toggleConceptBPlay = () => {
    if (!conceptBVideoRef.current) return;
    if (conceptBPlaying) {
      conceptBVideoRef.current.pause();
    } else {
      conceptBVideoRef.current.play().catch(() => {});
    }
    setConceptBPlaying(!conceptBPlaying);
  };

  const toggleVideo1Play = () => {
    if (!video1Ref.current) return;
    if (video1Playing) {
      video1Ref.current.pause();
    } else {
      video1Ref.current.play().catch(() => {});
    }
    setVideo1Playing(!video1Playing);
  };

  const toggleVideoMiddlePlay = () => {
    if (!videoMiddleRef.current) return;
    if (videoMiddlePlaying) {
      videoMiddleRef.current.pause();
    } else {
      videoMiddleRef.current.play().catch(() => {});
    }
    setVideoMiddlePlaying(!videoMiddlePlaying);
  };

  const toggleVideo2Play = () => {
    if (!video2Ref.current) return;
    if (video2Playing) {
      video2Ref.current.pause();
    } else {
      video2Ref.current.play().catch(() => {});
    }
    setVideo2Playing(!video2Playing);
  };

  // Trigger File Uploads
  const handleTriggerUpload = (
    type: 'hero' | 'coverA' | 'coverB' | 'slideA' | 'slideB' | 'persona1' | 'persona2' | 'strategyDiag' | 'competitor' | 'dirA' | 'dirB' | 'insight' | 'video1' | 'videoMiddle' | 'video2',
    index?: number
  ) => {
    setUploadTarget({ type, index });
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadTarget) return;

    const isVideo = file.type.startsWith('video/');

    if (isVideo) {
      const url = URL.createObjectURL(file);
      applyMediaChange({ type: 'video', url });
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          applyMediaChange({ type: 'image', url: result });
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const applyMediaChange = (media: { type: 'image' | 'video'; url: string }) => {
    if (!uploadTarget) return;

    if (uploadTarget.type === 'hero') {
      setHeroMedia(media);
    } else if (uploadTarget.type === 'coverA') {
      setConceptACover(media);
    } else if (uploadTarget.type === 'coverB') {
      setConceptBCover(media);
    } else if (uploadTarget.type === 'video1') {
      setVideo1Media({ type: 'video', url: media.url });
    } else if (uploadTarget.type === 'videoMiddle') {
      setVideoMiddleMedia(media);
    } else if (uploadTarget.type === 'video2') {
      setVideo2Media({ type: 'video', url: media.url });
    } else if (uploadTarget.type === 'persona1') {
      setPersona1Media(media);
    } else if (uploadTarget.type === 'persona2') {
      setPersona2Media(media);
    } else if (uploadTarget.type === 'strategyDiag') {
      setStrategyDiagramMedia(media);
    } else if (uploadTarget.type === 'competitor') {
      setCompetitorMedia(media);
    } else if (uploadTarget.type === 'dirA') {
      setDirectionAMedia(media);
    } else if (uploadTarget.type === 'dirB') {
      setDirectionBMedia(media);
    } else if (uploadTarget.type === 'insight' && uploadTarget.index !== undefined) {
      setInsightsMedia(prev => {
        const next = [...prev];
        next[uploadTarget.index!] = media;
        return next;
      });
    } else if (uploadTarget.type === 'slideA' && uploadTarget.index !== undefined) {
      setConceptASlides(prev => {
        const next = [...prev];
        next[uploadTarget.index!] = { ...next[uploadTarget.index!], type: media.type, url: media.url };
        return next;
      });
    } else if (uploadTarget.type === 'slideB' && uploadTarget.index !== undefined) {
      setConceptBSlides(prev => {
        const next = [...prev];
        next[uploadTarget.index!] = { ...next[uploadTarget.index!], type: media.type, url: media.url };
        return next;
      });
    }
  };

  // Prompt for manual URL input
  const promptMediaUrl = (
    type: 'hero' | 'coverA' | 'coverB' | 'slideA' | 'slideB' | 'persona1' | 'persona2' | 'strategyDiag' | 'competitor' | 'dirA' | 'dirB' | 'insight' | 'video1' | 'videoMiddle' | 'video2',
    index?: number
  ) => {
    let currentUrl = '';
    if (type === 'hero') currentUrl = heroMedia.url;
    else if (type === 'coverA') currentUrl = conceptACover.url;
    else if (type === 'coverB') currentUrl = conceptBCover.url;
    else if (type === 'video1') currentUrl = video1Media.url;
    else if (type === 'videoMiddle') currentUrl = videoMiddleMedia.url;
    else if (type === 'video2') currentUrl = video2Media.url;
    else if (type === 'persona1') currentUrl = persona1Media.url;
    else if (type === 'persona2') currentUrl = persona2Media.url;
    else if (type === 'strategyDiag') currentUrl = strategyDiagramMedia.url;
    else if (type === 'competitor') currentUrl = competitorMedia.url;
    else if (type === 'dirA') currentUrl = directionAMedia.url;
    else if (type === 'dirB') currentUrl = directionBMedia.url;
    else if (type === 'insight' && index !== undefined) currentUrl = insightsMedia[index]?.url || '';
    else if (type === 'slideA' && index !== undefined) currentUrl = conceptASlides[index]?.url || '';
    else if (type === 'slideB' && index !== undefined) currentUrl = conceptBSlides[index]?.url || '';

    const input = window.prompt('URL (.mp4 / .jpg / .png):', currentUrl);
    if (input && input.trim()) {
      const url = input.trim();
      const isVideo = url.toLowerCase().match(/\.(mp4|webm|mov|m4v)(\?.*)?$/i) !== null;
      setUploadTarget({ type, index });
      applyMediaChange({ type: isVideo ? 'video' : 'image', url });
    }
  };

  // Toggle media type manually (image <-> video)
  const toggleSlideMediaType = (type: 'slideA' | 'slideB', index: number) => {
    if (type === 'slideA') {
      setConceptASlides(prev => {
        const next = [...prev];
        const cur = next[index];
        next[index] = { ...cur, type: cur.type === 'image' ? 'video' : 'image' };
        return next;
      });
    } else if (type === 'slideB') {
      setConceptBSlides(prev => {
        const next = [...prev];
        const cur = next[index];
        next[index] = { ...cur, type: cur.type === 'image' ? 'video' : 'image' };
        return next;
      });
    }
  };

  const handleResetPickupDetails = () => {
    setHeroMedia({ type: 'video', url: '' });
    setVideo1Media({ type: 'video', url: '' });
    setVideo2Media({ type: 'video', url: '' });
    setVideoMiddleMedia({ type: 'video', url: '' });
    setPersona1Media({ type: 'image', url: '' });
    setPersona2Media({ type: 'image', url: '' });
    setStrategyDiagramMedia({ type: 'image', url: '' });
    setCompetitorMedia({ type: 'image', url: '' });
    setDirectionAMedia({ type: 'image', url: '' });
    setDirectionBMedia({ type: 'image', url: '' });
    setInsightsMedia([
      { type: 'image', url: '' },
      { type: 'image', url: '' },
      { type: 'image', url: '' },
    ]);
    setConceptACover({ type: 'video', url: '' });
    setConceptBCover({ type: 'video', url: '' });
    setConceptASlides([]);
    setConceptBSlides([]);

    localStorage.removeItem('pickup_hero_media');
    localStorage.removeItem('pickup_video1_media');
    localStorage.removeItem('pickup_video2_media');
    localStorage.removeItem('pickup_videomiddle_media');
    localStorage.removeItem('pickup_persona1_media');
    localStorage.removeItem('pickup_persona2_media');
    localStorage.removeItem('pickup_strategy_diag_media');
    localStorage.removeItem('pickup_competitor_media');
    localStorage.removeItem('pickup_dir_a_media');
    localStorage.removeItem('pickup_dir_b_media');
    localStorage.removeItem('pickup_insights_media');
    localStorage.removeItem('pickup_concept_a_cover');
    localStorage.removeItem('pickup_concept_b_cover');
    localStorage.removeItem('pickup_concept_a_slides');
    localStorage.removeItem('pickup_concept_b_slides');
    if (onResetAll) onResetAll();
  };

  return (
    <div className="w-full relative bg-black pb-24 text-white font-['Special_Gothic_Expanded_One']">
      
      {/* Hidden file input for uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,video/*"
        className="hidden"
      />

      {/* Lightbox Modal for Fullscreen Media */}
      <AnimatePresence>
        {previewMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewMedia(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 cursor-zoom-out"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-7xl w-full max-h-[92vh] flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 shadow-2xl"
            >
              <div className="w-full bg-neutral-900 border-b border-neutral-800 px-6 py-3 flex items-center justify-between text-xs font-mono text-neutral-300">
                <span className="text-[#753fec] font-bold">FULLSCREEN MEDIA</span>
                <button
                  onClick={() => setPreviewMedia(null)}
                  className="p-1.5 bg-black/60 hover:bg-[#753fec] text-white hover:text-black rounded-full transition-all cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              <div className="w-full h-full max-h-[82vh] flex items-center justify-center overflow-hidden bg-black p-2">
                {previewMedia.type === 'video' ? (
                  <video
                    src={previewMedia.url}
                    controls
                    autoPlay
                    loop
                    className="max-w-full max-h-[80vh] object-contain rounded-lg"
                  />
                ) : (
                  <img
                    src={previewMedia.url}
                    alt="Enlarged view"
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-[80vh] object-contain rounded-lg"
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
          HERO MEDIA BANNER (1920x1080 ASPECT RATIO)
         ========================================== */}
      <div className="relative w-full aspect-[1920/1080] bg-black overflow-hidden border-b border-neutral-900 group">
        {heroMedia.url ? (
          heroMedia.type === 'video' ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              key={heroMedia.url}
              className="w-full h-full object-cover"
            >
              <source src={encodeURI(heroMedia.url)} type="video/mp4" />
              <source src={heroMedia.url} type="video/mp4" />
            </video>
          ) : (
            <img
              src={heroMedia.url}
              alt="Hero Media"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-950 border border-neutral-900 text-neutral-500 p-8">
            <Upload className="w-10 h-10 mb-3 text-neutral-600" />
            <span className="text-xs font-mono text-neutral-400">D级皮卡 Hero 封面（暂无视频/图片，可点击右上角工具按钮上传）</span>
          </div>
        )}

        {/* Dark Vignette & Gradient Overlay for optimal title contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/50 pointer-events-none z-10" />

        {/* Hero Title & English Subtitle Overlaid on Top of Dynamic Video */}
        <div className="absolute inset-0 z-15 flex flex-col justify-center items-center text-center px-6 sm:px-12 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl space-y-3 sm:space-y-4"
          >
            <span className="inline-block font-mono text-xs sm:text-sm text-[#7a7a7a] tracking-[0.3em] uppercase font-bold bg-[#7a7a7a]/10 border border-[#7a7a7a]/30 px-4 py-1.5 rounded-full backdrop-blur-md">
              GLOBAL PICKUP TRUCK / HMI UI DESIGN
            </span>
            <h1 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-2xl leading-tight">
              {detail.title || "全球 D 级皮卡智能座舱 HMI 体验与视觉策略"}
            </h1>
            <p className="font-sans text-sm sm:text-base md:text-lg text-neutral-200 tracking-normal font-normal drop-shadow-lg max-w-3xl mx-auto leading-relaxed">
              {detail.subtitle || "面向越野、装载、露营与全球化复杂环境的座舱信息架构、交互策略与视觉系统定义"}
            </p>
            <p className="font-mono text-xs sm:text-sm md:text-base text-neutral-400 tracking-[0.25em] uppercase font-medium drop-shadow-lg">
              {detail.titleEn || "GLOBAL D-CLASS PICKUP ALL-NEW HMI UI DESIGN"}
            </p>
          </motion.div>
        </div>

        {/* Minimal Control Bar Overlay */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md p-2 rounded-xl border border-neutral-800 opacity-80 hover:opacity-100 transition-opacity">
          <button
            onClick={() => handleTriggerUpload('hero')}
            className="p-2 bg-[#753fec] hover:bg-[#2eb04e] text-black rounded-lg cursor-pointer transition-all"
            title="Upload Media"
          >
            <Upload className="w-4 h-4" />
          </button>
          <button
            onClick={() => promptMediaUrl('hero')}
            className="p-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg border border-neutral-700 cursor-pointer transition-all"
            title="Media URL"
          >
            <LinkIcon className="w-4 h-4 text-[#753fec]" />
          </button>
          {heroMedia.url ? (
            <button
              onClick={() => setPreviewMedia({ type: heroMedia.type, url: heroMedia.url })}
              className="p-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg border border-neutral-700 cursor-pointer transition-all"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          ) : null}
          <button
            onClick={handleResetPickupDetails}
            className="p-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg border border-neutral-700 cursor-pointer transition-all"
            title="Reset All"
          >
            <RefreshCcw className="w-4 h-4 text-[#753fec]" />
          </button>
        </div>
      </div>

      {/* ==========================================
          NEW IMAGES SECTION
         ========================================== */}
      <section className="w-full max-w-[1920px] mx-auto mt-8 sm:mt-16 px-0 sm:px-4 md:px-8 border-t border-neutral-900 pt-8 sm:pt-16">
        <div className="flex flex-col gap-10 w-full">
          {[
            {
              type: 'image',
              url: 'https://f75d3d355ae042e5960a8262010ed6b2.app.workbuddy.link/images/2.jpg'
            },
            {
              type: 'video',
              url: 'https://a566e28db74b41bebfdfab6ad1c9bbff.gz2.agentos-app.net/video1.mp4'
            },
            {
              type: 'image',
              url: 'https://f75d3d355ae042e5960a8262010ed6b2.app.workbuddy.link/images/1.jpg'
            },
            {
              type: 'video',
              url: 'https://a566e28db74b41bebfdfab6ad1c9bbff.gz2.agentos-app.net/video3.mp4'
            },
            {
              type: 'image',
              url: 'https://537a055e300844d9b462001bad8e9fd2.bj8.agentos-app.net/1685642279.jpg'
            },
            {
              type: 'video',
              url: 'https://a566e28db74b41bebfdfab6ad1c9bbff.gz2.agentos-app.net/video4.mp4'
            }
          ].map((media, index) => (
            <div key={index} className="flex flex-col gap-4">
              {index === 5 && (
                <div className="w-full flex flex-col justify-start px-4 sm:px-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-1">越野大师模式视觉</h3>
                  <p className="text-sm sm:text-base text-neutral-400 font-sans tracking-wide">
                    由于保密原因模糊处理，非最终效果
                  </p>
                </div>
              )}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="group relative w-full flex flex-col bg-neutral-950 border border-neutral-800 rounded-none sm:rounded-2xl overflow-hidden hover:border-[#753fec]/50 transition-all duration-500 shadow-2xl"
              >
                <div className="relative w-full bg-black overflow-hidden flex justify-center items-center">
                {media.type === 'image' ? (
                  <>
                    <img
                      src={media.url}
                      alt={`D级皮卡 展示图 ${index + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-auto object-cover block"
                      style={{ width: '100%', maxWidth: '1920px' }}
                    />
                    <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md p-2.5 rounded-xl border border-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setPreviewMedia({ type: 'image', url: media.url })}
                        className="p-2 bg-neutral-900 hover:bg-[#753fec] text-white hover:text-white rounded-lg border border-neutral-700 cursor-pointer transition-all flex items-center gap-1.5 text-xs font-mono font-bold"
                        title="全屏查看"
                      >
                        <Maximize2 className="w-4 h-4 text-[#753fec]" />
                        <span>全屏查看</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls
                    className="w-full h-auto max-h-[80vh] object-contain"
                  >
                    <source src={media.url} type="video/mp4" />
                  </video>
                )}
              </div>
            </motion.div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
