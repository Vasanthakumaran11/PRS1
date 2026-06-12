import React, { useState, useEffect } from 'react';
import { ArrowRight, Box, ShieldCheck, Truck, Clock, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { categories, mockProducts } from '../data/mockData';
import { productAPI } from '../services/api';
import '../index.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await productAPI.getAll();
        setProducts(response.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        // Fallback to mockProducts if API fails
        setProducts(mockProducts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-transparent">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-36 lg:pb-28 overflow-hidden bg-transparent">
        <div className="absolute inset-0 z-0">
           <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#bdf584]/50 dark:bg-emerald-950/20 rounded-full blur-[110px] opacity-70 translate-x-1/4 -translate-y-1/4"></div>
           <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#8cc63f]/25 dark:bg-teal-950/10 rounded-full blur-[90px] opacity-60 -translate-x-1/4 translate-y-1/4"></div>
        </div>
        
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Context, Brand Heading & Features */}
          <div className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left">
            
            {/* Tag indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#bdf584]/20 border border-[#004b36]/10 text-[#004b36] dark:text-[#bdf584] text-xs font-bold uppercase tracking-wider mb-6 mx-auto lg:mx-0 w-fit">
              <span className="w-2 h-2 rounded-full bg-[#8cc63f] animate-pulse"></span>
              Real-time Store Comparison
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-gray-100 tracking-tight leading-tight mb-6 max-w-2xl">
              Find the Best Products.<br/>
              Read <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#004b36] to-[#8cc63f] dark:from-emerald-400 dark:to-lime-400">Honest Reviews.</span>
            </h1>
            
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-xl leading-relaxed">
              Revu helps you discover top-rated tech, home, and fashion products while suggesting the most optimal platform to purchase them based on your budget.
            </p>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4">
              <button 
                onClick={() => navigate('/products')}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#004b36] dark:bg-gray-800 text-white font-bold rounded-xl hover:bg-[#1a2b22] dark:hover:bg-gray-700 active:scale-[0.99] hover:-translate-y-0.5 transition-all shadow-lg text-base flex justify-center items-center gap-2"
              >
                Start Exploring <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => navigate('/top-rated')}
                className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-150 border border-gray-200 dark:border-gray-800 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-850 active:scale-[0.99] hover:-translate-y-0.5 transition-all shadow-sm text-base flex justify-center items-center"
              >
                See Top Rated
              </button>
            </div>

            

          </div>

          {/* Right Column: Visual illustration */}
          <div className="lg:col-span-6 w-full relative flex items-center justify-center">
            <div className="w-full relative max-w-2xl bg-white/40 dark:bg-gray-900/40 backdrop-blur-md border border-white/60 dark:border-gray-850/60 rounded-3xl p-5 shadow-2xl relative overflow-hidden group">
              {/* Glowing inner blob */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#bdf584]/20 rounded-full blur-[80px] pointer-events-none -z-10"></div>
              
              <img 
                src="/hero_shopping.png" 
                alt="Product review comparison" 
                className="w-full h-auto object-contain rounded-2xl transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          </div>

        </div>
      </section>


      {/* Soft Divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <hr className="border-gray-200 dark:border-gray-800/80" />
      </div>

      {/* Categories Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-20">
        <div className="text-center mb-8">
           <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-gray-100 mb-4">Trending Categories</h2>
           <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-lg mb-8">Browse products through thoughtfully organized collections tailored to your lifestyle.</p>
        </div>
        
        {categories.map(category => {
          const categoryProducts = products.filter(p => 
            p.category && p.category.toLowerCase() === (category.id || category.name).toLowerCase()
          );
          
          return (
            <section key={category.id} className="relative">
              <div className="flex justify-between items-end mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{category.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{categoryProducts.length} products available</p>
                </div>
                <Link 
                  to={`/products?category=${category.id}`} 
                  className="hidden sm:flex items-center text-blue-600 font-bold hover:text-blue-800 transition-colors"
                 >
                  View Collection <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              {categoryProducts.length > 0 ? (
                <>
                  <div className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 no-scrollbar snap-x snap-mandatory">
                    {categoryProducts.slice(0, 4).map(product => (
                      <div key={product.productId || product.id} className="min-w-[280px] sm:min-w-0 snap-center">
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                  
                  <Link 
                    to={`/products?category=${category.id}`} 
                    className="sm:hidden block text-center mt-6 text-blue-700 font-bold bg-blue-50 dark:bg-blue-900 dark:text-blue-300 w-full py-3 rounded-xl transition"
                  >
                    View Full Collection
                  </Link>
                </>
              ) : (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                  <p className="text-gray-500 dark:text-gray-400">No products available in this category yet.</p>
                </div>
              )}
            </section>
          );
        })}
      </div>

    </div>
  );
};

export default HomePage;
