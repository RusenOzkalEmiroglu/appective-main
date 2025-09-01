"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ApplicationItem } from '@/data/types';
import { buttonStyles } from '@/app/utils/constants';

// --- ApplicationForm Component ---
type ApplicationFormData = {
  title: string;
  description: string;
  image: string;
  features: string; 
  platforms: string;
  project_url: string;
}

interface ApplicationFormProps {
  item: ApplicationItem | null;
  onSave: (application: ApplicationItem) => void;
  onCancel: () => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState<ApplicationFormData>({
    title: '',
    description: '',
    image: '',
    features: '',
    platforms: '',
    project_url: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        description: item.description,
        image: item.image,
        features: Array.isArray(item.features) ? item.features.join(', ') : '',
        platforms: item.platforms,
        project_url: item.project_url || '',
      });
      setImagePreview(item.image);
    } else {
      setFormData({ title: '', description: '', image: '', features: '', platforms: '', project_url: '' });
      setImagePreview(null);
    }
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = '';

    if (imageFile) {
      const formDataForUpload = new FormData();
      formDataForUpload.append('file', imageFile);
      try {
        const response = await fetch('/api/upload', { 
          method: 'POST', 
          body: formDataForUpload,
          credentials: 'include'
        });
        if (!response.ok) throw new Error('Image upload failed');
        const result = await response.json();
        imageUrl = result.filePath || result.url;
      } catch (error) {
        console.error('Error uploading image:', error);
        return;
      }
    }

    const featuresArray = formData.features.split(',').map(f => f.trim());
    const finalData: Omit<ApplicationItem, 'id'> & { id?: number } = {
      ...(item?.id && { id: item.id }),
      ...formData,
      image: imageUrl,
      features: featuresArray,
    };

    const endpoint = '/api/applications';
    const method = item?.id ? 'PUT' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Cookie': document.cookie
        },
        credentials: 'include',
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save application.');
      }

      const savedApplication = await response.json();
      onSave(savedApplication);

    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const inputStyles = "w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-white">{item ? 'Edit Application' : 'Add New Application'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
            <input id="title" name="title" value={formData.title} onChange={handleChange} className={inputStyles} required />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} className={inputStyles} rows={3} required />
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-1">Image</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/gif, image/webp"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
            />
            {imagePreview && (
              <div className="mt-4">
                <img src={imagePreview} alt="Image Preview" className="w-40 h-auto rounded-md" />
              </div>
            )}
          </div>
          <div>
            <label htmlFor="features" className="block text-sm font-medium text-gray-300 mb-1">Features (comma-separated)</label>
            <textarea id="features" name="features" value={formData.features} onChange={handleChange} className={inputStyles} rows={3} required />
          </div>
          <div>
            <label htmlFor="platforms" className="block text-sm font-medium text-gray-300 mb-1">Platforms</label>
            <input id="platforms" name="platforms" value={formData.platforms} onChange={handleChange} className={inputStyles} required />
          </div>
          <div>
            <label htmlFor="project_url" className="block text-sm font-medium text-gray-300 mb-1">Project URL</label>
            <input id="project_url" name="project_url" type="url" value={formData.project_url} onChange={handleChange} className={inputStyles} placeholder="https://example.com" />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onCancel} className={`${buttonStyles} bg-gray-600 hover:bg-gray-500`}>Cancel</button>
            <button type="submit" className={`${buttonStyles} bg-purple-600 hover:bg-purple-700`}>{item ? 'Save Changes' : 'Create Application'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- AdminApplications Component (Main) ---
export default function AdminApplications() {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationItem | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<ApplicationItem | null>(null);

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/applications');
      if (!response.ok) throw new Error('Failed to fetch applications');
      const data = await response.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleSave = (savedApplication: ApplicationItem) => {
    const exists = applications.some(app => app.id === savedApplication.id);
    if (exists) {
      setApplications(applications.map(app => app.id === savedApplication.id ? savedApplication : app));
    } else {
      setApplications(prevApps => [...prevApps, savedApplication]);
    }
    setIsFormOpen(false);
    setSelectedApplication(null);
  };

  const handleDeleteClick = (item: ApplicationItem) => {
    setApplicationToDelete(item);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!applicationToDelete) return;

    try {
      const response = await fetch(`/api/applications?id=${applicationToDelete.id}`, { 
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to delete');
      setApplications(prev => prev.filter(p => p.id !== applicationToDelete.id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsConfirmModalOpen(false);
      setApplicationToDelete(null);
    }
  };

  const handleAddNew = () => {
    setSelectedApplication(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: ApplicationItem) => {
    setSelectedApplication(item);
    setIsFormOpen(true);
  };

  const filteredApplications = applications.filter(app =>
    (app.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (app.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      {isFormOpen && <ApplicationForm item={selectedApplication} onSave={handleSave} onCancel={() => setIsFormOpen(false)} />}
      
      {isConfirmModalOpen && applicationToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-white">Confirm Deletion</h2>
            <p className="text-gray-300 mb-6">Are you sure you want to delete the application "{applicationToDelete.title}"?</p>
            <div className="flex justify-end space-x-4">
              <button onClick={() => setIsConfirmModalOpen(false)} className={`${buttonStyles} bg-gray-600 hover:bg-gray-500`}>Cancel</button>
              <button onClick={handleConfirmDelete} className={`${buttonStyles} bg-red-600 hover:bg-red-700`}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Application Management</h1>
        <button onClick={handleAddNew} className={`${buttonStyles} bg-purple-600 hover:bg-purple-700`}>
          + Add New Application
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      {isLoading ? (
        <p>Loading applications...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-left">Image</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((item) => (
                <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="p-4 align-top">{item.title}</td>
                  <td className="p-4 align-top max-w-md">{item.description}</td>
                  <td className="p-4 align-top">
                    <img src={item.image} alt={item.title} className="w-24 h-auto rounded-md" />
                  </td>
                  <td className="p-4 align-top">
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(item)} className={`${buttonStyles} bg-blue-600 hover:bg-blue-700`}>Edit</button>
                      <button onClick={() => handleDeleteClick(item)} className={`${buttonStyles} bg-red-600 hover:bg-red-700`}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
