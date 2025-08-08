"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'framer-motion';
import gsap from 'gsap';
import emailjs from '@emailjs/browser';

import { SocialLink, ContactInfo } from '@/lib/data'; // Import the SocialLink type

// A map to hold SVG paths for different social media platforms
const socialIconPaths: { [key: string]: string } = {
  facebook: "M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z",
  linkedin: "M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z",
  instagram: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  twitter: "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z",
};

const ContactSection = ({ socialLinks, contactInfo }: { socialLinks: SocialLink[], contactInfo: ContactInfo[] }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  const controls = useAnimation();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Initialize EmailJS once when component mounts
  useEffect(() => {
    // Initialize EmailJS with your public key
    emailjs.init('vNuiU13g9NcZFYrlv');
  }, []);

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  useEffect(() => {
    if (!sectionRef.current) return;
    
    // Animate form inputs on focus
    const inputs = sectionRef.current.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        gsap.to(input, {
          borderColor: 'rgba(138, 43, 226, 0.8)',
          boxShadow: '0 0 0 3px rgba(138, 43, 226, 0.2)',
          duration: 0.3,
        });
      });
      
      input.addEventListener('blur', () => {
        gsap.to(input, {
          borderColor: 'rgba(255, 255, 255, 0.1)',
          boxShadow: 'none',
          duration: 0.3,
        });
      });
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare template parameters for EmailJS - matching the template variables
      const templateParams = {
        to_email: 'affiliate@appective.net',
        name: formState.name,
        time: new Date().toLocaleString(),
        message: formState.message,
        company: formState.company || 'Not provided',
        email: formState.email,
        phone: formState.phone || 'Not provided',
      };
      
      // Log the form data for debugging
      console.log('Form submission:', templateParams);
      
      // Send the email using EmailJS with your actual credentials
      const response = await emailjs.send(
        'service_0d9ftiz',  // Your EmailJS service ID
        'template_p9b78b9', // Your EmailJS template ID
        templateParams,
        'vNuiU13g9NcZFYrlv'  // Your EmailJS public key
      );
      
      console.log('Email sent successfully:', response);
      
      // Show success message
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form after submission
      setFormState({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
      });
      
      // Reset submission status after delay
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
      
    } catch (error) {
      console.error('Error sending form:', error);
      setIsSubmitting(false);
      alert('There was an error sending your message. Please try again later.');
    }
  };



  return (
    <section id="contact" ref={sectionRef} className="section py-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#07081e]/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#07081e]/70 to-transparent"></div>
        {/* Decorative elements */}
        <div className="absolute top-1/3 right-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute bottom-1/3 left-10 w-80 h-80 rounded-full bg-primary/10 blur-3xl"></div>
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
            Get in Touch
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Contact us to discuss your project or get more information. We will get back to you as soon as possible.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
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
            <h3 className="text-2xl font-bold mb-8">Write to <span className="gradient-text">Us</span></h3>
            
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-white/80 text-sm mb-2">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none transition-all duration-300"
                    placeholder="Your Full Name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-white/80 text-sm mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none transition-all duration-300"
                    placeholder="example@mail.com"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-white/80 text-sm mb-2">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formState.phone}
                    onChange={handleChange}
                    className="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none transition-all duration-300"
                    placeholder="Your Phone Number"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-white/80 text-sm mb-2">Company</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formState.company}
                    onChange={handleChange}
                    className="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none transition-all duration-300"
                    placeholder="Company Name"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-white/80 text-sm mb-2">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none transition-all duration-300 resize-none"
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>
              
              <div className="flex items-center">
                <motion.button
                  type="submit"
                  className="magnetic interactive-btn bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[180px]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : isSubmitted ? (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Sent!
                    </>
                  ) : (
                    'Send'
                  )}
                </motion.button>
                
                {isSubmitted && (
                  <motion.p 
                    className="ml-4 text-green-400"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    Your message has been sent successfully. We will get back to you as soon as possible.
                  </motion.p>
                )}
              </div>
            </form>
          </motion.div>
          
          <motion.div
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
            <h3 className="text-2xl font-bold mb-8">Contact <span className="gradient-text">Information</span></h3>
            
            <div className="space-y-8 mb-12">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={index}
                  href={info.link}
                  target={info.title === 'Address' ? "_blank" : undefined}
                  rel={info.title === 'Address' ? "noopener noreferrer" : undefined}
                  className="flex items-start p-6 bg-dark/50 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-primary/30 transition-all duration-300 group"
                  whileHover={{ y: -5, boxShadow: '0 10px 30px -10px rgba(138, 43, 226, 0.2)' }}
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl mr-4 group-hover:bg-primary/20 transition-colors duration-300">
                    {info.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-1">{info.title}</h4>
                    <p className="text-white/70 group-hover:text-primary transition-colors duration-300">{info.details}</p>
                  </div>
                </motion.a>
              ))}
            </div>
            
            <h3 className="text-2xl font-bold mb-6">Follow <span className="gradient-text">Us</span></h3>
            
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const iconPath = socialIconPaths[social.platform.toLowerCase()];
                if (!iconPath) return null;
                return (
                  <motion.a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.platform}
                    className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary/80 transition-colors duration-300"
                    whileHover={{ y: -5, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d={iconPath} />
                    </svg>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
