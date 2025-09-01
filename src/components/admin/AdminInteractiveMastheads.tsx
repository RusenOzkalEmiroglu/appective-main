"use client";

import React, { useState, useEffect } from 'react';
import { MastheadItem } from '@/data/interactiveMastheadsData';
import MastheadForm from '@/components/admin/MastheadForm';
import { supabase } from '@/lib/supabase';
import { fetchWithAuth } from '@/lib/auth';

// Define colors based on Appective theme
const primaryTextColor = 'text-white';
const secondaryTextColor = 'text-gray-300';
const accentBgColor = 'bg-purple-600';
const hoverAccentBgColor = 'hover:bg-purple-700';
const darkBg = 'bg-black';
const inputBg = 'bg-gray-800';
const inputBorder = 'border-gray-700';
const buttonClasses = `${accentBgColor} ${primaryTextColor} py-2 px-4 rounded-md ${hoverAccentBgColor} transition-colors`;

const AdminInteractiveMastheadsPage = () => {
  const [mastheads, setMastheads] = useState<MastheadItem[]>([]);
  const [filteredMastheads, setFilteredMastheads] = useState<MastheadItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MastheadItem | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [categories, setCategories] = useState<string[]>(['ALL']);
  const [brands, setBrands] = useState<string[]>(['ALL']);

  useEffect(() => {
    fetchMastheads();
  }, []);

  useEffect(() => {
    // Apply filters
    let items = mastheads;
    if (selectedCategory !== 'ALL') {
      items = items.filter(item => item.category.toUpperCase() === selectedCategory);
    }
    if (selectedBrand !== 'ALL') {
      items = items.filter(item => item.brand === selectedBrand);
    }
    setFilteredMastheads(items);
  }, [selectedCategory, selectedBrand, mastheads]);

  const fetchMastheads = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data, error } = await supabase
        .from('interactive_mastheads')
        .select('*')
        .order('id');
      
      if (error) throw error;
      
      // Supabase verilerini MastheadItem formatına dönüştür
      const formattedData = (data || []).map((item: any) => ({
        id: item.id,
        category: item.category,
        brand: item.brand,
        title: item.title,
        image: item.image,
        popupHtmlPath: item.popup_html_path,
        popupTitle: item.popup_title,
        popupDescription: item.popup_description || '',
        bannerDetails: {
          size: item.banner_size || '',
          platforms: item.banner_platforms || ''
        }
      }));
      
      setMastheads(formattedData);
      setFilteredMastheads(formattedData);
      
      // Extract unique categories and brands for filters
      const uniqueCategories = ['ALL', ...Array.from(new Set(formattedData.map((item: MastheadItem) => item.category.toUpperCase())))];
      const uniqueBrands = ['ALL', ...Array.from(new Set(formattedData.map((item: MastheadItem) => item.brand)))];
      setCategories(uniqueCategories as string[]);
      setBrands(uniqueBrands as string[]);
    } catch (err: any) {
      console.error("Fetch Mastheads Error:", err);
      setError(err.message || 'Masthead verileri yüklenemedi.');
      setMastheads([]);
      setFilteredMastheads([]);
    }
    setIsLoading(false);
  };
  


  const openAddForm = () => {
    setEditingItem(null);
    setIsEditMode(false);
    setShowForm(true);
  };

  const openEditForm = (item: MastheadItem) => {
    setEditingItem(item);
    setIsEditMode(true);
    setShowForm(true);
  };

  const saveMastheadsToServer = async (updatedMastheads: MastheadItem[]) => {
    try {
      // Bu fonksiyon artık handleFormSubmit içinde tek tek kayıt yapıldığı için gerekli değil
      // Ama mevcut kod yapısını bozmamak için bırakıyoruz
      console.log('Mastheads kaydedildi!');
    } catch (err: any) {
      console.error("Save Mastheads Error:", err);
      setError(err.message || 'Masthead verileri kaydedilemedi.');
    }
  };

  const handleFormSubmit = async (data: MastheadItem) => {
    try {
      if (isEditMode && editingItem) {
        // Update existing masthead
        const { error } = await supabase
          .from('interactive_mastheads')
          .update({
            title: data.title,
            category: data.category,
            brand: data.brand,
            image: data.image,
            popup_html_path: data.popupHtmlPath,
            popup_title: data.title, // popup_title alanı zorunlu
            popup_description: data.popupDescription || '',
            banner_size: data.bannerDetails?.size || '',
            banner_platforms: data.bannerDetails?.platforms || ''
          })
          .eq('id', editingItem.id);

        if (error) throw error;

        // Update local state
        const updatedMastheads = mastheads.map(item => 
          item.id === editingItem.id ? { ...data, id: editingItem.id } : item
        );
        setMastheads(updatedMastheads);
      } else {
        // Add new masthead - ID otomatik üretimi
        const newId = 'masthead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        const { data: newData, error } = await supabase
          .from('interactive_mastheads')
          .insert({
            id: newId,
            title: data.title,
            category: data.category,
            brand: data.brand,
            image: data.image,
            popup_html_path: data.popupHtmlPath,
            popup_title: data.title, // popup_title alanı zorunlu
            popup_description: data.popupDescription || '',
            banner_size: data.bannerDetails?.size || '',
            banner_platforms: data.bannerDetails?.platforms || ''
          })
          .select()
          .single();

        if (error) throw error;

        // Update local state
        const newItem = { ...data, id: newData.id };
        setMastheads([...mastheads, newItem]);
      }

      setShowForm(false);
      setEditingItem(null);
    } catch (err: any) {
      console.error('Masthead kaydetme hatası:', err);
      setError(err.message || 'Masthead kaydedilemedi.');
    }
  };

  const cleanupHtmlAsset = async (filePath: string) => {
    if (!filePath || !filePath.includes('/interactive_mastheads_zips/')) return;
    
    try {
      const response = await fetchWithAuth('/api/cleanup', {
        method: 'POST',
        body: JSON.stringify({ filePath }),
      });
      
      if (!response.ok) {
        const errData = await response.json().catch(() => ({ message: 'Failed to parse error' }));
        console.error('Cleanup error:', errData.message || `HTTP error! status: ${response.status}`);
      } else {
        console.log('HTML5 asset cleanup successful');
      }
    } catch (err: any) {
      console.error('HTML5 asset cleanup error:', err.message);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (window.confirm('Bu masthead öğesini silmek istediğinizden emin misiniz? Bu değişiklik kalıcı olacaktır.')) {
      try {
        const { error } = await supabase
          .from('interactive_mastheads')
          .delete()
          .eq('id', itemId); // ID text tipinde olduğu için parseInt kaldırıldı

        if (error) throw error;

        // Update local state
        setMastheads(mastheads.filter(item => item.id !== itemId));
      } catch (err: any) {
        console.error('Masthead silme hatası:', err);
        setError(err.message || 'Masthead silinemedi.');
      }
    }
  };

  return (
    <div className="h-full">
      <h1 className={`text-2xl font-bold ${primaryTextColor} mb-6`}>Rich Media</h1>
      
      {/* Filters */}
      <div className={`${inputBg} p-4 rounded-lg mb-6 shadow-md`}>
        <h2 className={`text-lg font-medium ${primaryTextColor} mb-4`}>Filters</h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className={`block ${secondaryTextColor} text-sm font-medium mb-2`}>Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'ALL' ? 'All Categories' : category.charAt(0) + category.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className={`block ${secondaryTextColor} text-sm font-medium mb-2`}>Brand</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {brands.map(brand => (
                <option key={brand} value={brand}>
                  {brand === 'ALL' ? 'All Brands' : brand}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={openAddForm}
          className={`${buttonClasses}`}
          disabled={isLoading}
        >
          Add New Rich Media
        </button>
      </div>
      
      {/* Mastheads List */}
      <div className={`${inputBg} rounded-lg shadow-xl p-4`}>
        {isLoading && filteredMastheads.length === 0 ? (
          <p className={`${secondaryTextColor} text-center py-10`}>Loading mastheads...</p>
        ) : error && filteredMastheads.length === 0 ? (
          <p className="text-red-500 text-center py-10">Error loading data: {error}</p>
        ) : filteredMastheads.length === 0 ? (
          <p className={`${secondaryTextColor} text-center py-10`}>No mastheads found for the selected filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${secondaryTextColor} uppercase tracking-wider`}>Preview</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${secondaryTextColor} uppercase tracking-wider`}>Category</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${secondaryTextColor} uppercase tracking-wider`}>Brand</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${secondaryTextColor} uppercase tracking-wider`}>Size</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${secondaryTextColor} uppercase tracking-wider`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredMastheads.map((masthead) => (
                  <tr key={masthead.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-20 h-12 bg-gray-600 rounded overflow-hidden">
                        {masthead.image && (
                          <img 
                            src={masthead.image} 
                            alt={masthead.title} 
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap ${secondaryTextColor}`}>
                      {masthead.category}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap ${secondaryTextColor}`}>
                      {masthead.brand}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap ${secondaryTextColor}`}>
                      {masthead.bannerDetails?.size || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button 
                        onClick={() => openEditForm(masthead)} 
                        className="text-purple-400 hover:text-purple-300 mr-4"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteItem(masthead.id)} 
                        className="text-red-500 hover:text-red-400"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Form Modal */}
      {showForm && (
        <MastheadForm
          initialData={editingItem}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
          isEditMode={isEditMode}
        />
      )}
    </div>
  );
};

export default AdminInteractiveMastheadsPage;
