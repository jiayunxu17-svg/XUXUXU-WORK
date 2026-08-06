import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Archive, X, Check, Film, Loader2, Play, ExternalLink } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export interface VideoAsset {
  id: string;
  title: string;
  category: string;
  url: string;
  fileName: string;
  sizeEstimate?: string;
  poster?: string;
}

export const ALL_PAGE_VIDEOS: VideoAsset[] = [
  {
    id: 'roadster-hp-4',
    title: 'Roadster 动态巡航 HMI 展示视频',
    category: '首页/主展示 (Home Page)',
    url: '/video/roadster_homepage_4.mp4',
    fileName: 'roadster_homepage_4.mp4',
    sizeEstimate: '~4.9 MB'
  },
  {
    id: 'speedster-boomerang',
    title: 'Speedster 回旋动态质感视频',
    category: '图集/跑车 (Gallery Speedster)',
    url: '/video/speedster_boomerang.mp4',
    fileName: 'speedster_boomerang.mp4',
    sizeEstimate: '~2.5 MB'
  },
  {
    id: 'speedster-block',
    title: 'Speedster 赛道性能演示视频',
    category: '图集/性能 (Gallery Speedster Track)',
    url: '/video/speedster_track_block.mp4',
    fileName: 'speedster_track_block.mp4',
    sizeEstimate: '~0.9 MB'
  },
  {
    id: 'hover-bg',
    title: 'HMI 悬停与三维车控互动视频',
    category: '项目详情/悬停预览 (HMI Hover & Detail)',
    url: '/video/hmi_hover_interaction.mp4',
    fileName: 'hmi_hover_interaction.mp4',
    sizeEstimate: '~1.6 MB'
  },
  {
    id: 'footer-bg',
    title: '底栏与前瞻座舱背景动效',
    category: '网页页脚 (Footer Motion)',
    url: '/video/footer_cockpit_motion.mp4',
    fileName: 'footer_cockpit_motion.mp4',
    sizeEstimate: '~8.9 MB'
  },
  {
    id: 'cyber-horizon',
    title: 'Cyber Horizon 方案二 动态环视视频',
    category: '皮卡详情/方案二 (Concept Scheme B)',
    url: '/video/cyber_horizon_block.mp4',
    fileName: 'cyber_horizon_block.mp4',
    sizeEstimate: '~0.8 MB'
  },
  {
    id: 'planet-loop',
    title: '3D 全地形导航与星球渲染视频',
    category: '项目详情/导航 (3D Map & Navigation)',
    url: '/video/3d_planet_earth_navigation.mp4',
    fileName: '3d_planet_earth_navigation.mp4',
    sizeEstimate: '~4.4 MB'
  }
];

interface VideoPackagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoPackagerModal({ isOpen, onClose }: VideoPackagerModalProps) {
  const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>(
    ALL_PAGE_VIDEOS.map(v => v.id)
  );
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);
  const [currentStatus, setCurrentStatus] = useState<string>('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [previewingVideo, setPreviewingVideo] = useState<VideoAsset | null>(null);

  const toggleSelectAll = () => {
    if (selectedVideoIds.length === ALL_PAGE_VIDEOS.length) {
      setSelectedVideoIds([]);
    } else {
      setSelectedVideoIds(ALL_PAGE_VIDEOS.map(v => v.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedVideoIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Package selected videos into ZIP
  const handleBatchDownloadZip = async () => {
    const targets = ALL_PAGE_VIDEOS.filter(v => selectedVideoIds.includes(v.id));
    if (targets.length === 0) return;

    setIsZipping(true);
    setZipProgress(0);
    setCurrentStatus('初始化 ZIP 打包引擎...');
    setDownloadSuccess(false);

    const zip = new JSZip();
    const videoFolder = zip.folder("video");

    // Add replacement guide TXT
    const readmeText = `================================================
长安全球设计中心 (Changan HMI) - 网页视频资源替换说明
================================================

本压缩包已将网页所有高质量视频资源归档在【video】文件夹中。

【视频文件对应位置一览表】：
1. video/roadster_homepage_4.mp4
   - 对应位置：网页 Header / Hero 主视图背景动效
   - 描述：Roadster 动态巡航 HMI 展示视频

2. video/speedster_boomerang.mp4
   - 对应位置：作品集 (Gallery) - Speedster 跑车展示
   - 描述：Speedster 回旋动态质感视频

3. video/speedster_track_block.mp4
   - 对应位置：作品集 (Gallery) - 赛道性能模块
   - 描述：Speedster 赛道性能演示视频

4. video/hmi_hover_interaction.mp4
   - 对应位置：项目详情页 (Project Details) - 悬停预览 & 三维车控
   - 描述：HMI 悬停与三维车控互动视频

5. video/footer_cockpit_motion.mp4
   - 对应位置：网页底栏 (Footer)
   - 描述：底栏与前瞻座舱背景动效

6. video/3d_planet_earth_navigation.mp4
   - 对应位置：全地形导航模块 (3D Navigation)
   - 描述：3D 全地形导航与星球渲染视频

【如何进行替换】：
如需将项目中的视频替换为您自己的 MP4 视频：
方法 A：保持上述文件名一致，将新 MP4 视频直接替换到项目 public/video/ 目录下。
方法 B：在代码数据文件 src/data.ts 中修改对应的视频 URL 地址。
================================================`;

    zip.file("README_视频替换说明.txt", readmeText);

    let completed = 0;

    for (let i = 0; i < targets.length; i++) {
      const video = targets[i];
      setCurrentStatus(`正在打包视频 (${i + 1}/${targets.length}): video/${video.fileName}...`);

      try {
        const response = await fetch(video.url);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const blob = await response.blob();
        videoFolder?.file(video.fileName, blob);
      } catch {
        // Fallback: If CORS or fetch fails
        try {
          const res2 = await fetch(video.url, { mode: 'no-cors' });
          const blob2 = await res2.blob();
          videoFolder?.file(video.fileName, blob2);
        } catch {
          // Add URL shortcut text inside zip if fetch fails
          videoFolder?.file(`${video.fileName}.url`, `[InternetShortcut]\nURL=${video.url}\n`);
        }
      }

      completed++;
      setZipProgress(Math.round((completed / targets.length) * 70));
    }

    setCurrentStatus('正在生成 video.zip 压缩包...');

    try {
      const content = await zip.generateAsync({ type: 'blob' }, (metadata) => {
        setZipProgress(70 + Math.round(metadata.percent * 0.3));
      });

      saveAs(content, `video.zip`);
      setZipProgress(100);
      setCurrentStatus('打包完成！已开始下载 video.zip');
      setDownloadSuccess(true);
    } catch {
      setCurrentStatus('ZIP 打包失败，请点击右侧直链单独下载');
    } finally {
      setIsZipping(false);
    }
  };

  // Direct single download
  const handleSingleDownload = (video: VideoAsset) => {
    const link = document.createElement('a');
    link.href = video.url;
    link.download = video.fileName;
    link.target = '_blank';
    link.rel = 'noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.95, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 15 }}
            className="relative max-w-3xl w-full bg-[#0d0d0d] border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-white my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-6 border-b border-neutral-800 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#753fec]/10 border border-[#753fec]/30 rounded-xl text-[#753fec]">
                  <Archive className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-[#753fec] uppercase tracking-widest font-bold">.ASSETS PACKAGER</span>
                    <span className="bg-neutral-800 text-neutral-300 font-mono text-[10px] px-2 py-0.5 rounded">6 个高清视频</span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
                    网页视频资源打包下载
                  </h3>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selection Controls */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleSelectAll}
                  className="font-mono text-xs text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${selectedVideoIds.length === ALL_PAGE_VIDEOS.length ? 'bg-[#753fec] border-[#753fec]' : 'border-neutral-600'}`}>
                    {selectedVideoIds.length === ALL_PAGE_VIDEOS.length && <Check className="w-2.5 h-2.5 text-black font-bold" />}
                  </div>
                  {selectedVideoIds.length === ALL_PAGE_VIDEOS.length ? '全取消' : '全选'}
                </button>
                <span className="font-mono text-xs text-neutral-400">
                  已选中 <strong className="text-[#753fec]">{selectedVideoIds.length}</strong> / {ALL_PAGE_VIDEOS.length} 项
                </span>
              </div>

              <span className="font-mono text-xs text-neutral-400 hidden sm:inline">
                支持打包为 ZIP 或单独直链下载
              </span>
            </div>

            {/* Video List */}
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2 mb-6">
              {ALL_PAGE_VIDEOS.map((video) => {
                const isSelected = selectedVideoIds.includes(video.id);

                return (
                  <div
                    key={video.id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all ${isSelected ? 'bg-neutral-900/90 border-[#753fec]/40' : 'bg-neutral-950/60 border-neutral-800/80'}`}
                  >
                    <div className="flex items-center gap-3.5 mb-3 sm:mb-0">
                      <button
                        onClick={() => toggleSelect(video.id)}
                        className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${isSelected ? 'bg-[#753fec] border-[#753fec]' : 'border-neutral-600 hover:border-neutral-400'}`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-black font-bold" />}
                      </button>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black rounded-lg border border-neutral-800 flex items-center justify-center shrink-0 text-[#753fec]">
                          <Film className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-sans font-bold text-sm text-white">{video.title}</h4>
                            <span className="font-mono text-[9px] bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded">
                              {video.sizeEstimate}
                            </span>
                          </div>
                          <p className="font-mono text-xs text-neutral-400 mt-0.5">{video.category} • {video.fileName}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => setPreviewingVideo(video)}
                        className="p-2 text-xs font-mono text-neutral-400 hover:text-white bg-black border border-neutral-800 hover:border-neutral-700 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        title="在线预览视频"
                      >
                        <Play className="w-3.5 h-3.5" />
                        预览
                      </button>

                      <button
                        onClick={() => handleSingleDownload(video)}
                        className="p-2 text-xs font-mono text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-[#753fec] rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="单独下载此视频"
                      >
                        <Download className="w-3.5 h-3.5 text-[#753fec]" />
                        直链下载
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Zipping Progress Bar */}
            {isZipping && (
              <div className="mb-6 p-4 bg-neutral-900 border border-[#753fec]/40 rounded-xl space-y-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-white flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#753fec]" />
                    {currentStatus}
                  </span>
                  <span className="text-[#753fec] font-bold">{zipProgress}%</span>
                </div>
                <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#753fec] h-full transition-all duration-300"
                    style={{ width: `${zipProgress}%` }}
                  />
                </div>
              </div>
            )}

            {downloadSuccess && (
              <div className="mb-6 p-3 bg-purple-950/60 border border-purple-500/40 text-purple-300 rounded-xl font-mono text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-400" />
                所有视频打包完毕，已生成 <strong>video.zip</strong>（解压后即为 <strong>video/</strong> 文件夹）并触发下载！
              </div>
            )}

            {/* Bottom Download Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-800">
              <span className="font-mono text-xs text-neutral-400 text-center sm:text-left">
                格式: MP4 / 适用于 HMI 视觉呈现场景与汇报
              </span>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-neutral-800 font-mono text-xs text-neutral-300 hover:bg-neutral-900 transition-colors cursor-pointer"
                >
                  关闭窗口
                </button>

                <button
                  onClick={handleBatchDownloadZip}
                  disabled={isZipping || selectedVideoIds.length === 0}
                  className={`w-full sm:w-auto px-6 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isZipping || selectedVideoIds.length === 0
                      ? 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed'
                      : 'bg-[#753fec] text-black hover:bg-[#2eb04f] shadow-[0_0_20px_rgba(52,199,89,0.4)]'
                  }`}
                >
                  {isZipping ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      打包压缩中...
                    </>
                  ) : (
                    <>
                      <Archive className="w-4 h-4" />
                      一键打包下载选中的视频 (ZIP)
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Video Preview Lightbox */}
          {previewingVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
              onClick={() => setPreviewingVideo(null)}
            >
              <div
                className="relative max-w-4xl w-full bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden p-2"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-3 border-b border-neutral-800">
                  <h4 className="font-sans font-bold text-white text-sm">{previewingVideo.title}</h4>
                  <button
                    onClick={() => setPreviewingVideo(null)}
                    className="p-1.5 bg-neutral-900 text-neutral-400 hover:text-white rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="aspect-video bg-black rounded-xl overflow-hidden">
                  <video
                    src={previewingVideo.url}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
