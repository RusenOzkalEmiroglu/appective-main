"use client";

import React, { useState, useEffect } from 'react';
import { TeamMember } from '@/lib/supabase';
import ImageUploader from '@/components/admin/ImageUploader';

interface TeamMemberFormData {
  id?: number;
  name: string;
  position: string;
  image: string;
  bio: string;
  display_order: number;
  is_active: boolean;
}

const AdminTeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<TeamMember | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const [formData, setFormData] = useState<TeamMemberFormData>({
    name: '',
    position: '',
    image: '',
    bio: '',
    display_order: 0,
    is_active: true
  });

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/team-members');
      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that image is uploaded
    if (!formData.image || formData.image.trim() === '') {
      setImageError('Lütfen bir resim yükleyin.');
      return;
    }

    try {
      const response = await fetch('/api/team-members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchTeamMembers();
        resetForm();
        setShowForm(false);
      } else {
        console.error('Failed to save team member');
      }
    } catch (error) {
      console.error('Error saving team member:', error);
    }
  };

  const handleEdit = (item: TeamMember) => {
    setEditingItem(item);
    setFormData({
      id: item.id,
      name: item.name,
      position: item.position,
      image: item.image,
      bio: item.bio || '',
      display_order: item.display_order,
      is_active: item.is_active
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setDeletingItemId(id);
  };

  const confirmDelete = async () => {
    if (!deletingItemId) return;

    try {
      const response = await fetch(`/api/team-members?id=${deletingItemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchTeamMembers();
        setDeletingItemId(null);
      } else {
        console.error('Failed to delete team member');
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      image: '',
      bio: '',
      display_order: 0,
      is_active: true
    });
    setEditingItem(null);
    setImageError(null);
  };

  const handleImageUploaded = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }));
    setImageError(null);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Team Members Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Team Member
        </button>
      </div>

      {/* Team Members List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <div key={member.id} className="bg-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="aspect-square mb-4 overflow-hidden rounded-lg">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{member.name}</h3>
            <p className="text-primary text-sm mb-3">{member.position}</p>
            {member.bio && (
              <p className="text-white/70 text-sm mb-4 line-clamp-3">{member.bio}</p>
            )}
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/50">Order: {member.display_order}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(member)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark border border-white/10 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingItem ? 'Edit Team Member' : 'Add Team Member'}
            </h2>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-dark/50 border border-white/10 rounded-lg px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Position</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  className="w-full bg-dark/50 border border-white/10 rounded-lg px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full bg-dark/50 border border-white/10 rounded-lg px-3 py-2 text-white h-24 resize-none"
                  placeholder="Team member bio..."
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Display Order</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-dark/50 border border-white/10 rounded-lg px-3 py-2 text-white"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Image</label>
                <ImageUploader
                  onImageUploaded={handleImageUploaded}
                  currentImagePath={formData.image}
                  category="team-members"
                  type="preview"
                  brand=""
                />
                {imageError && (
                  <p className="text-red-500 text-sm mt-2">{imageError}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="is_active" className="text-white/70 text-sm">Active</label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-dark text-white py-2 rounded-lg transition-colors"
                >
                  {editingItem ? 'Update' : 'Add'} Team Member
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingItemId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-dark border border-white/10 rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-white mb-4">Confirm Delete</h3>
            <p className="text-white/70 mb-6">Are you sure you want to delete this team member?</p>
            <div className="flex space-x-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeletingItemId(null)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeamMembers;
