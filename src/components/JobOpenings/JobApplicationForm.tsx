'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Upload, X, Loader2 } from 'lucide-react';

interface JobApplicationFormProps {
  jobId: string;
  jobTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({ 
  jobId, 
  jobTitle,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
      
      // Check file type
      if (fileExt !== 'pdf' && fileExt !== 'doc' && fileExt !== 'docx') {
        setError('Lütfen sadece PDF veya Word dosyası yükleyin.');
        setFile(null);
        setFileName('');
        return;
      }
      
      // Check file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('Dosya boyutu 5MB\'dan küçük olmalıdır.');
        setFile(null);
        setFileName('');
        return;
      }

      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError('');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Form validation
    if (!formData.fullName || !formData.email || !formData.phone || !file) {
      setError('Lütfen tüm zorunlu alanları doldurun ve CV yükleyin.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('jobId', jobId);
      formDataToSend.append('jobTitle', jobTitle);
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('message', formData.message);
      if (file) {
        formDataToSend.append('cv', file);
      }

      const response = await fetch('/api/job-applications', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Başvuru gönderilirken bir hata oluştu.');
      }

      // Reset form and show success
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        message: '',
      });
      setFile(null);
      setFileName('');
      onSuccess();
    } catch (error) {
      setError('Başvuru gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      console.error('Application submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="w-full"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-purple-400">
          "{jobTitle}" Pozisyonuna Başvur
        </h3>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
            Ad Soyad*
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Adınız Soyadınız"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            E-posta*
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="ornek@email.com"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
            Telefon*
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="+90 5XX XXX XX XX"
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
            Mesajınız
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            placeholder="Kendiniz hakkında kısa bir bilgi verebilirsiniz..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            CV Yükle* (PDF, DOC, DOCX - max 5MB)
          </label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx"
          />
          <div 
            onClick={triggerFileInput}
            className="w-full bg-gray-900/50 border border-gray-700 border-dashed rounded-lg px-4 py-4 text-center cursor-pointer hover:bg-gray-800/50 transition-colors"
          >
            {fileName ? (
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle size={20} className="text-green-500" />
                <span className="text-gray-300 truncate max-w-xs">{fileName}</span>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setFileName('');
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <Upload size={24} className="text-purple-400" />
                <span className="text-gray-400">CV'nizi buraya sürükleyin veya seçmek için tıklayın</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex-1"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex-1 flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin mr-2" />
                Gönderiliyor...
              </>
            ) : (
              'Başvuruyu Gönder'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default JobApplicationForm;
