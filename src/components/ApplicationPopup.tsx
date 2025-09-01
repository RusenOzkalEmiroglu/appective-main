"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';



interface ApplicationPopupProps {
  application: any;
  onClose: () => void;
}

const ApplicationPopup = ({ application, onClose }: ApplicationPopupProps) => {
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
      {application && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg w-full max-w-3xl p-6 text-white"
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
            
            <div className="mb-4">
              <h2 className="text-2xl font-bold menu-item-glow-subtle pr-8">{application.title}</h2>
              {application.description && <p className="text-white/70 mt-1">{application.description}</p>}
            </div>

            <div className="my-6 flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                <div className="rounded-lg overflow-hidden border border-white/20">
                  <img 
                    src={application.image} 
                    alt={application.title} 
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
              
              <div className="md:w-1/2">
                <h3 className="text-lg font-semibold mb-3">Key Features:</h3>
                <ul className="space-y-2">
                  {application.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span className="text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-6">
                  <p className="text-white/80">
                    <span className="font-bold">Available Platform(s):</span> {application.platforms}
                  </p>
                  {application.project_url && (
                    <div className="mt-4">
                      <button
                        onClick={() => window.open(application.project_url, '_blank')}
                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                      >
                        Visit Project
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ApplicationPopup;
