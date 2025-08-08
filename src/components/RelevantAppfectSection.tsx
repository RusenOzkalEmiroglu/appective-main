"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Users, TrendingUp, MessageSquare, CreditCard, Layers, Settings, DollarSign, Palette, Users2, HelpCircle, ArrowRight, X
} from 'lucide-react';

const featureHotspots = [
  {
    id: 'partner-discovery',
    title: "Partner Discovery",
    icon: <Users className="w-6 h-6" />,
    color: "from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400",
    description: "Unearth countless potential partners. Automated nurture campaigns to recruit and onboard effectively.",
    details: [
      "Global Network Access",
      "Automated Recruitment Campaigns",
      "AI-Powered Partner Matching",
      "Analysis Tools"
    ]
  },
  {
    id: 'growth-analytics',
    title: "Growth Analytics",
    icon: <TrendingUp className="w-6 h-6" />,
    color: "from-sky-500 to-cyan-400 hover:from-sky-400 hover:to-cyan-300",
    description: "Track every click and conversion. Analyze data with pre-defined segments or custom reports.",
    details: [
      "Real-time Performance Dashboards",
      "Customizable Reporting Metrics",
      "Conversion Analysis",
      "A/B Testing Insights"
    ]
  },
  {
    id: 'engagement-tools',
    title: "Connect & Engage",
    icon: <MessageSquare className="w-6 h-6" />,
    color: "from-emerald-500 to-green-400 hover:from-emerald-400 hover:to-green-300",
    description: "Efficiently onboard, train, and engage with partners to drive awareness and revenue.",
    details: [
      "Integrated Communication Platform",
      "Automated Onboarding Workflows",
      "Partner Modules",
      "Performance-Based"
    ]
  },
  {
    id: 'payment-solutions',
    title: "Global Payments",
    icon: <CreditCard className="w-6 h-6" />,
    color: "from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300",
    description: "Automate partner payments with a single monthly invoice, in over 60 currencies.",
    details: [
      "Multi-Currency Payouts",
      "Automated Invoicing & Tax Compliance",
      "Flexible Commission Structures",
      "Fraud Detection & Prevention"
    ]
  }
];

const RelevantAppfectSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null); // Ref for the image container for parallax
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null); // Initialize with no active hotspot

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 100, mass: 0.8 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const rotateX_img = useTransform(springY, [-0.5, 0.5], ['-2deg', '2deg']);
  const rotateY_img = useTransform(springX, [-0.5, 0.5], ['2deg', '-2deg']);
  const translateX_img = useTransform(springX, [-0.5, 0.5], ['-8px', '8px']);
  const translateY_img = useTransform(springY, [-0.5, 0.5], ['-6px', '6px']);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!imageContainerRef.current) return;
    const { clientX, clientY } = event;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const xPct = Math.min(Math.max(((clientX - left) / width) - 0.5, -0.5), 0.5);
    const yPct = Math.min(Math.max(((clientY - top) / height) - 0.5, -0.5), 0.5);
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeaveSection = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const activeHotspotData = featureHotspots.find(h => h.id === activeHotspotId);

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };
  
  const imageItemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut", delay: 0.1 } } // Slight delay for image
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 20, stiffness: 200 } },
    exit: { opacity: 0, scale: 0.9, y: -20, transition: { duration: 0.2, ease: "easeIn" } }
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && activeHotspotId) {
        setActiveHotspotId(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [activeHotspotId]);

  return (
    <motion.section
      id="appfect-core"
      ref={sectionRef}
      onMouseMove={handleMouseMove} 
      onMouseLeave={handleMouseLeaveSection}
      className="relative py-16 md:py-24 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Content Container */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div variants={menuItemVariants} className="text-center mb-10 md:mb-14">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-[52px] font-extrabold mb-5 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-400"
          >
            Explore Appfect's Core
          </motion.h1>
          <motion.p
            className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto"
          >
            Navigate through Appfect's key features. Select a capability from the menu to see details and how it empowers your growth.
          </motion.p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-x-6 lg:gap-x-8 items-start">
          {/* Left Navigation Menu (Icon Only) */}
          <motion.div 
            className="w-full md:w-auto md:min-w-[90px] lg:min-w-[100px] flex flex-row md:flex-col justify-start gap-3 md:space-y-3 md:gap-0 md:sticky md:top-28 self-start mb-6 md:mb-0 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 no-scrollbar"
            variants={sectionVariants} 
          >
            {featureHotspots.map((hotspot, index) => (
              <motion.button
                key={hotspot.id}
                variants={menuItemVariants}
                custom={index} 
                onClick={() => setActiveHotspotId(hotspot.id)}
                className={`group flex-shrink-0 md:flex-shrink-0 w-20 h-auto md:w-full md:h-auto flex flex-col items-center justify-center p-2.5 rounded-lg transition-all duration-200 ease-in-out border-2 focus:outline-none focus:ring-2 focus:ring-purple-500/60
                  ${activeHotspotId === hotspot.id 
                    ? 'bg-purple-500/20 border-purple-500 shadow-md scale-[1.02]' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-400/30 hover:scale-[1.01]'}`}
                title={hotspot.title} 
              >
                <div className={`mb-1.5 p-2.5 rounded-md flex items-center justify-center bg-gradient-to-br ${hotspot.color.replace('hover:from', 'from').replace('hover:to', 'to')}`}>
                  {React.cloneElement(hotspot.icon, { className: "w-5 h-5 md:w-6 md:h-6 text-white" })}
                </div>
                <span 
                  className={`text-center text-[10px] md:text-xs font-medium leading-tight 
                             ${activeHotspotId === hotspot.id ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}
                >
                  {hotspot.title}
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* Right Image Display */}
          <motion.div 
            ref={imageContainerRef}
            variants={imageItemVariants} 
            style={{
              rotateX: rotateX_img,
              rotateY: rotateY_img,
              translateX: translateX_img,
              translateY: translateY_img,
              transformStyle: 'preserve-3d'
            }}
            className="w-full md:flex-1 aspect-[16/9] rounded-xl shadow-2xl border border-purple-500/20 overflow-hidden perspective-[1200px] bg-black/20 min-h-[250px] sm:min-h-[300px] md:min-h-[350px] lg:min-h-[400px]"
          >
            <Image
              src="/images/appfect/appfect_01.png"
              alt="Appfect Platform Interactive Overview"
              layout="fill"
              objectFit="cover"
              className="rounded-xl transform scale-100 opacity-90 group-hover:opacity-100 transition-opacity duration-300"
              priority
              sizes="(max-width: 768px) 100vw, (min-width: 769px) 75vw, 1000px"
            />
          </motion.div>
        </div>

        <AnimatePresence>
          {activeHotspotData && (
            <motion.div
              key="hotspot-modal"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setActiveHotspotId(null)} 
            >
              <motion.div 
                className="relative bg-gradient-to-br from-[#181033] to-[#0f0b1e] w-full max-w-xl p-6 md:p-7 rounded-xl shadow-2xl border border-purple-500/40 text-white overflow-y-auto max-h-[85vh]"
                onClick={(e) => e.stopPropagation()} 
                variants={modalVariants} 
              >
                <motion.button 
                  onClick={() => setActiveHotspotId(null)} 
                  className="absolute top-3.5 right-3.5 text-gray-500 hover:text-purple-300 transition-colors z-10 p-1 rounded-full hover:bg-white/10"
                  aria-label="Close details"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>
                
                <div className="flex items-center mb-5">
                  <div className={`p-2.5 rounded-lg mr-3.5 flex-shrink-0 bg-gradient-to-br ${activeHotspotData.color.split(' ')[0]}`}>
                    {React.cloneElement(activeHotspotData.icon, { className: "w-7 h-7 text-white" })}
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-400 to-red-400">{activeHotspotData.title}</h2>
                </div>
                
                <p className="text-gray-300/90 mb-5 text-sm md:text-base leading-relaxed">{activeHotspotData.description}</p>
                
                <h3 className="text-md md:text-lg font-semibold mb-2.5 text-purple-300">Key Capabilities:</h3>
                <ul className="space-y-1.5 mb-6">
                  {activeHotspotData.details.map((detail, i) => (
                    <motion.li 
                      key={i} 
                      className="flex items-start text-gray-300/90 text-sm"
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0, transition: { delay: 0.1 + i * 0.07 } }}
                    >
                      <ArrowRight className="w-4 h-4 mr-2.5 mt-0.5 text-pink-400 flex-shrink-0" />
                      {detail}
                    </motion.li>
                  ))}
                </ul>
                <div className="text-center mt-6">
                  <motion.button
                    onClick={() => {
                      window.open('https://www.appfect.net', '_blank', 'noopener,noreferrer');
                      setActiveHotspotId(null);
                    }} 
                    className="px-7 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-semibold rounded-lg shadow-md hover:opacity-90 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                    whileHover={{ boxShadow: "0px 0px 12px rgba(255,105,180,0.4)" }}
                  >
                    Discover Appfect
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.section>
  );
};

export default RelevantAppfectSection;
