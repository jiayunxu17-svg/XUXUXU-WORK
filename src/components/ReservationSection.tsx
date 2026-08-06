import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Copy, Check, QrCode, ExternalLink, MessageSquare } from 'lucide-react';
import GridLines from './GridLines';

interface ReservationSectionProps {
  model?: any;
  customization?: any;
}

export default function ReservationSection({ model, customization }: ReservationSectionProps) {
  const [copied, setCopied] = useState(false);
  const emailAddress = "958762729@qq.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="reserve" className="relative py-24 bg-[#080808] border-b border-neutral-900/60 overflow-hidden">
      <GridLines />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col gap-2 mb-16 text-center items-center">
          <span className="font-mono text-xs text-[#753fec] uppercase tracking-widest font-semibold">.get in touch / direct channel</span>
          <h2 className="font-display text-4xl sm:text-5xl text-white tracking-wider uppercase font-bold">
            联系我 CONTACT ME
          </h2>
          <div className="w-16 h-[2px] bg-[#753fec] mt-3"></div>
          <p className="text-xs text-neutral-400 font-sans max-w-md mt-2">
            欢迎通过电子邮箱或微信与我取得联系，期待交流与合作。
          </p>
        </div>

        {/* Contact Cards Container (Only Email & WeChat QR Code) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          
          {/* Card 1: Email Contact Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group relative bg-[#0d0d0d] border border-neutral-800/80 hover:border-[#753fec]/60 p-8 sm:p-10 rounded-2xl flex flex-col justify-between transition-all duration-300 shadow-xl overflow-hidden"
          >
            {/* Corner Tech Decorators */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neutral-700"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-neutral-700"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-neutral-700"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-neutral-700"></div>

            <div className="flex flex-col gap-6">
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#753fec]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">CHANNEL #01</span>
                    <h3 className="font-display text-xl text-white font-bold tracking-wider">电子邮箱 EMAIL</h3>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-purple-400 bg-purple-950/60 border border-purple-800/50 px-2.5 py-1 rounded">
                  ONLINE
                </span>
              </div>

              <div className="border-t border-neutral-900/80 pt-6 flex flex-col gap-3">
                <span className="font-mono text-xs text-neutral-400 uppercase tracking-wider">
                  PRIMARY EMAIL ADDRESS:
                </span>
                <div className="p-4 bg-black/80 border border-neutral-800/80 rounded-xl flex items-center justify-between gap-3 group-hover:border-neutral-700 transition-colors">
                  <span className="font-mono text-lg sm:text-xl text-white font-bold tracking-wide select-all text-ellipsis overflow-hidden">
                    {emailAddress}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-neutral-900/80">
              <button
                onClick={handleCopyEmail}
                className={`flex-1 font-mono text-xs tracking-wider uppercase py-3.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  copied
                    ? "bg-purple-500 text-black shadow-lg shadow-purple-500/20"
                    : "bg-[#767676] hover:bg-[#888888] text-black shadow-md shadow-neutral-500/10"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>已复制邮箱 (COPIED)</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>复制邮箱地址 (COPY)</span>
                  </>
                )}
              </button>

              <a
                href={`mailto:${emailAddress}`}
                className="font-mono text-xs tracking-wider uppercase py-3.5 px-5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>发送邮件</span>
              </a>
            </div>
          </motion.div>

          {/* Card 2: WeChat QR Code Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group relative bg-[#0d0d0d] border border-neutral-800/80 hover:border-[#753fec]/60 p-8 sm:p-10 rounded-2xl flex flex-col justify-between transition-all duration-300 shadow-xl overflow-hidden"
          >
            {/* Corner Tech Decorators */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neutral-700"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-neutral-700"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-neutral-700"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-neutral-700"></div>

            <div className="flex flex-col gap-6 items-center text-center">
              {/* Header Badge */}
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#753fec]">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">CHANNEL #02</span>
                    <h3 className="font-display text-xl text-white font-bold tracking-wider">微信二维码 WECHAT</h3>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-[#07C160] bg-[#07C160]/10 border border-[#07C160]/30 px-2.5 py-1 rounded font-semibold">
                  WECHAT
                </span>
              </div>

              {/* QR Code Container */}
              <div className="relative p-4 bg-white/5 border border-neutral-800 rounded-2xl mt-2 flex flex-col items-center justify-center group-hover:border-[#753fec]/40 transition-colors shadow-2xl">
                <div className="w-48 h-48 sm:w-52 sm:h-52 rounded-xl overflow-hidden border border-neutral-800 bg-black p-2 relative shadow-inner">
                  <img
                    src="https://b4ca62ea3b5c48218ab14dbc609f2c16.gz5.agentos-app.net/photo16.jpg"
                    alt="Xu Jiayun WeChat QR Code"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.attempt) {
                        target.dataset.attempt = '1';
                        target.src = 'https://b4ca62ea3b5c48218ab14dbc609f2c16.gz5.agentos-app.net/photo16.jpg';
                      }
                    }}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="mt-3 flex items-center gap-2 font-mono text-xs text-neutral-300">
                  <QrCode className="w-3.5 h-3.5 text-[#07C160]" />
                  <span>微信号 / 电话 WeChat/Phone: <strong className="text-white font-bold">15910507713</strong></span>
                </div>
              </div>
            </div>

            {/* Footer Hint */}
            <div className="mt-6 pt-4 border-t border-neutral-900/80 text-center">
              <span className="font-mono text-[11px] text-neutral-400">
                请使用微信 扫描二维码 或 搜索微信号添加好友
              </span>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
