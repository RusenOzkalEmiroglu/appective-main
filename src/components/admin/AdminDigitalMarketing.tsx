"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { DigitalMarketingItem, initialDigitalMarketingItems as fallbackData } from '@/data/digitalMarketingData';
import DigitalMarketingForm from '@/components/admin/DigitalMarketingForm';
import { PlusCircle, Edit3, Trash2, Search, Filter, AlertTriangle } from 'lucide-react';
import { pageTitleClasses, cardClasses, primaryButtonClasses, secondaryButtonClasses, inputBaseClasses, inputBorderClasses, primaryTextColor, secondaryTextColor, tableHeaderClasses, tableCellClasses, iconButtonClasses } from '@/app/utils/constants';
import { fetchWithAuth } from '@/lib/auth';

const AdminDigitalMarketingPage = () => {
  const [items, setItems] = useState<DigitalMarketingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<DigitalMarketingItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);
  // Add other filters if needed, e.g., by service type

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchWithAuth('/api/digital-marketing');
      if (!response.ok) {
        throw new Error('Failed to fetch digital marketing items');
      }
      const data = await response.json();
      setItems(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError((err as Error).message + '. Displaying fallback data.');
      setItems(fallbackData); // Use fallback data on error
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleFormSubmit = async (itemData: Omit<DigitalMarketingItem, 'id'> & { id?: number }) => {
    try {
      const response = await fetchWithAuth('/api/digital-marketing', {
        method: 'POST',
        body: JSON.stringify(itemData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save data');
      }
      
      // Refresh data from server
      await fetchItems();
      setShowForm(false);
      setEditingItem(null);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to save item: ' + (err as Error).message);
    }
  };

  const handleEdit = (item: DigitalMarketingItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDeleteClick = (itemId: number) => {
    setDeletingItemId(itemId);
  };

  const confirmDelete = async () => {
    if (deletingItemId === null) return;

    try {
      const response = await fetchWithAuth(`/api/digital-marketing?id=${deletingItemId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete item');
      }
      
      // Refresh data from server
      await fetchItems();
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to delete item: ' + (err as Error).message);
    } finally {
      setDeletingItemId(null);
    }
  };

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.services.join(', ').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading && !error) {
    return <div className={`p-4 ${primaryTextColor}`}>Loading digital marketing projects...</div>;
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className={`${pageTitleClasses} mb-6`}>Manage Digital Marketing Projects</h1>

      {error && (
        <div className={`${cardClasses} p-4 mb-6 bg-red-800/30 border border-red-700 flex items-center`}>
          <AlertTriangle className="text-red-400 mr-3 h-6 w-6" />
          <p className={`${primaryTextColor}`}>Error: {error}</p>
        </div>
      )}

      {showForm ? (
        <DigitalMarketingForm 
          onSubmit={handleFormSubmit} 
          onCancel={() => { setShowForm(false); setEditingItem(null); }} 
          initialData={editingItem}
        />
      ) : (
        <>
          <div className={`${cardClasses} p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4`}>
            <div className="relative w-full md:w-1/2 lg:w-1/3">
              <input 
                type="text" 
                placeholder="Search by title, client, description, services..." 
                className={`w-full pl-10 pr-4 py-2.5 ${inputBaseClasses} ${inputBorderClasses}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${secondaryTextColor}`} />
            </div>
            {/* Add filter dropdowns here if needed */}
            <button onClick={() => { setEditingItem(null); setShowForm(true); }} className={`${primaryButtonClasses} flex items-center gap-2 w-full md:w-auto`}>
              <PlusCircle size={20} /> Add New Project
            </button>
          </div>

          <div className={`${cardClasses} overflow-x-auto`}>
            <table className="w-full min-w-max">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className={`${tableHeaderClasses} text-left`}>Preview</th>
                  <th className={`${tableHeaderClasses} text-left`}>Title</th>
                  <th className={`${tableHeaderClasses} text-left`}>Client</th>
                  <th className={`${tableHeaderClasses} text-left`}>Services</th>
                  <th className={`${tableHeaderClasses} text-center`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length > 0 ? filteredItems.map(item => (
                  <tr key={item.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className={`${tableCellClasses} w-24`}>
                      {item.image ? 
                        <img src={item.image} alt={item.title} className="w-16 h-10 object-cover rounded-md" /> : 
                        <div className="w-16 h-10 bg-gray-700 rounded-md flex items-center justify-center text-xs ${secondaryTextColor}">No Image</div>}
                    </td>
                    <td className={`${tableCellClasses} font-medium`}>{item.title}</td>
                    <td className={`${tableCellClasses}`}>{item.client}</td>
                    <td className={`${tableCellClasses} text-xs max-w-xs truncate`}>{item.services.join(', ')}</td>
                    <td className={`${tableCellClasses} text-center w-32`}>
                      <button onClick={() => handleEdit(item)} className={`${iconButtonClasses} mr-2`} title="Edit">
                        <Edit3 size={18} />
                      </button>
                      <button onClick={() => handleDeleteClick(item.id)} className={`${iconButtonClasses} text-red-500 hover:text-red-400`} title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className={`${tableCellClasses} text-center py-8 ${secondaryTextColor}`}>No digital marketing projects found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {deletingItemId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className={`${cardClasses} p-6 rounded-lg shadow-xl max-w-sm w-full`}>
            <h3 className={`text-lg font-semibold ${primaryTextColor} mb-4`}>Confirm Deletion</h3>
            <p className={`${secondaryTextColor} mb-6`}>Are you sure you want to delete this item? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setDeletingItemId(null)} className={`${secondaryButtonClasses}`}>
                Cancel
              </button>
              <button onClick={confirmDelete} className={`${primaryButtonClasses} bg-red-600 hover:bg-red-700`}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDigitalMarketingPage;
