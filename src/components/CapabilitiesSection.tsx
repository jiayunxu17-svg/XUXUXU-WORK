import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function CapabilitiesSection() {
  const capabilities = [
    {
      number: '01',
      title: 'Design',
      description: '灵活的创意思维，高级的审美视觉表达。',
    },
    {
      number: '02',
      title: 'Energetic',
      description: '时刻饱满的工作状态和高效的执行力，活泼的氛围担当。',
    },
    {
      number: '03',
      title: 'Learning Agility',
      icon: true,
      description: '高学习敏捷性，适应新知识、有快速迭代能力。',
    },
  ];

  return (
    <section id="capabilities" className="w-full bg-[#e5e5e5] text-[#111111] py-20 sm:py-28 md:py-36">
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-24"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#111111] flex flex-wrap items-baseline gap-x-3 gap-y-2">
            <span>我能提供什么？</span>
            <span className="text-neutral-500 font-light text-2xl sm:text-3xl md:text-4xl">
              (I can help you with)
            </span>
          </h2>
        </motion.div>

        {/* 3 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 lg:gap-16">
          {capabilities.map((cap, index) => (
            <motion.div
              key={cap.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="flex flex-col border-t border-neutral-300 pt-6 md:pt-8"
            >
              {/* Number indicator */}
              <span className="font-mono text-xs sm:text-sm text-neutral-500 mb-8 sm:mb-12">
                {cap.number}
              </span>

              {/* Title with optional sparkle icon */}
              <div className="flex items-center gap-2.5 mb-4 md:mb-6">
                {cap.icon && (
                  <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-[#111111] fill-[#111111] shrink-0" />
                )}
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#111111]">
                  {cap.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-normal max-w-sm">
                {cap.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
