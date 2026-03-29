import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { categories, mockProducts } from '../data/mockData';
import { ArrowLeft } from 'lucide-react';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const category = categories.find(c => c.id === categoryId);
  const products = mockProducts.filter(p => p.category === categoryId);

  if (!category) {
    return (
      <div className="pt-24 text-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <h2 className="text-2xl font-bold mb-4">Category Not Found</h2>
        <Link to="/" className="text-blue-600 hover:underline">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{category.name}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">{category.description}</p>
            <p className="text-sm text-gray-400 mt-4">{products.length} Products Found</p>
          </div>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No products available in this category currently.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default CategoryPage;
