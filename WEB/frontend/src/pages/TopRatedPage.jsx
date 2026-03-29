import React from 'react';
import ProductCard from '../components/ProductCard';
import { mockProducts } from '../data/mockData';
import { Star } from 'lucide-react';

const TopRatedPage = () => {
  // Filter and sort for >4.0 rating
  const topRatedProducts = [...mockProducts]
    .filter(p => p.rating >= 4.0)
    .sort((a, b) => b.rating - a.rating);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-6 border-4 border-yellow-50">
             <Star className="w-8 h-8 text-yellow-500 fill-current" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">Top Rated Picks</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">Discover our highest-rated products, beloved by customers globally. Only products with 4.0+ stars make the cut.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {topRatedProducts.map((product, idx) => (
            <div key={product.id} className="relative group">
              {idx < 3 && (
                <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white z-10 shadow-lg ${idx === 0 ? 'bg-yellow-400' : idx === 1 ? 'bg-gray-400' : 'bg-orange-400'}`}>
                  {'#' + (idx + 1)}
                </div>
              )}
              <ProductCard product={product} />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default TopRatedPage;
