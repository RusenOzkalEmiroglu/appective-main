"use client";

import React, { useState, useEffect } from "react";
import { supabase, SocialLink } from '@/lib/supabase';

// Social platform icon mapping (for demo, use lucide-react or similar)
import { Facebook, Linkedin, Instagram, Twitter, Plus, Trash2, Save } from "lucide-react";

const SOCIAL_ICON_MAP: Record<string, React.ReactNode> = {
  facebook: <Facebook className="w-5 h-5" />,
  linkedin: <Linkedin className="w-5 h-5" />,
  instagram: <Instagram className="w-5 h-5" />,
  twitter: <Twitter className="w-5 h-5" />,
};

const SOCIAL_PLATFORMS = ["facebook", "linkedin", "instagram", "twitter"];

const SocialLinksAdmin: React.FC = () => {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [newPlatform, setNewPlatform] = useState<string>("");
  const [newUrl, setNewUrl] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>("");

  // Load links from Supabase
  useEffect(() => {
    const loadLinks = async () => {
      try {
        const { data, error } = await supabase
          .from('social_links')
          .select('*')
          .order('id');
        
        if (error) throw error;
        setLinks(data || []);
      } catch (err: any) {
        console.error("Failed to load social links:", err);
        setError("Sosyal medya linkleri yüklenemedi.");
        setLinks([]);
      }
    };
    loadLinks();
  }, []);

  // Save links to Supabase
  const [success, setSuccess] = useState<string>("");
  const saveLinks = async (updatedLinks: SocialLink[]) => {
    setIsSaving(true);
    setError("");
    setSuccess("");
    try {
      // Delete all existing links and insert new ones
      const { error: deleteError } = await supabase
        .from('social_links')
        .delete()
        .neq('id', 0); // Delete all records
      
      if (deleteError) throw deleteError;
      
      // Insert new links
      if (updatedLinks.length > 0) {
        const { error: insertError } = await supabase
          .from('social_links')
          .insert(updatedLinks.map(link => ({
            platform: link.platform,
            url: link.url
          })));
        
        if (insertError) throw insertError;
      }
      
      setSuccess("Başarıyla kaydedildi.");
      setTimeout(() => setSuccess(""), 2500);
    } catch (e: any) {
      setError(e.message || "Kaydedilemedi.");
      console.error('Social links save error:', e);
    } finally {
      setIsSaving(false);
    }
  };


  const handleAdd = async () => {
    if (!newPlatform || !newUrl) return;
    if (links.some((l) => l.platform === newPlatform)) {
      setError("Bu platform zaten ekli.");
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('social_links')
        .insert([{ platform: newPlatform, url: newUrl }])
        .select();
      
      if (error) throw error;
      
      setLinks([...links, data[0]]);
      setNewPlatform("");
      setNewUrl("");
      setSuccess("Platform başarıyla eklendi.");
      setTimeout(() => setSuccess(""), 2500);
    } catch (err: any) {
      setError(err.message);
      console.error('Social link add error:', err);
    }
  };

  const handleDelete = async (platform: string) => {
    try {
      const { error } = await supabase
        .from('social_links')
        .delete()
        .eq('platform', platform);
      
      if (error) throw error;
      
      const updated = links.filter((l) => l.platform !== platform);
      setLinks(updated);
      setSuccess("Platform başarıyla silindi.");
      setTimeout(() => setSuccess(""), 2500);
    } catch (err: any) {
      setError(err.message);
      console.error('Social link delete error:', err);
    }
  };

  const handleUrlChange = async (platform: string, url: string) => {
    try {
      const { error } = await supabase
        .from('social_links')
        .update({ url, updated_at: new Date().toISOString() })
        .eq('platform', platform);
      
      if (error) throw error;
      
      const updated = links.map((l) =>
        l.platform === platform ? { ...l, url } : l
      );
      setLinks(updated);
    } catch (err: any) {
      setError(err.message);
      console.error('Social link update error:', err);
    }
  };

  const handleSave = () => {
    saveLinks(links);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-900 rounded-xl shadow-lg">
      <h2 className="text-lg font-bold mb-4 text-white">Sosyal Medya Hesapları Yönetimi</h2>
      {error && <div className="text-red-400 mb-2" role="alert">{error}</div>}
      {success && <div className="text-green-400 mb-2" role="status">{success}</div>}
      <div className="space-y-2 mb-6">
        {links.length === 0 && (
          <div className="text-gray-400 text-sm" role="status">Henüz sosyal medya hesabı eklenmedi.</div>
        )}
        {links.map((link) => (
          <div key={link.platform} className="flex items-center space-x-3 bg-gray-800 rounded-lg px-3 py-2">
            <span>{SOCIAL_ICON_MAP[link.platform]}</span>
            <span className="capitalize text-white w-24">{link.platform}</span>
            <input
              className="flex-1 bg-gray-700 text-white px-2 py-1 rounded focus:outline-none"
              value={link.url}
              onChange={(e) => handleUrlChange(link.platform, e.target.value)}
              placeholder="Platform URL"
            />
            <button
              className="p-1 text-red-400 hover:text-red-600"
              onClick={() => handleDelete(link.platform)}
              aria-label={`${link.platform} hesabını sil`}
            >
              <Trash2 />
            </button>
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <select
          className="bg-gray-700 text-white px-2 py-1 rounded"
          value={newPlatform}
          onChange={(e) => setNewPlatform(e.target.value)}
        >
          <option value="">Platform Seç</option>
          {SOCIAL_PLATFORMS.filter((p) => !links.some((l) => l.platform === p)).map((platform) => (
            <option key={platform} value={platform}>
              {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </option>
          ))}
        </select>
        <input
          className="flex-1 bg-gray-700 text-white px-2 py-1 rounded focus:outline-none"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="Yeni hesap URL"
        />
        <button
          className="p-2 bg-purple-600 hover:bg-purple-700 rounded text-white"
          onClick={handleAdd}
        >
          <Plus />
        </button>
      </div>
      <button
        className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white disabled:opacity-70"
        onClick={handleSave}
        disabled={isSaving}
        aria-busy={isSaving}
      >
        <Save />
        <span>{isSaving ? (
          <span className="ml-2 animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full align-middle"></span>
        ) : 'Kaydet'}</span>
      </button>
    </div>
  );
};

export default SocialLinksAdmin;
