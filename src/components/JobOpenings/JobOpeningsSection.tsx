// src/components/JobOpenings/JobOpeningsSection.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { JobOpening } from '@/lib/supabase';
import JobOpeningCard from './JobOpeningCard';
import JobOpeningModal from './JobOpeningModal';
import { motion } from 'framer-motion';

const JobOpeningsSection: React.FC = () => {
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/job-openings');
        if (!response.ok) {
          throw new Error('Failed to fetch job openings');
        }
        const data = await response.json();
        setJobOpenings(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const openModal = (job: JobOpening) => {
    setSelectedJob(job);
  };

  const closeModal = () => {
    setSelectedJob(null);
  };

  return (
    <section className="py-16 md:py-24 text-white">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-purple-400">Job Openings</h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            It is nice to witness you making the decisions that you won't regret.
            Would you mind sharing which of the following fields are you thinking of applying?
          </p>
        </motion.div>

        <div className="min-h-[300px]">
          {isLoading && <p className="text-center pt-16">Loading job openings...</p>}
          {error && <p className="text-center pt-16 text-red-500">Error: {error}</p>}
          {!isLoading && !error && jobOpenings.length === 0 && (
            <p className="text-center pt-16 text-gray-400">There are currently no open positions. Please check back later!</p>
          )}
          {!isLoading && !error && jobOpenings.length > 0 && (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {jobOpenings.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <JobOpeningCard job={job} onClick={() => openModal(job)} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
      <JobOpeningModal job={selectedJob} onClose={closeModal} />
    </section>
  );
};

export default JobOpeningsSection;
