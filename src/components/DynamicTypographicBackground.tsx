"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const CHAR_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>/?~';
const NUM_CHARS = 200; // Adjust for density/performance

interface TypographicCharProps {
  id: string;
  char: string;
  initialX: number;
  initialY: number;
  initialSize: number;
  initialOpacity: number;
}

const TypographicChar: React.FC<TypographicCharProps> = React.memo(({ id, char, initialX, initialY, initialSize, initialOpacity }) => {
  const charRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = charRef.current;
    if (!el) return;

    const baseHue = 270 + (Math.random() - 0.5) * 40;
    const baseSaturation = 60 + Math.random() * 20;
    const baseLightness = 50 + Math.random() * 20;
    const initialSolidColor = `hsl(${baseHue}, ${baseSaturation}%, ${baseLightness}%)`;

    gsap.set(el, {
      x: initialX,
      y: initialY,
      fontSize: `${initialSize}px`,
      color: initialSolidColor,
      opacity: initialOpacity,
      position: 'absolute',
      display: 'inline-block',
      willChange: 'transform, opacity, color, font-size'
    });

    gsap.to(el, {
      scale: () => 1 + (Math.random() - 0.5) * 0.2,
      duration: () => 4 + Math.random() * 4,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: Math.random() * 2,
    });

    const createOscillation = () => {
      if (!el) return;
      gsap.to(el, {
        x: initialX + (Math.random() - 0.5) * 360,
        y: initialY + (Math.random() - 0.5) * 360,
        rotation: (Math.random() - 0.5) * 12,
        duration: () => 5.34 + Math.random() * 5.34,
        ease: 'sine.inOut',
        onComplete: createOscillation,
        delay: Math.random() * 0.2,
        overwrite: 'auto'
      });
    };
    createOscillation();
    
    gsap.to(el, {
      color: () => {
        const newHue = baseHue + (Math.random() - 0.5) * 20;
        const newLightness = baseLightness + (Math.random() - 0.5) * 10;
        return `hsla(${newHue}, ${baseSaturation}%, ${newLightness}%, ${initialOpacity})`;
      },
      duration: () => 6 + Math.random() * 6,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: Math.random() * 4,
    });

    return () => {
      gsap.killTweensOf(el);
    };
  }, [initialX, initialY, initialSize, initialOpacity]);

  return <span ref={charRef} className="dynamic-bg-char" data-id={id} data-initial-opacity={initialOpacity} style={{ position: 'absolute', display: 'inline-block', willChange: 'transform, opacity, color' }}>{char}</span>;
});

TypographicChar.displayName = 'TypographicChar';

const DynamicTypographicBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMousePositionRef = useRef<{ x: number, y: number } | null>(null);
  const [charsData, setCharsData] = useState<TypographicCharProps[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = Array.from({ length: NUM_CHARS }).map(() => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const charValue = CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)];
        return {
          id: `${x}-${y}-${charValue}-${Math.random().toString(16).slice(2,8)}`,
          char: charValue,
          initialX: x,
          initialY: y,
          initialSize: 3.125 + Math.random() * 21.875,
          initialOpacity: 0.15625 + Math.random() * 0.15625,
        };
      });
      setCharsData(data);
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current || charsData.length === 0 || typeof window === 'undefined') {
      return;
    }

    if (!lastMousePositionRef.current) {
      lastMousePositionRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    }

    const handleMouseMove = (event: MouseEvent) => {
      const { clientX: mouseX, clientY: mouseY } = event;
      if (lastMousePositionRef.current) {
        lastMousePositionRef.current.x = mouseX;
        lastMousePositionRef.current.y = mouseY;
      }

      const maxDist = 150;
      const targetScaleFactor = 0.3;
      const targetOpacityFactor = 0.5;

      gsap.utils.toArray<HTMLSpanElement>('.dynamic-bg-char').forEach(el => {
        const rect = el.getBoundingClientRect();
        const charX = rect.left + rect.width / 2;
        const charY = rect.top + rect.height / 2;
        const dx = mouseX - charX;
        const dy = mouseY - charY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const charData = charsData.find(cd => cd.id === el.dataset.id);

        if (distance < maxDist && charData) {
          const force = 1 - (distance / maxDist);
          const moveX = dx * 0.15 * force;
          const moveY = dy * 0.15 * force;
          const targetScale = 1 - targetScaleFactor * force;
          const baseOpacity = charData.initialOpacity;
          const targetOpacity = Math.min(1, baseOpacity + targetOpacityFactor * force);
          const proximityFactor = 1 - Math.min(1, distance / maxDist);
          const targetSize = 1 + (charData.initialSize - 1) * (1 - proximityFactor);

          gsap.to(el, {
            x: `+=${moveX}`,
            y: `+=${moveY}`,
            scale: targetScale,
            fontSize: `${targetSize}px`,
            opacity: targetOpacity,
            duration: 0.05 + (distance / maxDist) * 0.1,
            ease: 'power1.out',
            overwrite: 'auto'
          });
        } else if (charData) {
          gsap.to(el, {
            x: charData.initialX + (Math.random() - 0.5) * 10,
            y: charData.initialY + (Math.random() - 0.5) * 10,
            scale: 1,
            fontSize: `${charData.initialSize}px`,
            opacity: charData.initialOpacity,
            duration: 1.2 + Math.random() * 0.6,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }
      });
    };

    const handleClick = (event: MouseEvent) => {
      const explosionRadius = 700;
      const explosionForceMultiplier = 7;
      gsap.utils.toArray<HTMLSpanElement>('.dynamic-bg-char').forEach(el => {
        const rect = el.getBoundingClientRect();
        const charX = rect.left + rect.width / 2;
        const charY = rect.top + rect.height / 2;
        const dx = charX - event.clientX;
        const dy = charY - event.clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < explosionRadius) {
          const force = (1 - distance / explosionRadius) * explosionForceMultiplier;
          const moveX = dx * force * (0.5 + Math.random() * 0.5);
          const moveY = dy * force * (0.5 + Math.random() * 0.5);
          gsap.to(el, {
            x: `+=${moveX}`,
            y: `+=${moveY}`,
            scale: 1 + force * 0.6,
            rotation: `+=${(Math.random() - 0.5) * 120 * force}`,
            duration: 0.6 + force * 0.4,
            ease: 'circ.out',
            overwrite: 'auto',
            onComplete: () => {
              const charOriginalData = charsData.find(cd => cd.id === el.dataset.id);
              if (charOriginalData) {
                gsap.to(el, {
                  x: charOriginalData.initialX + (Math.random() - 0.5) * 20,
                  y: charOriginalData.initialY + (Math.random() - 0.5) * 20,
                  scale: 1,
                  rotation: (Math.random() - 0.5) * 10,
                  duration: 1.2 + Math.random() * 0.6,
                  ease: 'power2.inOut',
                  overwrite: 'auto'
                });
              }
            }
          });
        }
      });
    };

    const tickAttraction = () => {
      if (!lastMousePositionRef.current || !containerRef.current) return;
      const { x: mouseX, y: mouseY } = lastMousePositionRef.current;
      const maxDist = 150;
      const attractionStrength = 0.03;

      gsap.utils.toArray<HTMLSpanElement>('.dynamic-bg-char').forEach(el => {
        let scaleValue = gsap.getProperty(el, 'scale');
        const currentScale = typeof scaleValue === 'string' ? parseFloat(scaleValue) : Number(scaleValue);
        if (currentScale > 1.1) return;

        const rect = el.getBoundingClientRect();
        const charX = rect.left + rect.width / 2;
        const charY = rect.top + rect.height / 2;
        const dx = mouseX - charX;
        const dy = mouseY - charY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const charData = charsData.find(cd => cd.id === el.dataset.id);

        if (distance < maxDist && charData) {
          const force = 1 - (distance / maxDist);
          const moveX = dx * attractionStrength * force;
          const moveY = dy * attractionStrength * force;
          const proximityFactor = 1 - Math.min(1, distance / maxDist);
          const targetSize = 1 + (charData.initialSize - 1) * (1 - proximityFactor);
          // Optional: slightly adjust scale/opacity for ticker for a more subtle effect
          // const targetScale = 1 - 0.1 * force; // e.g. less aggressive scale for ticker
          // const targetOpacity = charData.initialOpacity + 0.2 * force;

          gsap.to(el, {
            x: `+=${moveX}`,
            y: `+=${moveY}`,
            fontSize: `${targetSize}px`,
            // scale: targetScale, // Uncomment if subtle scale effect is desired for ticker
            // opacity: targetOpacity, // Uncomment if subtle opacity effect is desired for ticker
            duration: 0.2,
            ease: 'power1.out',
            overwrite: 'auto'
          });
        }
      });
    };

    gsap.ticker.add(tickAttraction);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      gsap.ticker.remove(tickAttraction);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      gsap.utils.toArray<HTMLSpanElement>('.dynamic-bg-char').forEach(el => gsap.killTweensOf(el));
    };
  }, [charsData]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" 
      style={{ backgroundColor: '#07081e' }}
    >
      {charsData.map((data: TypographicCharProps) => (
        <TypographicChar 
          key={data.id} // Use the unique id for the key
          id={data.id}    // Pass the id as a prop
          char={data.char} 
          initialX={data.initialX} 
          initialY={data.initialY} 
          initialSize={data.initialSize} 
          initialOpacity={data.initialOpacity} 
        />
      ))}
    </div>
  );
};

export default DynamicTypographicBackground;
