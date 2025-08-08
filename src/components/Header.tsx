"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [displayText, setDisplayText] = useState(false);
  const [displayAppfectText, setDisplayAppfectText] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const appfectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Effect for scroll handling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effect for cleaning up the logo hover timer
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (appfectTimerRef.current) {
        clearTimeout(appfectTimerRef.current);
      }
    };
  }, []);

  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/#services' },
    { name: 'Our Work', href: '/#work' },
    { name: 'About Us', href: '/#about' },
    { name: 'Contact', href: '/#contact' },
  ];

  const menuVariants = {
    closed: {
      opacity: 0,
      x: '100%',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const menuItemVariants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 }
  };

  const handleLogoMouseEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setDisplayText(true);
    timerRef.current = setTimeout(() => {
      setDisplayText(false);
      timerRef.current = null;
    }, 3000);
  };

  const handleLogoMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setDisplayText(false);
  };

  const handleAppfectMouseEnter = () => {
    if (appfectTimerRef.current) {
      clearTimeout(appfectTimerRef.current);
    }
    setDisplayAppfectText(true);
    appfectTimerRef.current = setTimeout(() => {
      setDisplayAppfectText(false);
      appfectTimerRef.current = null;
    }, 3000);
  };

  const handleAppfectMouseLeave = () => {
    if (appfectTimerRef.current) {
      clearTimeout(appfectTimerRef.current);
      appfectTimerRef.current = null;
    }
    setDisplayAppfectText(false);
  };

  const logoTextVariants = {
    hidden: { opacity: 0, rotateY: -90, transition: { duration: 0.25, ease: 'easeInOut' } },
    visible: { opacity: 1, rotateY: 0, transition: { duration: 0.35, ease: 'easeInOut', delay: 0.05 } },
    exit: { opacity: 0, rotateY: 90, transition: { duration: 0.25, ease: 'easeInOut' } },
  };

  return (
    <header 
      className={`sticky top-0 left-0 w-full z-40 transition-all duration-500 bg-[#07081e]/70 ${isScrolled ? 'backdrop-blur-md py-3' : 'py-5'}`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between overflow-hidden">
        <Link href="/" className="relative z-50">
          <motion.div 
            className="flex items-center justify-center logo-pulse-glow cursor-pointer"
            style={{ width: '180px', height: '48px', perspective: '1000px', transformStyle: 'preserve-3d' }} // Smaller dimensions for mobile
            onMouseEnter={handleLogoMouseEnter}
            onMouseLeave={handleLogoMouseLeave}
            // whileHover and whileTap removed from here as they might interfere with the 3D effect's perceived stability
          >
            <AnimatePresence mode="wait">
              {!displayText ? (
                <motion.div
                  key="logo"
                  variants={logoTextVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  style={{ transformStyle: 'preserve-3d' }} // Ensure children also respect 3D space
                >
                  <Image 
                    src="/images/yatay_appective_logo.png" 
                    alt="Appective Logo" 
                    width={180} 
                    height={48} 
                    className="block" // Use block to prevent extra space under image
                    priority
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="text"
                  variants={logoTextVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex items-center justify-center h-full w-full"
                  style={{ transformStyle: 'preserve-3d' }} // Ensure children also respect 3D space
                >
                  <span className="text-2xl font-library-3-am text-white whitespace-nowrap leading-none">
                    So Effective
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          {menuItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className="text-white/80 transition-colors duration-300 text-base font-medium menu-item-glow-spray font-library-3-am"
            >
              <motion.span
                whileHover={{ y: -3 }}
                className="relative"
              >
                {item.name}
                <motion.span
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary"
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.span>
            </Link>
          ))}
          
          {/* Appfect Icon Menu Item */}
          <Link href="/#appfect-core">
            <motion.div 
              className="flex items-center self-center cursor-pointer"
              style={{ width: '48px', height: '48px', perspective: '1000px', transformStyle: 'preserve-3d' }}
              onMouseEnter={handleAppfectMouseEnter}
              onMouseLeave={handleAppfectMouseLeave}
            >
            <AnimatePresence mode="wait">
              {!displayAppfectText ? (
                <motion.div
                  key="appfectLogo"
                  variants={logoTextVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <Image 
                    src="/images/appfect/appfect-logo-mor.png" 
                    alt="Appfect Logo" 
                    width={48} 
                    height={48} 
                    className="block logo-pulse-glow" 
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="appfectText"
                  variants={logoTextVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex items-center justify-center h-full w-full"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <span className="text-base font-library-3-am text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 whitespace-nowrap leading-none font-bold">
                    APPFECT
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          </Link>
        </nav>

        <motion.button
          className="md:hidden fixed top-4 right-4 z-[100] w-12 h-12 flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg border-2 border-white/20"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          style={{ position: 'fixed' }}
        >
          <div className="w-6 flex flex-col items-center justify-center">
            <motion.span
              className={`block h-0.5 bg-white mb-1.5 transition-all duration-300 ${isMenuOpen ? 'w-6 transform rotate-45 translate-y-2' : 'w-6'}`}
            />
            <motion.span
              className={`block h-0.5 bg-white mb-1.5 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'w-5'}`}
            />
            <motion.span
              className={`block h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'w-6 transform -rotate-45 -translate-y-2' : 'w-6'}`}
            />
          </div>
        </motion.button>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="fixed inset-0 bg-gradient-to-b from-[#07081e]/95 to-purple-900/95 backdrop-blur-lg z-40 flex items-center justify-center md:hidden overflow-y-auto"
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
            >
              <motion.div className="flex flex-col items-center space-y-6 py-20 px-6 w-full max-w-md">
                {menuItems.map((item) => (
                  <motion.div
                    key={item.name}
                    variants={menuItemVariants}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      href={item.href}
                      className="text-white text-3xl font-medium menu-item-glow-spray font-library-3-am"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}

                {/* Appfect Icon in Mobile Menu */}
                <motion.div
                  variants={menuItemVariants}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center mt-4"
                >
                  <Link href="/#appfect-core" onClick={() => setIsMenuOpen(false)}>
                    <motion.div 
                      className="flex items-center justify-center cursor-pointer"
                      style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
                      onMouseEnter={handleAppfectMouseEnter}
                      onMouseLeave={handleAppfectMouseLeave}
                    >
                    <AnimatePresence mode="wait">
                      {!displayAppfectText ? (
                        <motion.div
                          key="appfectLogoMobile"
                          variants={logoTextVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          style={{ transformStyle: 'preserve-3d' }}
                        >
                          <Image 
                            src="/images/appfect/appfect-logo-mor.png" 
                            alt="Appfect Logo" 
                            width={60} 
                            height={60} 
                            className="block logo-pulse-glow" 
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="appfectTextMobile"
                          variants={logoTextVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="flex items-center justify-center h-full w-full"
                          style={{ transformStyle: 'preserve-3d' }}
                        >
                          <span className="text-2xl font-library-3-am text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 whitespace-nowrap leading-none font-bold">
                            APPFECT
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    </motion.div>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
