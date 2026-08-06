import React from 'react';
import { motion } from 'motion/react';
import GridLines from './GridLines';
const profileImg = 'https://b4ca62ea3b5c48218ab14dbc609f2c16.gz5.agentos-app.net/photo7.jpg';

// Thumbtack component simulating a highly realistic 3D bright neon lime-green push pin
const Thumbtack = () => (
  <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none select-none">
    {/* Soft, realistic offset 3D drop shadow cast by the pin body onto the card */}
    <div className="absolute top-5 left-3 w-5 h-7 bg-black/60 rounded-full blur-[4px] rotate-[22deg] transform-gpu origin-top" />
    
    {/* Pin Cap (Glossy Neon/Lime Green with organic volume and top reflection) */}
    <div className="w-5 h-3.5 rounded-[50%] bg-gradient-to-b from-lime-300 via-lime-400 to-lime-600 border border-lime-300/40 relative shadow-[inset_0_2px_2px_rgba(255,255,255,0.85),0_3px_5px_rgba(132,204,22,0.4)]">
      {/* Glossy specular highlight reflection */}
      <div className="absolute top-0.5 left-1.5 w-2 h-1 bg-white/90 rounded-full filter blur-[0.2px] transform -rotate-12" />
    </div>

    {/* Pin Neck/Grip (Tapered middle cylinder) */}
    <div className="w-3.5 h-2.5 bg-gradient-to-b from-lime-500 to-lime-600 border-x border-lime-500/30 relative shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]" />

    {/* Pin Base Flange (Flared base holding the needle) */}
    <div className="w-5.5 h-1.5 rounded-[50%] bg-gradient-to-b from-lime-500 to-lime-700 relative shadow-[0_2px_2px_rgba(0,0,0,0.45)]" />

    {/* Metal Pin Needle (Polished silver steel shaft) */}
    <div className="w-[1.5px] h-4 bg-gradient-to-b from-zinc-300 via-zinc-400 to-zinc-600 shadow-[1px_1px_1.5px_rgba(0,0,0,0.5)]" />
    
    {/* Insertion point shadow / crater */}
    <div className="w-2 h-1 bg-black/75 rounded-full blur-[0.6px] -mt-[0.5px]" />
  </div>
);

interface StickyNoteProps {
  key?: React.Key;
  id: string;
  title: string;
  subtitle: string;
  date: string;
  content: string;
  index: number;
}

// High-fidelity matte fine-grain paperboard texture SVG pattern mimicking the reference image.
// Features a high-density fractal noise to replicate granular organic paper fibers/sand-paper tooth.
const PAPER_TEXTURE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' opacity='0.55'%3E%3Cfilter id='matte-paper-grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='4' result='noise'/%3E%3CfeColorMatrix type='matrix' values='0.1 0 0 0 0.5  0 0.1 0 0 0.5  0 0 0.1 0 0.5  0 0 0 0.28 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23matte-paper-grain)'/%3E%3C/svg%3E")`;

// Sticky Resume Card component simulating a black transparent crumpled paper note
const StickyResumeCard = ({ id, title, subtitle, date, content, index }: StickyNoteProps) => {
  // Deterministic rotation angle to prevent shifting on re-renders, within range -4.5deg to 4.5deg
  const rotations = [-3.5, 2.8, -1.8, 4.2, -2.5, 3.5, -4.2, 1.8];
  const rot = rotations[index % rotations.length];
  
  // Slightly irregular border-radii for organic hand-cut feel
  const shapes = [
    "rounded-[6px_14px_8px_12px]",
    "rounded-[10px_8px_14px_6px]",
    "rounded-[8px_12px_6px_10px]",
    "rounded-[12px_6px_10px_8px]"
  ];
  const shapeClass = shapes[index % shapes.length];

  return (
    <motion.div
      className={`relative w-full min-h-[300px] sm:min-h-[320px] ${shapeClass} p-6 md:p-8 flex flex-col justify-between border border-neutral-800/40 select-text cursor-grab active:cursor-grabbing`}
      style={{
        background: `linear-gradient(135deg, rgba(16, 16, 16, 0.8) 0%, rgba(6, 6, 6, 0.8) 100%), ${PAPER_TEXTURE}`,
        backgroundBlendMode: 'overlay',
        boxShadow: "0 15px 35px -5px rgba(0,0,0,0.85), 0 8px 15px -6px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.08)",
        transformOrigin: "center center",
      }}
      initial={{ opacity: 0, y: 35, rotate: rot }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{
        rotate: rot * 0.25, // straightens up organic feel on hover
        scale: 1.05,
        y: -12,
        boxShadow: "0 28px 55px -10px rgba(0,0,0,0.95), 0 15px 22px -8px rgba(0,0,0,0.9), inset 0 1px 1px rgba(255,255,255,0.15)",
        transition: { type: "spring", stiffness: 260, damping: 18 }
      }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ type: "spring", stiffness: 100, damping: 14 }}
    >
      <Thumbtack />

      {/* Card Header [index] on top-left and Date */}
      <div className="w-full flex flex-col gap-1.5 z-10">
        <div className="flex justify-between items-center">
          <span className="font-mono text-xs text-neutral-500 font-semibold">[{id}]</span>
          <span className="font-mono text-[9px] tracking-wider text-neutral-400 bg-neutral-900/50 border border-neutral-800/40 px-1.5 py-0.5 rounded">
            {date}
          </span>
        </div>
        
        {/* Enlarged Title */}
        <h4 className="font-display text-lg sm:text-xl text-white font-black tracking-wide uppercase mt-1 leading-tight">
          {title}
        </h4>
        <span className="font-mono text-[9px] sm:text-[10px] text-[#753fec] uppercase tracking-wider font-bold">
          {subtitle}
        </span>
      </div>

      {/* Center content: Detailed description */}
      <div className="my-auto pt-3 pb-2 z-10">
        <p className="font-sans text-xs sm:text-[13px] text-neutral-200 leading-relaxed font-light tracking-wide select-text">
          {content}
        </p>
      </div>

    </motion.div>
  );
};

const careerItems = [
  {
    id: "01",
    title: "网易 (NetEase)",
    subtitle: "时尚部门 / 平面设计实习",
    date: "2019",
    content: "主导时尚品牌合作、线上专栏运营、新媒体视觉物料創意设计及社交传播物料产出。"
  },
  {
    id: "02",
    title: "百度 (Baidu)",
    subtitle: "学习部门 / UI设计实习",
    date: "2021",
    content: "辅助推进移动端及PC端交互界面视觉重构，打磨规范化组件与自适应模块。"
  },
  {
    id: "03",
    title: "奥美 (Ogilvy)",
    subtitle: "汽车部门 / 创意视觉设计实习",
    date: "2021",
    content: "为知名车企品牌线上推广战役提供核心视觉创意，设计高响应的多媒体互动原型。"
  },
  {
    id: "04",
    title: "蔚来汽车 (NIO)",
    subtitle: "HMI 体验设计实习",
    date: "2022",
    content: "协助智能座舱团队开展下一代大屏HMI、车载仪表动效原型预研与多模交互测试。"
  },
  {
    id: "05",
    title: "长安全球设计中心 (Changan)",
    subtitle: "HMI 视觉主导 / 5+项目 (3+重点项目)",
    date: "2022 - 2026",
    content: "负责中控屏 HMI UI 视觉风格设计以及整舱氛围亮点卖点设计。"
  },
  {
    id: "06",
    title: "长安全球设计中心 (Changan)",
    subtitle: "亮点功能视觉策划 / 多模态与跨硬件",
    date: "2022 - 2026",
    content: "车载多模态交互设计、内饰氛围灯联动体验设计、跨硬件（屏幕 / 灯光 / 车身）交互视觉设计、感知座舱用户场景分析。"
  },
  {
    id: "07",
    title: "长安全球设计中心 (Changan)",
    subtitle: "长安引力&凯程项目负责人 / 第一年即担任凯程负责人",
    date: "2022 - 2026",
    content: "统筹凯程及引力序列全部项目，搭建 UI DNA，管控各项目进度。"
  },
  {
    id: "08",
    title: "长安全球设计中心 (Changan)",
    subtitle: "搭建平台 AI 能力建设牵头人 / 优化速度效率 50h+/人",
    date: "2022 - 2026",
    content: "搭建 AI 工作流供平台使用，助力团队高效产出高质量创意内容与策略报告。"
  }
];

interface SpecsSectionProps {
  model: any; // Kept to match signature
}

export default function SpecsSection({ model }: SpecsSectionProps) {
  const basicInfo = [
    { label: 'NAME / 姓名', value: '徐佳韵 (XU JIAYUN)' },
    { label: 'AGE / 年龄', value: '28' },
    { label: 'LOCATION / 城市', value: '重庆 (Chongqing)' },
    { label: 'ROLE / 职位', value: 'Senior UX Designer / 用户体验资深设计师' },
    { label: 'UNDERGRADUATE / 本科院校', value: '北京交通大学 - 视觉传达专业 (Beijing Jiaotong University - Visual Communication)' },
    { label: 'POSTGRADUATE / 研究生院校', value: '北京交通大学 - 艺术设计（保研） (Beijing Jiaotong University - Art & Design, Recommended)' },
    { label: 'SOFTWARE / 常用软件', value: 'Figma / Sketch / PS / Blender / Liblib（comfyUI）/ Ranway' },
    { label: 'PHONE / 电话', value: '15910507713' },
    { label: 'EMAIL / 邮箱', value: '958762729@qq.com' }
  ];

  return (
    <section id="specs" className="relative pt-0 pb-28 border-b border-neutral-900/60 bg-[#0a0a0a] overflow-hidden">
      <GridLines />

      {/* ------------------------------------------------------------- */}
      {/* SEAMLESS TRANSITION BRIDGE (3D Hero -> Personal Intro Seam)  */}
      {/* ------------------------------------------------------------- */}
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#070709] via-[#09090c] to-[#0a0a0a] pt-2 pb-6 z-20 border-b border-neutral-900/80">
        
        {/* Cybernetic High-Tech Infinite Marquee Running Ticker */}
        <div className="w-full overflow-hidden py-2.5 bg-neutral-950/80 border-y border-neutral-900/90 backdrop-blur-md my-4 select-none group">
          <div className="flex whitespace-nowrap animate-[marquee_28s_linear_infinite] group-hover:[animation-play-state:paused]">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-8 px-4 font-mono text-xs text-neutral-400 uppercase tracking-widest">
                <span className="text-white font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#753fec] animate-pulse" />
                  XU JIAYUN 徐佳韵
                </span>
                <span className="text-neutral-500">/</span>
                <span className="text-[#753fec] font-semibold">SENIOR HMI & UX DESIGNER</span>
                <span className="text-neutral-500">/</span>
                <span className="text-neutral-300">长安全球设计中心 (CHANGAN GLOBAL DESIGN)</span>
                <span className="text-neutral-500">/</span>
                <span className="text-[#753fec] font-semibold">4年主机厂智能座舱经验</span>
                <span className="text-neutral-500">/</span>
                <span className="text-neutral-400">AI WORKFLOW LEAD</span>
                <span className="text-neutral-500">/</span>
                <span className="text-neutral-300">1920×1080 WIDESCREEN DOSSIER</span>
                <span className="text-neutral-500">/</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Editorial About Me Intro Panel: Full Width to align image to the very left edge of the page */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full border-b border-neutral-900/60 relative z-10 mb-24"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
          
          {/* Column 1: Portrait aligned to the absolute left of the web page and scaled up to look incredibly premium */}
          <div className="lg:col-span-5 relative group overflow-hidden border-r border-neutral-900/60 bg-[#0c0c0c] flex items-stretch">
            <div className="absolute -inset-1 bg-gradient-to-r from-neutral-800 to-neutral-900 blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-full h-full min-h-[480px] lg:min-h-[660px]">
              <img
                src={profileImg}
                alt="Xu Jiayun Profile"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.attempt) {
                    target.dataset.attempt = '1';
                    target.src = profileImg;
                  }
                }}
                className="w-full h-full object-cover grayscale brightness-95 filter contrast-105 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
              />

              {/* Interactive Laser Scan overlay line on image hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#753fec]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="absolute -top-full left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#753fec] to-transparent group-hover:top-full transition-all duration-1000 ease-in-out pointer-events-none" />

              <div className="absolute bottom-5 left-5 font-mono text-[9px] tracking-widest text-white/90 bg-black/80 backdrop-blur-md px-3 py-1 uppercase border border-white/20 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#753fec] animate-ping" />
                REF_ID: XU_9941 / VERIFIED DESIGNER
              </div>
            </div>
          </div>

          {/* Column 2: Typography & Bio (Constrained with right padding and left indent on large screens) */}
          <div className="lg:col-span-7 flex flex-col justify-center px-6 sm:px-12 lg:pl-16 lg:pr-24 xl:pr-32 py-16 lg:py-20 relative">
            
            {/* Giant Overlapping "About me" Text */}
            <div className="absolute -top-6 md:-top-12 lg:-top-16 left-6 lg:left-16 pointer-events-none select-none z-0">
              <span className="font-handwritten text-9xl md:text-[11rem] text-neutral-800/15 leading-none block">
                About me
              </span>
            </div>

            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#753fec] shadow-[0_0_8px_#753fec]" />
                  <span className="font-mono text-xs text-[#753fec] uppercase tracking-[0.3em] font-medium">.profile dossier</span>
                </div>
                <h2 className="font-display text-5xl sm:text-6xl text-white tracking-wider uppercase font-bold leading-none mt-1">
                  个人简介
                </h2>
                <div className="text-lg sm:text-xl font-medium text-[#a78bfa] tracking-wider mt-2">
                  创意策略型UI设计师
                </div>
              </div>

              <p className="font-sans text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl font-light">
                4年主机厂智能座舱 HMI UI 设计经验，研究生毕业后加入长安汽车全球设计中心，长期参与重点品牌及核心车型项目。具备从 UI 视觉策略、主视觉风格定义、核心界面设计、亮点功能创意策划到高质量设计稿快速产出的完整能力。擅长将品牌气质、车型定位、用户场景与科技体验转化为具有记忆点的座舱视觉方案，并持续探索 AI 工作流在设计提效中的应用。
              </p>

              {/* Basic Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-neutral-900/80 pt-8 mt-2">
                {basicInfo.map((info, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    viewport={{ once: true }}
                    className="flex flex-col gap-1 border-b border-neutral-900/40 pb-3 group hover:border-neutral-700 transition-colors"
                  >
                    <span className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase group-hover:text-[#753fec] transition-colors">
                      {info.label}
                    </span>
                    <span className="font-sans text-xs sm:text-sm text-neutral-200 group-hover:text-white transition-colors">
                      {info.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </motion.div>

      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* Timeline Divider Header */}
        <div className="pt-8 pb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-900 mb-12">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#753fec] shadow-[0_0_8px_#753fec] animate-pulse" />
              <span className="font-mono text-xs text-[#753fec] uppercase tracking-[0.25em] font-semibold">.career chronology</span>
            </div>
            <h3 className="font-display text-3xl sm:text-5xl text-white uppercase tracking-wider font-extrabold">
              工作履历 CAREER
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-neutral-400 bg-neutral-900/90 border border-neutral-800 px-3.5 py-1.5 rounded-full">
              4年+ 车企 HMI 经验 / 长安全球设计中心
            </span>
          </div>
        </div>

        {/* Clean & Elegant Career Timeline Container */}
        <div className="space-y-12 mb-16">

          {/* ========================================================= */}
          {/* STAGE 1: FULL-TIME CAREER (毕业就职: 2022 - 至今)          */}
          {/* ========================================================= */}
          <div className="bg-[#09090b] rounded-none p-6 sm:p-10 shadow-2xl relative overflow-hidden group transition-all duration-300">
            {/* Subtle Gradient Glow Accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_right,rgba(52,199,89,0.06),transparent_70%)] pointer-events-none" />

            {/* Stage Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-neutral-800/80 relative z-10">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-black bg-[#753fec] px-3 py-0.5 rounded-none uppercase tracking-wider">
                    2022.07 – 至今 (正式就职)
                  </span>
                  <span className="font-mono text-xs text-neutral-400">
                    全职 / FULL-TIME
                  </span>
                </div>
                <h4 className="font-display text-2xl sm:text-4xl text-white font-extrabold tracking-tight mt-1">
                  长安全球设计中心 <span className="text-neutral-400 font-normal text-xl sm:text-2xl">Changan Global Design Center</span>
                </h4>
                <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-300 mt-1">
                  <span className="bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-none text-neutral-300">前瞻及组合策略所</span>
                  <span className="text-neutral-600">•</span>
                  <span className="bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-none text-neutral-300">UI 设计室</span>
                  <span className="text-neutral-600">•</span>
                  <span className="bg-[#5d5d5d]/10 border border-[#5d5d5d]/30 px-3 py-1 rounded-none text-[#5d5d5d] font-semibold">核心序列 UI 牵头人</span>
                </div>
              </div>

              <div className="flex flex-col lg:items-end bg-neutral-950/80 border border-neutral-800 p-4 rounded-none shrink-0">
                <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">JOB TITLE / 职位</span>
                <span className="font-sans font-bold text-lg sm:text-xl text-white mt-0.5">
                  用户体验资深设计师
                </span>
                <span className="font-mono text-xs text-[#5d5d5d]">
                  Senior UX / UI Designer
                </span>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 py-8 border-b border-neutral-800/80 my-4 relative z-10">
              <div className="bg-neutral-950/80 border-2 border-neutral-800 p-5 sm:p-6 rounded-none shadow-xl hover:border-[#5d5d5d]/40 transition-all">
                <span className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-white block tracking-tight">4<span className="text-[#753fec] text-xl sm:text-2xl lg:text-3xl font-bold ml-1">年+</span></span>
                <span className="font-sans text-sm sm:text-base font-semibold text-neutral-200 mt-2 block leading-snug">主机厂智能座舱经验</span>
              </div>
              <div className="bg-neutral-950/80 border-2 border-neutral-800 p-5 sm:p-6 rounded-none shadow-xl hover:border-[#5d5d5d]/40 transition-all">
                <span className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-white block tracking-tight">10<span className="text-[#753fec] text-xl sm:text-2xl lg:text-3xl font-bold ml-1">+车型</span></span>
                <span className="font-sans text-sm sm:text-base font-semibold text-neutral-200 mt-2 block leading-snug">重点/量产车型 UI 主导</span>
              </div>
              <div className="bg-neutral-950/80 border-2 border-neutral-800 p-5 sm:p-6 rounded-none shadow-xl hover:border-[#5d5d5d]/40 transition-all">
                <span className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-white block tracking-tight">01<span className="text-[#753fec] text-xl sm:text-2xl lg:text-3xl font-bold ml-1">首年</span></span>
                <span className="font-sans text-sm sm:text-base font-semibold text-neutral-200 mt-2 block leading-snug">担任品牌 UI 负责人</span>
              </div>
              <div className="bg-neutral-950/80 border-2 border-neutral-800 p-5 sm:p-6 rounded-none shadow-xl hover:border-[#5d5d5d]/40 transition-all">
                <span className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-white block tracking-tight">50<span className="text-[#753fec] text-xl sm:text-2xl lg:text-3xl font-bold ml-1">h+/月</span></span>
                <span className="font-sans text-sm sm:text-base font-semibold text-neutral-200 mt-2 block leading-snug">AI 工作流团队提效</span>
              </div>
            </div>

            {/* Core Responsibilities Grid */}
            <div className="mt-10 relative z-10">
              <h5 className="font-mono text-xs sm:text-sm text-white font-bold uppercase tracking-[0.2em] mb-6 flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#ffffff] animate-pulse" />
                CORE RESPONSIBILITIES & KEY DELIVERABLES / 核心工作内容与职责成果
              </h5>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 01. HMI 视觉主导 */}
                <div className="bg-neutral-900/90 border-2 border-neutral-800 p-6 sm:p-8 rounded-none relative overflow-hidden group hover:border-[#707070] transition-all duration-300 shadow-xl">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#707070]" />
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <span className="font-display text-lg sm:text-xl font-extrabold text-white tracking-wide">
                      1. HMI 视觉主导与 UI DNA 迭代
                    </span>
                    <span className="font-mono text-xs sm:text-sm text-[#707070] bg-[#707070]/15 border border-[#707070]/40 px-3 py-1 rounded-none font-bold shadow-sm">
                      核心主导
                    </span>
                  </div>
                  <p className="font-sans text-sm sm:text-base text-neutral-200 leading-relaxed font-normal">
                    负责 <strong className="text-white font-bold underline decoration-[#707070] decoration-2 underline-offset-4">10+ 重点及量产车型</strong> 中控屏 HMI UI 视觉风格定义，主导整舱氛围亮点卖点设计，推进品牌 UI DNA 演进与高保真效果交付。
                  </p>
                </div>

                {/* 02. 品牌序列 UI 负责人 */}
                <div className="bg-neutral-900/90 border-2 border-neutral-800 p-6 sm:p-8 rounded-none relative overflow-hidden group hover:border-[#707070] transition-all duration-300 shadow-xl">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#707070]" />
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <span className="font-display text-lg sm:text-xl font-extrabold text-white tracking-wide">
                      2. 品牌序列 UI 负责人
                    </span>
                    <span className="font-mono text-xs sm:text-sm text-[#707070] bg-[#707070]/15 border border-[#707070]/40 px-3 py-1 rounded-none font-bold shadow-sm">
                      首年任命
                    </span>
                  </div>
                  <p className="font-sans text-sm sm:text-base text-neutral-200 leading-relaxed font-normal">
                    入职首年即担任 <strong className="text-white font-bold underline decoration-[#707070] decoration-2 underline-offset-4">引力序列及凯程品牌 UI 负责人</strong>，统筹序列全部项目设计进度，搭建 UI DNA 规范体系并把控全流程落地质量。
                  </p>
                </div>

                {/* 03. 多模态与亮点功能视觉策划 */}
                <div className="bg-neutral-900/90 border-2 border-neutral-800 p-6 sm:p-8 rounded-none relative overflow-hidden group hover:border-[#707070] transition-all duration-300 shadow-xl">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#707070]" />
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <span className="font-display text-lg sm:text-xl font-extrabold text-white tracking-wide">
                      3. 多模态与亮点功能视觉策划
                    </span>
                    <span className="font-mono text-xs sm:text-sm text-[#707070] bg-[#707070]/15 border border-[#707070]/40 px-3 py-1 rounded-none font-bold shadow-sm">
                      跨硬件联动
                    </span>
                  </div>
                  <p className="font-sans text-sm sm:text-base text-neutral-200 leading-relaxed font-normal">
                    负责车载多模态交互设计、内饰氛围灯联动体验设计，以及 <strong className="text-white font-bold underline decoration-[#707070] decoration-2 underline-offset-4">跨硬件（屏幕 / 灯光 / 车身外饰）</strong> 交互视觉设计与感知座舱场景规划。
                  </p>
                </div>

                {/* 04. AI 创新工作流牵头 */}
                <div className="bg-neutral-900/90 border-2 border-neutral-800 p-6 sm:p-8 rounded-none relative overflow-hidden group hover:border-[#707070] transition-all duration-300 shadow-xl">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#707070]" />
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <span className="font-display text-lg sm:text-xl font-extrabold text-white tracking-wide">
                      4. AI 创新工作流牵头
                    </span>
                    <span className="font-mono text-xs sm:text-sm text-[#707070] bg-[#707070]/15 border border-[#707070]/40 px-3 py-1 rounded-none font-bold shadow-sm">
                      提效 50h+/月
                    </span>
                  </div>
                  <p className="font-sans text-sm sm:text-base text-neutral-200 leading-relaxed font-normal">
                    搭建团队级 AI 工作流平台供全组使用，赋能座舱视觉探索与汇报宣讲，助力团队 <strong className="text-white font-bold underline decoration-[#707070] decoration-2 underline-offset-4">月均节省 50h+</strong> 高效产出高质量设计成果。
                  </p>
                </div>
              </div>
            </div>
          </div>


          {/* ========================================================= */}
          {/* STAGE 2: INTERNSHIPS (实习经历: 2018 - 2022)              */}
          {/* ========================================================= */}
          <div className="bg-[#09090b] rounded-none p-6 sm:p-10 shadow-2xl relative overflow-hidden group transition-all duration-300">
            {/* Stage Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800/80 mb-6">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-black bg-[#9e80ed] px-3 py-0.5 rounded-none uppercase tracking-wider">
                  2018.09 – 2022.06 (实习阶段)
                </span>
                <h4 className="font-display text-xl sm:text-2xl text-white font-extrabold tracking-tight">
                  知名科技与车企实习履历 <span className="text-neutral-500 font-normal text-sm sm:text-base">Academics & Internships</span>
                </h4>
              </div>
              <span className="font-mono text-xs text-neutral-400">
                4 大知名企业实习经验
              </span>
            </div>

            {/* Clean 4-Column Card Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  company: "蔚来汽车 (NIO)",
                  role: "工程设计部门 / 视觉设计实习生",
                  date: "2022",
                  highlight: "智能座舱",
                  desc: "完成工厂导向标识设计以及海报视觉设计。"
                },
                {
                  company: "奥美 (Ogilvy)",
                  role: "汽车部门 / 视觉设计实习生",
                  date: "2021",
                  highlight: "品牌营销",
                  desc: "为知名车企品牌线上推广战役提供核心视觉创意，设计高响应的多媒体互动原型。"
                },
                {
                  company: "百度 (Baidu)",
                  role: "移动与学习部门 / UI实习生",
                  date: "2021",
                  highlight: "用户界面",
                  desc: "辅助推进移动端及 PC 端交互界面视觉重构，打磨规范化组件与自适应响应模块。"
                },
                {
                  company: "网易 (NetEase)",
                  role: "时尚部门 / 平面设计实习生",
                  date: "2019",
                  highlight: "视觉传播",
                  desc: "主导时尚品牌合作、线上专栏运营、新媒体视觉物料创意设计及社交传播物料产出。"
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-neutral-950/80 border border-neutral-800/80 p-5 rounded-none flex flex-col justify-between group/card hover:border-[#753fec]/50 transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-mono text-xs font-bold text-[#753fec] bg-[#753fec]/10 border border-[#753fec]/30 px-2 py-0.5 rounded-none">
                        {item.date}
                      </span>
                      <span className="font-mono text-[10px] text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded-none">
                        {item.highlight}
                      </span>
                    </div>

                    <h5 className="font-display text-lg sm:text-xl text-white font-bold group-hover/card:text-[#753fec] transition-colors">
                      {item.company}
                    </h5>

                    <span className="font-mono text-xs text-[#753fec] font-medium block mt-1 mb-3">
                      {item.role}
                    </span>

                    <p className="font-sans text-xs text-neutral-300 leading-relaxed font-light">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
