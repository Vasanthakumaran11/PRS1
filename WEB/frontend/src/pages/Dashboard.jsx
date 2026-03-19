import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTopProducts } from '../services/api';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import ReviewForm from '../components/ReviewForm';
import { Search } from 'lucide-react';

const Dashboard = () => {
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    const navigate = useNavigate();

    const fetchTopProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getTopProducts(5);
            setTopProducts(response.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch top products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopProducts();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/product/${searchQuery.trim()}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <main className="max-w-6xl mx-auto px-6 py-8">
                
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="mb-10 flex gap-2 max-w-lg mx-auto">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                        <input 
                            type="text" 
                            className="w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Search by Product ID (e.g., P-101)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                        Search
                    </button>
                </form>

                {/* Add Review Form */}
                <ReviewForm onSuccess={fetchTopProducts} />

                {/* Top Products */}
                <div>
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Top Rated Products</h2>
                    {loading && <p className="text-gray-500">Loading top products...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    
                    {!loading && !error && topProducts.length === 0 && (
                        <p className="text-gray-500 bg-white p-6 rounded-2xl shadow-sm">No products found. Be the first to add a review!</p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {topProducts.map(product => (
                            <ProductCard 
                                key={product.productId}
                                productId={product.productId}
                                name={product.name}
                                avgRating={product.avgRating}
                                reviewCount={product.reviewCount}
                            />
                        ))}
                    </div>
                </div>

            </main>
        </div>
    );
};

export default Dashboard;
