"use client";

import React, { useState, useEffect } from 'react';
import { supabase, ContactInfo } from '@/lib/supabase';

const ContactInfoAdmin = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('contact_info')
          .select('*')
          .order('id');
        
        if (error) throw error;
        setContactInfo(data || []);
      } catch (err: any) {
        setError(err.message);
        console.error('Contact info fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContactInfo();
  }, []);

  const handleInputChange = (index: number, field: keyof ContactInfo, value: string) => {
    const updatedInfo = [...contactInfo];
    updatedInfo[index] = { ...updatedInfo[index], [field]: value };
    setContactInfo(updatedInfo);
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    try {
      // Update each contact info item
      for (const info of contactInfo) {
        const { error } = await supabase
          .from('contact_info')
          .update({
            icon: info.icon,
            title: info.title,
            details: info.details,
            link: info.link,
            updated_at: new Date().toISOString()
          })
          .eq('id', info.id);
        
        if (error) throw error;
      }
      
      setSuccess('İletişim bilgileri başarıyla güncellendi!');
    } catch (err: any) {
      setError(err.message);
      console.error('Contact info save error:', err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Manage Contact Information</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      
      <div className="space-y-6">
        {contactInfo.map((info, index) => (
          <div key={index} className="bg-gray-700 p-4 rounded-md">
            <h3 className="text-xl font-semibold mb-2">{info.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Icon</label>
                <input
                  type="text"
                  value={info.icon}
                  onChange={(e) => handleInputChange(index, 'icon', e.target.value)}
                  className="w-full p-2 bg-gray-600 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={info.title}
                  onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                  className="w-full p-2 bg-gray-600 rounded-md"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Details</label>
                <input
                  type="text"
                  value={info.details}
                  onChange={(e) => handleInputChange(index, 'details', e.target.value)}
                  className="w-full p-2 bg-gray-600 rounded-md"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Link</label>
                <input
                  type="text"
                  value={info.link}
                  onChange={(e) => handleInputChange(index, 'link', e.target.value)}
                  className="w-full p-2 bg-gray-600 rounded-md"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
      >
        Save Changes
      </button>
    </div>
  );
};

export default ContactInfoAdmin;
