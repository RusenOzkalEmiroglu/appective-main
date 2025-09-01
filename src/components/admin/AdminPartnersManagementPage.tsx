"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { PartnerCategory, LogoInfo } from '@/lib/partnersDataUtils'; // Assuming types are exported
import { PlusCircle, Edit3, Trash2, ChevronDown, ChevronRight, ImageUp, Loader2, Check, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const AdminPartnersManagementPage = () => {
  const [categories, setCategories] = useState<PartnerCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [newCategoryOriginalPath, setNewCategoryOriginalPath] = useState<string>('');
  const [isAddingCategory, setIsAddingCategory] = useState<boolean>(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<PartnerCategory | null>(null);
  const [logoToDelete, setLogoToDelete] = useState<{ categoryId: string; logoId: string } | null>(null);
  const [editingCategory, setEditingCategory] = useState<PartnerCategory | null>(null);
  const [editCategoryName, setEditCategoryName] = useState<string>('');
  const [isUpdatingCategory, setIsUpdatingCategory] = useState<boolean>(false);
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const [newLogoAlt, setNewLogoAlt] = useState<string>('');
  const [newLogoFile, setNewLogoFile] = useState<File | null>(null);
  const [newLogoUrl, setNewLogoUrl] = useState<string>('');
  const [newLogoClickUrl, setNewLogoClickUrl] = useState<string>('');
  const [activeLogoAddCategoryId, setActiveLogoAddCategoryId] = useState<string | null>(null); // categoryId of the category being added to
  const [deletingLogoInfo, setDeletingLogoInfo] = useState<{ categoryId: string; logoId: string } | null>(null);
  const [editingLogoInfo, setEditingLogoInfo] = useState<{ categoryId: string; logoId: string; currentAlt: string; currentUrl?: string } | null>(null);
  const [editLogoAlt, setEditLogoAlt] = useState<string>('');
  const [editLogoUrl, setEditLogoUrl] = useState<string>('');
  const [isUpdatingLogo, setIsUpdatingLogo] = useState<boolean>(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('partner_categories')
        .select('*')
        .order('id');
      
      if (categoriesError) throw categoriesError;

      // Fetch logos for each category
      const { data: logosData, error: logosError } = await supabase
        .from('partner_logos')
        .select('*')
        .order('id');
      
      if (logosError) throw logosError;

      // Combine categories with their logos
      const categoriesWithLogos: PartnerCategory[] = (categoriesData || []).map(category => ({
        id: category.id.toString(),
        name: category.name,
        originalPath: category.original_path,
        logos: (logosData || [])
          .filter(logo => logo.category_id === category.id)
          .map(logo => ({
            id: logo.id.toString(),
            alt: logo.alt,
            imagePath: logo.src,
            url: logo.url || undefined
          }))
      }));

      setCategories(categoriesWithLogos);
    } catch (err: any) {
      console.error("Error fetching categories:", err);
      setError(err.message || 'Kategoriler yüklenirken hata oluştu.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim() || !newCategoryOriginalPath.trim()) {
      setError('Kategori adı ve orijinal yol gereklidir.');
      return;
    }
    setIsAddingCategory(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('partner_categories')
        .insert([{
          name: newCategoryName,
          original_path: newCategoryOriginalPath
        }]);
      
      if (error) throw error;
      
      setNewCategoryName('');
      setNewCategoryOriginalPath('');
      await fetchCategories(); // Refresh the list
    } catch (err: any) {
      console.error("Error adding category:", err);
      setError(err.message || 'Kategori eklenirken hata oluştu.');
    }
    setIsAddingCategory(false);
  };

  const handleDeleteCategory = (category: PartnerCategory) => {
    setCategoryToDelete(category);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

    setDeletingCategoryId(categoryToDelete.id);
    setError(null);
    try {
      // First delete all logos in this category
      const { error: logosError } = await supabase
        .from('partner_logos')
        .delete()
        .eq('category_id', parseInt(categoryToDelete.id));
      
      if (logosError) throw logosError;

      // Then delete the category
      const { error: categoryError } = await supabase
        .from('partner_categories')
        .delete()
        .eq('id', parseInt(categoryToDelete.id));
      
      if (categoryError) throw categoryError;
      
      await fetchCategories(); // Refresh the list
    } catch (err: any) {
      console.error("Error deleting category:", err);
      setError(err.message || 'Kategori silinirken hata oluştu.');
    }
    setDeletingCategoryId(null);
    setCategoryToDelete(null);
  };

  const handleEditCategory = (category: PartnerCategory) => {
    setEditingCategory(category);
    setEditCategoryName(category.name);
    setError(null); // Clear previous errors
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditCategoryName('');
  };

  const handleUpdateCategory = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editCategoryName.trim()) {
      setError('Kategori adı boş olamaz.');
      return;
    }
    setIsUpdatingCategory(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('partner_categories')
        .update({ name: editCategoryName })
        .eq('id', parseInt(editingCategory.id));
      
      if (error) throw error;
      
      await fetchCategories(); // Refresh the list
      handleCancelEdit(); // Exit edit mode
    } catch (err: any) {
      console.error(`Error updating category ${editingCategory.id}:`, err);
      setError(err.message || 'Kategori güncellenirken hata oluştu.');
    }
    setIsUpdatingCategory(false);
  };

  const handleDeleteLogo = (categoryId: string, logoId: string) => {
    setLogoToDelete({ categoryId, logoId });
  };

  const confirmDeleteLogo = async () => {
    if (!logoToDelete) return;
    const { categoryId, logoId } = logoToDelete;

    setDeletingLogoInfo({ categoryId, logoId });
    setError(null);
    try {
      const { error } = await supabase
        .from('partner_logos')
        .delete()
        .eq('id', parseInt(logoId));
      
      if (error) throw error;
      
      await fetchCategories(); // Refresh the list
    } catch (err: any) {
      console.error(`Error deleting logo ${logoId} from category ${categoryId}:`, err);
      setError(err.message || 'Logo silinirken hata oluştu.');
    }
    setDeletingLogoInfo(null);
    setLogoToDelete(null);
  };

  const handleEditLogoClick = (categoryId: string, logoId: string, currentAlt: string, currentUrl?: string) => {
    setEditingLogoInfo({ categoryId, logoId, currentAlt, currentUrl });
    setEditLogoAlt(currentAlt);
    setEditLogoUrl(currentUrl || '');
    // Clear other editing states if any
    setEditingCategory(null);
  };

  const handleCancelEditLogo = () => {
    setEditingLogoInfo(null);
    setEditLogoAlt('');
    setEditLogoUrl('');
  };

  const handleSaveLogoEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingLogoInfo || !editLogoAlt.trim()) {
      setError('Logo alt metni boş olamaz.');
      return;
    }
    setIsUpdatingLogo(true);
    setError(null);
    const { categoryId, logoId } = editingLogoInfo;
    try {
      const { error } = await supabase
        .from('partner_logos')
        .update({ 
          alt: editLogoAlt, 
          url: editLogoUrl || null 
        })
        .eq('id', parseInt(logoId));
      
      if (error) throw error;
      
      await fetchCategories(); // Refresh the list
      handleCancelEditLogo(); // Close edit form
    } catch (err: any) {
      console.error(`Error updating logo ${logoId} in category ${categoryId}:`, err);
      setError(err.message || 'Logo güncellenirken hata oluştu.');
    }
    setIsUpdatingLogo(false);
  };

  const handleAddLogo = async (e: FormEvent, categoryId: string) => {
    e.preventDefault();
    console.log('handleAddLogo called with categoryId:', categoryId);
    console.log('Form data:', { newLogoAlt, newLogoFile, newLogoUrl });
    
    if (!newLogoAlt.trim()) {
      setError('Logo alt metni zorunludur.');
      return;
    }

    // Require file upload
    if (!newLogoFile) {
      setError('Logo dosyası seçilmelidir.');
      return;
    }

    setActiveLogoAddCategoryId(categoryId);
    setError(null);

    try {
      // Upload file to Supabase Storage
      const fileExt = newLogoFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `partner-logos/${fileName}`;

      console.log('Uploading file:', fileName);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('partner-logos')
        .upload(filePath, newLogoFile);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error('Dosya yüklenirken hata oluştu: ' + uploadError.message);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('partner-logos')
        .getPublicUrl(filePath);

      console.log('File uploaded, public URL:', publicUrl);

      const logoSrc = publicUrl;
      console.log('Inserting logo with data:', {
        category_id: parseInt(categoryId),
        alt: newLogoAlt,
        src: logoSrc,
        url: newLogoClickUrl.trim() || null
      });

      const { data, error } = await supabase
        .from('partner_logos')
        .insert([{
          category_id: parseInt(categoryId),
          alt: newLogoAlt,
          src: logoSrc,
          url: newLogoClickUrl.trim() || null
        }])
        .select();

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }

      console.log('Logo inserted successfully:', data);
      await fetchCategories(); // Refresh categories and their logos
      
      // Clear form
      setNewLogoAlt('');
      setNewLogoFile(null);
      setNewLogoUrl('');
      setNewLogoClickUrl('');
      
      // Reset file input
      const fileInput = document.querySelector(`#newLogoFile-${categoryId}`) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      
      console.log('Form cleared successfully');
    } catch (err: any) {
      console.error(`Error adding logo to category ${categoryId}:`, err);
      setError(err.message || 'Logo eklenirken hata oluştu.');
    }
    setActiveLogoAddCategoryId(null);
  };

  if (isLoading && categories.length === 0) { // Show loader only on initial load
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
        <p className="ml-4 text-xl text-white">Loading categories...</p>
      </div>
    );
  }

  return (
    <>
      {/* Deletion Confirmation Modals */}
      {logoToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-white max-w-sm mx-auto">
            <h3 className="text-lg font-bold mb-4">Logoyu Silme Onayı</h3>
            <p>Bu logoyu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setLogoToDelete(null)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md transition-colors"
              >
                İptal
              </button>
              <button
                onClick={confirmDeleteLogo}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {categoryToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-white max-w-sm mx-auto">
            <h3 className="text-lg font-bold mb-4">Kategoriyi Silme Onayı</h3>
            <p><b>{categoryToDelete.name}</b> kategorisini ve içindeki tüm logoları silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setCategoryToDelete(null)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md transition-colors"
              >
                İptal
              </button>
              <button
                onClick={confirmDeleteCategory}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 md:p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8 text-purple-400">İş Ortakları Yönetimi</h1>

      {error && (
        <div className="bg-red-700 border border-red-900 text-white px-4 py-3 rounded-md relative mb-6" role="alert">
          <strong className="font-bold">Hata:</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}

      {/* Add New Category Form */}
      <div className="mb-10 p-6 bg-gray-800 rounded-xl shadow-2xl">
        <h2 className="text-2xl font-semibold mb-6 text-purple-300">Yeni Kategori Ekle</h2>
        <form onSubmit={handleAddCategory} className="space-y-6">
          <div>
            <label htmlFor="newCategoryName" className="block text-sm font-medium text-gray-300 mb-1">Kategori Adı:</label>
            <input
              type="text"
              id="newCategoryName"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Örn: Finans Sektörü"
              className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors duration-200"
              required
            />
          </div>
          <div>
            <label htmlFor="newCategoryOriginalPath" className="block text-sm font-medium text-gray-300 mb-1">Klasör Adı (Path):</label>
            <input
              type="text"
              id="newCategoryOriginalPath"
              value={newCategoryOriginalPath}
              onChange={(e) => setNewCategoryOriginalPath(e.target.value.toLowerCase().replace(/[^a-z0-9_\-]+/g, ''))}
              placeholder="Örn: finans_sektoru (sadece küçük harf, rakam, _, -)"
              className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors duration-200"
              required
            />
            <p className="text-xs text-gray-400 mt-1">Bu ad, logoların saklanacağı klasör için kullanılacaktır. Sadece küçük harf, rakam, alt çizgi (_) ve tire (-) kullanın.</p>
          </div>
          <button
            type="submit"
            disabled={isAddingCategory || isLoading}
            className="w-full flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            {isAddingCategory ? (
              <><Loader2 className="animate-spin h-5 w-5 mr-2" /> Ekleniyor...</>
            ) : (
              <><PlusCircle className="h-5 w-5 mr-2" /> Kategori Ekle</>
            )}
          </button>
        </form>
      </div>

      {/* List Categories */}
      <div className="bg-gray-800 rounded-xl shadow-2xl p-6">
        <h2 className="text-2xl font-semibold mb-6 text-purple-300">Mevcut Kategoriler</h2>
        {isLoading && categories.length > 0 && (
            <div className="flex items-center text-sm text-gray-400 mb-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Kategoriler güncelleniyor...
            </div>
        )}
        {categories.length === 0 && !isLoading && (
          <p className="text-gray-400 italic">Henüz hiç kategori eklenmemiş.</p>
        )}
        <ul className="space-y-4">
          {categories.map(category => (
            <li key={category.id} className="p-5 bg-gray-700 rounded-lg shadow-lg hover:shadow-purple-500/30 transition-shadow duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-purple-400">{category.name}</h3>
                  <p className="text-sm text-gray-400">ID: {category.id}</p>
                  <p className="text-sm text-gray-400">Path: /public/images/is_ortaklari/{category.originalPath}</p>
                  <p className="text-sm text-gray-400">Logo Sayısı: {category.logos.length}</p>
                </div>
                <div className="flex space-x-3">
                  <button 
                    title={expandedCategoryId === category.id ? "Logoları Gizle" : "Logoları Yönet"}
                    onClick={() => setExpandedCategoryId(expandedCategoryId === category.id ? null : category.id)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors duration-200"
                  >
                    {expandedCategoryId === category.id ? <ChevronRight className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                  <button 
                    title="Kategoriyi Düzenle"
                    onClick={() => handleEditCategory(category)}
                    disabled={isLoading || !!editingCategory} // Disable if already editing another or loading
                    className="p-2 bg-yellow-500 hover:bg-yellow-600 rounded-full text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Edit3 className="h-5 w-5" />
                  </button>
                  <button 
                    title="Kategoriyi Sil"
                    onClick={() => handleDeleteCategory(category)}
                    disabled={deletingCategoryId === category.id || isLoading}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded-full text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingCategoryId === category.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              {/* Inline Edit Form for Category Name */}
              {editingCategory && editingCategory.id === category.id && (
                <form onSubmit={handleUpdateCategory} className="mt-4 p-4 bg-gray-600 rounded-md space-y-3">
                  <div>
                    <label htmlFor={`editCategoryName-${category.id}`} className="block text-sm font-medium text-gray-300 mb-1">Yeni Kategori Adı:</label>
                    <input
                      type="text"
                      id={`editCategoryName-${category.id}`}
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-500 border border-gray-400 rounded-md focus:ring-1 focus:ring-purple-400 focus:border-purple-400 outline-none transition-colors duration-200"
                      required
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={isUpdatingCategory}
                      className="flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-sm transition-colors duration-200 disabled:opacity-50"
                    >
                      {isUpdatingCategory ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <PlusCircle className="h-5 w-5 mr-2" />} Kaydet
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-gray-500 hover:bg-gray-400 text-white font-semibold rounded-md shadow-sm transition-colors duration-200"
                    >
                      İptal
                    </button>
                  </div>
                </form>
              )}
              
              {/* Logo Management Section (Expanded) */}
              {expandedCategoryId === category.id && (
                <div className="mt-6 p-5 bg-gray-700/50 rounded-lg">
                  <h4 className="text-lg font-semibold mb-4 text-purple-300">Logolar ({category.logos.length})</h4>
                  {category.logos.length === 0 ? (
                    <p className="text-gray-400 italic">Bu kategoride henüz logo bulunmuyor.</p>
                  ) : (
                    <ul className="space-y-3 mb-4">
                      {category.logos.map(logo => (
                        <li key={logo.id} className="p-3 bg-gray-600 rounded-md">
                          {editingLogoInfo?.logoId === logo.id ? (
                            <form onSubmit={handleSaveLogoEdit} className="space-y-2 w-full">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={editLogoAlt}
                                  onChange={(e) => setEditLogoAlt(e.target.value)}
                                  className="flex-grow px-2 py-1 bg-gray-500 border border-gray-400 rounded-md focus:ring-1 focus:ring-purple-400 focus:border-purple-400 outline-none transition-colors text-sm text-white"
                                  required
                                />
                                <div className="mb-4">
                                  <label className="block text-sm font-medium text-gray-300 mb-1">Logo URL (İsteğe Bağlı)</label>
                                  <input
                                    type="url"
                                    placeholder="https://example.com"
                                    value={editLogoUrl}
                                    onChange={(e) => setEditLogoUrl(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  />
                                </div>
                                <button 
                                  type="submit" 
                                  disabled={isUpdatingLogo || isLoading}
                                  className="p-1.5 bg-green-600 hover:bg-green-700 rounded-md text-white text-xs disabled:opacity-50"
                                >
                                  {isUpdatingLogo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                </button>
                                <button 
                                  type="button" 
                                  onClick={handleCancelEditLogo} 
                                  disabled={isUpdatingLogo || isLoading}
                                  className="p-1.5 bg-gray-400 hover:bg-gray-500 rounded-md text-white text-xs disabled:opacity-50"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                              <p className="text-xs text-gray-400">ID: {logo.id}, Path: {logo.imagePath}</p>
                            </form>
                          ) : (
                            <div className="flex justify-between items-center w-full">
                              <div className='flex items-center space-x-3'>
                                <ImageUp className="h-8 w-8 text-gray-400" /> {/* Placeholder for actual image preview */}
                                <div>
                                  <p className="text-sm font-medium text-gray-200">{logo.alt}</p>
                                  <p className="text-xs text-gray-400">ID: {logo.id}</p>
                                  <p className="text-xs text-gray-400">Path: {logo.imagePath}</p>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button 
                                  title="Logoyu Düzenle"
                                  onClick={() => handleEditLogoClick(category.id, logo.id, logo.alt, logo.url || '')}
                                  disabled={editingLogoInfo?.logoId === logo.id || isLoading || deletingLogoInfo?.logoId === logo.id}
                                  className="p-1.5 bg-yellow-500 hover:bg-yellow-600 rounded-md text-white transition-colors duration-200 disabled:opacity-50"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </button>
                                <button 
                                  title="Logoyu Sil"
                                  onClick={() => handleDeleteLogo(category.id, logo.id)}
                                  disabled={deletingLogoInfo?.logoId === logo.id || isLoading || editingLogoInfo?.logoId === logo.id}
                                  className="p-1.5 bg-red-600 hover:bg-red-700 rounded-md text-white transition-colors duration-200 disabled:opacity-50"
                                >
                                  {deletingLogoInfo?.logoId === logo.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                </button>
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                  {/* Add New Logo Form */}
                  <div className="mt-6 pt-6 border-t border-gray-600">
                    <h5 className="text-md font-semibold mb-3 text-purple-300">Yeni Logo Ekle</h5>
                    <form onSubmit={(e) => handleAddLogo(e, category.id)} className="space-y-4">
                      <div>
                        <label htmlFor={`newLogoAlt-${category.id}`} className="block text-sm font-medium text-gray-300 mb-1">Logo Alt Metni:</label>
                        <input
                          type="text"
                          id={`newLogoAlt-${category.id}`}
                          value={newLogoAlt}
                          onChange={(e) => setNewLogoAlt(e.target.value)}
                          placeholder="Örn: Şirket Adı Logosu"
                          className="w-full px-3 py-2 bg-gray-500 border border-gray-400 rounded-md focus:ring-1 focus:ring-purple-400 focus:border-purple-400 outline-none transition-colors text-sm text-white"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor={`newLogoFile-${category.id}`} className="block text-sm font-medium text-gray-300 mb-1">Logo Resmi:</label>
                        <input
                          type="file"
                          id={`newLogoFile-${category.id}`}
                          accept="image/svg+xml, image/png, image/jpeg, image/gif, image/webp"
                          onChange={(e) => setNewLogoFile(e.target.files ? e.target.files[0] : null)}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor={`newLogoClickUrl-${category.id}`} className="block text-sm font-medium text-gray-300 mb-1">Tıklama URL'i (İsteğe Bağlı)</label>
                        <input
                          type="text"
                          id={`newLogoClickUrl-${category.id}`}
                          placeholder="https://company-website.com"
                          value={newLogoClickUrl}
                          onChange={(e) => setNewLogoClickUrl(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <p className="text-xs text-gray-400 mt-1">Logoya tıklandığında gidilecek web sitesi</p>
                      </div>
                      <button
                        type="submit"
                        disabled={activeLogoAddCategoryId === category.id || isLoading}
                        className="w-full flex items-center justify-center px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-700"
                      >
                        {activeLogoAddCategoryId === category.id ? (
                          <><Loader2 className="animate-spin h-5 w-5 mr-2" /> Ekleniyor...</>
                        ) : (
                          <><ImageUp className="h-5 w-5 mr-2" /> Logoyu Ekle</>
                        )}
                      </button>
                    </form>
                  </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  </div>
  </>
);
};

export default AdminPartnersManagementPage;
