"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Globe, Facebook, Linkedin, Instagram, Twitter, ChevronDown, Mail, Phone, MapPin } from 'lucide-react';

const footerContentData = {
  tr: {
    description: "Dijital dünyada iz bırakan, yenilikçi ve etkileyici çözümler üreten Türkiye'nin önde gelen dijital reklam ajansı.",
    sections: [
      {
        title: 'Hızlı Bağlantılar',
        links: [
          { name: 'Dijital Tasarım', href: '/services/digital-design' },
          { name: 'Web Geliştirme', href: '/services/web-development' },
          { name: 'Hakkımızda', href: '/about' },
          { name: 'Ekibimiz', href: '/team' },
          { name: 'Blog', href: '/blog' },
        ],
      },
    ],
    legalLinks: [
        { name: 'Gizlilik Politikası', href: '/privacy-policy' },
        { name: 'Kullanım Koşulları', href: '/terms-of-service' },
        { name: 'Çerez Politikası', href: '/cookie-policy' },
    ],
    contactTitle: 'Bize Ulaşın',
    address: 'İstanbul, Türkiye',
    phone: '+90 212 123 4567',
    email: 'info@appective.com.tr',
    copyright: `© ${new Date().getFullYear()} Appective. Tüm hakları saklıdır.`,
    languageButton: 'Dil',
    currentLanguageName: 'Türkçe',
    switchToLanguageName: 'English',
    languageOptions: { tr: 'Türkçe', en: 'English' },
    newsletter: {
      title: 'Bültenimize Abone Olun',
      description: 'En son haberler, güncellemeler ve özel teklifler için abone olun.',
      placeholder: 'E-posta adresiniz',
      button: 'Abone Ol',
      successMessage: 'Abone olduğunuz için teşekkürler!',
      errorMessage: 'Bir hata oluştu. Lütfen tekrar deneyin.',
    },
  },
  en: {
    description: "Turkey's leading digital advertising agency, creating innovative and impressive solutions that leave a mark in the digital world.",
    sections: [
      {
        title: 'Quick Links',
        links: [
          { name: 'Digital Design', href: '/services/digital-design' },
          { name: 'Web Development', href: '/services/web-development' },
          { name: 'About Us', href: '/about' },
          { name: 'Our Team', href: '/team' },
          { name: 'Blog', href: '/blog' },
        ],
      },
    ],
    legalLinks: [
        { name: 'Privacy Policy', href: '/privacy-policy' },
        { name: 'Terms of Service', href: '/terms-of-service' },
        { name: 'Cookie Policy', href: '/cookie-policy' },
    ],
    contactTitle: 'Contact Us',
    address: 'Istanbul/Umraniye, Turkey',
    phone: '+90 544 207 11 14',
    email: 'affiliate@appective.com.tr',
    copyright: `© ${new Date().getFullYear()} Appective. All rights reserved.`,
    languageButton: 'Language',
    currentLanguageName: 'English',
    switchToLanguageName: 'Türkçe',
    languageOptions: { tr: 'Türkçe', en: 'English' },
    newsletter: {
      title: 'Subscribe to Our Newsletter',
      description: 'Subscribe for the latest news, updates, and special offers.',
      placeholder: 'Your email address',
      button: 'Subscribe',
      successMessage: 'Thank you for subscribing!',
      errorMessage: 'An error occurred. Please try again.',
    },
  },
};

interface SocialLink {
  platform: string;
  url: string;
}

const iconComponents: { [key: string]: React.FC<any> } = {
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  facebook: Facebook,
};

const Footer = ({ socialLinks }: { socialLinks: SocialLink[] }) => {
  const footerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(footerRef, { once: false, amount: 0.1 }); // Adjusted amount for earlier trigger
  const controls = useAnimation();
  
  // Set default language to English
  const [currentLang, setCurrentLang] = useState<'tr' | 'en'>('en');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const langToggleButtonRef = useRef<HTMLButtonElement>(null);
  
  // Newsletter form state
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else {
      // Optional: if you want animations to reset when out of view
      // controls.start('hidden');
    }
  }, [isInView, controls]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLangDropdownOpen(false);
        langToggleButtonRef.current?.focus();
      }
    };

    if (isLangDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isLangDropdownOpen, langDropdownRef, langToggleButtonRef]);

  const content = footerContentData[currentLang];
  const oldFooterLinks = footerContentData.tr.sections; // Keep for mapping existing structure for now

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    },
  };
  
  const staggerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <footer ref={footerRef} className="relative pt-24 pb-12 overflow-hidden bg-black text-gray-300 font-sans">
      <div className="absolute inset-0 z-0 opacity-50">
        <motion.div 
          className="absolute top-[-20vh] left-[-20vw] w-[60vw] h-[60vh] bg-gradient-radial from-purple-700/20 via-transparent to-transparent rounded-full blur-3xl"
          animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-[-25vh] right-[-25vw] w-[70vw] h-[70vh] bg-gradient-radial from-pink-600/15 via-transparent to-transparent rounded-full blur-3xl"
          animate={{ scale: [1, 1.03, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        />
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16"
          variants={staggerVariants} // Assuming staggerVariants is defined for the parent
          initial="hidden"
          animate={controls}
        >
          <motion.div 
            className="md:col-span-2 lg:col-span-1" 
            variants={itemVariants} // Assuming itemVariants is defined
          >
            <Link href="/" className="inline-block mb-6">
              <Image 
                src="/images/yatay_appective_logo.png" 
                alt="Appective Logo" 
                width={180}
                height={48} 
                className="h-auto w-auto filter drop-shadow-[0_2px_4px_rgba(168,85,247,0.4)] group-hover:drop-shadow-[0_3px_6px_rgba(217,70,239,0.5)] transition-all duration-300"
                priority
              />
            </Link>
            {/* MODIFIED: Bilingual description */}
            <p className="text-sm text-gray-400 mb-6 max-w-sm leading-relaxed">
              {content.description}
            </p>

          </motion.div>
          
          {/* Newsletter Subscription Form Only */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <h3 className="text-base font-semibold text-purple-300 mb-5 tracking-wide uppercase">
              {content.newsletter.title}
            </h3>
            <p className="text-sm text-gray-400 mb-4 max-w-md">
              {content.newsletter.description}
            </p>
            <form onSubmit={async (e) => {
              e.preventDefault();
              
              // Reset error message
              setErrorMessage('');
              
              // Basic email validation
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!email) {
                setSubscriptionStatus('error');
                setErrorMessage('Please enter your email address');
                return;
              }
              
              if (!emailRegex.test(email)) {
                setSubscriptionStatus('error');
                setErrorMessage('Please enter a valid email address');
                return;
              }
              
              try {
                setSubscriptionStatus('loading');
                
                const response = await fetch('/api/newsletter', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ email }),
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                  setSubscriptionStatus('error');
                  setErrorMessage(data.error || 'Failed to subscribe. Please try again.');
                  return;
                }
                
                setSubscriptionStatus('success');
                setEmail('');
                setTimeout(() => setSubscriptionStatus('idle'), 3000);
              } catch (error) {
                console.error('Newsletter subscription error:', error);
                setSubscriptionStatus('error');
                setErrorMessage('An unexpected error occurred. Please try again.');
              }
            }}>
              <div className="flex flex-row space-x-2 max-w-md">
                <div className="relative flex-grow">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={content.newsletter.placeholder}
                    className={`w-full px-4 py-2.5 bg-gray-800/80 border ${subscriptionStatus === 'error' ? 'border-red-500' : 'border-gray-700'} rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500`}
                    disabled={subscriptionStatus === 'loading'}
                    aria-invalid={subscriptionStatus === 'error'}
                    aria-describedby={subscriptionStatus === 'error' ? 'newsletter-error' : undefined}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md transition-colors duration-300 flex items-center justify-center whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={subscriptionStatus === 'loading'}
                >
                  {subscriptionStatus === 'loading' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : content.newsletter.button}
                </button>
              </div>
              
              {subscriptionStatus === 'success' && (
                <p className="mt-2 text-xs text-green-400">{content.newsletter.successMessage}</p>
              )}
              
              {subscriptionStatus === 'error' && (
                <p id="newsletter-error" className="mt-2 text-xs text-red-400">
                  {errorMessage || content.newsletter.errorMessage}
                </p>
              )}
            </form>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h3 className="text-base font-semibold text-purple-300 mb-5 tracking-wide uppercase">
              {content.contactTitle}
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start">
                <MapPin size={16} className="mr-3 mt-0.5 text-purple-400 flex-shrink-0" />
                <span>{content.address}</span>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-3 text-purple-400 flex-shrink-0" />
                <a href={`tel:${content.phone.replace(/\s/g, '')}`} className="hover:text-purple-300 transition-colors duration-300">{content.phone}</a>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-3 text-purple-400 flex-shrink-0" />
                <a href={`mailto:${content.email}`} className="hover:text-purple-300 transition-colors duration-300">{content.email}</a>
              </li>
            </ul>
          </motion.div>
          
          {/* Newsletter section has been moved to Quick Links */}
        </motion.div> {/* This closes the new motion.div for the grid */}
        
        <motion.div 
          className="pt-8 border-t border-gray-800/70 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0"
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] } }
          }}
        >
          {/* MODIFIED: Bilingual copyright */}
          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left space-y-2 sm:space-y-0 sm:space-x-4">
            <p className="text-xs text-gray-500 shrink-0">
              {content.copyright}
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-x-3 gap-y-1">
              {content.legalLinks.map((link) => (
                <Link
                  key={link.name} 
                  href={link.href}
                  className="text-xs text-gray-500 hover:text-purple-300 transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          

        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
