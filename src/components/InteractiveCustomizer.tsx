import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Eye, ShieldCheck, Palette, Disc, Layers } from 'lucide-react';
import { ModelData, CustomizationState } from '../types';
import { COLORS, WHEELS, INTERIORS } from '../data';
import GridLines, { GridIntersectionNode } from './GridLines';

interface InteractiveCustomizerProps {
  model: ModelData;
  customization: CustomizationState;
  onCustomizeChange: (key: keyof CustomizationState, value: string) => void;
  onProceedToReserve: () => void;
}

export default function InteractiveCustomizer({
  model,
  customization,
  onCustomizeChange,
  onProceedToReserve
}: InteractiveCustomizerProps) {
  // Get currently selected items for calculations
  const activeColor = COLORS.find(c => c.code === customization.color) || COLORS[0];
  const activeWheel = WHEELS.find(w => w.code === customization.wheels) || WHEELS[0];
  const activeInterior = INTERIORS.find(i => i.code === customization.interior) || INTERIORS[0];

  // Simple luxury pricing logic
  const getWheelPremium = (code: string) => {
    if (code === 'multi_spoke') return 1800;
    if (code === 'track_titanium') return 3500;
    return 0;
  };

  const getInteriorPremium = (code: string) => {
    if (code === 'crimson') return 2200;
    if (code === 'tan_hide') return 4000;
    return 0;
  };

  const basePrice = model.priceNum;
  const wheelPremium = getWheelPremium(customization.wheels);
  const interiorPremium = getInteriorPremium(customization.interior);
  const totalPrice = basePrice + wheelPremium + interiorPremium;

  return (
    <section id="customizer" className="relative py-24 bg-[#090909] border-b border-neutral-900/60 overflow-hidden">
      <GridLines />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col gap-2 mb-16">
          <span className="font-mono text-xs text-[#FF6B00] uppercase tracking-widest font-medium">.interactive competency framework</span>
          <h2 className="font-display text-4xl sm:text-5xl text-white tracking-wider uppercase">
            能力地图 Skills Map & Configurator
          </h2>
          <div className="w-20 h-[1px] bg-[#FF6B00] mt-2"></div>
        </div>

        {/* Customizer Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Visual Car Render Canvas (LGs: 7 columns) */}
          <div className="lg:col-span-7 flex flex-col gap-6 w-full">
            <div className="relative w-full aspect-[16/10] bg-neutral-950 border border-neutral-900 overflow-hidden flex flex-col items-center justify-center p-6 group">
              
              {/* Tech background overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40"></div>
              
              {/* Corner brackets */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-neutral-800"></div>
              <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-neutral-800"></div>
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-neutral-800"></div>
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-neutral-800"></div>

              {/* Status Header inside canvas */}
              <div className="absolute top-4 left-6 right-6 flex justify-between items-center z-10">
                <span className="font-mono text-[9px] tracking-widest text-neutral-500 uppercase flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                  live config: active
                </span>
                <span className="font-mono text-[9px] text-neutral-500 uppercase">
                  VIN_RESERVE_STABLE
                </span>
              </div>

              {/* Dynamic Reflection / Glow Backing */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={customization.color}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.35, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.8 }}
                  className="absolute w-80 h-80 rounded-full blur-[100px] pointer-events-none z-0"
                  style={{ backgroundColor: activeColor.hex }}
                ></motion.div>
              </AnimatePresence>

              {/* Styled Vehicle Image Overlay Layer */}
              <div className="relative w-full h-full flex items-center justify-center z-10">
                
                {/* Simulated Car Layer */}
                <div className="relative max-w-[580px] w-full aspect-[16/9] flex items-center justify-center">
                  
                  {/* Subtle Shimmer Paint Effect */}
                  <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 bg-gradient-to-tr from-transparent via-white to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1.8s] ease-in-out"></div>

                  <AnimatePresence mode="wait">
                    <motion.img
                      key={`${model.id}-${customization.color}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5 }}
                      src={model.heroImage}
                      alt={model.name}
                      className="w-full h-full object-contain filter contrast-[1.02] brightness-[1.0]"
                      // We use blend-modes & CSS filters to dynamically simulate color shift!
                      style={{
                        filter: customization.color === 'racing_green'
                          ? 'hue-rotate(110deg) saturate(0.65) brightness(0.7)'
                          : customization.color === 'monaco_red'
                          ? 'hue-rotate(340deg) saturate(0.9) brightness(0.8)'
                          : customization.color === 'carbon_black'
                          ? 'brightness(0.35) contrast(1.15) saturate(0.1)'
                          : 'none' // Liquid silver (default)
                      }}
                    />
                  </AnimatePresence>

                </div>
              </div>

              {/* Dynamic HUD Spec Badge on Canvas */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-4 items-center justify-between z-10 border-t border-neutral-900/80 pt-4">
                <div className="flex gap-4">
                  <div className="flex flex-col">
                    <span className="font-mono text-[9px] text-neutral-600 uppercase">Paint finish</span>
                    <span className="text-xs text-white font-medium">{activeColor.name}</span>
                  </div>
                  <div className="flex flex-col border-l border-neutral-900 pl-4">
                    <span className="font-mono text-[9px] text-neutral-600 uppercase">Alloys</span>
                    <span className="text-xs text-neutral-300 font-medium">{activeWheel.name.split(' 2')[0]}</span>
                  </div>
                  <div className="flex flex-col border-l border-neutral-900 pl-4">
                    <span className="font-mono text-[9px] text-neutral-600 uppercase">Cockpit</span>
                    <span className="text-xs text-neutral-300 font-medium">{activeInterior.name.split(' & ')[0]}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[9px] text-neutral-500 uppercase block">Est. Config Price</span>
                  <span className="text-sm font-semibold text-white">£{totalPrice.toLocaleString()}</span>
                </div>
              </div>

            </div>

            {/* Spec details preview summary */}
            <div className="bg-neutral-950/40 border border-neutral-900/60 p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-neutral-500 shrink-0" />
                <p className="text-xs text-neutral-400">
                  Your configurations are saved in your session. This ticket can be converted directly into an active production build slot.
                </p>
              </div>
              <span className="font-mono text-[10px] text-neutral-600 uppercase tracking-widest shrink-0 hidden sm:inline">.doc_spec_99x</span>
            </div>
          </div>

          {/* Right Column: Customizer Selector Panels (LGs: 5 columns) */}
          <div className="lg:col-span-5 flex flex-col gap-8 w-full">
            
            {/* 1. Paint Option Picker */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-neutral-900 pb-2">
                <Palette className="w-4 h-4 text-neutral-500" />
                <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">.01 exterior paint</span>
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                {COLORS.map((color) => {
                  const isSelected = customization.color === color.code;
                  return (
                    <button
                      key={color.code}
                      onClick={() => onCustomizeChange('color', color.code)}
                      className={`relative aspect-square rounded-none border p-1 flex items-center justify-center group ${
                        isSelected ? 'border-white' : 'border-neutral-900 hover:border-neutral-700'
                      }`}
                      title={color.name}
                    >
                      {/* Color Preview Block */}
                      <div className={`w-full h-full ${color.previewStyle} relative`}>
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-neutral-400 font-sans mt-1">
                Selected color: <span className="text-white font-medium">{activeColor.name}</span>
              </p>
            </div>

            {/* 2. Wheel Rims Option Picker */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-neutral-900 pb-2">
                <Disc className="w-4 h-4 text-neutral-500" />
                <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">.02 wheels & rims</span>
              </div>

              <div className="flex flex-col gap-3">
                {WHEELS.map((wheel) => {
                  const isSelected = customization.wheels === wheel.code;
                  const premium = getWheelPremium(wheel.code);
                  return (
                    <button
                      key={wheel.code}
                      onClick={() => onCustomizeChange('wheels', wheel.code)}
                      className={`text-left p-4 border flex justify-between items-center rounded-none transition-all ${
                        isSelected 
                          ? 'border-white bg-neutral-950' 
                          : 'border-neutral-900 hover:border-neutral-800 bg-neutral-950/40'
                      }`}
                    >
                      <div className="flex flex-col gap-1 pr-4">
                        <span className="text-xs font-semibold text-white">{wheel.name}</span>
                        <span className="text-[11px] text-neutral-500 leading-normal font-sans">{wheel.desc}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono text-xs text-white">
                          {premium === 0 ? 'Standard' : `+£${premium.toLocaleString()}`}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Cabin Interior Trim Picker */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-neutral-900 pb-2">
                <Layers className="w-4 h-4 text-neutral-500" />
                <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">.03 luxury cockpit trim</span>
              </div>

              <div className="flex flex-col gap-3">
                {INTERIORS.map((interior) => {
                  const isSelected = customization.interior === interior.code;
                  const premium = getInteriorPremium(interior.code);
                  return (
                    <button
                      key={interior.code}
                      onClick={() => onCustomizeChange('interior', interior.code)}
                      className={`text-left p-4 border flex justify-between items-center rounded-none transition-all ${
                        isSelected 
                          ? 'border-white bg-neutral-950' 
                          : 'border-neutral-900 hover:border-neutral-800 bg-neutral-950/40'
                      }`}
                    >
                      <div className="flex flex-col gap-1 pr-4">
                        <span className="text-xs font-semibold text-white">{interior.name}</span>
                        <span className="text-[11px] text-neutral-500 leading-normal font-sans">{interior.desc}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono text-xs text-white">
                          {premium === 0 ? 'Standard' : `+£${premium.toLocaleString()}`}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price calculation summary and checkout redirection */}
            <div className="mt-4 bg-neutral-950 border border-neutral-900 p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center font-mono text-xs text-neutral-500">
                <span>Base Model Price:</span>
                <span>£{basePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center font-mono text-xs text-neutral-500">
                <span>Selected Add-ons Premium:</span>
                <span>£{(wheelPremium + interiorPremium).toLocaleString()}</span>
              </div>
              
              <div className="h-[1px] bg-neutral-900 my-1"></div>
              
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-wider">your custom spec price</span>
                  <span className="text-2xl font-bold text-white tracking-tight mt-1">£{totalPrice.toLocaleString()}</span>
                </div>
                <button
                  onClick={onProceedToReserve}
                  className="bg-white hover:bg-neutral-200 text-black font-mono text-xs tracking-widest uppercase py-3.5 px-6 rounded-none transition-all duration-300 hover:shadow-lg hover:shadow-neutral-950"
                >
                  Proceed to Reserve +
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
