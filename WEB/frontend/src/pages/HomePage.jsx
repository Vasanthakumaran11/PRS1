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
      <section className="relative pt-24 pb-16 lg:pt-36 lg:pb-28 overflow-hidden bg-gradient-to-br from-blue-50/40 via-slate-50 to-teal-50/20 dark:from-slate-950 dark:via-slate-900/60 dark:to-teal-950/20">
        <div className="absolute inset-0 z-0">
           <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-teal-500/10 dark:bg-teal-950/15 rounded-full blur-[110px] opacity-70 translate-x-1/4 -translate-y-1/4"></div>
           <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-blue-500/5 dark:bg-blue-950/10 rounded-full blur-[90px] opacity-60 -translate-x-1/4 translate-y-1/4"></div>
        </div>
        
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Context, Brand Heading & Features */}
          <div className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left">
            
            {/* Tag indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50/80 border border-teal-150 text-teal-800 dark:bg-teal-950/30 dark:border-teal-900/50 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-6 mx-auto lg:mx-0 w-fit">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              Real-time Store Comparison
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-gray-100 tracking-tight leading-tight mb-6 max-w-2xl">
              Find the Best Products.<br/>
              Read <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-teal-500 dark:from-teal-400 dark:to-teal-300">Verified Reviews.</span>
            </h1>
            
            <p className="text-lg text-slate-500 dark:text-gray-400 mb-8 max-w-xl leading-relaxed">
              Your ultimate product intelligence and decision support engine. Reconstruct buying decisions using verified multi-platform data, custom recommendations, and real-time deal analysis.
            </p>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4">
              <button 
                onClick={() => navigate('/products')}
                className="w-full sm:w-auto px-8 py-3.5 bg-teal-700 text-white font-bold rounded-xl hover:bg-teal-800 active:scale-[0.99] hover:-translate-y-0.5 transition-all shadow-lg text-base flex justify-center items-center gap-2"
              >
                Start Exploring <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => navigate('/top-rated')}
                className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-gray-900 text-slate-900 dark:text-gray-150 border border-slate-200 dark:border-slate-800 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 active:scale-[0.99] hover:-translate-y-0.5 transition-all shadow-sm text-base flex justify-center items-center"
              >
                See Top Rated
              </button>
            </div>

          </div>

          {/* Right Column: Visual illustration */}
          <div className="lg:col-span-6 w-full relative flex items-center justify-center">
            <div className="w-full relative max-w-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden group">
              {/* Decorative glows */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] pointer-events-none"></div>
              
              {/* Dashboard Mockup Header */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-2">Intelligence Compare Engine</span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-green-55 text-green-700 border border-green-200 text-[10px] font-bold dark:bg-green-950/20 dark:border-green-900/50 dark:text-green-400">
                  <ShieldCheck className="w-3.5 h-3.5" /> Optimal Platform Found
                </span>
              </div>

              {/* Product Info Summary */}
              <div className="flex items-center gap-4 mb-6 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-150 dark:bg-slate-900 dark:border-slate-800 flex items-center justify-center p-1.5 flex-shrink-0">
                  <Package className="w-8 h-8 text-teal-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Wireless Noise-Cancelling Headphones</h4>
                  <p className="text-slate-400 text-[11px] font-medium">Premium Electronics • Model H-900</p>
                </div>
              </div>

              {/* Side-by-Side Comparison Grid */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Competitor Card */}
                <div className="border border-slate-150 dark:border-slate-800/80 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-900/20 flex flex-col justify-between transition-colors">
                  <div className="text-left">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Standard Store</span>
                    <h5 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-3">Online Retailer A</h5>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Price</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 line-through">₹24,999</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Shipping</span>
                        <span className="font-medium text-slate-600 dark:text-slate-400">3-5 Days</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Trust Score</span>
                        <span className="font-bold text-orange-500">62% Muted</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-center font-bold py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
                    Not Recommended
                  </div>
                </div>

                {/* Revu Optimized Card */}
                <div className="border border-teal-500/30 dark:border-teal-400/20 rounded-2xl p-4 bg-teal-50/10 dark:bg-teal-950/5 flex flex-col justify-between relative shadow-lg">
                  {/* Highlight Badge */}
                  <span className="absolute -top-2.5 right-4 bg-teal-700 text-white font-extrabold text-[8px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                    Verified Deal
                  </span>
                  <div className="text-left">
                    <span className="text-[9px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block mb-1">Optimal Store</span>
                    <h5 className="font-bold text-teal-700 dark:text-teal-400 text-sm mb-3">Amazon India</h5>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Price</span>
                        <span className="font-extrabold text-green-600 text-sm">₹21,499</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Shipping</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">Next Day</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Trust Score</span>
                        <span className="font-extrabold text-green-600 flex items-center gap-0.5">
                          <CheckCircle className="w-3.5 h-3.5 fill-current text-white dark:text-slate-900 bg-green-500 rounded-full" /> 98%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-center font-bold py-1.5 rounded-lg bg-teal-700 text-white shadow-sm hover:bg-teal-800 cursor-pointer">
                    Save ₹3,500 Now
                  </div>
                </div>

              </div>

              {/* Bottom Insight Section */}
              <div className="mt-4 text-[10px] bg-slate-50 dark:bg-slate-850 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-500 flex items-center gap-2 text-left">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse flex-shrink-0"></span>
                <span>Decision Intelligence recommendation: Buy from <strong>Amazon India</strong> for the best price, delivery speed, and review trust.</span>
              </div>
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
                  className="hidden sm:flex items-center text-teal-700 font-bold hover:text-teal-800 transition-colors"
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
                    className="sm:hidden block text-center mt-6 text-teal-700 font-bold bg-teal-50 dark:bg-teal-950/40 dark:text-teal-300 w-full py-3 rounded-xl transition"
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
