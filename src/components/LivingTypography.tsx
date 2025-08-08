"use client";

import React, { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';

interface LivingTypographyProps {
  text: string;
  tag?: React.ElementType; // Changed from keyof JSX.IntrinsicElements
  className?: string;
  characterClassName?: string;
  wordClassName?: string;
}

const LivingTypography: React.FC<LivingTypographyProps> = ({
  text,
  tag: TagElement = 'div', // Use alias and default for the component
  className = '',
  characterClassName = '',
  wordClassName = '',
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const charactersRef = useRef<HTMLSpanElement[]>([]);

  // Memoize words and characters to avoid re-splitting on every render unless text changes
  const words = useMemo(() => text.split(/(\s+)/), [text]); // Split by space, keeping spaces

  useEffect(() => {
    if (!containerRef.current) return;

    let charElements: HTMLSpanElement[] = [];
    containerRef.current.innerHTML = ''; // Clear previous content

    words.forEach((word, wordIndex) => {
      if (word.match(/^\s+$/)) { // It's a space character or sequence
        const spaceSpan = document.createElement('span');
        spaceSpan.innerHTML = word.replace(/ /g, '\u00A0'); // Preserve multiple spaces
        spaceSpan.className = characterClassName;
        spaceSpan.style.display = 'inline-block'; // Treat spaces like other chars for layout
        containerRef.current?.appendChild(spaceSpan);
        charElements.push(spaceSpan);
      } else {
        const wordWrapper = document.createElement('span');
        wordWrapper.className = wordClassName;
        wordWrapper.style.display = 'inline-block'; // So word can be clicked as a unit if needed

        word.split('').forEach((char) => {
          const charSpan = document.createElement('span');
          charSpan.textContent = char;
          charSpan.style.display = 'inline-block'; // Essential for transforms
          charSpan.className = characterClassName;
          wordWrapper.appendChild(charSpan);
          charElements.push(charSpan);
        });
        containerRef.current?.appendChild(wordWrapper);
      }
    });
    charactersRef.current = charElements;

  }, [text, characterClassName, wordClassName, words]);

  useEffect(() => {
    const chars = charactersRef.current;
    if (chars.length === 0) return;

    // 1. Breathe & 5. Random Twitch & Color Shift
    chars.forEach((char) => {
      gsap.killTweensOf(char); // Kill previous tweens

      // Breathing
      gsap.fromTo(char, 
        { scale: 1 + Math.random() * 0.02 - 0.01 }, 
        {
          scale: () => 1 + Math.random() * 0.05 - 0.025,
          duration: () => 2 + Math.random() * 2,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: Math.random() * 0.5,
        }
      );
      // Twitching
      gsap.fromTo(char, 
        { x: Math.random() * 1 - 0.5, y: Math.random() * 1 - 0.5, rotation: Math.random() * 1 - 0.5 },
        {
          x: () => Math.random() * 3 - 1.5,
          y: () => Math.random() * 3 - 1.5,
          rotation: () => Math.random() * 3 - 1.5,
          duration: () => 3 + Math.random() * 3,
          ease: 'power1.inOut',
          repeat: -1,
          yoyo: true,
          delay: Math.random() * 1,
        }
      );
      // Color shifts
      gsap.fromTo(char, 
        { color: '#FFFFFF' }, 
        {
          color: () => ['#FFFFFF', '#E0B0FF', '#D0A0FF', '#C080FF'][Math.floor(Math.random() * 4)],
          duration: () => 4 + Math.random() * 4,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: Math.random() * 1.5,
        }
      );
    });

    // 2. Mouse Follow/Flee
    const handleMouseMove = (event: MouseEvent) => {
      chars.forEach(char => {
        if (!char.parentElement) return; // Ensure char is in DOM
        const rect = char.getBoundingClientRect();
        const charCenterX = rect.left + rect.width / 2;
        const charCenterY = rect.top + rect.height / 2;
        const dx = event.clientX - charCenterX;
        const dy = event.clientY - charCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const fleeDistance = 60;
        const reactDistance = 150; // Max distance for reaction

        if (distance < fleeDistance) {
          const angle = Math.atan2(dy, dx);
          gsap.to(char, {
            x: -Math.cos(angle) * (fleeDistance - distance) * 0.6,
            y: -Math.sin(angle) * (fleeDistance - distance) * 0.6,
            scale: 1.1, // Slightly enlarge when fleeing
            duration: 0.2,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        } else if (distance < reactDistance) {
          const pullFactor = (reactDistance - distance) / reactDistance * 0.1;
          gsap.to(char, {
            x: dx * pullFactor,
            y: dy * pullFactor,
            scale: 1 + ( (reactDistance - distance) / reactDistance * 0.05 ),
            duration: 0.4,
            ease: 'power1.out',
            overwrite: 'auto',
          });
        } else {
          // Return to near-original state (let twitch/breathe take over)
          gsap.to(char, {
            x: (gsap.getProperty(char, 'x') as number) * 0.8, // Dampen current x
            y: (gsap.getProperty(char, 'y') as number) * 0.8, // Dampen current y
            scale: 1, // Reset scale
            duration: 0.5,
            ease: 'power1.out',
            overwrite: 'auto',
          });
        }
      });
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 3. Explode on Click (targeting individual characters for now)
    chars.forEach(char => {
      const clickHandler = () => {
        gsap.fromTo(char, 
          { scale: gsap.getProperty(char, 'scale'), opacity: 1 }, 
          {
            scale: () => (gsap.getProperty(char, 'scale') as number) * (1.5 + Math.random() * 1), 
            opacity: 0,
            x: () => (Math.random() - 0.5) * 50,
            y: () => (Math.random() - 0.5) * 50,
            rotation: () => (Math.random() - 0.5) * 90,
            duration: 0.4 + Math.random() * 0.3,
            ease: 'power2.out',
            onComplete: () => {
              // Reset after a delay
              gsap.to(char, { 
                scale: 1, 
                opacity: 1, 
                x: 0, 
                y: 0, 
                rotation: 0, 
                duration: 0.3, 
                delay: 0.5 + Math.random() * 0.5, 
                ease: 'power2.inOut'
              });
            }
          }
        );
      };
      char.addEventListener('click', clickHandler);
      // Store handler to remove it later
      (char as any)._clickHandler = clickHandler; 
    });

    // 4. Wave on Scroll (simple version)
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      chars.forEach((char, index) => {
        if (!char.parentElement) return;
        const charRect = char.getBoundingClientRect();
        // Only animate if char is somewhat in view
        if (charRect.top < window.innerHeight && charRect.bottom > 0) {
          const delay = index * 0.005; // Stagger effect
          const movement = deltaY * (Math.sin(index * 0.2 + currentScrollY * 0.005) * 0.1 + 0.05);
          gsap.to(char, {
            y: `+=${movement}`,
            duration: 0.6,
            ease: 'sine.out',
            delay: delay,
            overwrite: 'auto',
          });
        }
      });
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      chars.forEach(char => {
        gsap.killTweensOf(char);
        if ((char as any)._clickHandler) {
          char.removeEventListener('click', (char as any)._clickHandler);
        }
      });
    };
  }, [charactersRef.current]); // Rerun if charactersRef.current changes (which it does after text prop change)

  return <TagElement ref={containerRef as any} className={`living-typography ${className}`} />;
};

export default LivingTypography;
