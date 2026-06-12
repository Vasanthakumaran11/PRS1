import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import { Star, Award } from 'lucide-react';
import { productAPI } from '../services/api';
import { categories } from '../data/mockData';

const TopRatedPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setIsLoading(true);
        const response = await productAPI.getAll();
        setProducts(response.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="mb-14 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-950/30 mb-6 border-4 border-yellow-50 dark:border-yellow-900/20">
             <Star className="w-8 h-8 text-yellow-500 fill-current" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">Top Rated Picks</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-bold">Discover our highest-rated products, organized by their respective categories.</p>
        </div>

        {isLoading ? (
          <div className="space-y-12">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-800 w-48 rounded-md animate-pulse"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => <ProductSkeleton key={i} />)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {categories.map((category) => {
              // Filter products matching category
              const catProducts = products
                .filter(p => p.category && p.category.toLowerCase() === category.id.toLowerCase())
                // Sort by rating descending
                .sort((a, b) => {
                  const rA = a.rating || a.avgRating || 0;
                  const rB = b.rating || b.avgRating || 0;
                  return rB - rA;
                })
                // Take top 4
                .slice(0, 4);

              if (catProducts.length === 0) return null;

              return (
                <section key={category.id} className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-150 dark:border-gray-700/80 shadow-sm">
                  <div className="flex items-center gap-2 mb-6 pb-3 border-b border-gray-100 dark:border-gray-700">
                    <Award className="w-6 h-6 text-[#004b36] dark:text-[#8cc63f]" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">{category.name}</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {catProducts.map((product, idx) => (
                      <div key={product.productId} className="relative group">
                        {idx < 3 && (
                          <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white z-10 shadow-md ${idx === 0 ? 'bg-yellow-500 animate-bounce' : idx === 1 ? 'bg-gray-400' : 'bg-orange-400'}`}>
                            {'#' + (idx + 1)}
                          </div>
                        )}
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default TopRatedPage;
