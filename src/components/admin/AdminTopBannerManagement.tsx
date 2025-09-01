"use client";

import React, { useState, useEffect, FC, ReactNode, useCallback } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

// --- Reusable Confirmation Modal Component --- //
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  isActionInProgress: boolean;
  children: ReactNode;
}

const ConfirmationModal: FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, isActionInProgress, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
        <div className="text-gray-300 mb-6">{children}</div>
        <div className="flex justify-end gap-4">
          <button onClick={onClose} disabled={isActionInProgress} className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-500 transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={isActionInProgress} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
            {isActionInProgress && <span className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></span>}
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Admin Top Banner Management Component --- //
const AdminTopBannerManagement: FC = () => {
  const [currentBanner, setCurrentBanner] = useState<{ src: string; targetUrl: string } | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [targetUrl, setTargetUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActionInProgress, setIsActionInProgress] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', action: null as 'save' | 'delete' | null });
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const fetchBanner = useCallback(async () => {
    try {
      console.log('Fetching banner data...'); // Debug
      
      const { data, error } = await supabase
        .from('top_banner')
        .select('id, title, subtitle, description, button_text, button_link, background_image')
        .eq('id', 1)
        .maybeSingle();
      
      console.log('Fetch result:', { data, error }); // Debug
      
      if (error) {
        console.error('Banner fetch error:', error);
        setCurrentBanner(null);
        setTargetUrl('');
        return;
      }
      
      if (data) {
        console.log('Setting banner data:', data); // Debug
        setCurrentBanner({
          src: data.background_image || '',
          targetUrl: data.button_link || ''
        });
        setTargetUrl(data.button_link || '');
      } else {
        console.log('No banner record found, will create on save'); // Debug
        setCurrentBanner(null);
        setTargetUrl('');
      }
    } catch (error) {
      console.error('Banner yüklenirken hata:', error);
      setCurrentBanner(null);
      setTargetUrl('');
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchBanner().finally(() => setIsLoading(false));
  }, [fetchBanner]);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleSave = () => {
    if (!newImage && targetUrl === (currentBanner?.targetUrl || '')) {
      showFeedback('error', 'No changes to save.');
      return;
    }
    setModalContent({ title: 'Confirm Save', message: 'Are you sure you want to update the banner?', action: 'save' });
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    if (!currentBanner) return;
    setModalContent({ title: 'Confirm Deletion', message: 'Are you sure you want to delete the current banner?', action: 'delete' });
    setIsModalOpen(true);
  };

  const confirmAction = async () => {
    setIsActionInProgress(true);
    let success = false;

    try {
      if (modalContent.action === 'save') {
        // Resim yükleme işlemi
        let imageUrl = currentBanner?.src || '';
        
        if (newImage) {
          // Resmi public/images/banner klasörüne kaydet
          const formData = new FormData();
          formData.append('file', newImage);
          
          try {
            const uploadResponse = await fetch('/api/upload-banner', {
              method: 'POST',
              body: formData,
            });
            
            if (uploadResponse.ok) {
              const result = await uploadResponse.json();
              imageUrl = result.url;
            } else {
              throw new Error('Resim yükleme başarısız');
            }
          } catch (uploadError) {
            // API yoksa, basit yol kullan
            imageUrl = `/images/banner/${newImage.name}`;
          }
        }

        // Supabase'i güncelle
        const updateData = {
          button_link: targetUrl,
          background_image: imageUrl
        };

        console.log('Updating with data:', updateData); // Debug

        // Önce kayıt var mı kontrol et
        const { data: existingRecord } = await supabase
          .from('top_banner')
          .select('id')
          .eq('id', 1)
          .maybeSingle();

        let result;
        if (existingRecord) {
          // Kayıt varsa güncelle
          result = await supabase
            .from('top_banner')
            .update(updateData)
            .eq('id', 1)
            .select();
        } else {
          // Kayıt yoksa oluştur
          const insertData = {
            id: 1,
            title: 'Welcome to Appective',
            subtitle: 'Digital Marketing & Development',
            description: 'We create innovative digital solutions for your business',
            button_text: 'Get Started',
            ...updateData
          };
          result = await supabase
            .from('top_banner')
            .insert(insertData)
            .select();
        }
        
        console.log('Save result:', result); // Debug
        
        if (result.error) {
          console.error('Save error:', result.error);
          throw result.error;
        }

        success = true;
        showFeedback('success', 'Banner başarıyla güncellendi!');
      } else if (modalContent.action === 'delete') {
        const { error } = await supabase
          .from('top_banner')
          .update({ background_image: null })
          .eq('id', 1);
        
        if (error) throw error;
        success = true;
        showFeedback('success', 'Banner başarıyla silindi!');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu';
      showFeedback('error', `Hata: ${errorMessage}`);
    } finally {
      setIsModalOpen(false);
      setIsActionInProgress(false);
      if (success) {
        setNewImage(null);
        await fetchBanner();
      }
    }
  };

  if (isLoading) {
    return <div className="text-center p-8 text-white">Loading Banner Management...</div>;
  }

  return (
    <div className="p-6 bg-gray-900 rounded-lg text-white relative">
      <h2 className="text-2xl font-bold mb-4">Top Banner Management</h2>

      {feedback.message && (
        <div className={`p-3 rounded-md mb-4 text-white ${feedback.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {feedback.message}
        </div>
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => !isActionInProgress && setIsModalOpen(false)}
        onConfirm={confirmAction}
        title={modalContent.title}
        isActionInProgress={isActionInProgress}
      >
        <p>{modalContent.message}</p>
      </ConfirmationModal>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Current Banner</h3>
        {currentBanner && currentBanner.src ? (
          <div className="border border-gray-700 p-4 rounded-md bg-gray-800">
            <Image src={currentBanner.src} alt="Current Banner" width={500} height={100} className="rounded-md object-contain" unoptimized />
            <p className="mt-2 text-sm text-gray-400">Target URL: {currentBanner.targetUrl || 'Not set'}</p>
          </div>
        ) : (
          <p className="text-gray-500">No active banner.</p>
        )}
      </div>

      <div className="space-y-6 bg-gray-800 p-4 rounded-md">
        <div>
          <label htmlFor="bannerImage" className="block mb-2 font-medium">Upload New Banner Image (Optional)</label>
          <input id="bannerImage" type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer" />
        </div>
        <div>
          <label htmlFor="targetUrl" className="block mb-2 font-medium">Target URL (Optional)</label>
          <input id="targetUrl" type="text" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} placeholder="https://example.com" className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
      </div>

      <div className="flex items-center gap-4 mt-6">
        <button onClick={handleSave} className="px-6 py-2 rounded bg-purple-600 hover:bg-purple-500 transition-colors font-semibold">
          Save Changes
        </button>
        {currentBanner && (
          <button onClick={handleDelete} className="px-6 py-2 rounded bg-red-800 hover:bg-red-700 transition-colors font-semibold">
            Delete Current Banner
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminTopBannerManagement;
