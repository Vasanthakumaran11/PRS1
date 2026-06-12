import React from 'react';

/**
 * Generates a nested category URL path for a product detail page.
 * Example: /product/household/groceries/house_1
 * 
 * @param {Object} product The product object
 * @returns {string} The path to the product details
 */
export const getProductDetailUrl = (product) => {
  if (!product) return '/';
  
  // Normalize category ID
  const category = (product.category || 'general').toLowerCase();
  
  // Support both backend API `productId` and mock data `id`
  const productId = product.productId || product.id || 'unknown';
  
  let subcategory = 'general';
  if (category === 'electronics') {
    subcategory = 'technology';
  } else if (category === 'home') {
    subcategory = 'furniture';
  } else if (category === 'fashion') {
    subcategory = 'lifestyle';
  } else if (category === 'household') {
    subcategory = 'groceries';
  }
  
  return `/product/${category}/${subcategory}/${productId}`;
};

/**
 * Returns a styled platform badge for a product ID prefix.
 * 
 * @param {string} productId The product ID
 * @returns {JSX.Element|null} The badge component
 */
export const getPlatformBadge = (productId) => {
  if (!productId) return null;
  if (productId.startsWith('amz_')) {
    return (
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-700 font-bold text-xs border border-green-300 ml-1.5" title="Amazon">
        a
      </span>
    );
  }
  if (productId.startsWith('rel_')) {
    return (
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold text-xs border border-red-300 ml-1.5" title="Reliance Digital">
        r
      </span>
    );
  }
  if (productId.startsWith('fash_')) {
    return (
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pink-100 text-pink-700 font-bold text-xs border border-pink-300 ml-1.5" title="Myntra">
        m
      </span>
    );
  }
  if (productId.startsWith('furn_')) {
    return (
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-100 text-orange-700 font-bold text-xs border border-orange-300 ml-1.5" title="Urban Ladder">
        u
      </span>
    );
  }
  if (productId.startsWith('house_')) {
    return (
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-lime-100 text-lime-700 font-bold text-xs border border-lime-300 ml-1.5" title="BigBasket">
        b
      </span>
    );
  }
  return null;
};
