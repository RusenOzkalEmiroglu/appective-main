// src/components/JobOpenings/JobOpeningModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, CheckCircle } from 'lucide-react';
import { JobOpening } from '@/lib/supabase';
import JobApplicationForm from './JobApplicationForm';

interface JobOpeningModalProps {
  job: JobOpening | null;
  onClose: () => void;
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const JobOpeningModal: React.FC<JobOpeningModalProps> = ({ job, onClose }) => {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  
  // Modal her açıldığında state'leri sıfırla
  useEffect(() => {
    if (job) {
      setShowApplicationForm(false);
      setApplicationSuccess(false);
    }
  }, [job?.id]); // job.id değiştiğinde state'leri sıfırla
  
  if (!job) return null;

  // Supabase veri yapısını kullan
  
  const handleApplyClick = () => {
    setShowApplicationForm(true);
  };
  
  const handleFormClose = () => {
    setShowApplicationForm(false);
  };
  
  const handleApplicationSuccess = () => {
    setApplicationSuccess(true);
    setShowApplicationForm(false);
  };

  return (
    <AnimatePresence>
      {job && (
        <motion.div
          key="backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
          transition={{ duration: 0.3 }}
        >
          <motion.div
            key="modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            className="bg-gray-800/80 border border-purple-500/50 p-8 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative text-white"
            transition={{ duration: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start mb-6">
              <h2 className="text-3xl font-bold text-purple-400 mb-2 md:mb-0">
                {job.full_title || job.title}
              </h2>
              {!showApplicationForm && !applicationSuccess && (
                <button
                  onClick={handleApplyClick}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg flex items-center transition-colors duration-300 group whitespace-nowrap"
                >
                  Apply Now
                  <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              )}
            </div>

            {showApplicationForm ? (
              <JobApplicationForm 
                jobId={job.id} 
                jobTitle={job.full_title || job.title}
                onClose={handleFormClose}
                onSuccess={handleApplicationSuccess}
              />
            ) : applicationSuccess ? (
              <div className="bg-green-500/20 border border-green-500/50 text-green-100 p-6 rounded-lg text-center">
                <CheckCircle size={48} className="mx-auto mb-4 text-green-400" />
                <h3 className="text-xl font-bold mb-2">Başvurunuz Alındı!</h3>
                <p className="text-gray-300">
                  Başvurunuz başarıyla alınmıştır. Ekibimiz en kısa sürede sizinle iletişime geçecektir.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-purple-300 mb-2">Description</h3>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {job.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-purple-300 mb-2">What You'll Be Doing</h3>
                  <ul className="space-y-2">
                    {job.what_you_will_do?.map((item, index) => (
                      <li key={index} className="flex items-start text-gray-300">
                        <CheckCircle size={18} className="mr-3 mt-1 text-purple-400 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-purple-300 mb-2">What We're Looking For</h3>
                  <ul className="space-y-2">
                    {job.what_were_looking_for?.map((item, index) => (
                      <li key={index} className="flex items-start text-gray-300">
                        <CheckCircle size={18} className="mr-3 mt-1 text-purple-400 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-purple-300 mb-2">Why Join Us?</h3>
                  <ul className="space-y-2">
                    {job.why_join_us?.map((item, index) => (
                      <li key={index} className="flex items-start text-gray-300">
                        <CheckCircle size={18} className="mr-3 mt-1 text-purple-400 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {!showApplicationForm && !applicationSuccess && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleApplyClick}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg flex items-center justify-center w-full md:w-auto md:inline-flex transition-colors duration-300 group"
                >
                  Apply Now
                  <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            )}

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JobOpeningModal;
