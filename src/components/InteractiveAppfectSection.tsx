"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  Code, 
  Smartphone, 
  Globe, 
  Zap, 
  ArrowRight
} from 'lucide-react';

const InteractiveAppfectSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  const controls = useAnimation();
  
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isExploding, setIsExploding] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  // Hotspot data
  const hotspots = [
    {
      id: 1,
      x: 25,
      y: 30,
      title: "UI/UX Excellence",
      description: "Intuitive interface design with seamless user experience for maximum engagement and conversion.",
      icon: <Layers className="w-5 h-5" />,
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 2,
      x: 75,
      y: 35,
      title: "Advanced Analytics",
      description: "Real-time data visualization and comprehensive reporting for informed decision making.",
      icon: <Code className="w-5 h-5" />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 3,
      x: 40,
      y: 70,
      title: "Mobile Optimization",
      description: "Fully responsive design ensuring perfect performance across all devices and screen sizes.",
      icon: <Smartphone className="w-5 h-5" />,
      color: "from-green-500 to-emerald-500"
    },
    {
      id: 4,
      x: 65,
      y: 65,
      title: "Global Reach",
      description: "Multilingual support and localization features to connect with audiences worldwide.",
      icon: <Globe className="w-5 h-5" />,
      color: "from-orange-500 to-amber-500"
    },
    {
      id: 5,
      x: 50,
      y: 20,
      title: "Lightning Performance",
      description: "Optimized for speed with next-generation technology ensuring fast load times and smooth interactions.",
      icon: <Zap className="w-5 h-5" />,
      color: "from-pink-500 to-red-500"
    }
  ];

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
      
      // Start particle effect after a delay
      const timer = setTimeout(() => {
        setShowParticles(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isInView, controls]);

  // Handle zoom in/out
  const handleZoomIn = () => {
    if (zoomLevel < 1.5) {
      setZoomLevel(prev => prev + 0.1);
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 0.8) {
      setZoomLevel(prev => prev - 0.1);
    }
  };

  // Handle rotation
  const handleRotate = () => {
    setRotation(prev => prev + 15);
  };

  // Handle explosion effect
  const triggerExplosion = () => {
    setIsExploding(true);
    setTimeout(() => setIsExploding(false), 1000);
  };

  // Reset all effects
  const resetEffects = () => {
    setZoomLevel(1);
    setRotation(0);
    setActiveHotspot(null);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }
    }
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.43, 0.13, 0.23, 0.96],
        delay: 0.4
      }
    }
  };

  const hotspotVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.6 + (i * 0.1),
        duration: 0.5,
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    })
  };

  const pulseAnimation = {
    scale: [1, 1.1, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "loop" as const
    }
  };

  // Generate random particles for the explosion effect
  const generateParticles = () => {
    return Array.from({ length: 30 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 100 + 50;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const size = Math.random() * 10 + 5;
      const duration = Math.random() * 1 + 0.5;
      const delay = Math.random() * 0.2;
      
      return (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-purple-500 to-pink-500"
          style={{
            width: size,
            height: size,
            x: 0,
            y: 0,
            opacity: 1
          }}
          animate={{
            x,
            y,
            opacity: 0,
            scale: 0
          }}
          transition={{
            duration,
            delay,
            ease: "easeOut"
          }}
        />
      );
    });
  };

  return (
    <motion.section
      id="interactive-appfect"
      ref={sectionRef}
      className="relative py-20 md:py-32 bg-gradient-to-b from-[#0A0B20] via-[#10122B] to-[#0A0B20] text-white overflow-hidden"
      initial="hidden"
      animate={controls}
      variants={containerVariants}
    >
      {/* Background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/images/grid.png')] bg-repeat"></div>
      </div>
      <div className="absolute top-1/4 left-0 w-72 h-72 md:w-96 md:h-96 bg-purple-600/20 rounded-full filter blur-3xl animate-pulse-slow opacity-40 md:opacity-50"></div>
      <div className="absolute bottom-1/4 right-0 w-64 h-64 md:w-80 md:h-80 bg-pink-500/20 rounded-full filter blur-3xl animate-pulse-slow animation-delay-2000 opacity-40 md:opacity-50"></div>
      
      {/* Floating particles */}
      {showParticles && (
        <>
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 md:w-2 md:h-2 rounded-full bg-purple-500/50"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </>
      )}

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center mb-12 md:mb-16">
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-400"
          >
            Experience Appfect
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Explore our interactive platform visualization and discover the powerful features that drive your success
          </motion.p>
        </motion.div>

        {/* Interactive Image Section */}
        <motion.div 
          variants={itemVariants}
          className="relative mb-16 md:mb-24 bg-[#161A38]/70 backdrop-blur-xl rounded-2xl shadow-2xl p-4 sm:p-8 md:p-10 border border-purple-500/30 overflow-hidden"
        >
          {/* Control Panel */}
          <div className="flex justify-center mb-6 space-x-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleZoomIn}
              className="p-2 bg-purple-600/30 hover:bg-purple-600/50 rounded-full transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleZoomOut}
              className="p-2 bg-purple-600/30 hover:bg-purple-600/50 rounded-full transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRotate}
              className="p-2 bg-purple-600/30 hover:bg-purple-600/50 rounded-full transition-colors"
              title="Rotate"
            >
              <RotateCcw className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={triggerExplosion}
              className="p-2 bg-pink-600/30 hover:bg-pink-600/50 rounded-full transition-colors"
              title="Special Effect"
            >
              <Sparkles className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetEffects}
              className="p-2 bg-gray-600/30 hover:bg-gray-600/50 rounded-full transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Interactive Image Container */}
          <div className="relative flex justify-center items-center min-h-[400px] md:min-h-[500px] overflow-hidden" ref={imageRef}>
            <motion.div
              variants={imageVariants}
              style={{ 
                scale: zoomLevel,
                rotate: rotation,
              }}
              className="relative w-full max-w-4xl"
            >
              <Image
                src="/images/appfect/appfect_01.png"
                alt="Appfect Platform Visualization"
                width={3406}
                height={1764}
                className="w-full h-auto rounded-lg shadow-lg"
                priority
              />
              
              {/* Hotspots */}
              {hotspots.map((hotspot, index) => (
                <motion.div
                  key={hotspot.id}
                  custom={index}
                  variants={hotspotVariants}
                  animate={activeHotspot === hotspot.id ? "active" : "visible"}
                  whileHover={{ scale: 1.2 }}
                  className="absolute cursor-pointer"
                  style={{ 
                    left: `${hotspot.x}%`, 
                    top: `${hotspot.y}%`,
                    zIndex: activeHotspot === hotspot.id ? 20 : 10
                  }}
                  onClick={() => setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id)}
                >
                  <motion.div 
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-gradient-to-r ${hotspot.color}`}
                    animate={activeHotspot !== hotspot.id ? pulseAnimation : {}}
                  >
                    {hotspot.icon}
                  </motion.div>
                  
                  {/* Hotspot info popup */}
                  <AnimatePresence>
                    {activeHotspot === hotspot.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-20 bg-black/80 backdrop-blur-md border border-purple-500/50 rounded-lg p-4 shadow-xl w-64 md:w-72"
                        style={{ 
                          bottom: hotspot.y > 50 ? "calc(100% + 10px)" : "auto",
                          top: hotspot.y <= 50 ? "calc(100% + 10px)" : "auto",
                          left: hotspot.x > 70 ? "auto" : hotspot.x < 30 ? "0" : "50%",
                          right: hotspot.x > 70 ? "0" : "auto",
                          transform: hotspot.x > 30 && hotspot.x < 70 ? "translateX(-50%)" : "none"
                        }}
                      >
                        <h4 className="text-base md:text-lg font-semibold mb-2 text-white">{hotspot.title}</h4>
                        <p className="text-sm text-gray-300 mb-3">{hotspot.description}</p>
                        <div className="flex justify-end">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="text-xs md:text-sm text-purple-300 flex items-center"
                          >
                            Learn more <ArrowRight className="ml-1 w-3 h-3 md:w-4 md:h-4" />
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
              
              {/* Explosion effect */}
              {isExploding && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {generateParticles()}
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div variants={itemVariants} className="text-center pt-8">
          <motion.p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Ready to transform your digital experience with our cutting-edge platform?
          </motion.p>
          <motion.button
            className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white px-8 py-3 sm:px-10 sm:py-4 md:px-12 md:py-5 rounded-full text-base sm:text-lg md:text-xl font-bold shadow-2xl hover:shadow-red-500/40 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-500/50"
            whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 300 } }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Journey Today
            <ChevronRight className="inline w-5 h-5 sm:w-6 sm:h-6 ml-1.5 sm:ml-2" />
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default InteractiveAppfectSection;
