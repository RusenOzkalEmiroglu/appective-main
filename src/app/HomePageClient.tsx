"use client";

import { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
const Services = dynamic(() => import('@/components/Services'));
const RelevantAppfectSection = dynamic(() => import('@/components/RelevantAppfectSection'));
const WorkShowcase = dynamic(() => import('@/components/WorkShowcase'));
const AboutSection = dynamic(() => import('@/components/AboutSection'));
const JobOpeningsSection = dynamic(() => import('@/components/JobOpenings/JobOpeningsSection'));
const ContactSection = dynamic(() => import('@/components/ContactSection'));
const AppfectFeaturesGrid = dynamic(() => import('@/components/AppfectFeaturesGrid'));


import Image from 'next/image';

const DynamicTypographicBackground = dynamic(
  () => import('@/components/DynamicTypographicBackground'),
  { ssr: false }
);

// Dynamic import
// const ParticleBackground = dynamic(
//   () => import('@/components/ParticleBackground').then(mod => {
//     console.log('Fresh ParticleBackground loaded');
//     return mod.default;
//   }),
//   {
//     ssr: false,
//     loading: () => <div className="fixed inset-0 bg-dark" />
//   }
// );

// Force clean reload of the component to prevent old Three.js errors
// const ParticleBackgroundWithKey = ({ scrollY }: { scrollY: number }) => {
//   // Use timestamp to ensure unique key on each render
//   const uniqueKey = `particle-bg-${Math.floor(scrollY / 100)}`;
//   return <ParticleBackground key={uniqueKey} scrollY={scrollY} />;
// };

import { SocialLink, ContactInfo } from '@/lib/data';

export default function HomePageClient({ socialLinks, contactInfo }: { socialLinks: SocialLink[], contactInfo: ContactInfo[] }) {
  const [scrollY, setScrollY] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <>
      <div className="noise-bg"></div>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark">
          <div
            className="w-24 h-24 rounded-full border-4 border-primary flex items-center justify-center animate-pulse"
            style={{
              animation: 'pulse 1.8s infinite'
            }}
          >
            <Image
              src="/images/appective_A.png"
              alt="Appective A Logo"
              width={60}
              height={60}
              priority
            />
          </div>
        </div>
      )}
      <Suspense fallback={<div className="fixed inset-0 bg-dark" />}>
        {/* <ParticleBackgroundWithKey scrollY={scrollY} /> */}
      </Suspense>
      <DynamicTypographicBackground />
      
      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          <Services />
          <RelevantAppfectSection />
          <AppfectFeaturesGrid />
          <WorkShowcase /> 
          <AboutSection />
          <JobOpeningsSection /> {/* Added JobOpeningsSection */}
          <ContactSection socialLinks={socialLinks} contactInfo={contactInfo} />
        </main>

      </div>
    </>
  );
}
