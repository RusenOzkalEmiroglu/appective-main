"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { MastheadItem } from '@/data/interactiveMastheadsData';
import { useMemo } from 'react';

interface MastheadPopupProps {
  masthead: MastheadItem | null;
  onClose: () => void;
}

const MastheadPopup = ({ masthead, onClose }: MastheadPopupProps) => {
  const dimensions = useMemo(() => {
    if (!masthead?.bannerDetails.size) return { width: 'auto', height: 'auto' };
    
    // Handle full page formats
    if (masthead.bannerDetails.size.toLowerCase().includes('full') || 
        masthead.bannerDetails.size.toLowerCase().includes('page') ||
        masthead.bannerDetails.size.toLowerCase().includes('interstitial')) {
      return { width: '100%', height: '80vh', isFullPage: true };
    }

    // Handle interactive masthead and other special formats
    if (masthead.bannerDetails.size.toLowerCase().includes('interactive') ||
        masthead.bannerDetails.size.toLowerCase().includes('masthead')) {
      return { width: 970, height: 250, isInteractive: true };
    }

    // Handle scrollad format
    if (masthead.bannerDetails.size.toLowerCase().includes('scrollad')) {
      return { width: 970, height: 600, isScrollAd: true };
    }
    
    // Handle standard dimensions (e.g., 970x250)
    const sizeMatch = masthead.bannerDetails.size.match(/(\d+)x(\d+)/);
    if (sizeMatch) {
      const width = parseInt(sizeMatch[1], 10);
      const height = parseInt(sizeMatch[2], 10);

      if (!isNaN(width) && !isNaN(height)) {
        return { width, height };
      }
    }
    
    // Default size for any other format
    return { width: 970, height: 250 };
  }, [masthead]);

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, y: 50, scale: 0.95, transition: { duration: 0.2, ease: 'easeIn' } },
  };

  return (
    <AnimatePresence>
      {masthead && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg w-full max-w-max p-6 text-white font-library-3-am"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors z-10 p-1 bg-white/10 rounded-full"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            
            <div className="mb-4 max-w-4xl">
              <h2 className="text-2xl font-bold menu-item-glow-subtle pr-8">{masthead.popupTitle}</h2>
              {masthead.popupDescription && <p className="text-white/70 mt-1">{masthead.popupDescription}</p>}
            </div>

            <div 
              className="my-6 mx-auto border-0 rounded-lg overflow-hidden flex items-center justify-center"
              style={{
                width: (dimensions as any).isFullPage ? '90vw' : `${dimensions.width}px`,
                height: (dimensions as any).isFullPage ? '80vh' : `${dimensions.height}px`,
                maxWidth: '1800px',
                maxHeight: '90vh'
              }}
            >
              <iframe
                src={masthead.popupHtmlPath}
                width={(dimensions as any).isFullPage ? '100%' : dimensions.width}
                height={(dimensions as any).isFullPage ? '100%' : dimensions.height}
                frameBorder="0"
                scrolling={(dimensions as any).isFullPage ? "auto" : "no"}
                style={{ 
                  display: 'block',
                  width: (dimensions as any).isFullPage ? '100%' : `${dimensions.width}px`,
                  height: (dimensions as any).isFullPage ? '100%' : `${dimensions.height}px`
                }}
              />
            </div>

            <div className="max-w-4xl">
              <h3 className="text-lg font-semibold">Banner Details:</h3>
              <p className="text-white/80"><span className="font-bold text-red-400">Size(s):</span> {masthead.bannerDetails.size}</p>
              <p className="text-white/80"><span className="font-bold">Available Platform(s):</span> {masthead.bannerDetails.platforms}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MastheadPopup;
