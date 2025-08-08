"use client";

import { useEffect, useRef, useState } from 'react';

interface ParticleBackgroundProps {
  scrollY: number;
}

// Simple space travel effect with stars
const ParticleBackground = ({ scrollY }: ParticleBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Stars state - simple data structure
  const starsRef = useRef<Array<{
    x: number;
    y: number;
    z: number;
    size: number;
    color: string;
  }>>([]);
  
  // Ripple state
  const ripplesRef = useRef<Array<{
    x: number;
    y: number;
    radius: number;
    maxRadius: number;
    opacity: number;
    createdAt: number;
  }>>([]);
  
  // Mouse state
  const mouseRef = useRef({
    x: 0,
    y: 0,
    prevX: 0,
    prevY: 0
  });

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Set up dimensions
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
    
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    containerRef.current.appendChild(canvas);
    canvasRef.current = canvas;
    
    // Initialize stars - very few stars with dramatically different sizes
    const starCount = 12; // Very small number of stars
    
    // Clear any existing stars
    starsRef.current = [];
    
    // Create new stars
    for (let i = 0; i < starCount; i++) {
      // Determine star color - white or purple
      const isWhite = Math.random() > 0.4;
      const opacity = Math.random() * 0.3 + 0.3;
      const color = isWhite 
        ? `rgba(255, 255, 255, ${opacity})` 
        : `rgba(${180 + Math.floor(Math.random() * 75)}, ${100 + Math.floor(Math.random() * 50)}, 255, ${opacity})`;
      
      // Create stars with dramatically varying sizes
      starsRef.current.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        z: Math.random() * 1000 + 500, // Z distance (depth)
        size: Math.random() * 15 + 3, // Even larger size variation (3-18px)
        color
      });
    }
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setDimensions({ width, height });
      
      // Resize canvas
      if (canvasRef.current) {
        canvasRef.current.width = width;
        canvasRef.current.height = height;
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Handle mouse movement
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const { x: prevX, y: prevY } = mouseRef.current;
      
      mouseRef.current = {
        x: clientX,
        y: clientY,
        prevX,
        prevY
      };
      
      // Add ripple effect on mouse move (only if moved significantly)
      const dx = clientX - prevX;
      const dy = clientY - prevY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 40) { // Even higher threshold to reduce ripples further
        addRipple(event.clientX, event.clientY);
      }
    };
    
    // Function to add a new ripple
    const addRipple = (x: number, y: number) => {
      // Limit the number of ripples to prevent performance issues
      if (ripplesRef.current.length > 2) return;
      
      ripplesRef.current.push({
        x,
        y,
        radius: 0,
        maxRadius: Math.min(dimensions.width, dimensions.height) * 0.08, // Smaller ripples
        opacity: 0.12, // Even more transparent
        createdAt: Date.now()
      });
    };
    
    // Animation function
    const animate = () => {
      if (!canvasRef.current) return;
      
      // Get canvas context
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      
      // Clear canvas completely each frame to prevent slowdown
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      ctx.fillStyle = 'rgba(0, 0, 0, 1)';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
      
      // Calculate center of screen
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;
      
      // Update and draw stars - space travel effect
      starsRef.current.forEach((star, index) => {
        // Move star closer (z decreases) - space travel effect
        star.z -= 5; // Slower speed for better effect
        
        // If star is too close, reset it far away
        if (star.z < 10) {
          star.z = Math.random() * 1000 + 1000; // Reset far away
          star.x = Math.random() * dimensions.width;
          star.y = Math.random() * dimensions.height;
        }
        
        // Calculate perspective
        const scale = 1000 / star.z;
        const x = (star.x - centerX) * scale + centerX;
        const y = (star.y - centerY) * scale + centerY;
        
        // Calculate size based on perspective
        const size = star.size * scale;
        
        // Only draw if star is in view and reasonably sized
        if (x > -100 && x < dimensions.width + 100 && 
            y > -100 && y < dimensions.height + 100 && 
            size < 50) { // Limit maximum size
          
          // Draw star as a circle with glow effect
          // Outer glow
          const gradient = ctx.createRadialGradient(
            x, y, 0,
            x, y, size
          );
          gradient.addColorStop(0, star.color);
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          ctx.beginPath();
          ctx.arc(x, y, size * 2, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
          
          // Inner star
          ctx.beginPath();
          ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = star.color.replace('rgba', 'rgb').replace(/,[\d\.]+\)$/, ')');
          ctx.fill();
        }
      });
      
      // Draw ripples
      
      // Update and draw ripples
      const now = Date.now();
      const ripplesToKeep: typeof ripplesRef.current = [];
      
      for (const ripple of ripplesRef.current) {
        const age = now - ripple.createdAt;
        
        // Remove old ripples
        if (age > 2000) continue;
        
        ripplesToKeep.push(ripple);
        
        // Calculate current radius and opacity based on age
        const progress = age / 2000;
        ripple.radius = ripple.maxRadius * Math.pow(progress, 0.5);
        ripple.opacity = Math.max(0, 0.2 - progress * 0.2); // Very transparent
        
        // Draw ripple
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(180, 100, 255, ${ripple.opacity * 0.6})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        
        // Draw second ring for effect
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius * 0.85, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${ripple.opacity * 0.2})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
      
      ripplesRef.current = ripplesToKeep;
      
      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [dimensions]);

  return <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black" />; // Black background for stars
};

export default ParticleBackground;
