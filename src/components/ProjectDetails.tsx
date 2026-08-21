import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ChevronLeft, ChevronRight, X, Sparkles, Cpu, Compass, Layers, ShieldCheck, Upload, RefreshCw, Image as ImageIcon, ChevronDown, Plus, Trash2, Video, Film, Link as LinkIcon } from 'lucide-react';
import PickupDetailView from './PickupDetailView';
import SuvDetailView from './SuvDetailView';
import { ProjectExtendedDetails } from '../types';
const yuyinjinglImg = '/yuyinjingl.jpg';
const E01Img = '/E01.jpg';
const E02Img = '/E02.jpg';
const PHUD1Img = '/PHUD1.jpg';
const deepalOSImg = '/DEEPALOS.jpg';
const title02Img = '/02-title.jpg';
const PICKUP0Img = '/PICKUP0.jpg';
const wireframeImg = '/pickup_wireframe_1784513853585.jpg';
const brandGridImg = '/brand_ui_grid_1784513868767.jpg';
const deepalMapImg = '/deepal_map_3d_1784513881612.jpg';
const voiceStatesImg = '/voice_states_grid_1784513895504.jpg';
const sprite1Img = '/e07_sprite_img1_1784727955607.jpg';
const sprite2Img = '/e07_sprite_img2_1784727969523.jpg';
const sprite3Img = '/e07_sprite_img3_1784727983608.jpg';
const sprite4Img = '/e07_sprite_img4_1784727997638.jpg';
const sprite5Img = '/e07_sprite_img5_1784728011029.jpg';
const phudOverlayImg = '/phud_hud_overlay_1784513910409.jpg';

interface DetailPageItem {
  id: string;
  title: string;
  type?: 'image' | 'video';
  image?: string;
  videoUrl?: string;
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
  if (url.toLowerCase().includes('video4.mp4')) {
    return '/video/video4.mp4';
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

const INITIAL_PICKUP_DETAIL_PAGES: DetailPageItem[] = [
  { id: '01', title: '详情页 01 - 全球 D 级皮卡智能座舱 HMI 体验与视觉策略', type: 'image', image: 'https://f75d3d355ae042e5960a8262010ed6b2.app.workbuddy.link/images/2.jpg' },
  { id: '02', title: '详情页 02 - HMI 三维车控与底盘动态联动 (视频展面 01)', type: 'video', videoUrl: 'https://fe24cc531e24492595e3a36c2bf35416.bj8.agentos-app.net/video1.mp4', image: wireframeImg || '/pickup_wireframe_1784513853585.jpg' },
  { id: '03', title: '详情页 03 - 越野多模态栅格与风格定义', type: 'image', image: 'https://f75d3d355ae042e5960a8262010ed6b2.app.workbuddy.link/images/1.jpg' },
  { id: '04', title: '详情页 04 - 3D 全地形导航与环境渲染 (视频展面 02)', type: 'video', videoUrl: 'https://fe24cc531e24492595e3a36c2bf35416.bj8.agentos-app.net/video3.mp4', image: deepalMapImg || '/deepal_map_3d_1784513881612.jpg' },
  { id: '05', title: '详情页 05 - 亮点功能创意与交互状态', type: 'image', image: voiceStatesImg || '/voice_states_grid_1784513895504.jpg' },
];

const INITIAL_E07_DETAIL_PAGES: DetailPageItem[] = [
  { id: '01', title: '01 - E07 语音精灵 3D 拟态粒子生命体', type: 'image', image: sprite1Img || '/e07_sprite_img1_1784727955607.jpg' },
  { id: '02', title: '02 - E07 语音精灵 12 种情绪矩阵展面', type: 'image', image: sprite2Img || '/e07_sprite_img2_1784727969523.jpg' },
  { id: '03', title: '03 - E07 语音精灵 音波振荡与粒子随动', type: 'image', image: sprite3Img || '/e07_sprite_img3_1784727983608.jpg' },
  { id: '04', title: '04 - E07 语音精灵 驾驶模式自适应主题', type: 'image', image: sprite4Img || '/e07_sprite_img4_1784727997638.jpg' },
  { id: '05', title: '05 - E07 语音精灵 多模态 AI 语音交互卡片', type: 'image', image: sprite5Img || '/e07_sprite_img5_1784728011029.jpg' },
];

const EXTENDED_DETAILS_MAP: Record<string, ProjectExtendedDetails> = {
  "01": {
    id: "01",
    title: "全球 D 级皮卡智能座舱 HMI 体验与视觉策略",
    subtitle: "面向越野、装载、露营与全球化复杂环境的座舱信息架构、交互策略与视觉系统定义",
    titleEn: "GLOBAL D-CLASS PICKUP HMI UI VISUAL DESIGN STRATEGY",
    category: "GLOBAL PICKUP TRUCK / HMI UI STRATEGY",
    year: "2023–2025",
    role: "主设 / UI设计总师",
    imageSrc: PICKUP0Img || "/PICKUP0.jpg",
    subImageSrc: wireframeImg || "/pickup_wireframe_1784513853585.jpg",
    techs: ["HMI UI STRATEGY", "INTELLIGENT COCKPIT", "D-CLASS PICKUP", "VISUAL SYSTEM"],
    backgroundIntro: "项目因企业战略及业务节奏调整暂停，但本人完整参与并独立承担了 UI 视觉策略、核心界面设计及多轮方案推进工作。",
    dimensions: [
      { title: "三维车控实时底盘扫描", desc: "采用实时渲染算法，支持在网页端无缝进行车箱重载与高度随动计算，渲染多达50万个三角面。" },
      { title: "模块化野外露营拓展配置", desc: "拖拽式车尾货柜套件，支持在Web 3D视图中即时插拔发电机、探照灯与帐篷，生成高精度配置单。" },
      { title: "多语种极限环境UI自适应", desc: "针对中东沙尘、极地冰雪等多重复杂气候设计的极高明度UI配色规范，视认性提升35%。" }
    ],
    breakthroughs: [
      "极限悬架高度5档阻尼滑动交互组件设计",
      "三模分体式探野照地大灯触觉微振反馈系统",
      "全地形自适应动态反馈控制台设计"
    ],
    designSystem: {
      title: "硬派栅格体系 (Solid Grit System)",
      detail: "采用冷峻的机械切角底框，辅以超高饱和度的警示橙（#FF6B00）作为核心交互信号色。字体选用硬朗大气的粗黑无衬线体，契合硬派探索者气质。",
      accent: "#FF6B00"
    }
  },
  "02": {
    id: "02",
    title: "重点项目-SUV旗舰车型UI设计视觉迭代策略（2024-）",
    titleEn: "FLAGSHIP SUV UI DESIGN VISUAL ITERATION STRATEGY",
    category: "FLAGSHIP SUV / UI ITERATION STRATEGY",
    year: "2024-",
    role: "主设 / 视觉设计专家",
    imageSrc: title02Img || "/02-title.jpg",
    subImageSrc: brandGridImg || "/brand_ui_grid_1784513868767.jpg",
    techs: ["FLAGSHIP SUV", "UI ITERATION", "DIGITAL COCKPIT", "DESIGN SYSTEM"],
    backgroundIntro: "传统燃油车屏幕大换代，打通前瞻科技和传统美学的界限，定义新一代SUV智驾交互新美学",
    dimensions: [],
    breakthroughs: [
      "精细拟物旋钮动态光影在液晶屏幕中的全像素还原",
      "高敏捷自适应音响卡片物理弹簧反馈过渡算法",
      "一键暗黑模式与白天眩光环境下的色阶智能平移"
    ],
    designSystem: {
      title: "数字精密极简 (Neo-Precision Digital)",
      detail: "基于超细纤柔的黑白灰三色流，借助微妙的渐变营造极佳的数字空气感与空间纵深。摒弃繁琐的边框，以超现实的极简主义定义高品质出行态度。",
      accent: "#753FEC"
    }
  },
  "03": {
    id: "03",
    title: "落地项目-启源E07语音精灵设计（2022-2023）",
    titleEn: "QIYUAN E07 INTELLIGENT VOICE SPRITE DESIGN",
    category: "QIYUAN E07 / INTELLIGENT VOICE SPRITE",
    year: "2022-2023",
    role: "主设 / 3D与动效设计师",
    imageSrc: yuyinjinglImg || "/yuyinjingl.jpg",
    subImageSrc: yuyinjinglImg || "/yuyinjingl.jpg",
    techs: ["INTERACTIVE ORB", "3D PARTICLE", "AUDIO SYNC", "VOICE SPRITE"],
    backgroundIntro: "赋予 启源E07 智慧生命力与情感温度的标志性特征——车载语音精灵。打破以往呆板静态图像，创造了一个充满灵性的 3D 拟态粒子生命体。",
    dimensions: [
      { title: "情感化自适应流动形态", desc: "预置了12种核心情感状态（平静、欢快、害羞、专注、预备、倾听等），平滑重塑。" },
      { title: "高灵敏度音频随动震荡", desc: "实时捕获音频分频数据，根据低音及高音强度生成不同大小及频率的电磁波浪形态。" },
      { title: "超轻量动画实时回响", desc: "通过深度优化 Lottie 矢量路径与 Canvas 渲染管道，整体运行时CPU开销仅为2.5%。" }
    ],
    breakthroughs: [
      "十二种人工智能多维度交互情绪平滑渲染过渡",
      "融合语音拾音动态粒子呼吸波动特效",
      "自适应驾驶模式的拟态色彩智能渲染"
    ],
    designSystem: {
      title: "极光数字粒子 (Auroral Particle System)",
      detail: "采用具备通透柔光玻璃质感的有机流体形态，色彩源于北极荧光与温润粉金，赋予界面如深海生命的迷人触感。",
      accent: "#00E5FF"
    }
  },
  "04": {
    id: "04",
    title: "落地项目-深蓝DEEPAL OS 3.0UI设计（2023）",
    titleEn: "DEEPAL OS 3.0 HMI UI DESIGN",
    category: "DEEPAL OS 3.0 / MASS PRODUCTION",
    year: "2023",
    role: "资深UI设计师",
    imageSrc: deepalOSImg || "/DEEPALOS.jpg",
    subImageSrc: deepalOSImg || "/DEEPALOS.jpg",
    techs: ["INFOTAINMENT", "CANVAS ENGINE", "MICRO-INTERACTION", "HMI"],
    backgroundIntro: "深蓝汽车（Deepal）3.0 智能车载中控人机交互系统（HMI）的全面体验进化。负责3D卡片原子化车控机制优化及智能大地图与导航流界面的深度融合。",
    dimensions: [
      { title: "一体化3D车控极速控制", desc: "双指或单指触控车模任意区域（如车窗、尾翼、天窗），系统可在0.1秒内完成动作。" },
      { title: "「轻重态」地图导航降噪", desc: "剔除车载大屏中冗余的写实建筑与植被，仅渲染极简荧光路网线，自动调节明暗。" },
      { title: "量产机型超低能耗控制", desc: "将WebGL车模显存开销降低40%，在低配车机芯片上同样实现柔顺体验。" }
    ],
    breakthroughs: [
      "量产首创多层深度视差3D主卡片车机桌面",
      "全景动态遮阳帘阻尼随滑开合三维动效交互",
      "高保真3D路口辅助变道光纤流导向视效"
    ],
    designSystem: {
      title: "深蓝引力流 (Deepal Gravity Flow)",
      detail: "标志性的深蓝科技荧光绿（#00FF88）点缀在深沉幽黑背景上，所有交互遵循重力自适应运动法则。",
      accent: "#00FF88"
    }
  },
  "05": {
    id: "05",
    title: "AI概念产品- HMI UI设计师提效工具思考",
    subtitle: "探索生成式AI与Agent工作流在智能座舱HMI体验设计、资产生成与工程协同中的提效体系",
    titleEn: "AI CONCEPT - HMI UI DESIGNER EFFICIENCY TOOL THINKING",
    category: "AI CONCEPT / DESIGN EFFICIENCY TOOL",
    year: "2024-",
    role: "AI 提效工具主导 / 前瞻设计与产品定义",
    imageSrc: "https://f75d3d355ae042e5960a8262010ed6b2.app.workbuddy.link/images/3.jpg",
    subImageSrc: "https://f75d3d355ae042e5960a8262010ed6b2.app.workbuddy.link/images/4.jpg",
    techs: ["AI DESIGN COPILOT", "HMI WORKFLOW", "AGENTIC AI", "DESIGN SYSTEM AGENTS", "EFFICIENCY THINKING"],
    backgroundIntro: "针对智能座舱 HMI UI 设计链路中长周期的资产产出、多规格适配及跨团队沟通瓶颈，主导探索 AI 赋能的座舱设计工作流工具体系，打通从创意脑暴、设计规范智能校验到 3D/2D 资产批量生成的提效闭环。",
    dimensions: [
      { title: "全流程座舱设计 Copilot", desc: "基于设计规范与车机尺寸标准，AI 智能推荐界面布局与层级架构，秒级生成多套风格探索方案。" },
      { title: "3D/2D 资产与质感批量蒸馏", desc: "构建汽车专属 LoRA 与提示词知识库，实现仪表微动效、旋钮拟物光影与氛围灯材质的极速输出。" },
      { title: "跨职能协同与规范智能走查", desc: "自动识别图层命名与设计走查规范，输出开发适配标注，人均月度节约工时超 50 小时。" }
    ],
    breakthroughs: [
      "团队级座舱 AI 工作流平台搭建与实践落地，人均月均节省 50h+",
      "基于车规级 UI DNA 的专属多模态生成式设计模型与提示词库",
      "设计-开发全链路资产智能化切图与规范走查机制"
    ],
    designSystem: {
      title: "未来智能体工场 (AI Agent Design System)",
      detail: "融合电光紫与矩阵青的极客智感色彩体系，构建以人机共创为核心的高效生产力界面与数据流可视化架构。",
      accent: "#8B5CF6"
    }
  },
  "06": {
    id: "06",
    title: "概念项目-PHUD整舱视觉概念设计（2025-）",
    titleEn: "PANORAMIC HUD COCKPIT VISUAL CONCEPT DESIGN",
    category: "PANORAMIC HUD / CONCEPT DESIGN",
    year: "2025-",
    role: "前瞻UI概念设计专家",
    imageSrc: PHUD1Img || "/PHUD1.jpg",
    subImageSrc: phudOverlayImg || "/phud_hud_overlay_1784513910409.jpg",
    techs: ["PANORAMIC HUD", "AMBIENT SYNC", "AR PROJECTION", "CONCEPT"],
    backgroundIntro: "前瞻性五感交互先锋概念研究。打破传统仅显示时速的HUD天花板，在全挡风玻璃上投影自适应AR驾驶轨迹，联动全车32路全光谱氛围灯与座椅振动。",
    dimensions: [
      { title: "全挡风玻璃自适应AR投影", desc: "利用多焦点空间干涉算法，使车速、前车距离、盲区警告完美漂浮贴合于道路表面。" },
      { title: "32路智能氛围灯光脉冲", desc: "全车交互光纤随动，可在0.02秒内将预警色光波精准传递至车门内侧。" },
      { title: "五感协同防疲劳机制", desc: "智能香氛精油在驾驶员眨眼频率过低时微量散发，并伴有椅背仿生敲击。" }
    ],
    breakthroughs: [
      "全景多维深度AR光轨与实景精准拟合技术",
      "全车交互氛围灯、座椅和声场的零时差硬件级联控",
      "高能见度、抗眩光的自适应琥珀金AR视觉系统"
    ],
    designSystem: {
      title: "璀璨金AR光轨 (Liquid Amber AR)",
      detail: "选用极其高贵的液态琥珀金（#FFB300）作为AR主色，具备极高的多天气穿透力与防眩光特性。",
      accent: "#FFB300"
    }
  },
  "07": {
    id: "07",
    title: "概念项目-启源E0HMI UI视觉概念设计（2022-2025）",
    titleEn: "QIYUAN E0 HMI UI VISUAL CONCEPT DESIGN",
    category: "QIYUAN E0 / HMI UI CONCEPT",
    year: "2022-2025",
    role: "HMI 概念设计负责人",
    imageSrc: E01Img || "/E01.jpg",
    subImageSrc: E02Img || "/E02.jpg",
    techs: ["CONCEPT DESIGN", "HMI UI", "NEXT-GEN COCKPIT", "UI SYSTEM"],
    backgroundIntro: "探索下一代座舱HMI视觉范型。针对启源E0平台的未来智驾场景，构建模块化、高弹性、具未来主义科幻感的数字化界面美学。",
    dimensions: [
      { title: "多模态三维场景融合", desc: "将驾驶环境、行车参数与智慧感知能力融于一体，界面布局视流自然无缝。" },
      { title: "动态流体卡片架构", desc: "组件随驾乘模式自适应调整权重，高频功能触手可及。" },
      { title: "沉浸式夜光极域美学", desc: "暗夜环境下采用低刺激极光色彩搭配，大幅降低驾驶视觉疲劳。" }
    ],
    breakthroughs: [
      "高弹性三维座舱卡片流架构设计",
      "多场景自适应智能微动效交互规程",
      "高辨识度科幻拟态极域色彩系统"
    ],
    designSystem: {
      title: "未来智域 (Future Neo-Horizon)",
      detail: "以深邃极夜黑为基底，穿插电光紫与荧光青，表达前沿智驾科技与纯粹设计美学的共鸣。",
      accent: "#9E80ED"
    }
  },
  "08": {
    id: "08",
    title: "实习项目-小鹏公众号广宣视频（2021）",
    titleEn: "XPENG MOTORS OFFICIAL ACCOUNT PROMOTIONAL VIDEO",
    category: "XPENG / PROMOTIONAL VIDEO",
    year: "2021",
    role: "广宣视频设计 / 创意动效实习",
    imageSrc: "/assets/images/ui_iteration_project_1784513270370.jpg",
    subImageSrc: "/assets/images/designer_portrait_new_1784552525277.jpg",
    techs: ["XPENG MOTORS", "PROMOTIONAL VIDEO", "MOTION GRAPHICS", "OFFICIAL ACCOUNT"],
    backgroundIntro: "为小鹏汽车官方微信公众号策划与制作高品质品牌推广宣发视频。配合新车发布与线上传播营销动能，打造兼具科技美感与高互动性的动态视觉体验。",
    dimensions: [
      { title: "品牌视觉与动效融合", desc: "结合小鹏汽车年轻化科技品牌基因，运用高频次光影与空间转场提升画面冲击力。" },
      { title: "公众号多端屏适与节奏把控", desc: "针对移动端纵向与横向阅读习惯优化视频剪辑节奏与关键帧动效。" },
      { title: "高渲染品质与极速传播", desc: "精细化把控帧率与压缩算法，确保在社交媒体平台的高保真与秒开体验。" }
    ],
    breakthroughs: [
      "小鹏汽车品牌新车线上广宣视觉动效标准化制作",
      "微信公众号高转化率动态视频创意范型",
      "移动端多尺寸自适应动态视觉呈现策略"
    ],
    designSystem: {
      title: "小鹏极速荧光 (Xpeng Electric Green)",
      detail: "采用小鹏品牌标志性的高能极光绿与深空黑组合，彰显新能源智能汽车的极致速度感与未来感。",
      accent: "#00E5A3"
    }
  }
};

interface ProjectDetailsProps {
  projectId: string;
  onClose: () => void;
  onNavigate: (nextId: string) => void;
}

export default function ProjectDetails({ projectId, onClose, onNavigate }: ProjectDetailsProps) {
  const detail = EXTENDED_DETAILS_MAP[projectId] || EXTENDED_DETAILS_MAP["01"];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeReplaceIndex, setActiveReplaceIndex] = useState<number | null>(null);

  const getInitialPagesForProject = (id: string) => {
    if (id === '04') return INITIAL_E07_DETAIL_PAGES;
    return INITIAL_PICKUP_DETAIL_PAGES;
  };

  const sanitizePages = (pages: DetailPageItem[]) => {
    if (!Array.isArray(pages)) return [];
    return pages.map(p => ({
      ...p,
      image: p.image ? formatMediaUrl(p.image) : p.image
    }));
  };

  // Custom Detail Pages State (saved to localStorage for persistence)
  const [detailPages, setDetailPages] = useState<DetailPageItem[]>(() => {
    try {
      const saved = localStorage.getItem(`detail_pages_${projectId}`);
      if (saved) {
        return sanitizePages(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
    return getInitialPagesForProject(projectId);
  });

  // Re-sync pages when projectId changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`detail_pages_${projectId}`);
      if (saved) {
        setDetailPages(sanitizePages(JSON.parse(saved)));
        return;
      }
    } catch {
      // ignore
    }
    setDetailPages(getInitialPagesForProject(projectId));
  }, [projectId]);

  // Hero Background Video URL state
  const [heroVideoUrl, setHeroVideoUrl] = useState<string>(() => {
    const saved = localStorage.getItem(`hero_video_${projectId}`);
    if (saved && !saved.includes('/video2/')) return saved;
    return "/video/pickup_hero_dune.mp4";
  });

  // Lock scroll when open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`detail_pages_${projectId}`, JSON.stringify(detailPages));
    } catch {
      // ignore
    }
  }, [detailPages, projectId]);

  const handlePrev = () => {
    const currentNum = parseInt(projectId, 10);
    const prevNum = currentNum === 1 ? 8 : currentNum - 1;
    const prevId = prevNum.toString().padStart(2, '0');
    onNavigate(prevId);
  };

  const handleNext = () => {
    const currentNum = parseInt(projectId, 10);
    const nextNum = currentNum === 8 ? 1 : currentNum + 1;
    const nextId = nextNum.toString().padStart(2, '0');
    onNavigate(nextId);
  };

  // Replace single detail page media (image or video)
  const triggerMediaUpload = (index: number) => {
    setActiveReplaceIndex(index);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Prompt user for custom video URL
  const promptVideoUrl = (index: number) => {
    const current = detailPages[index]?.videoUrl || '';
    const input = window.prompt('请输入/粘贴 MP4 视频链接 (Enter MP4 Video URL):', current);
    if (input !== null && input.trim() !== '') {
      setDetailPages((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], type: 'video', videoUrl: input.trim() };
        return next;
      });
    }
  };

  // Toggle between image and video page modes
  const togglePageType = (index: number) => {
    setDetailPages((prev) => {
      const next = [...prev];
      const currentType = next[index].type || 'image';
      next[index] = {
        ...next[index],
        type: currentType === 'image' ? 'video' : 'image',
      };
      return next;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeReplaceIndex !== null) {
      if (file.type.startsWith('video/')) {
        const videoObjectUrl = URL.createObjectURL(file);
        setDetailPages((prev) => {
          const next = [...prev];
          next[activeReplaceIndex] = {
            ...next[activeReplaceIndex],
            type: 'video',
            videoUrl: videoObjectUrl,
          };
          return next;
        });
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (result) {
            setDetailPages((prev) => {
              const next = [...prev];
              next[activeReplaceIndex] = {
                ...next[activeReplaceIndex],
                type: 'image',
                image: result,
              };
              return next;
            });
          }
        };
        reader.readAsDataURL(file);
      }
    }
    // reset input
    e.target.value = '';
  };

  // Reset all images to initial template
  const handleResetDetailPages = () => {
    if (window.confirm('确定恢复默认详情页图板吗？')) {
      setDetailPages(getInitialPagesForProject(projectId));
      localStorage.removeItem(`detail_pages_${projectId}`);
    }
  };

  // Add new detail page slot
  const handleAddPage = () => {
    const newNum = (detailPages.length + 1).toString().padStart(2, '0');
    const newPage: DetailPageItem = {
      id: newNum,
      title: `详情页 ${newNum} - 自定义展面`,
      image: PICKUP0Img || '/PICKUP0.jpg',
    };
    setDetailPages([...detailPages, newPage]);
  };

  // Remove detail page slot
  const handleRemovePage = (index: number) => {
    if (detailPages.length <= 1) return;
    setDetailPages(detailPages.filter((_, i) => i !== index));
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] overflow-y-auto bg-black scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-black">
      
      {/* Watermark Overlay */}
      <div 
        className="fixed inset-0 z-[100] pointer-events-none select-none" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='340' height='340' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' font-size='28' font-weight='bold' fill='white' fill-opacity='0.08' font-family='sans-serif' text-anchor='middle' transform='rotate(-30 170 170)'%3EXU JIAYUN%3C/text%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }} 
      />

      {/* Hidden File Input for Image & Video Upload */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*,video/*" 
        className="hidden" 
      />

      {/* Sticky top control bar */}
      <div className="sticky top-0 z-[1000] w-full bg-black/95 backdrop-blur-xl border-b border-neutral-800 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xl">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-3 py-1.5 bg-transparent hover:bg-neutral-900 text-neutral-300 hover:text-white rounded-full border border-neutral-800 hover:border-neutral-700 text-xs transition-all duration-300 cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>返回列表</span>
        </button>

        <div className="flex items-center gap-3 sm:gap-6">
          <span className="font-mono text-xs text-neutral-400 font-medium hidden sm:inline">
            PROJECT {detail.id} / 08
          </span>
          <div className="flex bg-neutral-900 border border-neutral-800 rounded-lg p-1">
            <button
              onClick={handlePrev}
              className="px-2.5 py-1 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all rounded cursor-pointer flex items-center gap-1 font-mono text-xs"
              title="Previous Project"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden md:inline">上一项目</span>
            </button>
            <div className="w-[1px] bg-neutral-800 my-1" />
            <button
              onClick={handleNext}
              className="px-2.5 py-1 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all rounded cursor-pointer flex items-center gap-1 font-mono text-xs"
              title="Next Project"
            >
              <span className="hidden md:inline">下一项目</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 text-neutral-300 hover:text-white transition-all rounded-full cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      {detail.id === "01" ? (
        <PickupDetailView 
          detail={detail} 
          heroVideoUrl={heroVideoUrl} 
          onResetAll={handleResetDetailPages} 
        />
      ) : detail.id === "02" ? (
        <SuvDetailView 
          detail={detail} 
          heroVideoUrl={heroVideoUrl} 
        />
      ) : (detail.id === "03" || detail.title?.includes("语音精灵")) ? (
        /* CLEAN 1920 IMAGE SHOWCASE FOR VOICE SPRITE DESIGN (落地项目 - 语音精灵设计) */
        <div className="w-full relative pb-16 bg-black min-h-screen flex flex-col items-center justify-start">
          <div className="w-full max-w-[1920px] mx-auto bg-black flex justify-center overflow-hidden">
            <img
              src="https://b4ca62ea3b5c48218ab14dbc609f2c16.gz5.agentos-app.net/photo12.jpg"
              alt="落地项目-语音精灵设计"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-contain max-w-[1920px] mx-auto block shadow-2xl"
            />
          </div>
        </div>
      ) : (detail.id === "04" || detail.title?.includes("DEEPAL") || detail.title?.includes("深蓝")) ? (
        /* CLEAN 1920 IMAGE SHOWCASE FOR DEEPAL OS DESIGN (落地项目 - 深蓝Deepal OS) */
        <div className="w-full relative pb-16 bg-black min-h-screen flex flex-col items-center justify-start">
          <div className="w-full max-w-[1920px] mx-auto bg-black flex justify-center overflow-hidden">
            <img
              src="https://b4ca62ea3b5c48218ab14dbc609f2c16.gz5.agentos-app.net/photo11.jpg"
              alt="落地项目-深蓝DEEPAL OS"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-contain max-w-[1920px] mx-auto block shadow-2xl"
            />
          </div>
        </div>
      ) : (detail.id === "05" || detail.title?.includes("AI概念产品") || detail.title?.includes("提效工具")) ? (
        /* CLEAN FULL-SCREEN 2-IMAGE SHOWCASE FOR AI CONCEPT PRODUCT (05 AI概念产品 - HMI UI设计师提效工具思考) */
        <div className="w-full relative pb-16 bg-black min-h-screen flex flex-col items-center justify-start gap-0">
          <div className="w-full max-w-[1920px] mx-auto bg-black flex justify-center overflow-hidden">
            <img
              src="https://f75d3d355ae042e5960a8262010ed6b2.app.workbuddy.link/images/3.jpg"
              alt="AI概念产品-HMI UI设计师提效工具思考-01"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-contain max-w-[1920px] mx-auto block shadow-2xl"
            />
          </div>
          <div className="w-full max-w-[1920px] mx-auto bg-black flex justify-center overflow-hidden">
            <img
              src="https://f75d3d355ae042e5960a8262010ed6b2.app.workbuddy.link/images/4.jpg"
              alt="AI概念产品-HMI UI设计师提效工具思考-02"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-contain max-w-[1920px] mx-auto block shadow-2xl"
            />
          </div>
        </div>
      ) : (detail.id === "06" || detail.title?.includes("PHUD")) ? (
        /* CLEAN 1920 IMAGE & VIDEO SHOWCASE FOR CONCEPT PROJECT - PHUD COCKPIT VISUAL CONCEPT DESIGN (概念项目-PHUD整舱视觉概念设计) */
        <div className="w-full relative pb-16 bg-black min-h-screen flex flex-col items-center justify-start gap-4">
          <div className="w-full max-w-[1920px] mx-auto bg-black flex justify-center overflow-hidden">
            <img
              src="https://b4ca62ea3b5c48218ab14dbc609f2c16.gz5.agentos-app.net/photo10.jpg"
              alt="概念项目-PHUD整舱视觉概念设计"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-contain max-w-[1920px] mx-auto block shadow-2xl"
            />
          </div>

          {/* PHUD CONCEPT VIDEO SHOWCASE 01 */}
          <div className="w-full max-w-[1920px] mx-auto bg-black flex flex-col justify-center overflow-hidden relative my-4 rounded-xl border border-neutral-900 shadow-2xl">
            <div className="w-full aspect-video max-h-[85vh] bg-black">
              <iframe
                src="https://e41e5de1dfec4f20b8f5f9df2754e51a.bj6.agentos-app.net/"
                title="PHUD 概念动态视效 01"
                className="w-full h-full border-0 block"
                allow="autoplay; fullscreen"
              />
            </div>
          </div>

          {/* PHUD CONCEPT VIDEO SHOWCASE 02 */}
          <div className="w-full max-w-[1920px] mx-auto bg-black flex flex-col justify-center overflow-hidden relative my-4 rounded-xl border border-neutral-900 shadow-2xl">
            <div className="w-full aspect-video max-h-[85vh] bg-black">
              <iframe
                src="https://9b8493bfcd2a413286904ffb25b283c0.bj3.agentos-app.net/"
                title="PHUD 概念动态视效 02"
                className="w-full h-full border-0 block"
                allow="autoplay; fullscreen"
              />
            </div>
          </div>
        </div>
      ) : (detail.id === "07" || detail.title?.includes("E0HMI") || detail.title?.includes("E0") || detail.title?.includes("启源") || detail.title?.includes("起源")) ? (
        /* CLEAN 2-PHOTO + VIDEO SHOWCASE FOR CONCEPT PROJECT - E0 HMI UI CONCEPT DESIGN (概念项目-E0HMI UI概念设计) */
        <div className="w-full relative pb-16 bg-black min-h-screen flex flex-col items-center justify-start gap-0">
          <div className="w-full max-w-[1920px] mx-auto bg-black flex justify-center overflow-hidden">
            <img
              src="https://b4ca62ea3b5c48218ab14dbc609f2c16.gz5.agentos-app.net/photo13.jpg"
              alt="概念项目-E0HMI UI概念设计 - 01"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-contain max-w-[1920px] mx-auto block shadow-2xl"
            />
          </div>
          
          {/* E0 CONCEPT VIDEO SHOWCASE */}
          <div className="w-full max-w-[1920px] mx-auto bg-black flex justify-center overflow-hidden relative my-2">
            <video
              src="https://a566e28db74b41bebfdfab6ad1c9bbff.gz2.agentos-app.net/video9.mp4"
              autoPlay
              loop
              muted
              playsInline
              controls
              className="w-full h-auto object-contain max-w-[1920px] mx-auto block shadow-2xl border border-neutral-900"
            >
              <source src="https://a566e28db74b41bebfdfab6ad1c9bbff.gz2.agentos-app.net/video9.mp4" type="video/mp4" />
              <source src="/video/E0_VIDEO.mp4" type="video/mp4" />
            </video>
          </div>

          <div className="w-full max-w-[1920px] mx-auto bg-black flex justify-center overflow-hidden">
            <img
              src="https://b4ca62ea3b5c48218ab14dbc609f2c16.gz5.agentos-app.net/photo14.jpg"
              alt="概念项目-E0HMI UI概念设计 - 02"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-contain max-w-[1920px] mx-auto block shadow-2xl"
            />
          </div>
        </div>
      ) : (detail.id === "08" || detail.title?.includes("小鹏") || detail.title?.includes("XPENG")) ? (
        /* CLEAN VIDEO SHOWCASE FOR XPENG PROMOTIONAL VIDEO (实习项目 - 小鹏公众号广宣视频) */
        <div className="w-full relative pb-16 bg-black min-h-screen flex flex-col items-center justify-start gap-4 px-4 sm:px-8">
          <div className="w-full max-w-[1920px] mx-auto pt-6 pb-2">
            <div className="p-6 md:p-8 bg-neutral-900/60 border border-neutral-800 rounded-xl backdrop-blur-md max-w-4xl mx-auto shadow-2xl">
              <div className="inline-block px-3 py-1 bg-[#753fec]/20 border border-[#753fec]/40 rounded-full text-[#a78bfa] text-xs font-mono tracking-widest uppercase mb-3">
                OGILVY INTERNSHIP / 奥美实习经历
              </div>
              <p className="text-base sm:text-lg md:text-xl text-neutral-100 leading-relaxed font-light">
                奥美广告公司实习-参与小鹏、捷豹路虎等知名汽车创意视觉制作，全程参与创意脑暴和绘画、美图设计等。入职第一个月竞标稿为公司拿下百万项目
              </p>
            </div>
          </div>

          <div className="w-full max-w-[1920px] mx-auto bg-black flex flex-col justify-center overflow-hidden relative mb-4 rounded-xl border border-neutral-900 shadow-2xl">
            <div className="w-full bg-black flex justify-center items-center">
              <video
                autoPlay
                loop
                muted
                playsInline
                controls
                className="w-full h-auto max-h-[85vh] object-contain max-w-[1920px] mx-auto block shadow-2xl rounded-lg"
              >
                <source src="https://fe24cc531e24492595e3a36c2bf35416.bj8.agentos-app.net/video6.mp4" type="video/mp4" />
                <source src="/video/video6.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      ) : (
        /* ORIGINAL STANDARD LAYOUT FOR OTHER PROJECTS */
        <div className="min-h-screen w-full relative pt-4 pb-24">
          
          {/* FIRST FOLD: Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 w-full border-b border-neutral-900 min-h-[85vh] relative">
            
            {/* LEFT PANEL */}
            <div className="lg:col-span-7 p-6 md:p-12 lg:p-16 flex flex-col justify-between border-r border-neutral-900 relative overflow-hidden bg-gradient-to-br from-neutral-950 to-black">
              
              {detail.id === "04" && (
                <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-45 mix-blend-screen scale-110"
                  >
                    <source src="/video/3d_planet_earth_navigation.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-neutral-950/80 mix-blend-multiply" />
                </div>
              )}

              <div className="relative z-10 flex flex-col justify-between h-full w-full">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-[0.3em] text-[#FF6B00] uppercase font-medium">
                    .frontline design deployment
                  </span>
                  <span className="text-neutral-800 text-xs">•</span>
                  <span className="font-mono text-[10px] text-neutral-500">
                    ACTIVE_{detail.year}
                  </span>
                </div>

                <div className="my-12 md:my-16">
                  <div className="flex items-baseline gap-4 mb-2">
                    <span className="font-mono text-xl sm:text-2xl text-[#FF6B00] font-bold">
                      {detail.id}
                    </span>
                    <span className="text-neutral-800 font-light">/</span>
                    <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest">
                      {detail.category}
                    </span>
                  </div>
                  <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-wider uppercase font-extrabold leading-none select-text">
                    {detail.title}
                  </h1>
                  {detail.subtitle && (
                    <p className="font-sans text-base sm:text-lg text-neutral-300 font-normal leading-relaxed mt-3 select-text max-w-3xl">
                      {detail.subtitle}
                    </p>
                  )}
                </div>

                <div className="relative group overflow-hidden border border-neutral-800/80 bg-neutral-950/70 p-6 md:p-8 backdrop-blur-xl rounded-lg max-w-2xl shadow-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-[#FF6B00] animate-pulse" />
                    <h4 className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase font-semibold">
                      PROJECT BACKGROUND / 项目背景介绍
                    </h4>
                  </div>
                  <p className="font-sans text-sm sm:text-base text-neutral-200 leading-relaxed font-light select-text">
                    {detail.backgroundIntro}
                  </p>
                </div>
              </div>

            </div>

            {/* RIGHT PANEL */}
            <div className="lg:col-span-5 grid grid-rows-12 h-full min-h-[400px] lg:min-h-0 bg-[#060606]">
              <div className="row-span-7 relative overflow-hidden border-b border-neutral-900 group">
                <img
                  src={detail.imageSrc}
                  alt={detail.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.attempt) {
                      target.dataset.attempt = '1';
                      const filename = detail.imageSrc?.split('/').pop();
                      if (filename) target.src = '/' + filename;
                    } else if (target.dataset.attempt === '1') {
                      target.dataset.attempt = '2';
                      const filename = detail.imageSrc?.split('/').pop();
                      if (filename) target.src = '/assets/images/' + filename;
                    }
                  }}
                  className="w-full h-full object-cover grayscale brightness-90 filter contrast-105 group-hover:scale-105 transition-transform duration-1000"
                />
              </div>

              <div className="row-span-5 relative overflow-hidden group">
                <img
                  src={detail.subImageSrc}
                  alt={`${detail.title} wireframe`}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.attempt) {
                      target.dataset.attempt = '1';
                      const filename = detail.subImageSrc?.split('/').pop();
                      if (filename) target.src = '/' + filename;
                    } else if (target.dataset.attempt === '1') {
                      target.dataset.attempt = '2';
                      const filename = detail.subImageSrc?.split('/').pop();
                      if (filename) target.src = '/assets/images/' + filename;
                    }
                  }}
                  className="w-full h-full object-cover grayscale-0 brightness-95 group-hover:scale-105 transition-transform duration-1000"
                />
              </div>
            </div>

          </div>

          {/* SECOND FOLD */}
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 mt-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              <div className="lg:col-span-8 flex flex-col gap-12">
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <Compass className="w-5 h-5 text-[#FF6B00]" />
                    <h3 className="font-display text-2xl text-white uppercase tracking-wider">
                      核心设计维度 / CORE PERSPECTIVES
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {detail.dimensions.map((dim, index) => (
                      <div 
                        key={index}
                        className="bg-neutral-950/40 border border-neutral-900 p-6 rounded-lg hover:border-neutral-800 transition-colors"
                      >
                        <span className="font-mono text-xs text-neutral-500 block mb-2">
                          DIM_0{index + 1}
                        </span>
                        <h4 className="font-sans text-sm font-semibold text-white mb-2">
                          {dim.title}
                        </h4>
                        <p className="font-sans text-xs text-neutral-400 leading-relaxed">
                          {dim.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <Cpu className="w-5 h-5 text-[#FF6B00]" />
                    <h3 className="font-display text-2xl text-white uppercase tracking-wider">
                      交互功能突破 / TECHNICAL BREAKTHROUGHS
                    </h3>
                  </div>

                  <div className="flex flex-col gap-3">
                    {detail.breakthroughs.map((b, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-4 bg-[#0a0a0a] border border-neutral-900/60 p-4 rounded-lg hover:bg-neutral-950/40 transition-colors"
                      >
                        <div className="w-6 h-6 rounded-full bg-neutral-950 border border-neutral-900 flex items-center justify-center font-mono text-[10px] text-[#FF6B00] font-bold">
                          {index + 1}
                        </div>
                        <span className="font-sans text-xs sm:text-sm text-neutral-300">
                          {b}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 lg:sticky lg:top-24 flex flex-col gap-6">
                <div 
                  className="bg-neutral-950/80 border border-neutral-800/80 p-6 rounded-lg relative overflow-hidden"
                  style={{ borderLeft: `3px solid ${detail.designSystem.accent}` }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Layers className="w-4 h-4" style={{ color: detail.designSystem.accent }} />
                    <h4 className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase font-bold">
                      DESIGN SYSTEM TOKEN / 设计系统规范
                    </h4>
                  </div>

                  <h3 className="font-display text-xl text-white uppercase tracking-wide mb-3">
                    {detail.designSystem.title}
                  </h3>

                  <p className="font-sans text-xs text-neutral-400 leading-relaxed">
                    {detail.designSystem.detail}
                  </p>

                  <div className="mt-4 flex items-center gap-2">
                    <span className="font-mono text-[10px] text-neutral-500">ACCENT_RGB:</span>
                    <div className="w-16 h-4 rounded-sm border border-white/10" style={{ backgroundColor: detail.designSystem.accent }} />
                    <span className="font-mono text-[10px] text-neutral-200" style={{ color: detail.designSystem.accent }}>
                      {detail.designSystem.accent}
                    </span>
                  </div>
                </div>

                <div className="bg-neutral-950/20 border border-neutral-900 p-6 rounded-lg flex gap-4 items-start">
                  <ShieldCheck className="w-5 h-5 text-neutral-600 mt-0.5 shrink-0" />
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">VERIFIED QUANTUM QUALITY</span>
                    <p className="font-sans text-[11px] text-neutral-400 leading-normal">
                      该项目的所有交互状态均已通过数字座舱整车中控硬件仿真验证，符合高等级视认与超流畅人机工程准则。
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>,
    document.body
  );
}
