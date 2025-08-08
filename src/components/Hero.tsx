"use client";

import { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import SegmentedPartnerLogos from './SegmentedPartnerLogos';
import { TrendingUp, Target, Award, Users, Briefcase, ArrowRight, Rocket, BarChartBig, Brain, Smile } from 'lucide-react'; // Updated icons

// Helper component for animated stats
const AnimatedStat = ({ value, label, icon: Icon, controls, iconColor = "text-purple-400" }: {
  value: number;
  label: string;
  icon: React.ElementType;
  controls: any;
  iconColor?: string;
}) => {
  const [count, setCount] = useState(0);
  const statRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          controls.start({
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, delay: 0.2 }
          });
          let start = 0;
          const end = value;
          if (start === end) return;

          const duration = 2000; // 2 seconds
          const incrementTime = (duration / end) / (end / (end - start));

          const timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start === end) clearInterval(timer);
          }, incrementTime > 0 ? incrementTime : 1);
          observer.disconnect();
        }
      },
      { threshold: 0.5 } // Trigger when 50% visible
    );

    if (statRef.current) {
      observer.observe(statRef.current);
    }

    return () => {
      if (statRef.current) observer.unobserve(statRef.current);
    };
  }, [value, controls]);

  return (
    <motion.div 
      ref={statRef}
      className="group relative text-center p-3 md:p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden transition-all duration-300 aspect-square flex flex-col justify-center items-center"
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      whileHover={{
        scale: 1.05,
        rotateX: 5,
        rotateY: -5,
        boxShadow: "0px 12px 28px rgba(167, 139, 250, 0.25), 0px 2px 8px rgba(0,0,0,0.1)",
        transition: { type: "spring", stiffness: 280, damping: 18 }
      }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="absolute inset-0 top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-700 ease-in-out group-hover:left-[100%] z-10" />
      <Icon className={`w-8 h-8 md:w-12 md:h-12 ${iconColor} mx-auto mb-2 md:mb-3 transition-colors duration-300 group-hover:text-purple-300`} />
      <div className="text-2xl md:text-4xl font-bold text-white z-20">{count}+</div>
      <p className="text-xs md:text-base text-purple-200 mt-1 z-20">{label}</p>
    </motion.div>
  );
};

const Hero = () => {
  const controls = useAnimation();
  const heroRef = useRef<HTMLDivElement>(null);

  const stats = [
    { value: 500, label: 'Campaigns Launched', icon: Rocket, iconColor: 'text-pink-400' },
    { value: 250, label: 'Client Growth %', icon: BarChartBig, iconColor: 'text-sky-400' },
    { value: 10, label: 'Years of Expertise', icon: Brain, iconColor: 'text-green-400' },
    { value: 100, label: 'Satisfied Clients', icon: Smile, iconColor: 'text-yellow-400' },
  ];

  // Smooth scroll to section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Add a small delay to ensure DOM is fully rendered
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <section 
      ref={heroRef} 
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16 pb-12 md:pt-24 md:pb-20"
    >

      <div className="container mx-auto px-4 md:px-6 z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 md:mb-6 tracking-tight leading-tight">
            THE DIGITAL <span className="text-blue-400">PERFORMANCE</span> POWERHOUSE
          </h1>
          <p className="text-base md:text-xl text-blue-100 max-w-3xl mx-auto mb-6 md:mb-10 px-2">
            Appective drives unparalleled results through data-driven strategies, innovative technology, and a relentless focus on your success. We transform your digital presence into a high-performing asset.
          </p>
        </motion.div>

        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-10 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <motion.button
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white px-6 py-3 md:px-10 md:py-4 rounded-full text-base md:text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-pink-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-pink-500 flex items-center justify-center group"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('contact')} // Assuming a contact section exists
          >
            Start Your Campaign 
            <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
          <motion.button
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white px-6 py-3 md:px-10 md:py-4 rounded-full text-base md:text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-pink-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-pink-500 flex items-center justify-center group"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('work')} // Assuming a work section exists
          >
            View Our Work
            <Briefcase className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:rotate-[5deg]" />
          </motion.button>
        </motion.div>

        {/* Animated Stats Section */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-4xl mx-auto mb-10 md:mb-20 px-2">
          {stats.map((stat, index) => (
            <AnimatedStat 
              key={index} 
              value={stat.value} 
              label={stat.label} 
              icon={stat.icon} 
              iconColor={stat.iconColor}
              controls={useAnimation()} // Each stat gets its own animation controls
            />
          ))}
        </div>

        {/* Partner Logos Section */}
        <motion.div 
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
        >
          <SegmentedPartnerLogos />
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
