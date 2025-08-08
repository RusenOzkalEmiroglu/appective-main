"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

const SimpleContact = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form after submission
      setFormState({
        name: '',
        email: '',
        message: '',
      });
      
      // Reset submission status after delay
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="bg-dark/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
      <h3 className="text-2xl font-bold mb-6">Hızlı <span className="gradient-text">İletişim</span></h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="simple-name" className="block text-white/80 text-sm mb-2">Ad Soyad</label>
          <input
            type="text"
            id="simple-name"
            name="name"
            value={formState.name}
            onChange={handleChange}
            required
            className="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
            placeholder="Adınız Soyadınız"
          />
        </div>
        
        <div>
          <label htmlFor="simple-email" className="block text-white/80 text-sm mb-2">E-posta</label>
          <input
            type="email"
            id="simple-email"
            name="email"
            value={formState.email}
            onChange={handleChange}
            required
            className="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
            placeholder="ornek@mail.com"
          />
        </div>
        
        <div>
          <label htmlFor="simple-message" className="block text-white/80 text-sm mb-2">Mesajınız</label>
          <textarea
            id="simple-message"
            name="message"
            value={formState.message}
            onChange={handleChange}
            required
            rows={4}
            className="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 resize-none"
            placeholder="Mesajınızı yazın..."
          ></textarea>
        </div>
        
        <div>
          <motion.button
            type="submit"
            className="magnetic interactive-btn bg-primary hover:bg-primary-dark text-white w-full px-6 py-3 rounded-full text-base font-medium transition-all duration-300 shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
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
                Gönderildi!
              </>
            ) : (
              'Gönder'
            )}
          </motion.button>
          
          {isSubmitted && (
            <motion.p 
              className="mt-4 text-green-400 text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.
            </motion.p>
          )}
        </div>
      </form>
    </div>
  );
};

export default SimpleContact;