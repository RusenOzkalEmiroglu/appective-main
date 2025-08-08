"use client";

import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'framer-motion';
import gsap from 'gsap';
import Image from 'next/image';
import TeamSection from './TeamSection';

const AboutSection = () => {
  // Smooth scroll to section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  const controls = useAnimation();
  const counterRefs = useRef<(HTMLDivElement | null)[]>([]);

  const stats = [
    { value: 1200, label: 'Completed Projects', display: '1,200+' },
    { value: 100, label: 'Happy Clients', display: '100+' },
    { value: 15, label: 'Years of Experience', display: '15+' },
    { value: 10, label: 'Team Members', display: '10+' },
  ];

  // Team members are now managed in the TeamSection component

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
      
      // Animate counters with a simplified approach
      counterRefs.current.forEach((ref, index) => {
        if (!ref) return;
        
        const stat = stats[index];
        
        // Set initial value to avoid NaN
        if (ref) {
          ref.textContent = '0+';
        }
        
        // Use a simple counter animation
        let count = 0;
        const increment = Math.ceil(stat.value / 50); // Divide animation into ~50 steps
        const interval = setInterval(() => {
          count = Math.min(count + increment, stat.value);
          
          if (count >= stat.value) {
            // When animation completes, use the exact display format
            ref.textContent = stat.display;
            clearInterval(interval);
          } else {
            // During animation, format the number
            ref.textContent = count.toLocaleString('en-US') + '+';
          }
        }, 40); // ~2 seconds total duration (50 steps * 40ms)
      });
    }
  }, [isInView, controls, stats]);

  return (
    <section id="about" ref={sectionRef} className="section py-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#07081e]/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#07081e]/70 to-transparent"></div>
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-primary/10 blur-3xl"></div>
      </div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 gradient-text">
            About Us
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            We are a team that creates innovative and impressive solutions that leave a mark in the digital world.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { 
                opacity: 1, 
                x: 0,
                transition: { 
                  duration: 0.8,
                  delay: 0.2,
                  ease: [0.22, 1, 0.36, 1]
                }
              }
            }}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-6">In the Digital World <span className="gradient-text">We Make a Difference</span></h3>
            <p className="text-white/70 mb-6">
              Appective is one of Turkey's leading digital advertising agencies. We combine creative design, technological innovation, and strategic thinking to make brands stand out in the digital world.
            </p>
            <p className="text-white/70 mb-8">
              Our team consists of the industry's most talented designers, developers, and strategists. In every project, we strive to understand our clients' needs, help them achieve their goals, and exceed their expectations.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <motion.button
                className="magnetic interactive-btn bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('contact')}
              >
                Learn More
              </motion.button>
              <motion.button
                className="magnetic interactive-btn bg-transparent border border-white/20 hover:border-primary/50 text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-300"
                whileHover={{ scale: 1.05, borderColor: 'rgba(138, 43, 226, 0.8)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('team')}
              >
                Meet Our Team
              </motion.button>
            </div>
          </motion.div>
          
          <motion.div
            className="relative"
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, x: 50 },
              visible: { 
                opacity: 1, 
                x: 0,
                transition: { 
                  duration: 0.8,
                  delay: 0.4,
                  ease: [0.22, 1, 0.36, 1]
                }
              }
            }}
          >
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&h=563&q=80)' }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  className="w-20 h-20 rounded-full bg-primary/80 flex items-center justify-center text-white"
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(138, 43, 226, 0.9)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </motion.button>
              </div>
            </div>
            
            {/* Founded box removed */}
          </motion.div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-dark/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center"
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
                y: -10,
                borderColor: 'rgba(138, 43, 226, 0.3)',
                boxShadow: '0 10px 30px -10px rgba(138, 43, 226, 0.2)'
              }}
            >
              <div 
                ref={(el: HTMLDivElement | null) => { counterRefs.current[index] = el; }}
                className="text-3xl md:text-4xl font-bold gradient-text mb-2"
              >
                0+
              </div>
              <p className="text-white/70 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
        
        {/* Team Section */}
        <TeamSection />
      </div>
    </section>
  );
};

export default AboutSection;
