"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { GameItem, initialGames } from '@/data/gamesData';
import GameForm from '@/components/admin/GameForm';
import { PlusCircle, Edit3, Trash2, Search, Filter } from 'lucide-react';
import { primaryTextColor, secondaryTextColor, inputBg, buttonClasses, secondaryButtonClasses, primaryBgColor } from '@/app/utils/constants';
import { fetchWithAuth } from '@/lib/auth';

// Delete Confirmation Modal Component (reusable)
interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${inputBg} p-6 rounded-lg shadow-xl max-w-sm w-full`}>
        <h3 className={`text-lg font-semibold ${primaryTextColor} mb-4`}>Confirm Deletion</h3>
        <p className={`${secondaryTextColor} mb-6`}>Are you sure you want to delete "{itemName}"? This action cannot be undone.</p>
        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className={`px-4 py-2 rounded-md ${secondaryTextColor} bg-gray-600 hover:bg-gray-500 transition-colors`}>
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-500 transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminGamesPage = () => {
  const [games, setGames] = useState<GameItem[]>([]);
  const [filteredGames, setFilteredGames] = useState<GameItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<GameItem | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: number, title: string} | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState('ALL'); // Renamed for clarity
  const [platformOptions, setPlatformOptions] = useState<string[]>(['ALL']); // Renamed for clarity

  const fetchGames = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetchWithAuth('/api/games');
      if (!response.ok) {
        const errData = await response.json().catch(() => ({ message: 'Failed to fetch games and parse error' }));
        throw new Error(errData.message || `HTTP error! status: ${response.status}`);
      }
      const data: GameItem[] = await response.json();
      setGames(data);
      setFilteredGames(data); // Initialize filteredGames with all games
      
      const allPlatforms = data.flatMap(item => item.platforms.split(',').map(p => p.trim()));
      const uniquePlatforms = ['ALL', ...Array.from(new Set(allPlatforms.filter(p => p)))];
      setPlatformOptions(uniquePlatforms);
    } catch (err: any) {
      console.error("Fetch Games Error:", err);
      setError(err.message || 'Could not load games.');
      setGames([]);
      setFilteredGames([]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  useEffect(() => {
    let items = games;
    if (searchTerm) {
      items = items.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.features.join(' ').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedPlatformFilter !== 'ALL') {
      items = items.filter(item => item.platforms.split(',').map(p => p.trim()).includes(selectedPlatformFilter));
    }
    setFilteredGames(items);
  }, [searchTerm, selectedPlatformFilter, games]);

  const saveGameToServer = async (itemData: GameItem) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetchWithAuth('/api/games', {
        method: 'POST',
        body: JSON.stringify(itemData),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({ message: 'Failed to save game and parse error' }));
        throw new Error(errData.message || `HTTP error! status: ${response.status}`);
      }
      await fetchGames(); // Refresh data after saving
    } catch (err: any) {
      console.error("Save Game Error:", err);
      setError(err.message || 'Could not save game.');
    }
    setIsLoading(false);
  };

  const handleFormSubmit = async (data: GameItem) => {
    let itemData;
    if (isEditMode && editingItem) {
      itemData = { ...data, id: editingItem.id };
    } else {
      itemData = { ...data }; // Let Supabase handle ID generation
    }
    await saveGameToServer(itemData);
    setShowForm(false);
    setEditingItem(null);
    setIsEditMode(false);
  };

  const openAddForm = () => {
    setEditingItem(null);
    setIsEditMode(false);
    setShowForm(true);
  };

  const openEditForm = (item: GameItem) => {
    setEditingItem(item);
    setIsEditMode(true);
    setShowForm(true);
  };

  const openDeleteConfirmation = (item: GameItem) => {
    setItemToDelete({ id: item.id, title: item.title });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (itemToDelete) {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetchWithAuth(`/api/games?id=${itemToDelete.id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errData = await response.json().catch(() => ({ message: 'Failed to delete game and parse error' }));
          throw new Error(errData.message || `HTTP error! status: ${response.status}`);
        }
        await fetchGames(); // Refresh data after deletion
      } catch (err: any) {
        console.error("Delete Game Error:", err);
        setError(err.message || 'Could not delete game.');
      }
      setIsLoading(false);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  return (
    <div className="h-full">
      <h1 className={`text-2xl font-bold ${primaryTextColor} mb-6`}>Manage Games</h1>
      
      <div className={`${inputBg} p-4 rounded-lg mb-6 shadow-md`}>
        <h2 className={`text-lg font-medium ${primaryTextColor} mb-4 flex items-center`}><Filter size={20} className="mr-2"/> Filters</h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="gameSearch" className={`block ${secondaryTextColor} text-sm font-medium mb-2`}>Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className={secondaryTextColor} />
              </div>
              <input
                id="gameSearch"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, description, features..."
                className={`w-full pl-10 pr-3 py-2 ${inputBg} border border-gray-600 rounded-md ${primaryTextColor} focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="gamePlatformFilter" className={`block ${secondaryTextColor} text-sm font-medium mb-2`}>Platform</label>
            <select
              id="gamePlatformFilter"
              value={selectedPlatformFilter}
              onChange={(e) => setSelectedPlatformFilter(e.target.value)}
              className={`w-full px-3 py-2 ${inputBg} border border-gray-600 rounded-md ${primaryTextColor} focus:outline-none focus:ring-2 focus:ring-purple-500`}
            >
              {platformOptions.map(platform => (
                <option key={platform} value={platform}>
                  {platform === 'ALL' ? 'All Platforms' : platform}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={openAddForm}
          className={`${buttonClasses} flex items-center`}
          disabled={isLoading}
        >
          <PlusCircle size={20} className="mr-2"/> Add New Game
        </button>
      </div>
      
      <div className={`${inputBg} rounded-lg shadow-xl p-4`}>
        {isLoading && filteredGames.length === 0 ? (
          <p className={`${secondaryTextColor} text-center py-10`}>Loading games...</p>
        ) : error ? (
          <p className="text-red-500 text-center py-10">Error loading data: {error}</p>
        ) : filteredGames.length === 0 ? (
          <p className={`${secondaryTextColor} text-center py-10`}>No games found for the selected filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${secondaryTextColor} uppercase tracking-wider`}>Preview</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${secondaryTextColor} uppercase tracking-wider`}>Title</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${secondaryTextColor} uppercase tracking-wider`}>Platforms</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${secondaryTextColor} uppercase tracking-wider`}>Features</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${secondaryTextColor} uppercase tracking-wider`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredGames.map((game) => (
                  <tr key={game.id} className="hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-20 h-12 bg-gray-600 rounded overflow-hidden flex items-center justify-center">
                        {game.image ? (
                          <img 
                            src={game.image} 
                            alt={game.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className={`text-xs ${secondaryTextColor}`}>No Image</span>
                        )}
                      </div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap ${primaryTextColor}`}>
                      {game.title || 'Untitled Game'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap ${secondaryTextColor}`}>
                      {game.platforms}
                    </td>
                    <td className={`px-6 py-4 ${secondaryTextColor}`}>
                      <div className="max-w-xs truncate" title={game.features.join(', ')}>
                        {game.features.slice(0, 2).join(', ')}
                        {game.features.length > 2 && '...'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button 
                        onClick={() => openEditForm(game)} 
                        className="text-purple-400 hover:text-purple-300 mr-4 flex items-center"
                        title="Edit Game"
                      >
                        <Edit3 size={16} className="mr-1" /> Edit
                      </button>
                      <button 
                        onClick={() => openDeleteConfirmation(game)} 
                        className="text-red-500 hover:text-red-400 flex items-center"
                        title="Delete Game"
                      >
                        <Trash2 size={16} className="mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {showForm && (
        <GameForm
          initialData={editingItem}
          onSubmit={handleFormSubmit}
          onCancel={() => { setShowForm(false); setEditingItem(null); setIsEditMode(false); }}
          isEditMode={isEditMode}
        />
      )}

      {showDeleteModal && itemToDelete && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={cancelDelete}
          onConfirm={handleDeleteConfirmed}
          itemName={itemToDelete.title}
        />
      )}
    </div>
  );
};

export default AdminGamesPage;
