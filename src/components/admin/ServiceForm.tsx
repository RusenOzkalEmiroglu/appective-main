"use client";

import React, { useState, useEffect } from 'react';
import { ServiceCategory } from '@/types/service';
import ImageUploader from './ImageUploader';
import {
  primaryTextColor,
  secondaryTextColor,
  inputBg,
  inputBorderClasses,
  primaryButtonClasses,
  secondaryButtonClasses,
  inputBaseClasses
} from '@/app/utils/constants';

interface ServiceFormProps {
  initialData?: ServiceCategory | null;
  onSubmit: (data: ServiceCategory) => void;
  onCancel: () => void;
  isEditMode: boolean;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ initialData, onSubmit, onCancel, isEditMode }) => {
  const emptyService: ServiceCategory = {
    id: '',
    name: '',
    description: '',
    icon: '',
    folderName: '',
    imageUrl: '',
  };
  
  // Helper function to generate a URL-friendly ID from the service name
  const generateServiceId = (name: string): string => {
    return name.toLowerCase()
      .replace(/\s+/g, '-')       // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, '') // Remove special characters
      .replace(/-+/g, '-');       // Replace multiple hyphens with single hyphen
  };

  const [formData, setFormData] = useState<ServiceCategory>(initialData || emptyService);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(emptyService);
    }
    // Clear errors when initialData changes (e.g., opening form for new vs. edit)
    setFormErrors({}); 
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Auto-generate ID and folderName when name changes
    if (name === 'name' && !isEditMode) {
      const generatedId = generateServiceId(value);
      const generatedFolderName = value ? `${generatedId}_folder` : '';
      
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        id: generatedId,
        folderName: generatedFolderName
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear specific field error on change
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Only validate visible fields
    if (!formData.name.trim()) {
      errors.name = 'Service name is required.';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required.';
    }
    
    // Ensure ID and folderName are set behind the scenes
    if (!isEditMode) {
      if (!formData.id.trim()) {
        formData.id = generateServiceId(formData.name);
      }
      if (!formData.folderName.trim()) {
        formData.folderName = `${formData.id}_folder`;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Service ID is now auto-generated and hidden */}

      <div>
        <label htmlFor="name" className={`block text-sm font-medium ${primaryTextColor} mb-1`}>Service Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          className={`${inputBaseClasses} ${formErrors.name ? 'border-red-500' : inputBorderClasses}`}
          placeholder="e.g., Cost Per Install, Rich Media Ads"
        />
        {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
      </div>

      <div>
        <label htmlFor="description" className={`block text-sm font-medium ${primaryTextColor} mb-1`}>Description</label>
        <textarea
          name="description"
          id="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className={`${inputBaseClasses} ${formErrors.description ? 'border-red-500' : inputBorderClasses}`}
          placeholder="Short description for the service card"
        />
        {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
      </div>

      <div>
        <label htmlFor="icon" className={`block text-sm font-medium ${primaryTextColor} mb-1`}>Icon</label>
        <select
          name="icon"
          id="icon"
          value={formData.icon || ''}
          onChange={handleChange}
          className={`${inputBaseClasses} ${inputBorderClasses}`}
        >
          <option value="">Select an icon</option>
          <option value="📱">📱 Mobile</option>
          <option value="💻">💻 Desktop</option>
          <option value="🖥️">🖥️ Monitor</option>
          <option value="📊">📊 Chart</option>
          <option value="📈">📈 Growth</option>
          <option value="🚀">🚀 Rocket</option>
          <option value="⚙️">⚙️ Settings</option>
          <option value="🔍">🔍 Search</option>
          <option value="📝">📝 Document</option>
          <option value="📢">📢 Announcement</option>
          <option value="🎯">🎯 Target</option>
          <option value="💡">💡 Idea</option>
          <option value="🔒">🔒 Security</option>
          <option value="🔔">🔔 Notification</option>
          <option value="📦">📦 Package</option>
          <option value="🔄">🔄 Sync</option>
          <option value="⚡">⚡ Lightning</option>
          <option value="🌐">🌐 Globe</option>
          <option value="📅">📅 Calendar</option>
        </select>
        <p className={`text-xs ${secondaryTextColor} mt-1`}>Select an icon for this service.</p>
      </div>

      {/* Folder Name is now auto-generated and hidden */}

      <div>
        <label className={`block text-sm font-medium ${primaryTextColor} mb-1`}>Service Image</label>
        <ImageUploader 
          onImageUploaded={(filePath) => {
            setFormData(prev => ({ ...prev, imageUrl: filePath }));
          }}
          category="services"
          brand="main"
          type="preview"
          currentImagePath={formData.imageUrl || ''}
        />
        <p className={`text-xs ${secondaryTextColor} mt-1`}>Upload a main image for this service. Recommended size: 600x400px.</p>
      </div>



      <div className="flex justify-end space-x-4 pt-2">
        <button type="button" onClick={onCancel} className={`${secondaryButtonClasses} hover:bg-gray-600`}>
          Cancel
        </button>
        <button type="submit" className={`${primaryButtonClasses} hover:bg-purple-700`}>
          {isEditMode ? 'Update Service' : 'Add Service'}
        </button>
      </div>
    </form>
  );
};

export default ServiceForm;
