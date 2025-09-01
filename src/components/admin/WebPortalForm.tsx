"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { WebPortalItem } from '@/data/webPortalsData';
import ImageUploader from './ImageUploader';
import { primaryButtonClasses, secondaryButtonClasses, inputBaseClasses, inputBorderClasses, primaryTextColor, secondaryTextColor } from '@/app/utils/constants';

interface WebPortalFormProps {
  onSubmit: (data: Omit<WebPortalItem, 'id'> & { id?: number }) => void;
  onCancel: () => void;
  initialData?: WebPortalItem | null;
}

const WebPortalForm: React.FC<WebPortalFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState<Omit<WebPortalItem, 'id'> & { id?: number }>({
    title: '',
    client: '',
    description: '',
    image: '',
    projectUrl: '',
  });
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        client: '',
        description: '',
        image: '',
        projectUrl: '',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newFormData = { ...prev, [name]: value };
      // Automatically set client to be the same as title
      if (name === 'title') {
        newFormData.client = value;
      }
      return newFormData;
    });
  };

  const handleImageUploaded = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }));
    setImageError(null); // Clear error when image is uploaded
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Validate that image is uploaded
    if (!formData.image || formData.image.trim() === '') {
      setImageError('Lütfen bir resim yükleyin.');
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg border border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className={`text-2xl font-bold ${primaryTextColor} mb-4`}>
          {initialData ? 'Edit Web Portal' : 'Add New Web Portal'}
        </h2>
        
        <div>
          <label htmlFor="title" className={`block text-sm font-medium ${secondaryTextColor}`}>Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full mt-1 ${inputBaseClasses} ${inputBorderClasses}`}
            required
          />
        </div>

        <div>
          <label htmlFor="description" className={`block text-sm font-medium ${secondaryTextColor}`}>Description</label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full mt-1 ${inputBaseClasses} ${inputBorderClasses}`}
            required
          />
        </div>

        <div className="space-y-2">
          <label className={`block text-sm font-medium ${secondaryTextColor}`}>
            Project Image
          </label>
          <ImageUploader
            onImageUploaded={handleImageUploaded}
            category="web-portals"
            brand="web-portals"
            type="preview"
            currentImagePath={formData.image}
          />
          {imageError && (
            <p className="text-red-500 text-sm mt-1">{imageError}</p>
          )}
        </div>

        <div>
          <label htmlFor="projectUrl" className={`block text-sm font-medium ${secondaryTextColor}`}>Project URL (Optional)</label>
          <input
            type="url"
            name="projectUrl"
            id="projectUrl"
            value={formData.projectUrl || ''}
            onChange={handleChange}
            className={`w-full mt-1 ${inputBaseClasses} ${inputBorderClasses}`}
            placeholder="https://example.com"
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={onCancel} className={`${secondaryButtonClasses}`}>
            Cancel
          </button>
          <button type="submit" className={`${primaryButtonClasses}`}>
            {initialData ? 'Update Project' : 'Add Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WebPortalForm;
