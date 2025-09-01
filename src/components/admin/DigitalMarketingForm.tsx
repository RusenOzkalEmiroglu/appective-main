"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { DigitalMarketingItem } from '@/data/digitalMarketingData';
import ImageUploader from './ImageUploader'; // Assuming ImageUploader is in the same directory
import { primaryButtonClasses, secondaryButtonClasses, inputBaseClasses, inputBorderClasses, pageTitleClasses, cardClasses, primaryTextColor, secondaryTextColor, inputBg } from '@/app/utils/constants';

interface DigitalMarketingFormProps {
  onSubmit: (item: Omit<DigitalMarketingItem, 'id'> & { id?: number }) => void;
  onCancel: () => void;
  initialData?: DigitalMarketingItem | null;
}

const DigitalMarketingForm: React.FC<DigitalMarketingFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [services, setServices] = useState(''); // Comma-separated string
  const [projectUrl, setProjectUrl] = useState('');
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setClient(initialData.client || '');
      setDescription(initialData.description || '');
      setImage(initialData.image || '');
      setServices(initialData.services?.join(', ') || '');
      setProjectUrl(initialData.projectUrl || '');
    } else {
      // Reset form for new entry
      setTitle('');
      setClient('');
      setDescription('');
      setImage('');
      setServices('');
      setProjectUrl('');
    }
  }, [initialData]);

  const handleImageUploaded = (url: string) => {
    setImage(url);
    setImageError(null); // Clear error when image is uploaded
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Validate that image is uploaded
    if (!image || image.trim() === '') {
      setImageError('Lütfen bir resim yükleyin.');
      return;
    }
    
    const servicesArray = services.split(',').map(s => s.trim()).filter(s => s);
    const itemToSubmit = {
      title,
      client,
      description,
      image,
      services: servicesArray,
      projectUrl,
    };

    if (initialData && initialData.id) {
      onSubmit({ ...itemToSubmit, id: initialData.id });
    } else {
      onSubmit(itemToSubmit);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${cardClasses} p-6 md:p-8`}>
      <div>
        <label htmlFor="title" className={`block text-sm font-medium ${secondaryTextColor} mb-1`}>Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={`w-full px-4 py-2.5 ${inputBg} border ${inputBorderClasses} rounded-lg ${primaryTextColor} focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow`}
        />
      </div>

      <div>
        <label htmlFor="client" className={`block text-sm font-medium ${secondaryTextColor} mb-1`}>Client</label>
        <input
          id="client"
          type="text"
          value={client}
          onChange={(e) => setClient(e.target.value)}
          required
          className={`w-full px-4 py-2.5 ${inputBg} border ${inputBorderClasses} rounded-lg ${primaryTextColor} focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow`}
        />
      </div>

      <div>
        <label htmlFor="description" className={`block text-sm font-medium ${secondaryTextColor} mb-1`}>Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
          className={`w-full px-4 py-2.5 ${inputBg} border ${inputBorderClasses} rounded-lg ${primaryTextColor} focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow resize-none`}
        />
      </div>

      <div>
        <label className={`block text-sm font-medium ${secondaryTextColor} mb-1`}>Preview Image</label>
        <ImageUploader 
          onImageUploaded={handleImageUploaded}
          currentImagePath={image}
          category="digital-marketing"
          brand={client || title || 'dm-project'}
          type="preview"
        />
        {imageError && (
          <p className="text-red-500 text-sm mt-1">{imageError}</p>
        )}
        {image && <p className={`text-xs ${secondaryTextColor} mt-1`}>Current image: {image}</p>}
      </div>

      <div>
        <label htmlFor="services" className={`block text-sm font-medium ${secondaryTextColor} mb-1`}>Services (comma-separated)</label>
        <input
          id="services"
          type="text"
          value={services}
          onChange={(e) => setServices(e.target.value)}
          placeholder="e.g., SEO, PPC, Content Marketing"
          className={`w-full px-4 py-2.5 ${inputBg} border ${inputBorderClasses} rounded-lg ${primaryTextColor} focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow`}
        />
      </div>

      <div>
        <label htmlFor="projectUrl" className={`block text-sm font-medium ${secondaryTextColor} mb-1`}>Project URL</label>
        <input
          id="projectUrl"
          type="url"
          value={projectUrl}
          onChange={(e) => setProjectUrl(e.target.value)}
          placeholder="https://example.com/case-study"
          className={`w-full px-4 py-2.5 ${inputBg} border ${inputBorderClasses} rounded-lg ${primaryTextColor} focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow`}
        />
      </div>

      <div className="flex justify-end space-x-4 pt-2">
        <button 
          type="button" 
          onClick={onCancel} 
          className={`${secondaryButtonClasses} hover:bg-gray-700`}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className={`${primaryButtonClasses} hover:bg-purple-700`}
        >
          {initialData ? 'Save Changes' : 'Add Project'}
        </button>
      </div>
    </form>
  );
};

export default DigitalMarketingForm;
