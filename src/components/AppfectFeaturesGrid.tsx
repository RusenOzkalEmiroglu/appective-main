import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Target, DollarSign, Gauge, Image as ImageIcon, Users, Info, BarChartBig, Palette, Settings2, UsersRound, SearchCode, ShieldCheck } from 'lucide-react';
import { useMotionValue, useTransform, useSpring } from 'framer-motion';

const rawFeaturesData = [
  {
    id: 1,
    icon: <BarChartBig />,
    title: "Advanced Tracking Solutions",
    description: "Appfect supports all modern tracking solutions like S2S, pixels, and probabilistic attribution for precise measurement.",
    baseColors: { hex: '#8B5CF6', rgb: '139, 92, 246' }, // Violet
    nebulaColors: ['#a855f7', '#ec4899', '#f97316'] // Purple, Pink, Orange
  },
  {
    id: 2,
    icon: <DollarSign />,
    title: "Flexible Payout Models",
    description: "Optimize your business goals by choosing from multiple payout models tailored to your needs.",
    baseColors: { hex: '#22C55E', rgb: '34, 197, 94' }, // Green
    nebulaColors: ['#10b981', '#6ee7b7', '#a7f3d0'] // Emerald, Green-light, Green-lighter
  },
  {
    id: 3,
    icon: <Settings2 />,
    title: "Smart Budget Management",
    description: "Effortlessly control your spending. Set automated caps for desired actions and stay on budget.",
    baseColors: { hex: '#F59E0B', rgb: '245, 158, 11' }, // Amber
    nebulaColors: ['#f59e0b', '#fbbf24', '#fde68a'] // Amber, Yellow, Yellow-light
  },
  {
    id: 4,
    icon: <Palette />,
    title: "Creative Asset Hub",
    description: "Protect your brand with your creatives. Upload, manage, and analyze the performance of your assets.",
    baseColors: { hex: '#0EA5E9', rgb: '14, 165, 233' }, // Sky
    nebulaColors: ['#0ea5e9', '#38bdf8', '#7dd3fc'] // Sky, Sky-light, Sky-lighter
  },
  {
    id: 5,
    icon: <UsersRound />,
    title: "Team & Role Management",
    description: "Seamlessly add your team to Appfect, manage roles, and define granular access permissions.",
    baseColors: { hex: '#F43F5E', rgb: '244, 63, 94' }, // Rose
    nebulaColors: ['#f43f5e', '#fb7185', '#fda4af'] // Rose, Rose-light, Rose-lighter
  },
  {
    id: 6,
    icon: <SearchCode />,
    title: "In-Depth Partner Insights",
    description: "Gain valuable insights about publishers before collaborating. Review promotion channels, traffic sources, audience size, and more.",
    baseColors: { hex: '#6366F1', rgb: '99, 102, 241' }, // Indigo
    nebulaColors: ['#6366f1', '#818cf8', '#a5b4fc'] // Indigo, Indigo-light, Indigo-lighter
  },
];

const featuresData = rawFeaturesData;

const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 + 0.2, duration: 0.5, ease: "easeOut" }, // Staggered delay after title
  }),
};

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", delay: 0.4 } // Delay after cards typically start appearing
  }
};

const AppfectFeaturesGrid: React.FC = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 mb-12 md:mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          Packed with Powerful Features
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {featuresData.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}

        </div>

        <motion.div 
          className="text-center mt-12 md:mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.3 }} // Delay slightly after cards start appearing
        >
          <motion.button
            onClick={() => window.open('https://appfect.net', '_blank', 'noopener,noreferrer')}
            className="px-8 py-3.5 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white text-base font-semibold rounded-lg shadow-lg 
                       hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700 
                       hover:shadow-[0_10px_25px_-5px_rgba(236,72,153,0.4),_0_8px_10px_-6px_rgba(139,92,246,0.3)]
                       transition-all duration-300 transform hover:scale-105 
                       focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-slate-900 inline-flex items-center group"
            variants={buttonVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            Discover Appfect
            <ArrowRight className="w-5 h-5 ml-2.5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

const FeatureCard = ({ feature, index }: { feature: typeof featuresData[0], index: number }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  
  const cardStyle = {
    transformStyle: 'preserve-3d' as 'preserve-3d',
    rotateX,
    rotateY,
  };

  const glowStyle = {
    boxShadow: `0 0 30px 5px rgba(${feature.baseColors.rgb}, 0), 0 0 0px 0px rgba(${feature.baseColors.rgb}, 0)`,
  };
  const hoverGlowStyle = {
    boxShadow: `0 0 60px 10px rgba(${feature.baseColors.rgb}, 0.3), 0 0 20px 2px rgba(${feature.baseColors.rgb}, 0.2)`,
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      custom={index}
      className="relative w-full aspect-square rounded-3xl"
      style={cardStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div 
        className="absolute inset-0 rounded-3xl bg-slate-900/80 border border-slate-700/80 shadow-2xl transition-shadow duration-500 ease-out"
        style={glowStyle}
        whileHover={hoverGlowStyle}
      >
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 md:p-6 text-center">
          <motion.div 
            className="p-3 md:p-4 rounded-full mb-3 md:mb-4 transition-all duration-300 ease-out"
            style={{ background: `radial-gradient(circle, rgba(${feature.baseColors.rgb},0.3) 0%, rgba(${feature.baseColors.rgb},0.1) 60%, transparent 80%)`}}
            whileHover={{ scale: 1.15, boxShadow: `0 0 25px 5px rgba(${feature.baseColors.rgb}, 0.4)` }}
          >
            {React.cloneElement(feature.icon, { className: "w-7 h-7 md:w-8 md:h-8", style: { color: feature.baseColors.hex } })}
          </motion.div>
          
          <motion.h3 
            className="text-lg md:text-xl font-bold text-slate-50 mb-1.5 md:mb-2 tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
          >
            {feature.title}
          </motion.h3>
          <motion.p 
            className="text-xs md:text-sm text-slate-300/80 leading-relaxed px-1 md:px-2 min-h-[3.5rem] md:min-h-[4rem]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.05 }}
          >
            {feature.description}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AppfectFeaturesGrid;
