import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import { PlusCircle, ShoppingBag, Loader2, AlertCircle } from 'lucide-react';
import type { Product, Page } from '../types';

interface HomePageProps {
  isLoggedIn: boolean;
  onNavigate: (page: Page) => void;
}

export default function HomePage({ isLoggedIn, onNavigate }: HomePageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError('Failed to load listings. Please refresh the page.');
      } else {
        setProducts(data ?? []);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white py-14 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <ShoppingBag size={30} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Campus Marketplace</h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto">
            Buy and sell items with fellow students — textbooks, gadgets, furniture, and more.
          </p>
          {isLoggedIn ? (
            <button
              onClick={() => onNavigate('add-product')}
              className="mt-6 inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow"
            >
              <PlusCircle size={18} />
              Post an Item
            </button>
          ) : (
            <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={() => onNavigate('register')}
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow"
              >
                Get Started
              </button>
              <button
                onClick={() => onNavigate('login')}
                className="inline-flex items-center gap-2 bg-blue-500/30 text-white border border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-blue-500/40 transition-colors"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {loading ? 'Loading listings...' : `${products.length} listing${products.length !== 1 ? 's' : ''} available`}
          </h2>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={32} className="animate-spin text-blue-500" />
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <ShoppingBag size={28} className="text-gray-300" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No listings yet</p>
            <p className="text-gray-400 text-sm mt-1">Be the first to post an item!</p>
            {isLoggedIn && (
              <button
                onClick={() => onNavigate('add-product')}
                className="mt-5 inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
              >
                <PlusCircle size={16} />
                Post an Item
              </button>
            )}
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
