const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const tmpSvgDir = '/tmp/dune_svgs';
const tmpPngDir = '/tmp/dune_pngs';

if (!fs.existsSync(tmpSvgDir)) fs.mkdirSync(tmpSvgDir, { recursive: true });
if (!fs.existsSync(tmpPngDir)) fs.mkdirSync(tmpPngDir, { recursive: true });

const totalFrames = 90; // 3s loop at 30fps

console.log(`Generating ${totalFrames} SVG frames...`);

for (let i = 0; i < totalFrames; i++) {
  const t = i / totalFrames; // 0.0 to 1.0
  const angle = t * 2 * Math.PI;

  const lightX = 960 + Math.sin(angle) * 500;
  const shimmerPos1 = (t * 100) % 100;
  const shimmerPos2 = ((t + 0.33) * 100) % 100;
  const shimmerPos3 = ((t + 0.66) * 100) % 100;

  const wave1 = Math.sin(angle) * 12;
  const wave2 = Math.cos(angle) * 10;
  const wave3 = Math.sin(angle + Math.PI / 2) * 14;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#72533d"/>
      <stop offset="30%" stop-color="#523725"/>
      <stop offset="65%" stop-color="#311f14"/>
      <stop offset="100%" stop-color="#120a06"/>
    </linearGradient>

    <radialGradient id="sunGlow" cx="${lightX / 1920 * 100}%" cy="25%" r="65%">
      <stop offset="0%" stop-color="#f0d4b0" stop-opacity="0.4"/>
      <stop offset="40%" stop-color="#a87c56" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>

    <linearGradient id="dune1Grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#583c29"/>
      <stop offset="100%" stop-color="#2a180e"/>
    </linearGradient>

    <linearGradient id="dune2Grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#42291a"/>
      <stop offset="100%" stop-color="#1b0c06"/>
    </linearGradient>

    <linearGradient id="dune3Grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2e1b10"/>
      <stop offset="100%" stop-color="#0f0502"/>
    </linearGradient>

    <linearGradient id="dune4Grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e0f08"/>
      <stop offset="100%" stop-color="#050201"/>
    </linearGradient>

    <linearGradient id="crestGrad1" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#c29d72"/>
      <stop offset="${Math.max(0, shimmerPos1 - 15)}%" stop-color="#c29d72"/>
      <stop offset="${shimmerPos1}%" stop-color="#ffffff"/>
      <stop offset="${Math.min(100, shimmerPos1 + 15)}%" stop-color="#c29d72"/>
      <stop offset="100%" stop-color="#c29d72"/>
    </linearGradient>

    <linearGradient id="crestGrad2" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#d8b488"/>
      <stop offset="${Math.max(0, shimmerPos2 - 15)}%" stop-color="#d8b488"/>
      <stop offset="${shimmerPos2}%" stop-color="#ffffff"/>
      <stop offset="${Math.min(100, shimmerPos2 + 15)}%" stop-color="#d8b488"/>
      <stop offset="100%" stop-color="#d8b488"/>
    </linearGradient>

    <linearGradient id="crestGrad3" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ebd0a6"/>
      <stop offset="${Math.max(0, shimmerPos3 - 15)}%" stop-color="#ebd0a6"/>
      <stop offset="${shimmerPos3}%" stop-color="#ffffff"/>
      <stop offset="${Math.min(100, shimmerPos3 + 15)}%" stop-color="#ebd0a6"/>
      <stop offset="100%" stop-color="#ebd0a6"/>
    </linearGradient>
  </defs>

  <rect width="1920" height="1080" fill="url(#bgGrad)"/>
  <rect width="1920" height="1080" fill="url(#sunGlow)"/>

  <!-- Dune Layer 1 -->
  <path d="M -100 ${360 + wave1} Q 500 ${280 - wave1}, 1100 ${420 + wave2} T 2020 ${340 - wave1} L 2020 1180 L -100 1180 Z" fill="url(#dune1Grad)"/>
  <path d="M -100 ${360 + wave1} Q 500 ${280 - wave1}, 1100 ${420 + wave2} T 2020 ${340 - wave1}" fill="none" stroke="url(#crestGrad1)" stroke-width="3.5"/>

  <!-- Dune Layer 2 -->
  <path d="M -100 ${500 - wave2} C 400 ${390 + wave3}, 900 ${570 - wave1}, 1400 ${460 + wave2} T 2020 ${520 - wave2} L 2020 1180 L -100 1180 Z" fill="url(#dune2Grad)"/>
  <path d="M -100 ${500 - wave2} C 400 ${390 + wave3}, 900 ${570 - wave1}, 1400 ${460 + wave2} T 2020 ${520 - wave2}" fill="none" stroke="url(#crestGrad2)" stroke-width="4"/>

  <!-- Dune Layer 3 -->
  <path d="M -100 ${670 + wave3} C 500 ${560 - wave1}, 1000 ${730 + wave2}, 1500 ${600 - wave3} T 2020 ${660 + wave1} L 2020 1180 L -100 1180 Z" fill="url(#dune3Grad)"/>
  <path d="M -100 ${670 + wave3} C 500 ${560 - wave1}, 1000 ${730 + wave2}, 1500 ${600 - wave3} T 2020 ${660 + wave1}" fill="none" stroke="url(#crestGrad3)" stroke-width="4.5"/>

  <!-- Dune Layer 4 -->
  <path d="M -100 ${860 - wave1} C 600 ${740 + wave2}, 1200 ${890 - wave3}, 2020 ${780 + wave1} L 2020 1180 L -100 1180 Z" fill="url(#dune4Grad)"/>
  <path d="M -100 ${860 - wave1} C 600 ${740 + wave2}, 1200 ${890 - wave3}, 2020 ${780 + wave1}" fill="none" stroke="url(#crestGrad2)" stroke-width="5"/>

</svg>`;

  const frameNum = String(i).padStart(4, '0');
  fs.writeFileSync(path.join(tmpSvgDir, `frame_${frameNum}.svg`), svg);
}

console.log("SVG frames created successfully.");
