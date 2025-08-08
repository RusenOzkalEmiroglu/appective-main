"use client";

import React, { useState, useEffect } from 'react';
import { MastheadItem } from '@/data/interactiveMastheadsData';
import ImageUploader from './ImageUploader';

interface MastheadFormProps {
  initialData?: MastheadItem | null;
  onSubmit: (data: MastheadItem) => void;
  onCancel: () => void;
  isEditMode: boolean;
}

// Consistent styling elements from AdminPage
const primaryTextColor = 'text-white';
const secondaryTextColor = 'text-gray-300';
const darkBg = 'bg-black'; 
const formSectionBg = 'bg-gray-850'; // Background for the form itself
const inputBg = 'bg-gray-700'; 
const inputBorder = 'border-gray-600';
const labelClass = `block text-sm font-medium ${secondaryTextColor} mb-1`;
const inputClass = `mt-1 block w-full px-3 py-2 ${inputBg} ${primaryTextColor} border ${inputBorder} rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm`;
const buttonAccentClass = `bg-purple-600 hover:bg-purple-700 ${primaryTextColor} py-2 px-4 rounded-md transition-colors`;
const buttonSecondaryClass = `bg-gray-600 hover:bg-gray-700 ${primaryTextColor} py-2 px-4 rounded-md transition-colors`;

const MastheadForm: React.FC<MastheadFormProps> = ({ initialData, onSubmit, onCancel, isEditMode }) => {
  const emptyMasthead: MastheadItem = {
    id: '', // Will be set on effect or by parent for new items
    category: '',
    brand: '',
    title: '',
    image: '',
    popupHtmlPath: '',
    popupTitle: '', // Will be set to same as title
    popupDescription: '',
    bannerDetails: { size: '970x250', platforms: '' },
  };

  const [formData, setFormData] = useState<MastheadItem>(initialData || emptyMasthead);

  // Effect to handle Escape key press for closing the modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCancel]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // For new items, use the empty masthead template
      setFormData(emptyMasthead);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('bannerDetails.')) {
      const detailKey = name.split('.')[1] as keyof MastheadItem['bannerDetails'];
      setFormData(prev => ({
        ...prev,
        bannerDetails: {
          ...prev.bannerDetails,
          [detailKey]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure popupTitle is always the same as title
    const finalData = {
      ...formData,
      popupTitle: formData.title
    };
    onSubmit(finalData);
  };

  return (
    // Modal container
    <div className={`fixed inset-0 ${darkBg} bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]`}> {/* Increased z-index */}
      <form 
        onSubmit={handleSubmit} 
        className={`${formSectionBg} p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-4 border ${inputBorder}`}
        onClick={(e) => e.stopPropagation()} // Prevent closing if clicking inside form
      >
        <h2 className={`text-xl font-semibold ${primaryTextColor} mb-4`}>{isEditMode ? 'Edit Rich Media' : 'Add New Rich Media'}</h2>

        <div>
          <label htmlFor="title" className={labelClass}>Title*</label>
          <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className={inputClass} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className={labelClass}>Category*</label>
            <input type="text" name="category" id="category" value={formData.category} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="brand" className={labelClass}>Brand*</label>
            <input type="text" name="brand" id="brand" value={formData.brand} onChange={handleChange} required className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Main Image* (970x250)</label>
          <ImageUploader 
            onImageUploaded={(imagePath) => setFormData(prev => ({ ...prev, image: imagePath }))}
            category={formData.category || 'uncategorized'}
            brand={formData.brand || 'unknown'}
            type="preview"
            currentImagePath={formData.image}
          />
          {formData.image && (
            <p className={`text-xs ${secondaryTextColor} mt-1`}>Current path: {formData.image}</p>
          )}
        </div>

        {/* Popup Title removed - using main title for both */}

        <div>
          <label className={labelClass}>Popup HTML5 Ad (ZIP)*</label>
          <ImageUploader 
            onImageUploaded={(filePath) => setFormData(prev => ({ ...prev, popupHtmlPath: filePath }))}
            category={formData.category || 'uncategorized'}
            brand={formData.brand || 'unknown'}
            type="popup"
            currentImagePath={formData.popupHtmlPath}
            acceptTypes=".zip"
            isZipUpload={true}
          />
          {formData.popupHtmlPath && (
            <p className={`text-xs ${secondaryTextColor} mt-1`}>Current HTML path: {formData.popupHtmlPath}</p>
          )}
          <p className={`text-xs ${secondaryTextColor} mt-1`}>Upload a ZIP file containing an HTML5 ad (970x250px). The ZIP must include an index.html file.</p>
        </div>

        <div>
          <label htmlFor="popupDescription" className={labelClass}>Popup Description</label>
          <textarea name="popupDescription" id="popupDescription" value={formData.popupDescription} onChange={handleChange} rows={3} className={inputClass}></textarea>
        </div>

        <fieldset className={`border ${inputBorder} p-4 rounded-md`}>
          <legend className={`text-md font-medium ${secondaryTextColor} px-1`}>Banner Details</legend>
          <div className="space-y-3 mt-2">
            <div>
              <label htmlFor="bannerDetails.size" className={labelClass}>Size*</label>
              <select 
                name="bannerDetails.size" 
                id="bannerDetails.size" 
                value={formData.bannerDetails.size} 
                onChange={handleChange} 
                required 
                className={inputClass}
              >
                <option value="">Select an ad format</option>
                <option value="INTERACTIVE">INTERACTIVE</option>
                <option value="VIDEO INTERSTITIAL">VIDEO INTERSTITIAL</option>
                <option value="INTERSTITIAL">INTERSTITIAL</option>
                <option value="FORM INSTERSTITIAL">FORM INSTERSTITIAL</option>
                <option value="MOBILE INSTERSTITIAL">MOBILE INSTERSTITIAL</option>
                <option value="INTERACTIVE MASTHEAD">INTERACTIVE MASTHEAD</option>
                <option value="MOBILE MASTHEAD">MOBILE MASTHEAD</option>
                <option value="MASTHEAD">MASTHEAD</option>
                <option value="INPAGE">INPAGE</option>
                <option value="MOBILE FULLPAGE">MOBILE FULLPAGE</option>
                <option value="PIXAD">PIXAD</option>
                <option value="FULLPAGE">FULLPAGE</option>
                <option value="SCROLLAD">SCROLLAD</option>
                <option value="MOBILE SCROLLAD">MOBILE SCROLLAD</option>
                <option value="INTERSCROLLER">INTERSCROLLER</option>
              </select>
            </div>
            <div>
              <label htmlFor="bannerDetails.platforms" className={labelClass}>Platforms* (comma-separated)</label>
              <input type="text" name="bannerDetails.platforms" id="bannerDetails.platforms" value={formData.bannerDetails.platforms} onChange={handleChange} required className={inputClass} />
            </div>
          </div>
        </fieldset>

        <div className="flex justify-end space-x-3 pt-4">
          <button type="button" onClick={onCancel} className={buttonSecondaryClass}>
            Cancel
          </button>
          <button type="submit" className={buttonAccentClass}>
            {isEditMode ? 'Save Changes' : 'Add Masthead'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MastheadForm;
