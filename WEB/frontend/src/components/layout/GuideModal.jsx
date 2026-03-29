import React, { useEffect } from 'react';
import { X, Search, MousePointerClick, Edit3, ShoppingCart, Star } from 'lucide-react';

const GuideModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const steps = [
    {
      icon: <Search className="w-8 h-8 text-blue-600" />,
      bg: "bg-blue-100",
      title: "Search for products",
      desc: "Use the search bar at the top of any page to find products by name or Product ID. Results appear instantly as you type."
    },
    {
      icon: <MousePointerClick className="w-8 h-8 text-purple-600" />,
      bg: "bg-purple-100",
      title: "View product details",
      desc: "Click any product card to open its detail page. You can see the full description, all customer reviews, star rating breakdown, and price."
    },
    {
      icon: <Edit3 className="w-8 h-8 text-green-600" />,
      bg: "bg-green-100",
      title: "Write a review",
      desc: "On any product detail page, scroll down to 'Write a Review'. Select a star rating and write your experience. You can only review each product once."
    },
    {
      icon: <ShoppingCart className="w-8 h-8 text-orange-600" />,
      bg: "bg-orange-100",
      title: "Add to cart",
      desc: "Click 'Add to Cart' on any product page or use the sticky bottom bar. View your cart from the MyCart link."
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-600" />,
      bg: "bg-yellow-100",
      title: "View top rated products",
      desc: "Click 'Top Rated' in the navigation bar to see products sorted by highest average rating. The fastest way to find quality items."
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white dark:bg-gray-800 overflow-y-auto animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-700 px-6 py-4 flex justify-between items-center z-10">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight">How to use Revu</h2>
        <button 
          onClick={onClose}
          className="p-3 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors flex items-center justify-center"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-4xl mx-auto px-6 py-12 sm:py-20 w-full flex flex-col justify-center">
        
        <div className="text-center mb-16">
          <h3 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">Welcome to your ultimate shopping companion</h3>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Master the platform in minutes with these simple quick-steps and get straight to finding the best deals.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {steps.map((step, idx) => (
             <div key={idx} className="flex flex-col sm:flex-row gap-6 p-6 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300 group">
               <div className={`w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${step.bg}`}>
                 {step.icon}
               </div>
               <div className="flex flex-col justify-center">
                 <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{step.title}</h4>
                 <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base">{step.desc}</p>
               </div>
             </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <button 
            onClick={onClose}
            className="px-12 py-5 bg-blue-600 text-white rounded-2xl font-bold text-xl hover:bg-blue-700 hover:-translate-y-1 transition-all shadow-[0_8px_30px_rgb(37,99,235,0.3)]"
          >
            I'm ready to explore!
          </button>
        </div>

      </div>
    </div>
  );
};

export default GuideModal;
