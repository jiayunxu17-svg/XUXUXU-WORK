import React from 'react';

export default function GridLines() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="w-full h-full relative">
        {/* Vertical lines matched to db-longbow grid ratios: 0%, 25%, 33.3%, 50%, 66.6%, 75%, 100% */}
        <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-neutral-800/30"></div>
        <div className="absolute top-0 bottom-0 left-[25%] w-[1px] bg-neutral-800/30 hidden md:block"></div>
        <div className="absolute top-0 bottom-0 left-[33.333%] w-[1px] bg-neutral-800/20 hidden lg:block"></div>
        <div className="absolute top-0 bottom-0 left-[50%] w-[1px] bg-neutral-800/30"></div>
        <div className="absolute top-0 bottom-0 left-[66.666%] w-[1px] bg-neutral-800/20 hidden lg:block"></div>
        <div className="absolute top-0 bottom-0 left-[75%] w-[1px] bg-neutral-800/30 hidden md:block"></div>
        <div className="absolute top-0 bottom-0 right-0 w-[1px] bg-neutral-800/30"></div>
      </div>
    </div>
  );
}

export function GridIntersectionNode({ position }: { position: string }) {
  // position can be "left", "left-25", "left-50", "left-75", "right"
  const classes = {
    left: 'left-0',
    'left-25': 'left-[25%] hidden md:block',
    'left-33': 'left-[33.333%] hidden lg:block',
    'left-50': 'left-[50%]',
    'left-66': 'left-[66.666%] hidden lg:block',
    'left-75': 'left-[75%] hidden md:block',
    right: 'right-0'
  }[position] || 'left-0';

  return (
    <div className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-neutral-500 border border-neutral-900 z-10 ${classes}`} />
  );
}

export function GridHorizontalLine() {
  return (
    <div className="relative w-full h-[1px] bg-neutral-800/50 my-8">
      <GridIntersectionNode position="left" />
      <GridIntersectionNode position="left-25" />
      <GridIntersectionNode position="left-50" />
      <GridIntersectionNode position="left-75" />
      <GridIntersectionNode position="right" />
    </div>
  );
}
