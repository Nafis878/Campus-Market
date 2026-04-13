import { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Upload, Image as ImageIcon, CheckCircle, X, Loader2 } from 'lucide-react';
import type { Page } from '../types';

interface AddProductPageProps {
  onNavigate: (page: Page) => void;
  userId: string;
}

export default function AddProductPage({ onNavigate, userId }: AddProductPageProps) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB.');
      return;
    }
    setError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) { setError('Please enter a product title.'); return; }
    if (!price || isNaN(Number(price)) || Number(price) < 0) {
      setError('Please enter a valid price.');
      return;
    }
    if (!description.trim()) { setError('Please enter a description.'); return; }
    if (!imageFile) { setError('Please upload a product image.'); return; }

    setLoading(true);

    const fileExt = imageFile.name.split('.').pop();
    const filePath = `${userId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, imageFile, { upsert: false });

    if (uploadError) {
      setError('Failed to upload image. Please try again.');
      setLoading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    const imageUrl = publicUrlData.publicUrl;

    const { error: insertError } = await supabase.from('products').insert({
      user_id: userId,
      title: title.trim(),
      price: Number(price),
      description: description.trim(),
      image_url: imageUrl,
    });

    setLoading(false);

    if (insertError) {
      setError('Failed to post listing. Please try again.');
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center max-w-sm w-full">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Listing Posted!</h2>
          <p className="text-gray-500 text-sm mb-6">Your item is now live on CampusMarket.</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Browse Listings
            </button>
            <button
              onClick={() => {
                setTitle(''); setPrice(''); setDescription('');
                setImageFile(null); setImagePreview(null); setSuccess(false);
              }}
              className="w-full border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Post Another Item
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Post an Item</h1>
          <p className="text-gray-500 text-sm mt-1">List something for sale to fellow students</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-5 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-video">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow transition-colors"
                  >
                    <X size={16} className="text-gray-700" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-44 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <ImageIcon size={32} />
                    <span className="text-sm font-medium">Click to upload image</span>
                    <span className="text-xs">JPG, PNG, WebP up to 5MB</span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Calculus Textbook 3rd Edition"
                maxLength={100}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full pl-7 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe your item — condition, features, reason for selling..."
                rows={4}
                maxLength={600}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              />
              <p className="text-xs text-gray-400 text-right mt-0.5">{description.length}/600</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Post Listing
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
