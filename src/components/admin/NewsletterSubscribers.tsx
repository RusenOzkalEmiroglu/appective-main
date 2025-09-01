"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCw, Download, Search, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

const NewsletterSubscribers = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const subscribersPerPage = 10;

  const fetchSubscribers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });
      
      if (error) throw error;
      
      // Map Supabase data to component format
      const mappedData = (data || []).map(item => ({
        id: item.id.toString(),
        email: item.email,
        subscribedAt: item.subscribed_at
      }));
      
      setSubscribers(mappedData);
    } catch (err: any) {
      setError('Aboneler yüklenirken hata oluştu. Lütfen tekrar deneyin.');
      console.error('Error fetching subscribers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const deleteSubscribersApi = async (ids: string[]) => {
    if (ids.length === 0) return;
    if (!window.confirm(`${ids.length} aboneyi silmek istediğinizden emin misiniz?`)) return;

    setDeleteLoading(true);
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .in('id', ids.map(id => parseInt(id)));

      if (error) throw error;

      setSubscribers(prev => prev.filter(s => !ids.includes(s.id)));
      setSelectedSubscribers(prev => prev.filter(subId => !ids.includes(subId)));
    } catch (err: any) {
      alert(`Hata: ${err.message || 'Aboneler silinirken hata oluştu.'}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter(subscriber =>
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [subscribers, searchTerm]);

  const paginatedSubscribers = useMemo(() => {
    const startIndex = (currentPage - 1) * subscribersPerPage;
    return filteredSubscribers.slice(startIndex, startIndex + subscribersPerPage);
  }, [filteredSubscribers, currentPage]);

  const totalPages = Math.ceil(filteredSubscribers.length / subscribersPerPage);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedSubscribers(paginatedSubscribers.map(s => s.id));
    } else {
      setSelectedSubscribers([]);
    }
  };

  const toggleSelectSubscriber = (id: string) => {
    setSelectedSubscribers(prev =>
      prev.includes(id) ? prev.filter(subId => subId !== id) : [...prev, id]
    );
  };

  const exportToCSV = () => {
    if (subscribers.length === 0) {
      alert('No subscribers to export.');
      return;
    }
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Email,Subscribed At\n"
      + subscribers.map(s => `${s.email},"${new Date(s.subscribedAt).toLocaleString()}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `subscribers-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-800">Newsletter Subscribers</h2>
        <div className="flex items-center gap-2">
          <button onClick={fetchSubscribers} className="p-2 text-gray-600 hover:text-blue-600 transition-colors" title="Refresh" disabled={loading}>
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={exportToCSV} className="p-2 text-gray-600 hover:text-green-600 transition-colors" title="Export as CSV" disabled={subscribers.length === 0}>
            <Download size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search subscribers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X size={18} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        {selectedSubscribers.length > 0 && (
          <button
            onClick={() => deleteSubscribersApi(selectedSubscribers)}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center gap-2 transition-colors"
            disabled={deleteLoading}
          >
            <Trash2 size={16} />
            <span>Delete ({selectedSubscribers.length})</span>
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="p-4">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={paginatedSubscribers.length > 0 && selectedSubscribers.length === paginatedSubscribers.length}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscribed At</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={4} className="text-center py-10 text-gray-500">Loading subscribers...</td></tr>
            ) : paginatedSubscribers.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-10 text-gray-500">No subscribers found.</td></tr>
            ) : (
              paginatedSubscribers.map((subscriber) => (
                <tr key={subscriber.id} className={`hover:bg-gray-50 ${selectedSubscribers.includes(subscriber.id) ? 'bg-purple-50' : ''}`}>
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedSubscribers.includes(subscriber.id)}
                      onChange={() => toggleSelectSubscriber(subscriber.id)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{subscriber.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(subscriber.subscribedAt).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => deleteSubscribersApi([subscriber.id])}
                      className="text-red-600 hover:text-red-900 transition-colors"
                      disabled={deleteLoading}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <ChevronLeft size={16} className="mr-2" />
            Previous
          </button>
          <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            Next
            <ChevronRight size={16} className="ml-2" />
          </button>
        </div>
      )}
      <div className="mt-4 text-sm text-gray-500">
        {filteredSubscribers.length} {filteredSubscribers.length === 1 ? 'subscriber' : 'subscribers'}
        {searchTerm && subscribers.length !== filteredSubscribers.length && ` (filtered from ${subscribers.length})`}
      </div>
    </div>
  );
};

export default NewsletterSubscribers;
