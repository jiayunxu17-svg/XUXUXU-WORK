const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const tmpSvgDir = '/tmp/node3_svgs';
if (!fs.existsSync(tmpSvgDir)) fs.mkdirSync(tmpSvgDir, { recursive: true });

const totalFrames = 120; // 4s loop at 30fps

console.log(`Generating ${totalFrames} SVG frames for 视频节点 3...`);

for (let i = 0; i < totalFrames; i++) {
  const t = i / totalFrames; // 0.0 to 1.0
  const angle = t * 2 * Math.PI;

  const pulse = (Math.sin(angle) + 1) / 2;
  const rotation = t * 360;
  const gridOffset = (t * 100) % 50;

  const radarX = 960 + Math.sin(angle) * 300;
  const radarY = 540 + Math.cos(angle) * 120;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0a0814"/>
      <stop offset="50%" stop-color="#120d26"/>
      <stop offset="100%" stop-color="#05030a"/>
    </linearGradient>

    <linearGradient id="hudGlow" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#753fec" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#2eb04e" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#753fec" stop-opacity="0.8"/>
    </linearGradient>

    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#753fec" stop-opacity="0.35"/>
      <stop offset="60%" stop-color="#2eb04e" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="1920" height="1080" fill="url(#bgGrad)"/>
  <rect width="1920" height="1080" fill="url(#centerGlow)"/>

  <!-- Perspective Perspective Grid Lines -->
  <g stroke="#753fec" stroke-opacity="0.15" stroke-width="1.5">
    ${Array.from({ length: 21 }).map((_, idx) => {
      const x = idx * 96;
      return `<line x1="${x}" y1="0" x2="${(x - 960) * 1.8 + 960}" y2="1080"/>`;
    }).join('')}
    ${Array.from({ length: 15 }).map((_, idx) => {
      const y = (idx * 72 + gridOffset) % 1080;
      return `<line x1="0" y1="${y}" x2="1920" y2="${y}"/>`;
    }).join('')}
  </g>

  <!-- Central HMI Telemetry Node 3 Ring -->
  <g transform="translate(960, 540)">
    <!-- Rotating outer ring -->
    <circle r="320" fill="none" stroke="#753fec" stroke-width="2" stroke-dasharray="20 10 40 10" transform="rotate(${rotation})"/>
    <circle r="290" fill="none" stroke="#2eb04e" stroke-width="1.5" stroke-dasharray="15 15" transform="rotate(${-rotation * 1.5})"/>
    <circle r="260" fill="none" stroke="#ffffff" stroke-opacity="0.2" stroke-width="1" stroke-dasharray="5 5"/>

    <!-- Pulse Ring -->
    <circle r="${200 + pulse * 40}" fill="none" stroke="#753fec" stroke-width="${3 - pulse * 2}" stroke-opacity="${1 - pulse}"/>

    <!-- Center Node HUD Circle -->
    <circle r="180" fill="#0c071d" stroke="#753fec" stroke-width="3"/>

    <!-- Node 3 Title Text -->
    <text x="0" y="-30" font-family="'Inter', sans-serif" font-size="28" font-weight="800" fill="#2eb04e" text-anchor="middle" letter-spacing="4">HMI NODE 03</text>
    <text x="0" y="20" font-family="'Inter', sans-serif" font-size="42" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="2">视频节点 3</text>
    <text x="0" y="65" font-family="'Inter', sans-serif" font-size="16" font-weight="600" fill="#753fec" text-anchor="middle" letter-spacing="3">COCKPIT INTERACTION ACTIVE</text>

    <!-- Crosshair indicator -->
    <line x1="-220" y1="0" x2="-190" y2="0" stroke="#2eb04e" stroke-width="3"/>
    <line x1="190" y1="0" x2="220" y2="0" stroke="#2eb04e" stroke-width="3"/>
    <line x1="0" y1="-220" x2="0" y2="-190" stroke="#2eb04e" stroke-width="3"/>
    <line x1="0" y1="190" x2="0" y2="220" stroke="#2eb04e" stroke-width="3"/>
  </g>

  <!-- Animated Satellite Radar Points -->
  <circle cx="${radarX}" cy="${radarY}" r="8" fill="#2eb04e"/>
  <circle cx="${radarX}" cy="${radarY}" r="18" fill="none" stroke="#2eb04e" stroke-width="2" stroke-opacity="0.6"/>
  <line x1="960" y1="540" x2="${radarX}" y2="${radarY}" stroke="#2eb04e" stroke-width="1.5" stroke-dasharray="4 4"/>

  <!-- Top Left HUD Specs -->
  <g transform="translate(100, 100)" font-family="monospace" fill="#2eb04e" font-size="16">
    <rect x="-20" y="-30" width="360" height="160" fill="#080512" fill-opacity="0.8" stroke="#753fec" stroke-width="1.5" rx="8"/>
    <text x="0" y="0" font-weight="bold" fill="#ffffff">SYS.NODE // 03_LIVE_FEED</text>
    <text x="0" y="30" fill="#753fec">FPS: 60.0  |  LATENCY: 4ms</text>
    <text x="0" y="60">SIGNAL STRENGTH: 99.8%</text>
    <text x="0" y="90" fill="#ffffff">MODE: PICKUP_HMI_SMART_DRIVE</text>
  </g>

  <!-- Top Right HUD Badge -->
  <g transform="translate(1500, 100)" font-family="sans-serif">
    <rect x="0" y="-30" width="320" height="70" fill="#753fec" rx="12"/>
    <text x="160" y="15" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">智能座舱视频节点 3</text>
  </g>

  <!-- Bottom Wave Analyzer -->
  <g transform="translate(460, 960)">
    ${Array.from({ length: 40 }).map((_, idx) => {
      const h = 20 + Math.sin(angle * 2 + idx * 0.3) * 35 + Math.cos(angle + idx * 0.1) * 15;
      const x = idx * 25;
      return `<rect x="${x}" y="${-h}" width="16" height="${h}" fill="${idx % 2 === 0 ? '#753fec' : '#2eb04e'}" rx="4"/>`;
    }).join('')}
  </g>
</svg>`;

  fs.writeFileSync(path.join(tmpSvgDir, `frame_${String(i).padStart(4, '0')}.svg`), svg);
}

console.log('SVG frames created. Encoding with ffmpeg...');
