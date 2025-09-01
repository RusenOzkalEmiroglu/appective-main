"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/lib/auth';

// Import all necessary components
import NewsletterSubscribers from '@/components/admin/NewsletterSubscribers';
import AdminPartnersManagementPage from '@/components/admin/AdminPartnersManagementPage';
import AdminTopBannerManagement from '@/components/admin/AdminTopBannerManagement';
import AdminJobOpeningsManagementPage from '@/components/admin/AdminJobOpeningsManagementPage';
import SocialLinksAdmin from "@/components/admin/SocialLinksAdmin";
import ContactInfoAdmin from '@/components/admin/ContactInfoAdmin';
import OurWorksAdminPage from '@/components/admin/OurWorksAdminPage';
import AdminTeamMembers from '@/components/admin/AdminTeamMembers';

// Imports for "Our Works" sub-pages and others
import AdminInteractiveMastheads from '@/components/admin/AdminInteractiveMastheads';
import AdminGames from '@/components/admin/AdminGames';
import AdminDigitalMarketing from '@/components/admin/AdminDigitalMarketing';
import AdminWebPortal from '@/components/admin/AdminWebPortal';
import AdminServices from '@/components/admin/AdminServices';
import AdminApplications from '@/components/admin/AdminApplications';
import JobApplicationsManagementPage from '@/components/admin/JobApplicationsManagementPage';

interface DashboardCardProps {
  title: string;
  description: string;
  onClick: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, description, onClick }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition-colors cursor-pointer" onClick={onClick}>
    <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
    <p className="text-gray-400">{description}</p>
  </div>
);

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signIn, signOut, checkAuth, getSavedSession, saveSession, clearSession } = useAuth();

  useEffect(() => {
    setIsClient(true);
    
    // Check for saved session first
    const savedSession = getSavedSession();
    if (savedSession) {
      setIsAuthenticated(true);
      return;
    }

    // Check authentication status on mount
    const checkStatus = async () => {
      try {
        const status = await checkAuth();
        setIsAuthenticated(status.isAuthenticated && status.isAdmin);
        
        if (!status.isAuthenticated) {
          clearSession();
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
        clearSession();
      }
    };
    checkStatus();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const result = await signIn(email, password);
      
      if (result.success) {
        // Save session to localStorage
        saveSession(result.session);
        setIsAuthenticated(true);
        setEmail('');
        setPassword('');
      } else {
        setError(result.message || 'Giriş başarısız');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
      setEmail('');
      setPassword('');
      clearSession();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-white">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardCard title="Top Banner" description="Manage the homepage top banner" onClick={() => setActiveSection('top-banner')} />
              <DashboardCard title="Partners" description="Manage partner logos and categories" onClick={() => setActiveSection('partners')} />
              <DashboardCard title="Team Members" description="Manage team members" onClick={() => setActiveSection('team-members')} />
              <DashboardCard title="Our Services" description="Manage services offered" onClick={() => setActiveSection('our-services')} />
              <DashboardCard title="Job Openings" description="Manage career opportunities" onClick={() => setActiveSection('job-openings')} />
              <DashboardCard title="Job Applications" description="View and manage job applications" onClick={() => setActiveSection('job-applications')} />
              <DashboardCard title="Newsletter" description="View and manage subscribers" onClick={() => setActiveSection('newsletter')} />
              <DashboardCard title="Social Media" description="Update social media links" onClick={() => setActiveSection('social-links')} />
              <DashboardCard title="Contact Info" description="Update contact details" onClick={() => setActiveSection('contacts')} />
              <DashboardCard title="Our Works" description="Manage portfolio sections" onClick={() => setActiveSection('our-works')} />
            </div>
          </div>
        );
      case 'top-banner':
        return <AdminTopBannerManagement />;
      case 'newsletter':
        return <NewsletterSubscribers />;
      case 'partners':
        return <AdminPartnersManagementPage />;
      case 'team-members':
        return <AdminTeamMembers />;
      case 'job-openings':
        return <AdminJobOpeningsManagementPage />;
      case 'job-applications':
        return <JobApplicationsManagementPage />;
      case 'social-links':
        return <SocialLinksAdmin />;
      case 'contacts':
        return <ContactInfoAdmin />;
      case 'our-works':
        return <OurWorksAdminPage onSectionChange={setActiveSection} />;
      // "Our Works" Sub-pages
      case 'mastheads':
        return <AdminInteractiveMastheads />;
      case 'our-services':
        return <AdminServices />;
      case 'applications':
        return <AdminApplications />;
      case 'games':
        return <AdminGames />;
      case 'digital-marketing':
        return <AdminDigitalMarketing />;
      case 'web-portal':
        return <AdminWebPortal />;
      default:
        return <div className="p-8 text-white">Please select a section.</div>;
    }
  };

  if (!isClient) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-xl">
          <h1 className="text-2xl font-bold mb-6 text-white text-center">Appective Admin</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 bg-gray-700 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 bg-gray-700 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2.5 px-5 rounded-md hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout 
      activeSection={activeSection} 
      onSectionChange={setActiveSection} 
      onLogout={handleLogout}
    >
      {renderContent()}
    </AdminLayout>
  );
};

export default AdminPage;
