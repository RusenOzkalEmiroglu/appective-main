"use client";

import React, { useState, useRef, useEffect } from 'react';
// Using img tag instead of Next.js Image to avoid issues with dynamic paths

interface ImageUploaderProps {
  onImageUploaded: (filePath: string) => void;
  category: string;
  brand: string;
  type: 'preview' | 'popup';
  currentImagePath?: string;
  acceptTypes?: string;
  isZipUpload?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUploaded, 
  category, 
  brand, 
  type,
  currentImagePath,
  acceptTypes = "image/jpeg,image/png,image/gif,image/webp",
  isZipUpload = false
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImagePath || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For images, create a preview URL
    if (!isZipUpload) {
      const localPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(localPreviewUrl);
    } else {
      // For ZIP files, we can't preview them directly
      // Just show a placeholder or icon
      setPreviewUrl(null);
    }

    // Upload the file
    await uploadFile(file);

    // Clean up the local preview URL if it was created
    if (!isZipUpload) {
      return () => URL.revokeObjectURL(previewUrl as string);
    }
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      formData.append('brand', brand);
      formData.append('type', type);
      formData.append('isZip', isZipUpload ? 'true' : 'false');

      // Get auth token from localStorage
      const token = localStorage.getItem('supabase_auth_token');
      
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to upload ${isZipUpload ? 'ZIP file' : 'image'}`);
      }

      const data = await response.json();
      onImageUploaded(data.filePath);
    } catch (err: any) {
      setError(err.message || `An error occurred while uploading the ${isZipUpload ? 'ZIP file' : 'image'}`);
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    // For images, create a preview URL
    if (!isZipUpload) {
      const localPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(localPreviewUrl);
    } else {
      // For ZIP files, we can't preview them directly
      setPreviewUrl(null);
    }

    // Upload the file
    await uploadFile(file);

    // Clean up the local preview URL if it was created
    if (!isZipUpload && previewUrl) {
      return () => URL.revokeObjectURL(previewUrl);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Define styles based on Appective theme
  const primaryTextColor = 'text-white';
  const secondaryTextColor = 'text-gray-300';
  const accentBgColor = 'bg-purple-600';
  const hoverAccentBgColor = 'hover:bg-purple-700';
  const inputBg = 'bg-gray-700';
  const inputBorder = 'border-gray-600';

  return (
    <div className="mb-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptTypes}
        className="hidden"
      />

      <div 
        onClick={triggerFileInput}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed ${inputBorder} rounded-lg p-4 text-center cursor-pointer
          ${inputBg} transition-colors hover:border-purple-500
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        {previewUrl ? (
          <div className="relative w-full h-40 mb-2">
            <img
              src={previewUrl}
              alt="Preview"
              style={{ objectFit: 'contain', width: '100%', height: '100%' }}
              className="rounded"
            />
          </div>
        ) : isZipUpload && currentImagePath ? (
          <div className="flex flex-col items-center justify-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm text-purple-400 mt-2">HTML5 Ad ZIP Uploaded</p>
          </div>
        ) : (
          <div className={`text-4xl ${secondaryTextColor} mb-2`}>
            {isZipUpload ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
          </div>
        )}

        <div className={`${secondaryTextColor} text-sm`}>
          {isUploading ? (
            <p>Uploading...</p>
          ) : (
            <>
              <p>Click or drag and drop to upload {isZipUpload ? 'a ZIP file containing an HTML5 ad' : type === 'preview' ? 'a 970x250 image' : 'an image'}</p>
              <p className="text-xs mt-1">{isZipUpload ? 'ZIP file containing index.html (max 50MB)' : 'JPEG, PNG, GIF, or WebP (max 5MB)'}</p>
            </>
          )}
        </div>

        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default ImageUploader;
