"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { mastheadData, MastheadItem, categories } from '@/data/interactiveMastheadsData';
import dynamic from 'next/dynamic';

const DynamicTypographicBackground = dynamic(
  () => import('@/components/DynamicTypographicBackground'),
  { ssr: false }
);
import MastheadPopup from '@/components/MastheadPopup';

export default function InteractiveMastheadsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
  const [selectedAdFormat, setSelectedAdFormat] = useState<string>('ALL');
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const [isAdFormatDropdownOpen, setIsAdFormatDropdownOpen] = useState(false);
  const [selectedMasthead, setSelectedMasthead] = useState<MastheadItem | null>(null);
  const [displayText, setDisplayText] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const brandDropdownRef = useRef<HTMLDivElement>(null);
  const adFormatDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  
  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close brand dropdown when clicking outside
      if (brandDropdownRef.current && !brandDropdownRef.current.contains(event.target as Node)) {
        setIsBrandDropdownOpen(false);
      }
      
      // Close ad format dropdown when clicking outside
      if (adFormatDropdownRef.current && !adFormatDropdownRef.current.contains(event.target as Node)) {
        setIsAdFormatDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogoMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDisplayText(true);
    timerRef.current = setTimeout(() => setDisplayText(false), 3000);
  };

  const handleLogoMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDisplayText(false);
  };

  const logoTextVariants = {
    hidden: { opacity: 0, rotateY: -90, transition: { duration: 0.25, ease: 'easeInOut' } },
    visible: { opacity: 1, rotateY: 0, transition: { duration: 0.35, ease: 'easeInOut', delay: 0.05 } },
    exit: { opacity: 0, rotateY: 90, transition: { duration: 0.25, ease: 'easeInOut' } },
  };

  const allBrands = useMemo(() => {
    const brands = new Set(mastheadData.map((item: MastheadItem) => item.brand));
    return ['ALL', ...Array.from(brands)];
  }, []);
  
  const allAdFormats = useMemo(() => {
    const formats = new Set(mastheadData.map((item: MastheadItem) => {
      // Clean up the size format (remove 'px' and trim)
      return item.bannerDetails.size.replace(/\s*px\s*/gi, '').trim();
    }));
    return ['ALL', ...Array.from(formats)];
  }, []);

  const brandsForSelectedCategory = useMemo(() => {
    if (selectedCategory === 'ALL') return [];
    const brands = new Set(
      mastheadData
        .filter((item: MastheadItem) => item.category.toUpperCase() === selectedCategory)
        .map((item: MastheadItem) => item.brand)
    );
    return Array.from(brands);
  }, [selectedCategory]);

  const filteredMastheads = useMemo(() => {
    let data: MastheadItem[] = mastheadData;
    
    if (selectedBrand !== 'ALL') {
      data = data.filter((item: MastheadItem) => item.brand === selectedBrand);
    }
    else if (selectedCategory !== 'ALL') {
      data = data.filter((item: MastheadItem) => item.category.toUpperCase() === selectedCategory);
    }
    
    if (selectedAdFormat !== 'ALL') {
      data = data.filter((item: MastheadItem) => {
        const cleanSize = item.bannerDetails.size.replace(/\s*px\s*/gi, '').trim();
        return cleanSize === selectedAdFormat;
      });
    }
    
    return data;
  }, [selectedCategory, selectedBrand, selectedAdFormat]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSelectedBrand('ALL');
  };

  const handleBrandClick = (brand: string) => {
    setSelectedBrand(brand);
    setSelectedCategory('ALL'); 
  };

  const handleGlobalBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    setSelectedCategory('ALL');
    setIsBrandDropdownOpen(false);
  };
  
  const handleAdFormatChange = (format: string) => {
    setSelectedAdFormat(format);
    setIsAdFormatDropdownOpen(false);
  };

  return (
    <>
      <div className="noise-bg"></div>
      <DynamicTypographicBackground />
      <div className="relative z-10 min-h-screen text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          
          <header className="flex items-center justify-between mb-12">
            <Link href="/" className="relative z-50">
              <motion.div 
                className="flex items-center justify-center logo-pulse-glow cursor-pointer"
                style={{ width: '240px', height: '64px', perspective: '1000px', transformStyle: 'preserve-3d' }}
                onMouseEnter={handleLogoMouseEnter}
                onMouseLeave={handleLogoMouseLeave}
              >
                <AnimatePresence mode="wait">
                  {!displayText ? (
                    <motion.div key="logo" variants={logoTextVariants} initial="hidden" animate="visible" exit="exit" style={{ transformStyle: 'preserve-3d' }}>
                      <Image src="/images/yatay_appective_logo.png" alt="Appective Logo" width={240} height={64} className="block" priority />
                    </motion.div>
                  ) : (
                    <motion.div key="text" variants={logoTextVariants} initial="hidden" animate="visible" exit="exit" className="flex items-center justify-center h-full w-full" style={{ transformStyle: 'preserve-3d' }}>
                      <span className="text-2xl font-library-3-am text-white whitespace-nowrap leading-none">So Effective</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
            <h1 className="text-4xl font-library-3-am menu-item-glow-spray hidden md:block">
              Rich Medias
            </h1>
          </header>

          <div className="relative z-30 mb-10">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <div className="flex space-x-3 mb-4 sm:mb-0 order-2 sm:order-1">
                <div className="relative" ref={brandDropdownRef}>
                  <button
                    onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
                    className="px-4 py-2 w-48 text-left bg-purple-900/50 rounded-lg flex justify-between items-center hover:bg-purple-800/60 transition-colors duration-300 font-library-3-am border border-purple-500/30">
                    <span>{selectedBrand === 'ALL' ? 'All Brands' : selectedBrand}</span>
                    <svg className={`w-4 h-4 transition-transform duration-300 ${isBrandDropdownOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                  <AnimatePresence>
                    {isBrandDropdownOpen && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute left-0 mt-2 w-48 bg-dark/90 backdrop-blur-lg border border-purple-500/30 rounded-lg shadow-xl z-50 overflow-hidden">
                        {allBrands.map(brand => (
                          <button key={brand} onClick={() => handleGlobalBrandChange(brand)} className="block w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-purple-700/80 transition-colors duration-300 font-library-3-am">
                            {brand}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="relative" ref={adFormatDropdownRef}>
                  <button
                    onClick={() => setIsAdFormatDropdownOpen(!isAdFormatDropdownOpen)}
                    className="px-4 py-2 w-48 text-left bg-purple-900/50 rounded-lg flex justify-between items-center hover:bg-purple-800/60 transition-colors duration-300 font-library-3-am border border-purple-500/30">
                    <span>{selectedAdFormat === 'ALL' ? 'ADS FORMAT' : selectedAdFormat}</span>
                    <svg className={`w-4 h-4 transition-transform duration-300 ${isAdFormatDropdownOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                  <AnimatePresence>
                    {isAdFormatDropdownOpen && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute left-0 mt-2 w-48 bg-dark/90 backdrop-blur-lg border border-purple-500/30 rounded-lg shadow-xl z-50 overflow-hidden">
                        {allAdFormats.map(format => (
                          <button key={format} onClick={() => handleAdFormatChange(format)} className="block w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-purple-700/80 transition-colors duration-300 font-library-3-am">
                            {format}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              
              <div className="flex flex-col items-end order-1 sm:order-2">
                <span className="text-xs font-library-3-am text-white/70 mb-1.5">Categories</span>
                <div className="flex flex-wrap justify-center gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-all duration-300 font-library-3-am ${selectedCategory === category ? 'bg-primary text-white shadow-primary/40 shadow-lg' : 'bg-indigo-900/40 hover:bg-indigo-800/50 border border-indigo-500/30'}`}>
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={selectedCategory + '-' + selectedBrand} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredMastheads.map((item: MastheadItem) => (
                <motion.div 
                  key={item.id} 
                  className="cursor-pointer bg-black/20 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 transition-all duration-300 group hover:border-primary/80 hover:shadow-2xl hover:shadow-primary/20"
                  layout 
                  whileHover={{ y: -8, scale: 1.03 }}
                  onClick={() => setSelectedMasthead(item)}
                >
                  <div className="relative w-full h-48">
                    <Image src={item.image} alt={item.brand} layout="fill" objectFit="cover" className="transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold font-library-3-am">{item.brand}</h3>
                    <p className="text-sm text-white/60 font-library-3-am uppercase tracking-wider">{item.category}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <MastheadPopup masthead={selectedMasthead} onClose={() => setSelectedMasthead(null)} />
    </>
  );
}
