"use client";

import React, { useRef, useEffect, useState } from 'react'; // Added React import
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Users, TrendingUp, Target, Zap, Globe, BarChartBig, CreditCard, Settings,
  Filter, Search, ChevronDown, ChevronRight, Smile, MessageSquare, FileText,
  Gift, Volume2, CalendarCheck, ShieldCheck, DollarSign, Layers, Palette, Users2, HelpCircle,
  ChevronLeft, Quote
} from 'lucide-react';

// Helper for animated numbers
const AnimatedNumber = ({ value, duration = 2 }: { value: number, duration?: number }) => {
  const [count, setCount] = useState(0);
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        transition: { duration: 0.5 }
      });
      let start = 0;
      const end = value;
      if (start === end) {
        setCount(end); // Ensure final value is set if start === end
        return;
      }

      const range = end - start;
      let current = start;
      const increment = end > start ? 1 : -1;
      // Adjust stepTime for smoother animation based on range and duration
      const stepTime = Math.max(10, Math.abs(Math.floor(duration * 1000 / (range === 0 ? 1 : range)))); 

      const timer = setInterval(() => {
        // More controlled increment
        let step = Math.ceil(Math.abs(range) / (duration * 1000 / 50)); 
        if (step === 0) step = 1; // Ensure step is at least 1
        current += increment * step;

        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
          current = end;
          clearInterval(timer);
        }
        setCount(current);
      }, 50); // Update every 50ms for smoother visual

      return () => clearInterval(timer); // Cleanup timer
    }
  }, [isInView, value, duration, controls]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
};


const AppfectSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  const carouselRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<'discovery' | 'reporting'>('discovery');
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const tabContentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeInOut" } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3, ease: "easeInOut" } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };
  
  const textVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: 0.1 } }
  };

  const features = [
    {
      icon: <Users className="w-8 h-8 text-purple-400" />,
      title: "Nurture Partner Relationships",
      description: "Unearth countless potential partners and effortlessly recruit them using automated nurture campaigns.",
      details: ["Global Network Access", "Automated Recruitment", "Relationship Management"]
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-pink-400" />,
      title: "Track and Amplify Growth",
      description: "Accurately track every click and conversion. Analyze data with pre-defined segments or custom reports.",
      details: ["Detailed Conversion Tracking", "Custom Reporting", "Raw Data Export"]
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-sky-400" />,
      title: "Connect & Engage Effectively",
      description: "Efficiently onboard, train, and engage with partners to drive awareness and revenue.",
      details: ["Smart Ticket System", "Automated Replies", "Contract Approvals", "Announcements"]
    },
    {
      icon: <CreditCard className="w-8 h-8 text-green-400" />,
      title: "Streamline Global Payments",
      description: "Automate partner payments with a single monthly invoice, in over 60 currencies across 214 countries.",
      details: ["Invoice Automation", "Commission Tiers", "Progressive Payouts", "Multi-Currency Support"]
    }
  ];

  const platformCapabilities = [
    { icon: <Layers className="w-7 h-7" />, name: "All Tracking Solutions", description: "S2S, pixels, probabilistic attribution." },
    { icon: <DollarSign className="w-7 h-7" />, name: "Multiple Payout Models", description: "Maximize your business goals." },
    { icon: <Settings className="w-7 h-7" />, name: "Budget Management", description: "Automated budget caps." },
    { icon: <Palette className="w-7 h-7" />, name: "Creatives Management", description: "Protect brand, optimize assets." },
    { icon: <Users2 className="w-7 h-7" />, name: "User & Role Management", description: "Team collaboration with defined access." },
    { icon: <HelpCircle className="w-7 h-7" />, name: "Detailed Partner Insights", description: "Informed collaboration decisions." },
  ];
  
  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Michael Johnson",
      title: "Marketing Director",
      company: "Global Media Inc.",
      image: "/images/testimonials/person1.jpg",
      quote: "Appfect has transformed how we manage our marketing campaigns. The intuitive interface and powerful analytics have increased our conversion rates by 45% in just three months."
    },
    {
      id: 2,
      name: "Emily Wilson",
      title: "Digital Strategy Lead",
      company: "TechVision",
      image: "/images/testimonials/person2.jpg",
      quote: "The partner discovery feature is a game-changer. We've found high-quality affiliates that we would have never discovered otherwise. Our network has grown by 300% since using Appfect."
    },
    {
      id: 3,
      name: "David Thompson",
      title: "CEO",
      company: "AdTech Solutions",
      image: "/images/testimonials/person3.jpg",
      quote: "As someone who manages multiple marketing channels, Appfect's unified dashboard saves me hours every week. The real-time data and automation capabilities are unmatched in the industry."
    },
    {
      id: 4,
      name: "Sarah Miller",
      title: "Growth Marketing Manager",
      company: "E-Commerce Leaders",
      image: "/images/testimonials/person4.jpg",
      quote: "The payment processing system is flawless. Managing international partners used to be a nightmare, but now it's fully automated and error-free. Our finance team loves it!"
    },
    {
      id: 5,
      name: "James Anderson",
      title: "Head of Partnerships",
      company: "Mobile Gaming Co.",
      image: "/images/testimonials/person5.jpg",
      quote: "Appfect's reporting capabilities are exceptional. We can slice and dice data in ways we never could before, revealing insights that have directly contributed to our 60% revenue increase."
    },
    {
      id: 6,
      name: "Jessica Roberts",
      title: "Performance Marketing Lead",
      company: "Travel Bookings Platform",
      image: "/images/testimonials/person6.jpg",
      quote: "The onboarding process was incredibly smooth. Within a week, our entire team was proficient with the platform. The support team was responsive and helpful throughout the process."
    },
    {
      id: 7,
      name: "Robert Davis",
      title: "Affiliate Manager",
      company: "Financial Services Group",
      image: "/images/testimonials/person7.jpg",
      quote: "We've tried several platforms before, but Appfect stands out for its reliability and comprehensive feature set. It's become an essential part of our marketing infrastructure."
    },
    {
      id: 8,
      name: "Jennifer White",
      title: "CMO",
      company: "Retail Chain",
      image: "/images/testimonials/person8.jpg",
      quote: "The ability to segment partners and customize commission structures has allowed us to optimize our spending and maximize ROI. Appfect pays for itself many times over."
    },
    {
      id: 9,
      name: "Thomas Brown",
      title: "Digital Acquisition Director",
      company: "Insurance Tech",
      image: "/images/testimonials/person9.jpg",
      quote: "Appfect's fraud detection capabilities have saved us thousands of dollars. The platform automatically flags suspicious activities, allowing us to focus on genuine growth opportunities."
    },
    {
      id: 10,
      name: "Elizabeth Clark",
      title: "Partner Success Manager",
      company: "SaaS Platform",
      image: "/images/testimonials/person10.jpg",
      quote: "The communication tools within Appfect have streamlined our partner relationships. Announcements, newsletters, and performance updates are all managed from one central location."
    }
  ];

  return (
    <motion.section
      id="appfect-reimagined"
      ref={sectionRef}
      className="relative py-20 md:py-32 bg-gradient-to-b from-[#0A0B20] via-[#10122B] to-[#0A0B20] text-white overflow-hidden"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
    >
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/images/grid.png')] bg-repeat"></div>
      </div>
      <div className="absolute top-1/4 left-0 w-72 h-72 md:w-96 md:h-96 bg-purple-600/20 rounded-full filter blur-3xl animate-pulse-slow opacity-40 md:opacity-50"></div>
      <div className="absolute bottom-1/4 right-0 w-64 h-64 md:w-80 md:h-80 bg-pink-500/20 rounded-full filter blur-3xl animate-pulse-slow animation-delay-2000 opacity-40 md:opacity-50"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div variants={textVariant} className="text-center mb-16 md:mb-24">
          <motion.div
            className="inline-block mb-6"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.1, type: "spring", stiffness: 150 }}
          >
            <Image
              src="/images/appfect/appfect_icon.webp"
              alt="Appfect Logo"
              width={100}
              height={100}
              className="mx-auto filter drop-shadow-[0_0_15px_rgba(168,85,247,0.7)]"
              priority
            />
          </motion.div>
          <motion.h1
            variants={textVariant}
            className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-4 md:mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-400"
          >
            Explore Appfect's Core
          </motion.h1>
          <motion.p
            variants={textVariant}
            className="text-sm sm:text-base md:text-xl text-gray-300 max-w-3xl mx-auto px-2"
          >
            Appfect's key features. Select a capability from the menu to see how it empowers your growth.
          </motion.p>
        </motion.div>

        <motion.div 
          variants={cardVariants} custom={0}
          className="mb-20 md:mb-32 bg-[#161A38]/70 backdrop-blur-xl rounded-2xl shadow-2xl p-4 sm:p-6 md:p-10 border border-purple-500/30"
        >
          <div className="flex flex-col sm:flex-row border-b border-purple-500/50 mb-6">
            <button
              onClick={() => setActiveTab('discovery')}
              className={`w-full sm:w-auto px-4 sm:px-6 py-3 text-sm md:text-base font-medium transition-colors duration-300 relative ${activeTab === 'discovery' ? 'text-pink-400' : 'text-gray-400 hover:text-white'}`}
            >
              Partner Discovery
              {activeTab === 'discovery' && <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-400"/>}
            </button>
            <button
              onClick={() => setActiveTab('reporting')}
              className={`w-full sm:w-auto px-4 sm:px-6 py-3 text-sm md:text-base font-medium transition-colors duration-300 relative ${activeTab === 'reporting' ? 'text-pink-400' : 'text-gray-400 hover:text-white'}`}
            >
              Growth Analytics
              {activeTab === 'reporting' && <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-400"/>}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'discovery' && (
              <motion.div key="discovery" variants={tabContentVariants} initial="hidden" animate="visible" exit="exit" className="grid md:grid-cols-12 gap-6 min-h-[380px] sm:min-h-[420px]">
                <div className="md:col-span-4 bg-black/20 p-3 sm:p-4 rounded-lg">
                  <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-purple-300">Browse Publishers</h4>
                  {['Countries', 'Traffic Sources', 'Verticals', 'Audience Size', 'OS', 'Labels'].map(filter => (
                    <div key={filter} className="flex justify-between items-center py-2 px-2.5 sm:py-2.5 sm:px-3 mb-1.5 sm:mb-2 bg-white/5 rounded-md hover:bg-white/10 transition-colors cursor-pointer">
                      <span className="text-xs sm:text-sm text-gray-300">{filter}</span>
                      <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                    </div>
                  ))}
                  <button className="w-full mt-2 sm:mt-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 sm:py-2.5 rounded-md text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity">
                    Apply Filters
                  </button>
                </div>
                <div className="md:col-span-8 bg-black/20 p-3 sm:p-4 rounded-lg">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4">
                    <h4 className="text-base sm:text-lg font-semibold text-purple-300 mb-2 sm:mb-0">Available Publishers (<AnimatedNumber value={1258} />)</h4>
                    <div className="relative w-full sm:w-auto">
                      <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                      <input type="text" placeholder="Search..." className="w-full bg-white/5 pl-8 sm:pl-10 pr-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm focus:ring-1 focus:ring-pink-500 outline-none transition-all" />
                    </div>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                  {[ /* Mock Publisher List */
                    { name: 'GlobalTrafficNet', available: true, tags: ['Coupons', 'macOS', 'USA', 'GB'] },
                    { name: 'PeakConverters', available: true, tags: ['Facebook', 'iOS', 'DE'] },
                    { name: 'DirectLeads Co.', available: false, tags: ['Instagram', 'Android', 'All'] },
                    { name: 'ViralReach Now', available: true, tags: ['Blog', 'Telegram', 'IT', 'FR'] },
                  ].map((pub, idx) => (
                    <motion.div 
                      key={idx} 
                      className="flex items-center justify-between p-2 sm:p-3 bg-white/5 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0, transition: { delay: idx * 0.05 } }} // Faster stagger for list items
                    >
                      <div className="flex items-center min-w-0">
                        <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full mr-2 sm:mr-3 flex-shrink-0 ${pub.available ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <span className="text-xs sm:text-sm font-medium text-gray-200 truncate" title={pub.name}>{pub.name}</span>
                      </div>
                      <div className="hidden sm:flex items-center space-x-1 sm:space-x-1.5 flex-shrink-0 ml-2">
                        {pub.tags.slice(0,2).map(tag => <span key={tag} className="text-[10px] sm:text-xs bg-purple-500/30 text-purple-300 px-1 sm:px-1.5 py-0.5 rounded-sm whitespace-nowrap">{tag}</span>)}
                        {pub.tags.length > 2 && <span className="text-[10px] sm:text-xs text-gray-400">+{pub.tags.length - 2} more</span>}
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0 ml-2" />
                    </motion.div>
                  ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'reporting' && (
              <motion.div key="reporting" variants={tabContentVariants} initial="hidden" animate="visible" exit="exit" className="grid md:grid-cols-12 gap-6 min-h-[380px] sm:min-h-[420px]">
                {/* Report Config Column */}
                <div className="md:col-span-4 bg-black/20 p-3 sm:p-4 rounded-lg">
                  <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-purple-300">Report Settings</h4>
                  {['Affiliate', 'Period', 'Group By', 'Attributes', 'Metrics'].map(setting => (
                     <div key={setting} className="flex justify-between items-center py-2 px-2.5 sm:py-2.5 sm:px-3 mb-1.5 sm:mb-2 bg-white/5 rounded-md hover:bg-white/10 transition-colors cursor-pointer">
                      <span className="text-xs sm:text-sm text-gray-300">{setting}</span>
                      <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                    </div>
                  ))}
                   <button className="w-full mt-2 sm:mt-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 sm:py-2.5 rounded-md text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity">
                    Generate Report
                  </button>
                </div>
                 {/* Report Data Column */} 
                <div className="md:col-span-8 bg-black/20 p-3 sm:p-4 rounded-lg overflow-x-auto">
                  <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-purple-300">July, 2024 Performance</h4>
                  <div className="min-w-[450px]">
                    <table className="w-full text-xs sm:text-sm text-left">
                      <thead className="text-[11px] sm:text-xs text-gray-400 uppercase bg-white/5">
                        <tr>
                          <th scope="col" className="px-3 sm:px-4 py-1.5 sm:py-2">Publisher</th>
                          <th scope="col" className="px-3 sm:px-4 py-1.5 sm:py-2">CR</th>
                          <th scope="col" className="px-3 sm:px-4 py-1.5 sm:py-2">Clicks</th>
                          <th scope="col" className="px-3 sm:px-4 py-1.5 sm:py-2">Revenue</th>
                        </tr>
                      </thead> 
                      <tbody>
                        {[ /* Mock Report Data */
                          { name: 'Pub Example A', cr: '0.12%', clicks: '241,799', revenue: '$24,691' },
                          { name: 'Pub Example B', cr: '0.25%', clicks: '287,010', revenue: '$50,042' },
                          { name: 'Pub Example C', cr: '0.18%', clicks: '199,980', revenue: '$33,100' },
                          { name: 'Pub Example D', cr: '0.31%', clicks: '301,500', revenue: '$63,306' },
                        ].map((row, idx) => (
                          <motion.tr 
                            key={idx} 
                            className="border-b border-white/10 hover:bg-white/5 transition-colors"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { delay: idx * 0.05 } }} // Faster stagger
                          >
                            <td className="px-3 sm:px-4 py-1.5 sm:py-2 font-medium text-gray-200 whitespace-nowrap">{row.name}</td>
                            <td className="px-3 sm:px-4 py-1.5 sm:py-2 text-green-400 whitespace-nowrap">{row.cr} <TrendingUp className="inline w-3 h-3 ml-0.5" /></td>
                            <td className="px-3 sm:px-4 py-1.5 sm:py-2 text-gray-300 whitespace-nowrap">{row.clicks}</td>
                            <td className="px-3 sm:px-4 py-1.5 sm:py-2 text-sky-400 whitespace-nowrap">{row.revenue}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Features Section */}
        <motion.div className="mb-20 md:mb-32">
          <motion.h2 variants={textVariant} className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16">
            Everything You Need to <span className="text-pink-400">Succeed</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                custom={index + 1} // Stagger after dashboard
                variants={cardVariants}
                className="bg-white/5 backdrop-blur-md rounded-xl p-6 md:p-8 shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-1.5 border border-transparent hover:border-purple-500/50"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 p-3 bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-300 mb-3 text-sm md:text-base leading-relaxed">{feature.description}</p>
                    <ul className="space-y-1.5">
                      {feature.details.map(detail => (
                        <li key={detail} className="flex items-center text-xs md:text-sm text-gray-400">
                          <ShieldCheck className="w-3.5 h-3.5 mr-2 text-green-400 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonial Carousel Section */}
        <motion.div 
          variants={cardVariants} custom={features.length + 1}
          className="mb-16 md:mb-24 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10 p-6 md:p-8 rounded-2xl shadow-xl border border-purple-500/20 overflow-hidden"
        >
          
          <div className="relative" ref={carouselRef}>
            {/* Navigation Controls - Positioned outside content area */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 z-10 flex justify-between w-full pointer-events-none">
              <button 
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true);
                    setActiveTestimonial(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
                    setTimeout(() => setIsAnimating(false), 500);
                  }
                }}
                className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm border border-white/10 shadow-lg pointer-events-auto transition-all duration-300 hover:scale-110 -ml-3 sm:ml-0"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button 
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true);
                    setActiveTestimonial(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
                    setTimeout(() => setIsAnimating(false), 500);
                  }
                }}
                className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm border border-white/10 shadow-lg pointer-events-auto transition-all duration-300 hover:scale-110 -mr-3 sm:mr-0"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            
            {/* Testimonials - More compact with horizontal padding */}
            <div className="overflow-hidden px-6 sm:px-8">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="flex flex-col md:flex-row items-center md:items-center gap-4 md:gap-6 py-2 max-w-4xl mx-auto"
                >
                  {/* Profile Image - Further reduced size */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-purple-500/30 shadow-lg mb-3">
                      <div className="w-full h-full bg-gradient-to-br from-purple-600/80 to-pink-600/80 flex items-center justify-center text-white">
                        {/* Fallback if image doesn't load */}
                        <Users2 className="w-8 h-8 opacity-50" />
                        <Image 
                          src={testimonials[activeTestimonial].image} 
                          alt={testimonials[activeTestimonial].name}
                          width={96} 
                          height={96} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Hide the broken image
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <h4 className="text-base font-semibold text-white">{testimonials[activeTestimonial].name}</h4>
                      <div className="flex items-center space-x-1">
                        <p className="text-xs text-purple-300">{testimonials[activeTestimonial].title}</p>
                        <span className="mx-1 text-gray-500">•</span>
                        <p className="text-xs text-gray-400">{testimonials[activeTestimonial].company}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quote - More compact with quotes at top-left and bottom-right */}
                  <div className="flex-1 relative flex items-center">
                    <div className="relative w-full">
                      <Quote className="w-6 h-6 text-purple-500/40 absolute -top-3 -left-2" />
                      <blockquote className="text-gray-300 text-sm md:text-base italic leading-relaxed pt-4 pb-6 px-2 md:px-4">
                        {testimonials[activeTestimonial].quote}
                      </blockquote>
                      <Quote className="w-6 h-6 text-purple-500/40 absolute -bottom-1 right-0 rotate-180" />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Platform Capabilities */}
         <motion.div className="mb-16 md:mb-24">
          <motion.h2 variants={textVariant} className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16">
            Loaded with <span className="text-purple-400">Powerful</span> Capabilities
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {platformCapabilities.map((cap, index) => (
              <motion.div
                key={index}
                custom={features.length + 2 + index} // Stagger after testimonial
                variants={cardVariants}
                className="group bg-white/5 p-5 sm:p-6 rounded-xl hover:bg-purple-600/10 transition-all duration-300 border border-transparent hover:border-purple-500/30 transform hover:scale-[1.03]"
              >
                <div className="flex items-center space-x-3 sm:space-x-4 mb-3">
                  <div className="p-2 sm:p-2.5 bg-white/10 rounded-lg group-hover:bg-pink-500/20 transition-colors">
                    {React.cloneElement(cap.icon, { className: "w-5 h-5 sm:w-6 sm:h-6 text-purple-300 group-hover:text-pink-300 transition-colors" })}
                  </div>
                  <h4 className="text-sm sm:text-md font-semibold text-gray-100 group-hover:text-white transition-colors">{cap.name}</h4>
                </div>
                <p className="text-xs sm:text-sm text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">{cap.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>


        {/* Call to Action */}
        <motion.div variants={textVariant} className="text-center pt-8">
          <motion.button
            className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white px-8 py-3 sm:px-10 sm:py-4 md:px-12 md:py-5 rounded-full text-base sm:text-lg md:text-xl font-bold shadow-2xl hover:shadow-red-500/40 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-500/50"
            whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 300 } }}
            whileTap={{ scale: 0.95 }}
          >
            Discover Appfect's Power
            <ChevronRight className="inline w-5 h-5 sm:w-6 sm:h-6 ml-1.5 sm:ml-2" />
          </motion.button>
        </motion.div>

      </div>
    </motion.section>
  );
};

export default AppfectSection;
