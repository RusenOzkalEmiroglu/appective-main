"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ServiceCategory } from '@/types/service';
import ServiceForm from '@/components/admin/ServiceForm';
import { PlusCircle, Edit3, Trash2, Search, Filter, AlertTriangle } from 'lucide-react';
import {
  primaryTextColor,
  secondaryTextColor,
  inputBg,
  primaryButtonClasses,
  secondaryButtonClasses,
  pageTitleClasses,
  cardClasses,
  tableHeaderClasses,
  tableCellClasses,
  inputBaseClasses
} from '@/app/utils/constants';
import { fetchWithAuth } from '@/lib/auth';

// Delete Confirmation Modal Component
interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className={`${cardClasses} p-6 rounded-lg shadow-xl max-w-md w-full`}>
        <div className="flex items-center mb-4">
          <AlertTriangle className="text-red-500 mr-3" size={24} />
          <h3 className={`text-xl font-semibold ${primaryTextColor}`}>Confirm Deletion</h3>
        </div>
        <p className={`${secondaryTextColor} mb-6`}>Are you sure you want to delete the service "{itemName}"? This action cannot be undone.</p>
        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className={`${secondaryButtonClasses} hover:bg-gray-600`}>
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminServicesPage = () => {
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceCategory | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ServiceCategory | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchWithAuth('/api/services');
      if (!response.ok) {
        const errData = await response.json().catch(() => ({ message: 'Failed to fetch services' }));
        throw new Error(errData.message || `HTTP error! status: ${response.status}`);
      }
      const data: ServiceCategory[] = await response.json();
      setServices(data);
      setFilteredServices(data); 
    } catch (err: any) {
      console.error("Fetch Services Error:", err);
      setError(err.message || 'Could not load services.');
      setServices([]);
      setFilteredServices([]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    let items = services;
    if (searchTerm) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredServices(items);
  }, [searchTerm, services]);

  const handleFormSubmit = async (data: ServiceCategory) => {
    setIsLoading(true);
    setError(null);
    const url = isEditMode && editingItem ? `/api/services/${editingItem.id}` : '/api/services';
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await fetchWithAuth(url, {
        method: method,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ message: `Failed to ${isEditMode ? 'update' : 'add'} service` }));
        throw new Error(errData.message || `HTTP error! status: ${response.status}`);
      }
      
      await fetchServices(); // Refresh data
      setShowForm(false);
      setEditingItem(null);
      setIsEditMode(false);
    } catch (err: any) {
      console.error("Form Submit Error:", err);
      setError(err.message || `Could not ${isEditMode ? 'update' : 'add'} service.`);
    }
    setIsLoading(false);
  };

  const handleAddService = async (newService: ServiceCategory) => {
    try {
      setIsLoading(true);
      
      // Always generate a unique ID based on name or timestamp
      newService.id = newService.name 
        ? newService.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-')
        : `service-${Date.now()}`;
        
      // Generate folder name if not provided
      if (!newService.folderName) {
        newService.folderName = `${newService.id}_folder`;
      }
      const url = '/api/services';
      const method = 'POST';

      const response = await fetchWithAuth(url, {
        method: method,
        body: JSON.stringify(newService),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ message: 'Failed to add service' }));
        throw new Error(errData.message || `HTTP error! status: ${response.status}`);
      }
      
      await fetchServices(); // Refresh data
      setShowForm(false);
      setEditingItem(null);
      setIsEditMode(false);
    } catch (err: any) {
      console.error("Add Service Error:", err);
      setError(err.message || 'Could not add service.');
    }
    setIsLoading(false);
  };

  const openAddForm = () => {
    setEditingItem(null);
    setIsEditMode(false);
    setShowForm(true);
  };

  const openEditForm = (service: ServiceCategory) => {
    // Ensure service has an id to avoid errors
    if (!service.id && typeof service.id !== 'string') {
      service.id = service.name ? service.name.toLowerCase().replace(/\s+/g, '-') : 'service-' + Date.now();
    }
    setEditingItem(service);
    setIsEditMode(true);
    setShowForm(true);
  };

  const openDeleteConfirmation = (service: ServiceCategory) => {
    // Ensure service has an id to avoid errors
    if (!service.id && typeof service.id !== 'string') {
      service.id = service.name ? service.name.toLowerCase().replace(/\s+/g, '-') : 'service-' + Date.now();
    }
    setItemToDelete(service);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!itemToDelete) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchWithAuth(`/api/services/${itemToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({ message: 'Failed to delete service' }));
        throw new Error(errData.message || `HTTP error! status: ${response.status}`);
      }
      await fetchServices(); // Refresh data
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (err: any) {
      console.error("Delete Error:", err);
      setError(err.message || 'Could not delete service.');
    }
    setIsLoading(false);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  return (
    <div className="h-full p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className={pageTitleClasses}>Manage Services</h1>
        <button onClick={openAddForm} className={`${primaryButtonClasses} flex items-center`}>
          <PlusCircle size={20} className="mr-2" /> Add New Service
        </button>
      </div>
      
      <div className={`${cardClasses} p-4 rounded-lg mb-6 shadow`}>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[250px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className={secondaryTextColor} />
            </div>
            <input
              id="serviceSearch"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, name, description..."
              className={`${inputBaseClasses} pl-10`}
            />
          </div>
          {/* Add more filters here if needed */}
        </div>
      </div>

      {isLoading && <p className={primaryTextColor}>Loading services...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!isLoading && !error && (
        <div className="overflow-x-auto rounded-lg border border-gray-700/50 shadow">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800/50">
              <tr>
                <th scope="col" className={`${tableHeaderClasses} w-1/4`}>Name</th>
                <th scope="col" className={`${tableHeaderClasses} w-1/4`}>Image</th>
                <th scope="col" className={`${tableHeaderClasses} w-2/5`}>Description</th>
                <th scope="col" className={`${tableHeaderClasses} text-center`}>Icon</th>
                <th scope="col" className={`${tableHeaderClasses} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`${inputBg} divide-y divide-gray-700`}>
              {filteredServices.length > 0 ? filteredServices.map((item, index) => (
                <tr key={item.id || `service-${index}`}>
                  <td className={tableCellClasses}>{item.name}</td>
                  <td className={tableCellClasses}>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="h-10 w-auto max-w-[100px] object-contain rounded" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    ) : (
                      <span className={`text-xs ${secondaryTextColor}`}>No Image</span>
                    )}
                  </td>
                  <td className={`${tableCellClasses} text-xs`}>{item.description}</td>
                  <td className={`${tableCellClasses} text-2xl text-center`}>{item.icon}</td>
                  <td className={`${tableCellClasses} text-right`}>
                    <button onClick={() => openEditForm(item)} className="p-1.5 text-blue-400 hover:text-blue-300 mr-2">
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => openDeleteConfirmation(item)} className="p-1.5 text-red-500 hover:text-red-400">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className={`${tableCellClasses} text-center ${secondaryTextColor}`}>No services found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40 p-4">
          <div className={`${cardClasses} p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto`}>
            <h2 className={`text-xl font-semibold ${primaryTextColor} mb-4`}>{isEditMode ? 'Edit Service' : 'Add New Service'}</h2>
            <ServiceForm 
              initialData={editingItem}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingItem(null);
                setIsEditMode(false);
              }}
              isEditMode={isEditMode}
            />
          </div>
        </div>
      )}
      <DeleteConfirmationModal 
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={handleDeleteConfirmed}
        itemName={itemToDelete?.name || ''}
      />
    </div>
  );
};

export default AdminServicesPage;
