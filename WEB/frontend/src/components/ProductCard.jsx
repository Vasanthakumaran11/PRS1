import React from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const price = product.platforms?.amazon?.price || product.price_amazon || product.price_flipkart || product.base_price || 0;
  const rating = product.rating || product.avgRating || 0;
  const reviewCount = product.reviewCount || 0;
  
  return (
    <Link to={`/product/${product.productId}`} className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl hover:border-[#8cc63f]/60 dark:hover:border-[#8cc63f]/60 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-200 dark:border-gray-700/80">
      <div className="relative aspect-square overflow-hidden bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700/80 p-8 flex items-center justify-center">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply dark:mix-blend-normal"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider font-medium capitalize">{product.category || 'Product'}</p>
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-lg mb-2 line-clamp-2">{product.name}</h3>
        
        <div className="flex flex-col mb-3 mt-auto">
          <div className="flex text-yellow-400 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-current' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">{(reviewCount || 0).toLocaleString()} reviews</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="font-bold text-xl text-gray-900 dark:text-gray-100">₹{Math.round(price)}</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
