// src/components/admin/AdminJobOpeningsManagementPage.tsx
'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { JobOpening } from '@/types/jobOpenings';
import { PlusCircle, Edit3, Trash2, ChevronDown, ChevronUp, Loader2, Check, X, AlertCircle } from 'lucide-react';

const AdminJobOpeningsManagementPage = () => {
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [editingJob, setEditingJob] = useState<JobOpening | null>(null);

  const fetchJobOpenings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/job-openings');
      if (!response.ok) throw new Error('Failed to fetch job openings.');
      const data = await response.json();
      setJobOpenings(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobOpenings();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job opening?')) return;

    try {
      const response = await fetch(`/api/job-openings/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete job opening.');
      setJobOpenings(prev => prev.filter(job => job.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
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
                  <button onClick={() => handleDelete(job.id)} className="text-red-500 hover:text-red-400"><Trash2 size={20}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
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
    const [formData, setFormData] = useState<Partial<JobOpening>>({
        title: '',
        shortDescription: '',
        iconName: 'Briefcase',
        isRemote: false,
        isTr: false,
        slug: '',
        details: {
            fullTitle: '',
            description: '',
            whatYouWillDo: [],
            whatWereLookingFor: [],
            whyJoinUs: []
        }
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        if (job) {
            setFormData(job);
        } else {
            // Reset form for adding new
            setFormData({
                title: '', shortDescription: '', iconName: 'Briefcase', isRemote: false, isTr: false, slug: '',
                details: { fullTitle: '', description: '', whatYouWillDo: [], whatWereLookingFor: [], whyJoinUs: [] }
            });
        }
    }, [job]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : false;

        if (name.startsWith('details.')) {
            const detailKey = name.split('.')[1] as keyof JobOpening['details'];
            setFormData(prev => ({
                ...prev,
                details: { ...prev.details!, [detailKey]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        }
    };
    
    const handleArrayChange = (e: React.ChangeEvent<HTMLTextAreaElement>, field: 'whatYouWillDo' | 'whatWereLookingFor' | 'whyJoinUs') => {
        const value = e.target.value.split('\n');
        setFormData(prev => ({ ...prev, details: { ...prev.details!, [field]: value } }));
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError(null);

        // Ensure fullTitle is set from title before submitting
        const submissionData = {
            ...formData,
            details: {
                ...formData.details,
                fullTitle: formData.title
            }
        };

        const url = job ? `/api/job-openings/${job.id}` : '/api/job-openings';
        const method = job ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save job opening.');
            }
            onSuccess();
        } catch (err: any) {
            setFormError(err.message);
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
                            {formData.iconName && (
                                <>
                                    {formData.iconName === 'Briefcase' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                        </svg>
                                    )}
                                    {formData.iconName === 'Code' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="16 18 22 12 16 6"></polyline>
                                            <polyline points="8 6 2 12 8 18"></polyline>
                                        </svg>
                                    )}
                                    {formData.iconName === 'Megaphone' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="m3 11 18-5v12L3 14v-3z"></path>
                                            <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path>
                                        </svg>
                                    )}
                                    {formData.iconName === 'Share2' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="18" cy="5" r="3"></circle>
                                            <circle cx="6" cy="12" r="3"></circle>
                                            <circle cx="18" cy="19" r="3"></circle>
                                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                                        </svg>
                                    )}
                                    {formData.iconName === 'PenTool' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="m12 19 7-7 3 3-7 7-3-3z"></path>
                                            <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                                            <path d="m2 2 7.586 7.586"></path>
                                            <circle cx="11" cy="11" r="2"></circle>
                                        </svg>
                                    )}
                                    {formData.iconName === 'BarChart' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="20" x2="12" y2="10"></line>
                                            <line x1="18" y1="20" x2="18" y2="4"></line>
                                            <line x1="6" y1="20" x2="6" y2="16"></line>
                                        </svg>
                                    )}
                                    {formData.iconName === 'Database' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                                            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                                            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                                        </svg>
                                    )}
                                    {formData.iconName === 'Globe' && (
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
                            name="iconName" 
                            value={formData.iconName} 
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
                    <label className="text-sm font-medium text-gray-300">Summary</label>
                    <textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} placeholder="Brief description of the job position" className="bg-gray-700 p-2 rounded-lg" rows={3}></textarea>
                </div>
                
                <div className="flex items-center gap-4">
                    <label className="flex items-center"><input type="checkbox" name="isRemote" checked={formData.isRemote} onChange={handleChange} className="mr-2"/> Remote</label>
                    <label className="flex items-center"><input type="checkbox" name="isTr" checked={formData.isTr} onChange={handleChange} className="mr-2"/> Office</label>
                </div>
            </div>

            <hr className="border-gray-600"/>

            {/* Detail Fields */}
            <h3 className="text-xl font-semibold mt-8 mb-4 border-b border-gray-700 pb-2">Job Details (Modal)</h3>
            <div className="grid grid-cols-1 gap-6">
                <input type="hidden" name="details.fullTitle" value={formData.title || ''} />
                
                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-300">Description</label>
                    <textarea name="details.description" value={formData.details?.description || ''} onChange={handleChange} placeholder="Full job description" className="bg-gray-700 p-2 rounded-lg w-full" rows={4}></textarea>
                </div>
                
                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-300">What You'll Be Doing</label>
                    <textarea value={formData.details?.whatYouWillDo?.join('\n')} onChange={(e) => handleArrayChange(e, 'whatYouWillDo')} placeholder="One item per line" className="bg-gray-700 p-2 rounded-lg w-full" rows={4}></textarea>
                </div>
                
                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-300">What We're Looking For</label>
                    <textarea value={formData.details?.whatWereLookingFor?.join('\n')} onChange={(e) => handleArrayChange(e, 'whatWereLookingFor')} placeholder="One item per line" className="bg-gray-700 p-2 rounded-lg w-full" rows={4}></textarea>
                </div>
                
                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-300">Why Join Us?</label>
                    <textarea value={formData.details?.whyJoinUs?.join('\n')} onChange={(e) => handleArrayChange(e, 'whyJoinUs')} placeholder="One item per line" className="bg-gray-700 p-2 rounded-lg w-full" rows={4}></textarea>
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
