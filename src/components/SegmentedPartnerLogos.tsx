// src/components/SegmentedPartnerLogos.tsx
"use client";

import React from 'react'; // Import React for JSX

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { PartnerCategory, LogoInfo as ApiLogoInfo } from '@/lib/partnersDataUtils'; // Assuming types are exported

// We'll handle the animation manually without staggerChildren
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

// Animation for individual logos with custom delay based on index
const itemVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      delay: 0.15 + (index * 0.1), // Custom delay based on absolute index
      ease: [0.16, 1, 0.3, 1]
    }
  })
};

interface ConditionalLinkWrapperProps {
  url?: string;
  children: React.ReactNode;
}

const ConditionalLinkWrapper: React.FC<ConditionalLinkWrapperProps> = ({ url, children }) => {
  if (url) {
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="block w-full h-full no-underline text-current focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-2xl"
      >
        {children}
      </a>
    );
  }
  return <>{children}</>;
};

const SegmentedPartnerLogos = () => {
  const [categoriesData, setCategoriesData] = useState<PartnerCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/partners');
        if (!response.ok) {
          throw new Error(`Failed to fetch partners: ${response.statusText}`);
        }
        const data: PartnerCategory[] = await response.json();
        setCategoriesData(data);
        // Set the first available category as the default selected category
        const firstCatWithLogos = data.find(cat => cat.logos.length > 0 && cat.id !== 'interactive_masthead');
        if (firstCatWithLogos) {
          setSelectedCategory(firstCatWithLogos.id);
        } else if (data.length > 0) {
          // Find first category with logos or fallback to first category
          const categoryWithLogos = data.find(cat => cat.logos.length > 0);
          setSelectedCategory(categoryWithLogos ? categoryWithLogos.id : data[0].id);
        }
      } catch (err: any) {
        console.error("Error fetching partners:", err);
        setError(err.message || 'An unknown error occurred');
      }
      setIsLoading(false);
    };

    fetchPartners();
  }, []);

  const currentCategory = categoriesData.find(cat => cat.id === selectedCategory);
  const displayedLogos = currentCategory?.logos.map(logo => ({ 
    ...logo, 
    // imagePath from API is already correct, e.g., /images/is_ortaklari/category/logo.svg
    // src for Image component should be this imagePath directly
  })) || [];

  // Exclude 'interactive_masthead' from filter buttons, and categories with no logos
  const filterButtonsData = categoriesData.filter(cat => cat.logos.length > 0 && cat.id !== 'interactive_masthead');

  if (isLoading) {
    return (
      <div className="py-12 md:py-20 text-center text-white">
        <p>Loading partners...</p>
        {/* You can add a spinner here */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 md:py-20 text-center text-red-500">
        <p>Error loading partners: {error}</p>
      </div>
    );
  }

  if (categoriesData.length === 0) {
    return (
      <div className="py-12 md:py-20 text-center text-white">
        <p>No partners to display.</p>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-20 bg-gradient-to-br from-gray-900/[.15] via-purple-900/[.15] to-black/[.15] text-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-10 md:mb-16 tracking-tight">
          Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400">Partners</span>
        </motion.h2>

        <div className="flex flex-nowrap overflow-x-auto justify-start md:justify-center items-end gap-2 md:gap-4 mb-6 md:mb-12 py-2 px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {filterButtonsData.map((categoryButton) => (
            <motion.button
              key={categoryButton.id}
              onClick={() => setSelectedCategory(categoryButton.id)}
              initial={{ opacity: 0.8, y: 5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, /* scale removed to prevent blinking */ transition: { type: "spring", stiffness: 400, damping: 15 } }}
              className={`px-4 py-2 md:px-5 md:py-2.5 text-xs sm:text-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-pink-500 transition-colors duration-200 ease-out
                ${selectedCategory === categoryButton.id
                  ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white'
                  : 'bg-gray-700/20 text-gray-400 hover:text-gray-100 hover:bg-purple-600/30'
                }`}
              whileHover={selectedCategory === categoryButton.id 
                ? { scale: 1.1, y: -2, /* boxShadow removed */ transition: { type: "spring", stiffness: 350, damping: 12 } } 
                : { scale: 1.12, y: -3, /* boxShadow removed */ transition: { type: "spring", stiffness: 350, damping: 12 } }
              }
              whileTap={{ scale: 0.92, y: 0 }}
            >
              {categoryButton.name}
            </motion.button>
          ))}
        </div>

        {/* Key the entire grid on selectedCategory to force complete re-render on category change */}
        <motion.div
          key={selectedCategory} // This is crucial - forces fresh animations on category change
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 md:gap-8"
        >
          {displayedLogos.map((logo, index) => (
            <ConditionalLinkWrapper key={`${selectedCategory}-${logo.id}-${index}`} url={logo.url}>
              <motion.div
                custom={index} // Pass the index to the variants for custom delay
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                whileHover={{
                  scale: 1.07,
                  rotateX: 8,
                  rotateY: -8,
                  boxShadow: "0px 12px 28px rgba(167, 139, 250, 0.25), 0px 2px 8px rgba(0,0,0,0.1)",
                  transition: { type: "spring", stiffness: 280, damping: 18 }
                }}
                style={{ transformStyle: 'preserve-3d' }}
                className="group relative flex flex-col justify-center items-center p-4 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg aspect-w-16 aspect-h-9 overflow-hidden transition-all duration-300 w-full h-full text-center"
              >

                <div className="absolute inset-0 top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-all duration-700 ease-in-out group-hover:left-[100%] z-10" />
                <div className="relative w-full h-16 flex justify-center items-center transition-transform duration-300 mb-2">
                  <Image
                    src={logo.imagePath} // Use the direct imagePath from API data
                    alt={logo.alt}
                    width={150} // Provide a base width for aspect ratio
                    height={75} // Provide a base height for aspect ratio
                    sizes="(max-width: 768px) 30vw, (max-width: 1024px) 20vw, 15vw"
                    style={{ 
                      width: '80%', 
                      height: 'auto',
                      objectFit: 'contain' 
                    }}
                    className="opacity-80 group-hover:opacity-100 transition-opacity"
                    priority={index < 12} // Prioritize loading for the first few visible images
                  />
                </div>
                <p className="text-xs text-black transition-colors duration-200 mt-auto leading-tight px-1 truncate w-full" title={logo.alt}>
                  {logo.alt}
                </p>
              </motion.div>
            </ConditionalLinkWrapper>
          ))}
        </motion.div>
        {displayedLogos.length === 0 && selectedCategory !== '' && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center text-gray-400 mt-12 text-lg"
          >
            No partners found in the "{categoriesData.find(c=>c.id === selectedCategory)?.name || selectedCategory}" category.
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default SegmentedPartnerLogos;
