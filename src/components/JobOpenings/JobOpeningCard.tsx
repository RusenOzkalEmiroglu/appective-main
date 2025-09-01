// src/components/JobOpenings/JobOpeningCard.tsx
'use client';

import React from 'react';
import { LucideProps } from 'lucide-react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Globe } from 'lucide-react';
import { JobOpening } from '@/lib/supabase';
import dynamic from 'next/dynamic';
import dynamicIconImports from 'lucide-react/dynamicIconImports';

// Dynamically import lucide-react icons to allow for any icon name
const LucideIcon = ({ name, ...props }: { name: string; [key: string]: any }) => {
  const iconName = name as keyof typeof dynamicIconImports;
  const IconComponent = dynamic(dynamicIconImports[iconName] ?? dynamicIconImports.briefcase);
  return <IconComponent {...props} />;
};

interface JobOpeningCardProps {
  job: JobOpening;
  onClick: () => void;
}

const JobOpeningCard: React.FC<JobOpeningCardProps> = ({ job, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg shadow-xl cursor-pointer h-full flex flex-col justify-between border border-purple-500/30 hover:border-purple-500/70 transition-colors duration-300"
      whileHover={{ y: -5, boxShadow: '0px 10px 20px rgba(128, 0, 128, 0.5)' }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="w-16 h-16 bg-purple-600/30 rounded-full flex items-center justify-center text-purple-400 mb-3">
            <LucideIcon name={job.icon_name || 'briefcase'} size={32} />
          </div>
          <div className="flex space-x-2 text-xs text-gray-400">
            {job.is_remote && (
              <span className="flex items-center bg-gray-700/50 px-2 py-1 rounded-full">
                <Globe size={12} className="mr-1" /> Remote
              </span>
            )}
            {job.is_tr && (
              <span className="flex items-center bg-gray-700/50 px-2 py-1 rounded-full">
                <MapPin size={12} className="mr-1" /> TR
              </span>
            )}
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-white">{job.title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
          {job.short_description}
        </p>
      </div>
      <button
        className="mt-auto flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-200 group"
      >
        Apply Now
        <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
      </button>
    </motion.div>
  );
};

export default JobOpeningCard;
