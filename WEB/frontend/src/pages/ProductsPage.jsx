import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import { categories } from '../data/mockData';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { productAPI } from '../services/api';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const [query, setQuery] = useState(search);
  
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters and Sort State
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  // Tabs generated from mockData categories + "All"
  const filterTabs = [{ id: 'all', name: 'All Products' }, ...categories];

  // Fetching effect
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        let response;
        
        if (search) {
          response = await productAPI.search(search);
        } else if (activeTab !== 'all') {
          response = await productAPI.getByCategory(activeTab);
        } else {
          response = await productAPI.getAll();
        }

        let result = response.data;
        
        // Apply Sort locally for now as backend sorting is limited
        if (sortBy === 'price_asc') {
          result.sort((a, b) => a.price_amazon - b.price_amazon);
        } else if (sortBy === 'price_desc') {
          result.sort((a, b) => b.price_amazon - a.price_amazon);
        } else if (sortBy === 'top_rated') {
          result.sort((a, b) => b.avgRating - a.avgRating);
        } else if (sortBy === 'most_reviewed') {
          result.sort((a, b) => b.reviewCount - a.reviewCount);
        }

        setAllProducts(result);
        setDisplayedProducts(result.slice(0, page * itemsPerPage));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [search, activeTab, sortBy, page]);

  // When search parameter changes, reset active tab and query input
  useEffect(() => {
    if (search !== query) setQuery(search);
    if (search) {
       setActiveTab('all');
       setPage(1);
    }
  }, [search]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ search: query });
    } else {
      setSearchParams({});
    }
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
             <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 leading-none mb-1">Explore Products</h1>
             {search && <p className="text-gray-500 dark:text-gray-400 font-medium">Search results for "{search}"</p>}
          </div>
          
          <form onSubmit={handleSearch} className="w-full md:w-96 relative">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm transition-all"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
            <button type="submit" className="absolute right-1.5 top-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 p-1.5 rounded-lg hover:bg-gray-200 transition">
              <span className="sr-only">Search</span>
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Filter Tabs & Sort Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          
          {/* Horizontal Scroll Tabs */}
          <div className="flex overflow-x-auto no-scrollbar pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              {filterTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setPage(1); }}
                  className={`px-4 py-2 whitespace-nowrap rounded-full font-medium text-sm transition-all duration-200 border
                    ${activeTab === tab.id 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 hover:border-gray-300 dark:border-gray-600'
                    }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="relative flex-shrink-0 flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 shadow-sm">
            <SlidersHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium mr-2">Sort by:</span>
            <select 
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="text-sm text-gray-900 dark:text-gray-100 bg-transparent outline-none font-semibold cursor-pointer appearance-none pr-4 w-full sm:w-auto"
            >
              <option value="default">Relevance</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="top_rated">Top Rated</option>
              <option value="most_reviewed">Most Reviewed</option>
            </select>
            <ChevronDown className="absolute right-3 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
          </div>

        </div>

        {/* Separator Line */}
        <hr className="mb-8 border-t border-gray-200 dark:border-gray-800" />

        {/* Product Grid Area */}
        <div className="relative min-h-[400px]">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : displayedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-300">
                {displayedProducts.map(product => (
                  <ProductCard key={product.productId} product={product} />
                ))}
              </div>
              
              {/* Load More Button */}
              {displayedProducts.length < allProducts.length && (
                <div className="mt-12 text-center">
                  <button 
                    onClick={loadMore}
                    className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm text-base font-medium rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-blue-600 transition-colors"
                  >
                    Load More Products
                  </button>
                  <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                    Showing {displayedProducts.length} of {allProducts.length} results
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col items-center">
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-full mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No products found</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">We couldn't find any items matching your current filters. Try adjusting your search query or removing categories.</p>
              <button 
                onClick={() => { setActiveTab('all'); setSearchParams({}); }}
                className="mt-6 px-6 py-2.5 bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProductsPage;
