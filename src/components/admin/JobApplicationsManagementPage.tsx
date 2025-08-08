'use client';

import React, { useState, useEffect } from 'react';
import { JobApplication } from '@/types/jobApplication';
import { Loader2, AlertCircle, Download, Eye, CheckCircle, XCircle, Clock, FileDown } from 'lucide-react';

const JobApplicationsManagementPage = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [jobFilter, setJobFilter] = useState<string>('all');
  const [uniqueJobs, setUniqueJobs] = useState<{id: string, title: string}[]>([]);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/job-applications');
      if (!response.ok) throw new Error('Başvurular alınamadı.');
      const data = await response.json();
      setApplications(data);
      
      // Benzersiz iş pozisyonlarını çıkar
      const uniqueJobsMap = new Map();
      data.forEach((app: JobApplication) => {
        if (!uniqueJobsMap.has(app.jobId)) {
          uniqueJobsMap.set(app.jobId, { id: app.jobId, title: app.jobTitle });
        }
      });
      setUniqueJobs(Array.from(uniqueJobsMap.values()));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications().catch(err => {
      console.error('Başvurular yüklenirken hata oluştu:', err);
      setError('Başvurular yüklenirken bir hata oluştu.');
      setIsLoading(false);
    });
  }, []);

  const updateApplicationStatus = async (id: string, status: 'pending' | 'reviewed' | 'contacted' | 'rejected') => {
    try {
      const response = await fetch(`/api/job-applications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Sunucudan geçerli bir hata mesajı alınamadı.' }));
        throw new Error(`Sunucu yanıtı: ${response.status} - ${errorData.message || JSON.stringify(errorData)}`);
      }

      const updatedApplication = await response.json();

      setApplications(prev => 
        prev.map(app => app.id === id ? { ...app, status: updatedApplication.status, updatedAt: updatedApplication.updatedAt } : app)
      );

      if (selectedApplication && selectedApplication.id === id) {
        setSelectedApplication(prev => prev ? { ...prev, status: updatedApplication.status, updatedAt: updatedApplication.updatedAt } : null);
      }

    } catch (error) {
      let errorMessage = 'Bilinmeyen bir hata oluştu.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error('Durum güncelleme hatası:', error);
      alert(`Hata: Durum güncellenemedi.\nDetay: ${errorMessage}`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="flex items-center bg-yellow-500/20 text-yellow-300 text-xs px-2 py-1 rounded-full"><Clock size={12} className="mr-1" /> Bekliyor</span>;
      case 'reviewed':
        return <span className="flex items-center bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full"><Eye size={12} className="mr-1" /> İncelendi</span>;
      case 'contacted':
        return <span className="flex items-center bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full"><CheckCircle size={12} className="mr-1" /> İletişime Geçildi</span>;
      case 'rejected':
        return <span className="flex items-center bg-red-500/20 text-red-300 text-xs px-2 py-1 rounded-full"><XCircle size={12} className="mr-1" /> Reddedildi</span>;
      default:
        return <span className="bg-gray-500/20 text-gray-300 text-xs px-2 py-1 rounded-full">Bilinmiyor</span>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // CSV'ye aktarma fonksiyonu
  const exportToCSV = () => {
    setIsExporting(true);
    
    try {
      // Başlık satırı
      const headers = [
        'ID', 'İsim Soyisim', 'E-posta', 'Telefon', 
        'Pozisyon', 'Durum', 'Başvuru Tarihi', 'Mesaj', 'CV Linki'
      ];
      
      // Veri satırları
      const rows = filteredApplications.map(app => [
        app.id,
        app.fullName,
        app.email,
        app.phone,
        app.jobTitle,
        app.status,
        new Date(app.createdAt).toLocaleString('tr-TR'),
        app.message,
        `${window.location.origin}${app.cvFilePath}`
      ]);
      
      // CSV içeriğini oluştur
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => 
          // Virgül veya tırnak içeriyorsa, tırnak içine al ve içerideki tırnakları escape et
          cell ? `"${cell.toString().replace(/"/g, '""')}"` : ''
        ).join(','))
      ].join('\n');
      
      // CSV dosyasını indir
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `is-basvurulari-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('CSV dışa aktarma hatası:', error);
      alert('CSV dışa aktarma sırasında bir hata oluştu.');
    } finally {
      setIsExporting(false);
    }
  };

  const filteredApplications = applications ? applications.filter(app => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesJob = jobFilter === 'all' || app.jobId === jobFilter;
    return matchesStatus && matchesJob;
  }) : [];

  if (isLoading) return <div className="flex justify-center items-center p-8"><Loader2 className="animate-spin mr-2" /> Yükleniyor...</div>;
  if (error) return <div className="text-red-500 bg-red-100 p-4 rounded-lg flex items-center"><AlertCircle className="mr-2"/> Hata: {error}</div>;

  return (
    <div className="p-4 md:p-8 bg-gray-900 text-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-purple-400">İş Başvuruları</h1>
        </div>

        <div className="bg-gray-800/50 p-6 rounded-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-semibold">Tüm Başvurular</h2>
              <button 
                onClick={exportToCSV} 
                disabled={isExporting || applications.length === 0}
                className="flex items-center bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm py-1 px-3 rounded-lg transition-colors"
                title="CSV olarak dışa aktar"
              >
                {isExporting ? (
                  <>
                    <Loader2 size={16} className="mr-1 animate-spin" /> 
                    Dışa Aktarılıyor...
                  </>
                ) : (
                  <>
                    <FileDown size={16} className="mr-1" /> 
                    CSV'ye Aktar
                  </>
                )}
              </button>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Durum Filtresi</label>
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-gray-700 text-white p-2 rounded-lg w-full"
                >
                  <option value="all">Tüm Durumlar</option>
                  <option value="pending">Bekliyor</option>
                  <option value="reviewed">İncelendi</option>
                  <option value="contacted">İletişime Geçildi</option>
                  <option value="rejected">Reddedildi</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Pozisyon Filtresi</label>
                <select 
                  value={jobFilter} 
                  onChange={(e) => setJobFilter(e.target.value)}
                  className="bg-gray-700 text-white p-2 rounded-lg w-full"
                >
                  <option value="all">Tüm Pozisyonlar</option>
                  {uniqueJobs.map(job => (
                    <option key={job.id} value={job.id}>{job.title}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              Filtrelere uygun başvuru bulunamadı.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-700/30 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-600/50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Başvuran</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Pozisyon</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tarih</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Durum</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600/30">
                  {filteredApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-600/20 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-white">{application.fullName}</div>
                          <div className="text-sm text-gray-400">{application.email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {application.jobTitle}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatDate(application.createdAt.toString())}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {getStatusBadge(application.status)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => setSelectedApplication(application)} 
                            className="text-blue-400 hover:text-blue-300 p-1"
                            title="Detayları Görüntüle"
                          >
                            <Eye size={18} />
                          </button>
                          <a 
                            href={application.cvFilePath} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-purple-400 hover:text-purple-300 p-1"
                            title="CV'yi İndir"
                          >
                            <Download size={18} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Başvuru Detay Modalı */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800/80 border border-purple-500/50 p-8 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative text-white">
            <button
              onClick={() => setSelectedApplication(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-purple-400 mb-2">Başvuru Detayları</h2>
              <div className="text-sm text-gray-400">
                Başvuru Tarihi: {formatDate(selectedApplication.createdAt.toString())}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-purple-300 mb-2">Başvuran Bilgileri</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-400">Ad Soyad:</span>
                    <span className="ml-2 text-white">{selectedApplication.fullName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">E-posta:</span>
                    <span className="ml-2 text-white">{selectedApplication.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Telefon:</span>
                    <span className="ml-2 text-white">{selectedApplication.phone}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-purple-300 mb-2">Pozisyon Bilgileri</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-400">Pozisyon:</span>
                    <span className="ml-2 text-white">{selectedApplication.jobTitle}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Durum:</span>
                    <span className="ml-2">{getStatusBadge(selectedApplication.status)}</span>
                  </div>
                  <div>
                    <a 
                      href={selectedApplication.cvFilePath} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center text-purple-400 hover:text-purple-300"
                    >
                      <Download size={16} className="mr-1" /> CV'yi İndir
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {selectedApplication.message && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-purple-300 mb-2">Mesaj</h3>
                <div className="bg-gray-700/30 p-4 rounded-lg text-gray-300 whitespace-pre-line">
                  {selectedApplication.message}
                </div>
              </div>
            )}

            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-purple-300 mb-3">Durumu Güncelle</h3>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => updateApplicationStatus(selectedApplication.id, 'pending')} 
                  className={`px-3 py-2 rounded-lg flex items-center text-sm ${selectedApplication.status === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-700 text-yellow-300 hover:bg-yellow-500/20'}`}
                >
                  <Clock size={16} className="mr-1" /> Bekliyor
                </button>
                <button 
                  onClick={() => updateApplicationStatus(selectedApplication.id, 'reviewed')} 
                  className={`px-3 py-2 rounded-lg flex items-center text-sm ${selectedApplication.status === 'reviewed' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-blue-300 hover:bg-blue-500/20'}`}
                >
                  <Eye size={16} className="mr-1" /> İncelendi
                </button>
                <button 
                  onClick={() => updateApplicationStatus(selectedApplication.id, 'contacted')} 
                  className={`px-3 py-2 rounded-lg flex items-center text-sm ${selectedApplication.status === 'contacted' ? 'bg-green-500 text-white' : 'bg-gray-700 text-green-300 hover:bg-green-500/20'}`}
                >
                  <CheckCircle size={16} className="mr-1" /> İletişime Geçildi
                </button>
                <button 
                  onClick={() => updateApplicationStatus(selectedApplication.id, 'rejected')} 
                  className={`px-3 py-2 rounded-lg flex items-center text-sm ${selectedApplication.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-gray-700 text-red-300 hover:bg-red-500/20'}`}
                >
                  <XCircle size={16} className="mr-1" /> Reddedildi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobApplicationsManagementPage;
