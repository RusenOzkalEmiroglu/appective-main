"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'framer-motion';
import Image from 'next/image';
import { TeamMember } from '@/lib/supabase';
import './team-section.css';

const TeamSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  const controls = useAnimation();
  const [activeTeamMember, setActiveTeamMember] = useState<number | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch('/api/team-members');
        if (response.ok) {
          const data = await response.json();
          setTeamMembers(data);
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  if (loading) {
    return (
      <div id="team" ref={sectionRef} className="py-16">
        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-10 text-center">Meet Our <span className="gradient-text">Team</span></h3>
          <div className="flex justify-center items-center h-32">
            <div className="text-white/70">Loading team members...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="team" ref={sectionRef} className="py-16">
      <motion.div
        className="mb-16"
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1]
            }
          }
        }}
      >
        <h3 className="text-2xl md:text-3xl font-bold mb-10 text-center">Meet Our <span className="gradient-text">Team</span></h3>
        
        <div className="flex justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-full auto-rows-fr">
            {teamMembers.map((member: TeamMember, index: number) => (
              <motion.div
                key={member.id}
                className="group relative overflow-hidden rounded-xl bg-dark/30 backdrop-blur-sm border border-white/10 w-full h-40 sm:h-44 md:h-48 lg:h-52 flex flex-col"
                initial="hidden"
                animate={controls}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                      duration: 0.6,
                      delay: 0.2 + index * 0.1,
                      ease: [0.22, 1, 0.36, 1]
                    }
                  }
                }}
                whileHover={{ 
                  y: -5,
                  boxShadow: '0 15px 30px -8px rgba(138, 43, 226, 0.5), 0 0 10px rgba(138, 43, 226, 0.3)',
                  scale: 1.03,
                  transition: { type: 'spring', stiffness: 300, damping: 15 }
                }}
                onMouseEnter={() => setActiveTeamMember(member.id)}
                onMouseLeave={() => setActiveTeamMember(null)}
              >
                <div className="relative w-full flex-1">
                  <Image 
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 8rem, (max-width: 768px) 10rem, (max-width: 1024px) 12rem, 14rem"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                
                <div className="p-2 bg-dark/70 backdrop-blur-sm flex-shrink-0 min-h-[3rem] flex flex-col justify-center">
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-tight truncate">{member.name}</h4>
                  <p className="text-primary text-xs leading-tight mt-0.5 truncate">{member.position}</p>
                </div>
                
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-b from-primary/90 to-primary/70 flex items-center justify-center p-3"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: activeTeamMember === member.id ? 1 : 0,
                    transition: { duration: 0.3 }
                  }}
                >
                  {member.bio && (
                    <p className="text-white/90 text-xs leading-tight text-center">
                      {member.bio.split(' ').slice(0, 20).join(' ')}...
                    </p>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TeamSection;
