"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useAnimation, AnimatePresence, useInView } from 'framer-motion';
import gsap from 'gsap';
import './services.css';

import { ServiceCategory } from '@/types/service';
import { primaryTextColor, secondaryTextColor, cardClasses } from '@/app/utils/constants';
import { AlertTriangle, Loader2, X } from 'lucide-react';

interface ImageMagnifierProps {
  src: string;
  alt: string;
  containerWidth?: string | number;
  containerHeight?: string | number;
  magnifierHeight?: number;
  magnifierWidth?: number;
  zoomLevel?: number;
}

const ImageMagnifier: React.FC<ImageMagnifierProps> = ({
  src,
  alt,
  containerWidth = '720px',
  containerHeight = '405px',
  magnifierHeight = 220,
  magnifierWidth = 220,
  zoomLevel = 3,
}) => {
  const [visible, setVisible] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [dimensions, setDimensions] = useState({
    containerW: 0,
    containerH: 0,
    imageW: 0,
    imageH: 0,
  });

  useEffect(() => {
    const calculateDimensions = () => {
      if (imageRef.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const imageRect = imageRef.current.getBoundingClientRect();
        setDimensions({
          containerW: containerRect.width,
          containerH: containerRect.height,
          imageW: imageRect.width,
          imageH: imageRect.height,
        });
      }
    };

    const img = imageRef.current;
    if (img) {
      img.onload = calculateDimensions;
      if (img.complete) {
        calculateDimensions();
      }
    }

    window.addEventListener('resize', calculateDimensions);
    return () => {
      if (img) img.onload = null;
      window.removeEventListener('resize', calculateDimensions);
    };
  }, [src]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - containerRect.left,
      y: e.clientY - containerRect.top,
    });
  };

  const offsetX = (dimensions.containerW - dimensions.imageW) / 2;
  const offsetY = (dimensions.containerH - dimensions.imageH) / 2;

  const bgX = -((cursorPos.x - offsetX) * zoomLevel - magnifierWidth / 2);
  const bgY = -((cursorPos.y - offsetY) * zoomLevel - magnifierHeight / 2);

  return (
    <div
      ref={containerRef}
      className="relative flex justify-center items-center bg-gray-800/30 rounded-xl cursor-zoom-in"
      style={{ width: containerWidth, height: containerHeight }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className="w-full h-full object-contain"
        style={{ display: 'block' }}
      />

      {visible && (
        <div
          style={{
            position: 'absolute',
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`,
            width: `${magnifierWidth}px`,
            height: `${magnifierHeight}px`,
            transform: 'translate(-50%, -50%)',
            border: '2px solid rgba(255, 255, 255, 0.5)',
            borderRadius: '50%',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
            pointerEvents: 'none',
            backgroundImage: `url(${src})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${dimensions.imageW * zoomLevel}px ${dimensions.imageH * zoomLevel}px`,
            backgroundPosition: `${bgX}px ${bgY}px`,
          }}
        />
      )}
    </div>
  );
};

interface ServiceImage {
  id: string;
  src: string;
  alt: string;
}

const getCardGradient = (index: number) => {
  const gradients = [
    'from-purple-600 to-pink-500',
    'from-blue-500 to-teal-400',
    'from-green-500 to-emerald-400',
    'from-orange-500 to-amber-400',
    'from-red-500 to-rose-400',
    'from-indigo-600 to-blue-400',
    'from-pink-500 to-rose-400',
    'from-teal-500 to-cyan-400'
  ];
  return gradients[index % gradients.length];
};

const getShadowColor = (gradient: string) => {
  if (gradient.includes('purple') || gradient.includes('pink')) return 'rgba(168, 85, 247, 0.4)';
  if (gradient.includes('blue') || gradient.includes('teal')) return 'rgba(59, 130, 246, 0.4)';
  if (gradient.includes('green') || gradient.includes('emerald')) return 'rgba(16, 185, 129, 0.4)';
  if (gradient.includes('orange') || gradient.includes('amber')) return 'rgba(245, 158, 11, 0.4)';
  if (gradient.includes('red') || gradient.includes('rose')) return 'rgba(239, 68, 68, 0.4)';
  if (gradient.includes('indigo')) return 'rgba(99, 102, 241, 0.4)';
  return 'rgba(139, 92, 246, 0.4)';
};

const ServiceCard: React.FC<{
  category: ServiceCategory;
  onClick: () => void;
  index: number;
}> = ({ category, onClick, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const isInView = useInView(cardRef, { once: false, amount: 0.3 });
  const [isHovered, setIsHovered] = useState(false);
  const gradient = getCardGradient(index);

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  /* useEffect(() => {
    if (!cardRef.current) return;
    const card = cardRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 15;
      const rotateY = (centerX - x) / 15;

      gsap.to(card, { rotateX, rotateY, transformPerspective: 1000, duration: 0.4, ease: 'power2.out' });
      gsap.to(card.querySelector('.card-highlight'), { opacity: 0.3, x: x - 100, y: y - 100, duration: 0.4, ease: 'power2.out' });
      if (iconRef.current) {
        gsap.to(iconRef.current, { x: (x - centerX) / 15, y: (y - centerY) / 15, duration: 0.4, ease: 'power2.out' });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
      gsap.to(card.querySelector('.card-highlight'), { opacity: 0, duration: 0.3, ease: 'power2.out' });
      if (iconRef.current) {
        gsap.to(iconRef.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
      }
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    if (!cardRef.current || !isHovered) return;
    const card = cardRef.current;
    gsap.to(card.querySelector('.card-glow'), { opacity: 0.66, scale: 1.055, duration: 1.65, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to(card, { scale: 1.022, duration: 1.98, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to(card.querySelector('.card-bg'), { opacity: 0.7, duration: 2.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    return () => {
      if (cardRef.current) {
        gsap.killTweensOf(card);
        gsap.killTweensOf(card.querySelector('.card-glow'));
        gsap.set(card, { scale: 1 });
        gsap.set(card.querySelector('.card-glow'), { opacity: 0, scale: 1 });
        gsap.set(card.querySelector('.card-bg'), { opacity: 0.2 });
      }
    };
  }, [isHovered]); */

  const shadowColor = getShadowColor(gradient);

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden backdrop-blur-md rounded-2xl p-4 md:p-6 h-full cursor-pointer border border-white/10`}
      onClick={onClick}
    >
      <div className={`card-bg absolute inset-0 bg-gradient-to-br ${gradient} opacity-20`}></div>
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div className={`absolute -inset-[1px] bg-gradient-to-r ${gradient} opacity-50`}
             style={{ backgroundSize: '200% 200%', animation: 'borderAnimation 8s linear infinite' }}></div>
      </div>
      <div className="card-highlight absolute w-[200px] h-[200px] rounded-full bg-white blur-3xl opacity-0 pointer-events-none"></div>
      <div className={`card-glow absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} blur-md opacity-0 pointer-events-none`}></div>
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center mb-3 md:mb-4">
          <div ref={iconRef} className="flex items-center justify-center text-3xl md:text-4xl mr-3 md:mr-4">
            {category.icon || '🚀'}
          </div>
          <h3 className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">{category.name}</h3>
        </div>
        <p className="text-white/70 text-xs md:text-sm flex-grow line-clamp-3 md:line-clamp-none">{category.description}</p>
      </div>
    </div>
  );
};

const Services = () => {
  const [fetchedServiceCategories, setFetchedServiceCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategoryForModal, setActiveCategoryForModal] = useState<ServiceCategory | null>(null);
  const [modalImages, setModalImages] = useState<ServiceImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sectionControls = useAnimation();
  const sectionInView = useInView(sectionRef, { once: false, amount: 0.2 });

  useEffect(() => {
    if (sectionInView) {
      sectionControls.start('visible');
    } else {
      sectionControls.start('hidden');
    }
  }, [sectionInView, sectionControls]);

  /* useEffect(() => {
    if (!titleRef.current) return;
    const title = titleRef.current;

    // @ts-ignore - WebKit özelliği
    title.style.webkitTextFillColor = 'transparent';

    gsap.fromTo(title, { backgroundPosition: '0% 50%' }, {
      backgroundPosition: '100% 50%', duration: 10, repeat: -1, yoyo: true, ease: 'sine.inOut'
    });
  }, []); */

  useEffect(() => {
    const fetchServiceData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/services');
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to fetch services data.'}));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const data: ServiceCategory[] = await response.json();
        setFetchedServiceCategories(data);
      } catch (err: any) {
        console.error("Error fetching services:", err);
        setError(err.message || 'An unexpected error occurred.');
        setFetchedServiceCategories([]);
      }
      setIsLoading(false);
    };
    fetchServiceData();
  }, []);

  const openModalWithCategory = useCallback((category: ServiceCategory) => {
    setActiveCategoryForModal(category);
    const images: ServiceImage[] = [
      {
        id: `${category.folderName}-1`,
        src: category.imageUrl || `/images/services/${category.folderName}/01.png`,
        alt: `${category.name} example`
      }
    ];
    setModalImages(images);
    setCurrentImageIndex(0);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => {
        setActiveCategoryForModal(null);
        setModalImages([]);
    }, 300);
  }, []);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % modalImages.length);
  }, [modalImages.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + modalImages.length) % modalImages.length);
  }, [modalImages.length]);

  if (isLoading) {
    return (
      <section id="services" className="py-12 md:py-20 bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className={`animate-spin ${primaryTextColor} mb-4 inline-block`} size={48} />
          <p className={`${secondaryTextColor} text-lg`}>Loading services...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="services" className="py-12 md:py-20 bg-gray-900 min-h-screen flex items-center justify-center">
        <div className={`${cardClasses} p-6 md:p-8 rounded-lg shadow-xl max-w-2xl mx-auto text-center`}>
          <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
          <h3 className={`text-2xl font-semibold ${primaryTextColor} mb-3`}>Error Loading Services</h3>
          <p className={`${secondaryTextColor} mb-6`}>{error}</p>
          <p className={`${secondaryTextColor} text-sm`}>Please try refreshing the page.</p>
        </div>
      </section>
    );
  }

  if (!fetchedServiceCategories || fetchedServiceCategories.length === 0) {
    return (
      <section id="services" className="py-12 md:py-20 bg-gray-900 min-h-screen flex items-center justify-center">
        <div className={`${cardClasses} p-6 md:p-8 rounded-lg shadow-xl max-w-2xl mx-auto text-center`}>
          <AlertTriangle className="text-yellow-500 mx-auto mb-4" size={48} />
          <h3 className={`text-2xl font-semibold ${primaryTextColor} mb-3`}>No Services Available</h3>
          <p className={`${secondaryTextColor}`}>No services have been added yet. Please check back later.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="services" ref={sectionRef} className="section py-24 relative overflow-hidden">

      <div className="container mx-auto px-4 relative z-10">
        <h2
          ref={titleRef}
          className="text-4xl md:text-5xl font-bold text-center mb-8 md:mb-16 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg"
        >
          Our Services
        </h2>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          initial="hidden"
          animate={sectionControls}
        >
          {fetchedServiceCategories.map((category, index) => (
            <ServiceCard
              key={category.id}
              category={category}
              onClick={() => openModalWithCategory(category)}
              index={index}
            />
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {isModalOpen && activeCategoryForModal && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className={`${cardClasses} relative rounded-xl overflow-hidden shadow-2xl w-full max-w-4xl border border-white/10`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-xl sm:text-2xl font-bold ${primaryTextColor} flex items-center`}>
                    <span className="text-3xl mr-3">{activeCategoryForModal.icon || '🖼️'}</span>
                    {activeCategoryForModal.name}
                  </h3>
                  <button onClick={closeModal} className={`p-2 rounded-full hover:bg-white/20 transition-colors ${secondaryTextColor}`}>
                    <X size={24} />
                  </button>
                </div>
                
                <div className="relative overflow-hidden rounded-lg bg-gray-900 flex justify-center items-center">
                  {modalImages.length > 0 && (
                    <ImageMagnifier
                      src={modalImages[currentImageIndex].src}
                      alt={modalImages[currentImageIndex].alt}
                      containerWidth="100%"
                      containerHeight="60vh"
                      magnifierHeight={220}
                      magnifierWidth={220}
                      zoomLevel={3}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Services;
