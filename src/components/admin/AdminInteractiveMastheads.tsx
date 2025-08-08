"use client";

import React, { useState, useEffect } from 'react';
import { MastheadItem } from '@/data/interactiveMastheadsData';
import MastheadForm from '@/components/admin/MastheadForm';

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
      const response = await fetch('/api/mastheads');
      if (!response.ok) {
        const errData = await response.json().catch(() => ({ message: 'Failed to fetch mastheads and parse error' }));
        throw new Error(errData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMastheads(data);
      setFilteredMastheads(data);
      
      // Extract unique categories and brands for filters
      const uniqueCategories = ['ALL', ...Array.from(new Set(data.map((item: MastheadItem) => item.category.toUpperCase())))];
      const uniqueBrands = ['ALL', ...Array.from(new Set(data.map((item: MastheadItem) => item.brand)))];
      setCategories(uniqueCategories as string[]);
      setBrands(uniqueBrands as string[]);
    } catch (err: any) {
      console.error("Fetch Mastheads Error:", err);
      setError(err.message || 'Could not load mastheads.');
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
      const response = await fetch('/api/mastheads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMastheads),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({ message: 'Failed to save mastheads and parse error' }));
        throw new Error(errData.message || `HTTP error! status: ${response.status}`);
      }
      console.log('Mastheads saved successfully to server!');
      // Optionally, refetch mastheads or update UI to confirm save
      // fetchMastheads(); // Or update state more directly if API returns new data
    } catch (err: any) {
      console.error("Save Mastheads to Server Error:", err);
      setError(err.message || 'Could not save mastheads to server.');
      // Consider user-facing error message here
      alert(`Error saving to server: ${err.message}`);
    }
  };

  const handleFormSubmit = async (data: MastheadItem) => {
    let updatedMastheads;
    
    if (isEditMode && editingItem) {
      // If editing and the popupHtmlPath has changed, clean up the old one
      const oldPopupHtmlPath = editingItem.popupHtmlPath;
      const newPopupHtmlPath = data.popupHtmlPath;
      
      if (oldPopupHtmlPath && oldPopupHtmlPath !== newPopupHtmlPath && oldPopupHtmlPath.includes('/interactive_mastheads_zips/')) {
        await cleanupHtmlAsset(oldPopupHtmlPath);
      }
      
      // Ensure we keep the original ID when editing
      const updatedData = { ...data, id: editingItem.id };
      updatedMastheads = mastheads.map(item => item.id === editingItem.id ? updatedData : item);
    } else {
      // Generate a string ID for new items
      const newItem = { ...data, id: `masthead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}` };
      updatedMastheads = [...mastheads, newItem];
    }
    
    setMastheads(updatedMastheads);
    await saveMastheadsToServer(updatedMastheads); // Save to server
    setShowForm(false);
    setEditingItem(null);
  };

  const cleanupHtmlAsset = async (filePath: string) => {
    if (!filePath || !filePath.includes('/interactive_mastheads_zips/')) return;
    
    try {
      const response = await fetch('/api/cleanup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    if (window.confirm('Are you sure you want to delete this masthead item? This change will be permanent.')) {
      // Find the item to get its popupHtmlPath for cleanup
      const itemToDelete = mastheads.find(item => item.id === itemId);
      
      // Remove the item from the mastheads array
      const updatedMastheads = mastheads.filter(item => item.id !== itemId);
      setMastheads(updatedMastheads);
      
      // Save the updated mastheads to the server
      await saveMastheadsToServer(updatedMastheads);
      
      // Clean up the HTML5 asset if it exists
      if (itemToDelete?.popupHtmlPath) {
        await cleanupHtmlAsset(itemToDelete.popupHtmlPath);
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
