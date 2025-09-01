// src/components/admin/AdminJobOpeningsManagementPage.tsx
'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { JobOpening } from '@/lib/supabase';
import { PlusCircle, Edit3, Trash2, ChevronDown, ChevronUp, Loader2, Check, X, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Onay modalı component'i
interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            İptal
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Sil
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminJobOpeningsManagementPage = () => {
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [editingJob, setEditingJob] = useState<JobOpening | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; jobId: string; jobTitle: string }>({
    isOpen: false,
    jobId: '',
    jobTitle: ''
  });

  const fetchJobOpenings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('job_openings')
        .select('*')
        .order('id');
      
      if (error) throw error;
      setJobOpenings(data || []);
    } catch (err: any) {
      setError(err.message || 'İş ilanları yüklenirken hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobOpenings();
  }, []);

  const handleDeleteClick = (job: JobOpening) => {
    setDeleteModal({
      isOpen: true,
      jobId: job.id,
      jobTitle: job.title
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      const { error } = await supabase
        .from('job_openings')
        .delete()
        .eq('id', deleteModal.jobId);
      
      if (error) throw error;
      setJobOpenings(prev => prev.filter(job => job.id !== deleteModal.jobId));
      setDeleteModal({ isOpen: false, jobId: '', jobTitle: '' });
    } catch (err: any) {
      setError(err.message || 'İş ilanı silinirken hata oluştu.');
      setDeleteModal({ isOpen: false, jobId: '', jobTitle: '' });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, jobId: '', jobTitle: '' });
  };

  if (isLoading) return <div className="flex justify-center items-center p-8"><Loader2 className="animate-spin" /> Loading...</div>;
  if (error) return <div className="text-red-500 bg-red-100 p-4 rounded-lg flex items-center"><AlertCircle className="mr-2"/> Error: {error}</div>;

  return (
    <div className="p-4 md:p-8 bg-gray-900 text-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-purple-400">Manage Job Openings</h1>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-300"
          >
            {isAdding ? <><X className="mr-2"/> Cancel</> : <><PlusCircle className="mr-2"/> Add New Job</>}
          </button>
        </div>

        {(isAdding || editingJob) && (
          <JobOpeningForm 
            job={editingJob} 
            onSuccess={() => {
              fetchJobOpenings();
              setIsAdding(false);
              setEditingJob(null);
            }}
            onCancel={() => {
              setIsAdding(false);
              setEditingJob(null);
            }}
          />
        )}

        <div className="bg-gray-800/50 p-6 rounded-lg mt-8">
          <h2 className="text-2xl font-semibold mb-4">Existing Job Openings</h2>
          <div className="space-y-4">
            {jobOpenings.map(job => (
              <div key={job.id} className="flex justify-between items-center bg-gray-700/50 p-4 rounded-lg">
                <span className="font-semibold">{job.title}</span>
                <div className="flex items-center space-x-4">
                  <button onClick={() => setEditingJob(job)} className="text-blue-400 hover:text-blue-300"><Edit3 size={20}/></button>
                  <button onClick={() => handleDeleteClick(job)} className="text-red-500 hover:text-red-400"><Trash2 size={20}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Onay Modalı */}
        <ConfirmModal
          isOpen={deleteModal.isOpen}
          title="İş İlanını Sil"
          message={`"${deleteModal.jobTitle}" iş ilanını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      </div>
    </div>
  );
};

// Sub-component for the Add/Edit Form
interface JobOpeningFormProps {
    job: JobOpening | null;
    onSuccess: () => void;
    onCancel: () => void;
}

const JobOpeningForm: React.FC<JobOpeningFormProps> = ({ job, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        title: job?.title || '',
        short_description: job?.short_description || '',
        icon_name: job?.icon_name || 'Briefcase',
        slug: job?.slug || '',
        is_remote: job?.is_remote || false,
        is_tr: job?.is_tr || false,
        full_title: job?.full_title || '',
        description: job?.description || '',
        what_you_will_do: job?.what_you_will_do || [],
        what_were_looking_for: job?.what_were_looking_for || [],
        why_join_us: job?.why_join_us || [],
        apply_link: job?.apply_link || ''
    });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        if (job) {
            setFormData({
                title: job.title,
                short_description: job.short_description,
                icon_name: job.icon_name,
                slug: job.slug,
                is_remote: job.is_remote,
                is_tr: job.is_tr,
                full_title: job.full_title,
                description: job.description,
                what_you_will_do: job.what_you_will_do,
                what_were_looking_for: job.what_were_looking_for,
                why_join_us: job.why_join_us,
                apply_link: job.apply_link || ''
            });
        }
    }, [job]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleArrayChange = (e: React.ChangeEvent<HTMLTextAreaElement>, field: 'what_you_will_do' | 'what_were_looking_for' | 'why_join_us') => {
        const items = e.target.value.split('\n').filter(item => item.trim() !== '');
        setFormData(prev => ({ ...prev, [field]: items }));
    };
    
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError(null);

        // Generate unique ID for new jobs
        const generateId = () => {
            return 'job_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        };

        // Prepare data for Supabase - tam alan listesi
        const submissionData = {
            id: job ? job.id : generateId(), // Use existing ID or generate new one
            title: formData.title,
            short_description: formData.short_description,
            icon_name: formData.icon_name || 'Briefcase',
            slug: formData.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            is_remote: formData.is_remote || false,
            is_tr: formData.is_tr || false,
            full_title: formData.full_title || formData.title,
            description: formData.description,
            what_you_will_do: formData.what_you_will_do,
            what_were_looking_for: formData.what_were_looking_for,
            why_join_us: formData.why_join_us,
            apply_link: formData.apply_link
        };

        console.log('Submitting job data:', submissionData); // Debug

        try {
            if (job) {
                try {
                    // Update existing job
                    const { id, ...updateData } = submissionData; // Exclude ID from update data
                    
                    const { data, error } = await supabase
                        .from('job_openings')
                        .update(updateData)
                        .eq('id', job.id)
                        .select();
                    
                    console.log('Update result:', { data, error }); // Debug
                    if (error) throw error;
                } catch (err: any) {
                    console.error('Update error:', err); // Debug
                    throw err;
                }
            } else {
                // Insert new job with generated ID
                const { data, error } = await supabase
                    .from('job_openings')
                    .insert([submissionData])
                    .select();
                
                console.log('Insert result:', { data, error }); // Debug
                if (error) throw error;
            }
            
            onSuccess();
        } catch (err: any) {
            console.error('Submission error:', err); // Debug
            setFormError(err.message || 'İş ilanı kaydedilirken hata oluştu.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-800/50 p-6 rounded-lg space-y-6">
            {formError && <div className="text-red-400 bg-red-900/50 p-3 rounded-lg">{formError}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card Fields */}
                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-300">Job Title</label>
                    <input name="title" value={formData.title} onChange={handleChange} placeholder="e.g., 'Backend Developer'" className="bg-gray-700 p-2 rounded-lg" required />
                </div>
                
                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-300">Icon</label>
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
                            {formData.icon_name && (
                                <>
                                    {formData.icon_name === 'Briefcase' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                        </svg>
                                    )}
                                    {formData.icon_name === 'Code' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="16 18 22 12 16 6"></polyline>
                                            <polyline points="8 6 2 12 8 18"></polyline>
                                        </svg>
                                    )}
                                    {formData.icon_name === 'Megaphone' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="m3 11 18-5v12L3 14v-3z"></path>
                                            <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path>
                                        </svg>
                                    )}
                                    {formData.icon_name === 'Share2' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="18" cy="5" r="3"></circle>
                                            <circle cx="6" cy="12" r="3"></circle>
                                            <circle cx="18" cy="19" r="3"></circle>
                                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                                        </svg>
                                    )}
                                    {formData.icon_name === 'PenTool' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="m12 19 7-7 3 3-7 7-3-3z"></path>
                                            <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                                            <path d="m2 2 7.586 7.586"></path>
                                            <circle cx="11" cy="11" r="2"></circle>
                                        </svg>
                                    )}
                                    {formData.icon_name === 'BarChart' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="20" x2="12" y2="10"></line>
                                            <line x1="18" y1="20" x2="18" y2="4"></line>
                                            <line x1="6" y1="20" x2="6" y2="16"></line>
                                        </svg>
                                    )}
                                    {formData.icon_name === 'Database' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                                            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                                            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                                        </svg>
                                    )}
                                    {formData.icon_name === 'Globe' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="2" y1="12" x2="22" y2="12"></line>
                                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                        </svg>
                                    )}
                                </>
                            )}
                        </div>
                        <select 
                            name="icon_name" 
                            value={formData.icon_name} 
                            onChange={handleChange} 
                            className="bg-gray-700 p-2 rounded-lg flex-grow"
                        >
                            <option value="">Select an icon</option>
                            <option value="Briefcase">Briefcase</option>
                            <option value="Code">Code</option>
                            <option value="Megaphone">Megaphone</option>
                            <option value="Share2">Share</option>
                            <option value="PenTool">Design</option>
                            <option value="BarChart">Analytics</option>
                            <option value="Database">Database</option>
                            <option value="Globe">Global</option>
                        </select>
                    </div>
                    <input type="hidden" name="slug" value={formData.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')} />
                </div>
                
                <div className="flex flex-col space-y-1 md:col-span-2">
                    <label className="text-sm font-medium text-gray-300">Kısa Açıklama</label>
                    <textarea name="short_description" value={formData.short_description} onChange={handleChange} placeholder="İş pozisyonunun kısa açıklaması" className="bg-gray-700 p-2 rounded-lg" rows={3}></textarea>
                </div>
                
                <div className="flex flex-col space-y-1 md:col-span-2">
                    <label className="text-sm font-medium text-gray-300">Tam Başlık</label>
                    <input name="full_title" value={formData.full_title} onChange={handleChange} placeholder="Detaylı iş başlığı" className="bg-gray-700 p-2 rounded-lg" />
                </div>
                
                <div className="flex flex-col space-y-1 md:col-span-2">
                    <label className="text-sm font-medium text-gray-300">Açıklama</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="İş pozisyonunun detaylı açıklaması" className="bg-gray-700 p-2 rounded-lg" rows={4}></textarea>
                </div>
                
                <div className="flex flex-col space-y-1 md:col-span-2">
                    <label className="text-sm font-medium text-gray-300">Yapacağınız İşler (Her satıra bir madde)</label>
                    <textarea 
                        value={formData.what_you_will_do.join('\n')} 
                        onChange={(e) => handleArrayChange(e, 'what_you_will_do')} 
                        placeholder="• İş tanımlarını buraya yazın\n• Her satıra bir madde" 
                        className="bg-gray-700 p-2 rounded-lg" 
                        rows={4}
                    ></textarea>
                </div>
                
                <div className="flex flex-col space-y-1 md:col-span-2">
                    <label className="text-sm font-medium text-gray-300">Aradığımız Özellikler (Her satıra bir madde)</label>
                    <textarea 
                        value={formData.what_were_looking_for.join('\n')} 
                        onChange={(e) => handleArrayChange(e, 'what_were_looking_for')} 
                        placeholder="• Gerekli beceriler\n• Her satıra bir madde" 
                        className="bg-gray-700 p-2 rounded-lg" 
                        rows={4}
                    ></textarea>
                </div>
                
                <div className="flex flex-col space-y-1 md:col-span-2">
                    <label className="text-sm font-medium text-gray-300">Neden Bize Katılmalısınız (Her satıra bir madde)</label>
                    <textarea 
                        value={formData.why_join_us.join('\n')} 
                        onChange={(e) => handleArrayChange(e, 'why_join_us')} 
                        placeholder="• Şirket avantajları\n• Her satıra bir madde" 
                        className="bg-gray-700 p-2 rounded-lg" 
                        rows={4}
                    ></textarea>
                </div>
                
                <div className="flex flex-col space-y-1 md:col-span-2">
                    <label className="text-sm font-medium text-gray-300">Başvuru Linki (Opsiyonel)</label>
                    <input name="apply_link" value={formData.apply_link} onChange={handleChange} placeholder="https://..." className="bg-gray-700 p-2 rounded-lg" />
                </div>
                
                <div className="flex items-center gap-4">
                    <label className="flex items-center"><input type="checkbox" name="is_remote" checked={formData.is_remote} onChange={handleChange} className="mr-2"/> Uzaktan</label>
                    <label className="flex items-center"><input type="checkbox" name="is_tr" checked={formData.is_tr} onChange={handleChange} className="mr-2"/> Ofis</label>
                </div>
            </div>



            <div className="flex justify-end space-x-4">
                <button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                    {isSubmitting ? <><Loader2 className="animate-spin mr-2"/> Saving...</> : <><Check className="mr-2"/> Save</>}
                </button>
            </div>
        </form>
    );
}

export default AdminJobOpeningsManagementPage;
