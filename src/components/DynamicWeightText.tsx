import React, { useEffect, useRef } from 'react';

interface DynamicWeightTextProps {
  text: string;
  color?: string;
  className?: string;
  fromWeight?: number;
  toWeight?: number;
  reach?: number; // max distance in px for influence
  fontFamily?: string;
}

export const DynamicWeightText: React.FC<DynamicWeightTextProps> = ({
  text,
  color,
  className = '',
  fromWeight = 200,
  toWeight = 900,
  reach = 450,
  fontFamily = '"Special Gothic Expanded One", var(--font-display), sans-serif',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const factorsRef = useRef<number[]>([]);
  const mousePosRef = useRef({ x: -99999, y: -99999 });
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleMouseLeave = () => {
      mousePosRef.current = { x: -99999, y: -99999 };
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    let animationFrameId: number;

    const animate = (now: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = now;
      const dt = Math.min(0.1, (now - lastTimeRef.current) / 1000);
      lastTimeRef.current = now;

      const { x: mx, y: my } = mousePosRef.current;
      const easeSpeed = 1 - Math.exp(-dt / 0.15); // Smooth interpolation speed

      letterRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const dx = mx - cx;
        const dy = my - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Proximity factor: 1 when cursor is right over letter center, 0 when beyond reach
        const target = Math.max(0, Math.min(1, 1 - dist / reach));

        const currentFactor = factorsRef.current[i] || 0;
        const nextFactor = currentFactor + (target - currentFactor) * easeSpeed;
        factorsRef.current[i] = nextFactor;

        const weight = Math.round(fromWeight + (toWeight - fromWeight) * nextFactor);
        
        el.style.fontWeight = `${weight}`;
        el.style.fontVariationSettings = `'wght' ${weight}`;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [fromWeight, toWeight, reach]);

  const characters = text.split('');
  letterRefs.current = [];

  return (
    <div
      ref={containerRef}
      className={`inline-block select-none cursor-pointer ${className}`}
      style={{ color }}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex flex-nowrap">
        {characters.map((char, index) => (
          <span
            key={index}
            ref={(el) => {
              letterRefs.current[index] = el;
            }}
            className="inline-block transition-transform duration-75"
            style={{
              fontWeight: fromWeight,
              fontVariationSettings: `'wght' ${fromWeight}`,
              fontFamily: fontFamily,
              willChange: 'font-weight, font-variation-settings',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
    </div>
  );
};

export default DynamicWeightText;

