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
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-transparent">
        <div className="absolute inset-0 z-0">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#bdf584]/60 dark:bg-blue-100 rounded-full blur-[100px] opacity-60 translate-x-1/2 -translate-y-1/4"></div>
           <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#8cc63f]/30 dark:bg-indigo-100 rounded-full blur-[80px] opacity-60 -translate-x-1/2 translate-y-1/4"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <h1 className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-gray-100 tracking-tight leading-tight mb-6 max-w-4xl mx-auto">
            Find the Best Products.<br/>
            Read <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#004b36] to-[#8cc63f] dark:from-blue-600 dark:to-indigo-600">Honest Reviews.</span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Revu helps you discover top-rated tech, home, and fashion products while suggesting the most optimal platform to purchase them based on your budget.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button 
              onClick={() => navigate('/products')}
              className="w-full sm:w-auto px-10 py-4 bg-[#004b36] dark:bg-gray-900 text-white font-bold rounded-xl hover:bg-[#1a2b22] dark:hover:bg-gray-800 hover:-translate-y-0.5 transition-all shadow-xl text-lg flex justify-center items-center"
            >
              Start Exploring <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate('/top-rated')}
              className="w-full sm:w-auto px-10 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 hover:-translate-y-0.5 transition-all shadow-sm text-lg flex justify-center items-center"
            >
              See Top Rated
            </button>
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
