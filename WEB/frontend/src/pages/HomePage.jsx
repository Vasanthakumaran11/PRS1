import React from 'react';
import { ArrowRight, Box, ShieldCheck, Truck, Clock, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { categories, mockProducts } from '../data/mockData';
import '../index.css';

const HomePage = () => {
  const navigate = useNavigate();

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
        
        {categories.map(category => (
          <section key={category.id} className="relative">
            <div className="flex justify-between items-end mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{category.name}</h3>
              </div>
              <Link 
                to={`/category/${category.id}`} 
                className="hidden sm:flex items-center text-blue-600 font-bold hover:text-blue-800 transition-colors"
               >
                View Collection <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 no-scrollbar snap-x snap-mandatory">
              {mockProducts
                .filter(p => p.category === category.id)
                .slice(0, 4) // Show up to 4 in row
                .map(product => (
                  <div key={product.id} className="min-w-[280px] sm:min-w-0 snap-center">
                    <ProductCard product={product} />
                  </div>
              ))}
            </div>
            
            <Link 
              to={`/category/${category.id}`} 
              className="sm:hidden block text-center mt-6 text-blue-700 font-bold bg-blue-50 w-full py-3 rounded-xl transition"
            >
              View Full Collection
            </Link>
          </section>
        ))}
      </div>

      {/* Apple-Style Footer From Reference Image */}
      <footer className="bg-[#f5f5f7] dark:bg-[#111] text-[#1d1d1f] dark:text-[#a1a1a6] text-xs pt-10 pb-8 mt-auto border-t border-gray-200 dark:border-gray-800 font-sans transition-colors duration-300">
         <div className="max-w-5xl mx-auto px-4">
            
            {/* Top row with Logo/Brand */}
            <div className="flex items-center gap-2 mb-6 border-b border-gray-300 dark:border-gray-700 pb-4">
              <Package className="w-5 h-5 text-gray-900 dark:text-gray-100" /> 
              <span className="text-gray-500 dark:text-gray-400 font-medium text-2xl">Support</span>
            </div>

            {/* Links Columns */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
               <div>
                 <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2.5">Resources</h3>
                 <ul className="space-y-2.5 text-gray-600 dark:text-gray-400 text-2xl">
                   <li><Link to="/help" className="hover:underline">My Support</Link></li>
                   <li><Link to="/help" className="hover:underline">Product Documentation</Link></li>
                   <li><Link to="/help" className="hover:underline">Accessibility</Link></li>
                 </ul>
               </div>

               <div>
                 <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2.5">Connect</h3>
                 <ul className="space-y-2.5 text-gray-600 dark:text-gray-400 text-2xl">
                   <li><Link to="/help" className="hover:underline">Contact us</Link></li>
                   <li><Link to="/help" className="hover:underline">Support app</Link></li>
                 </ul>
               </div>

            </div>

            <div className="border-t border-gray-300 dark:border-gray-700 pt-4 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 relative text-[11px]">
               <div className="flex flex-col md:flex-row items-start md:items-center md:gap-4 text-[#6e6e73] dark:text-[#a1a1a6] space-y-2 md:space-y-0">
                 <div className="flex flex-wrap items-center divide-x divide-gray-300 dark:divide-gray-600">
                    <Link to="/" className="px-2 hover:text-gray-900 dark:hover:text-gray-100 dark:hover:text-white first:pl-0">Privacy Policy</Link>
                    <Link to="/" className="px-2 hover:text-gray-900 dark:hover:text-gray-100 dark:hover:text-white">Terms of Use</Link>
                    <Link to="/" className="px-2 hover:text-gray-900 dark:hover:text-gray-100 dark:hover:text-white">Sales Policy</Link>
                    <Link to="/" className="px-2 hover:text-gray-900 dark:hover:text-gray-100 dark:hover:text-white">Legal</Link>
                    <Link to="/" className="pl-2 hover:text-gray-900 dark:hover:text-gray-100 dark:hover:text-white">Site Map</Link>
                 </div>
               </div>
               <div className="absolute top-4 right-0 md:static hover:text-gray-900 dark:hover:text-gray-100 dark:hover:text-white cursor-pointer transition-colors font-medium">
                 India
               </div>
            </div>

         </div>
      </footer>

    </div>
  );
};

export default HomePage;
