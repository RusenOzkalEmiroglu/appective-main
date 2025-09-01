import React, { useState, useEffect } from 'react';
import { GameItem } from '@/data/gamesData';
import ImageUploader from '@/components/admin/ImageUploader';
import { primaryTextColor, secondaryTextColor, inputBg, buttonClasses, secondaryButtonClasses, inputBorder } from '@/app/utils/constants';

interface GameFormProps {
  initialData?: GameItem | null;
  onSubmit: (data: GameItem) => void;
  onCancel: () => void;
  isEditMode: boolean;
}

const GameForm: React.FC<GameFormProps> = ({ initialData, onSubmit, onCancel, isEditMode }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [features, setFeatures] = useState(''); // Comma-separated string
  const [platforms, setPlatforms] = useState(initialData?.platforms || '');
  const [projectUrl, setProjectUrl] = useState(initialData?.projectUrl || '');
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setImage(initialData.image || '');
      setFeatures(initialData.features?.join(', ') || '');
      setPlatforms(initialData.platforms || '');
      setProjectUrl(initialData.projectUrl || '');
    } else {
      // Reset form for new entry
      setTitle('');
      setDescription('');
      setImage('');
      setFeatures('');
      setPlatforms('');
      setProjectUrl('');
    }
  }, [initialData]);

  const handleImageUploaded = (url: string) => {
    setImage(url);
    setImageError(null); // Clear error when image is uploaded
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that image is uploaded
    if (!image || image.trim() === '') {
      setImageError('Lütfen bir resim yükleyin.');
      return;
    }
    
    const featuresArray = features.split(',').map(f => f.trim()).filter(f => f);
    
    // For new items, ID will be handled by the parent component or API
    // For existing items, we don't modify the ID here.
    const gameData: Partial<GameItem> = {
      title,
      description,
      image,
      features: featuresArray,
      platforms,
      projectUrl,
    };

    // If it's an edit, we pass the existing ID, otherwise it's undefined
    const idToUse = initialData?.id;

    onSubmit({ ...gameData, id: idToUse } as GameItem); // Type assertion as ID will be set by parent for new items
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40 p-4">
      <div className={`${inputBg} p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto`}>
        <h2 className={`text-2xl font-semibold ${primaryTextColor} mb-6`}>
          {isEditMode ? 'Edit Game' : 'Add New Game'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="title" className={`block text-sm font-medium ${secondaryTextColor} mb-1`}>Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={`w-full px-4 py-2.5 ${inputBg} border border-gray-600 rounded-lg ${primaryTextColor} focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow`}
              placeholder="Enter game title"
            />
          </div>

          <div>
            <label htmlFor="description" className={`block text-sm font-medium ${secondaryTextColor} mb-1`}>Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={`w-full px-4 py-2.5 ${inputBg} border border-gray-600 rounded-lg ${primaryTextColor} focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow`}
              placeholder="Enter game description"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${secondaryTextColor} mb-1`}>Image</label>
            <ImageUploader 
              onImageUploaded={handleImageUploaded} 
              currentImagePath={image} 
              category="games"
              brand={title || "game_asset"} 
              type="preview"
            />
            {imageError && (
              <p className="text-red-500 text-sm mt-1">{imageError}</p>
            )}
            {image && (
              <div className="mt-3 p-2 border border-gray-600 rounded-md bg-gray-700">
                <img src={image} alt="Preview" className="max-h-40 rounded-md mx-auto" />
                <p className={`text-xs ${secondaryTextColor} mt-1 text-center truncate`}>{image}</p>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="features" className={`block text-sm font-medium ${secondaryTextColor} mb-1`}>Features (comma-separated)</label>
            <input
              id="features"
              type="text"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              className={`w-full px-4 py-2.5 ${inputBg} border border-gray-600 rounded-lg ${primaryTextColor} focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow`}
              placeholder="e.g., Feature 1, Feature 2"
            />
          </div>

          <div>
            <label htmlFor="platforms" className={`block text-sm font-medium ${secondaryTextColor} mb-1`}>Platforms (comma-separated)</label>
            <input
              id="platforms"
              type="text"
              value={platforms}
              onChange={(e) => setPlatforms(e.target.value)}
              className={`w-full px-4 py-2.5 ${inputBg} border border-gray-600 rounded-lg ${primaryTextColor} focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow`}
              placeholder="e.g., Web, iOS, Android"
            />
          </div>

          <div>
            <label htmlFor="projectUrl" className={`block text-sm font-medium ${secondaryTextColor} mb-1`}>Project URL</label>
            <input
              id="projectUrl"
              type="url"
              value={projectUrl}
              onChange={(e) => setProjectUrl(e.target.value)}
              placeholder="https://example.com/my-game"
              className={`w-full px-4 py-2.5 ${inputBg} border border-gray-600 rounded-lg ${primaryTextColor} focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow`}
            />
          </div>

          <div className="flex justify-end space-x-4 pt-2">
            <button 
              type="button" 
              onClick={onCancel} 
              className={`px-5 py-2.5 rounded-lg ${secondaryTextColor} bg-gray-600 hover:bg-gray-500 transition-colors font-medium`}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`${buttonClasses} px-5 py-2.5 font-medium`}
            >
              {isEditMode ? 'Save Changes' : 'Add Game'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GameForm;
