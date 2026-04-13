import { Tag, User, Clock } from 'lucide-react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return 'Just now';
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Tag size={36} className="text-gray-300" />
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2 mb-1">
          {product.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-3 flex-1">{product.description}</p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-blue-600 font-bold text-lg">${Number(product.price).toFixed(2)}</span>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Clock size={12} />
            {timeAgo(product.created_at)}
          </div>
        </div>
        {product.seller_name && (
          <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-100">
            <User size={12} className="text-gray-400" />
            <span className="text-xs text-gray-400 truncate">{product.seller_name}</span>
          </div>
        )}
      </div>
    </div>
  );
}
