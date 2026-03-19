import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../services/api';
import Navbar from '../components/Navbar';
import { Star, ArrowLeft } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getProduct(id);
                setProduct(response.data.product);
                setReviews(response.data.reviews);
            } catch (err) {
                setError(err.message || 'Product not found');
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <main className="max-w-4xl mx-auto px-6 py-8">
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition font-medium"
                >
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>

                {loading && <p className="text-gray-500 text-lg">Loading product details...</p>}
                
                {error && (
                    <div className="bg-red-50 text-red-600 p-6 rounded-2xl shadow-sm text-center">
                        <h2 className="text-2xl font-bold mb-2">Error</h2>
                        <p>{error}</p>
                    </div>
                )}

                {!loading && !error && product && (
                    <>
                        <div className="bg-white rounded-2xl shadow-md p-8 mb-8 border-t-4 border-blue-600">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                            <p className="text-gray-500 bg-gray-100 inline-block px-3 py-1 rounded-md mb-6 font-medium">ID: {product.productId}</p>
                            
                            <div className="flex items-center gap-4">
                                <div className="flex items-center text-yellow-500 bg-yellow-50 px-4 py-2 rounded-lg">
                                    <Star size={24} fill="currentColor" />
                                    <span className="ml-2 text-lg font-bold">{product.avgRating.toFixed(1)}</span>
                                </div>
                                <span className="text-gray-600 text-lg">{product.reviewCount} {product.reviewCount === 1 ? 'Review' : 'Reviews'}</span>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Reviews</h2>
                            
                            {reviews.length === 0 ? (
                                <p className="text-gray-500 bg-white p-6 rounded-2xl shadow-sm">No reviews yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {reviews.map(review => (
                                        <div key={review.id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <p className="font-bold text-gray-800">{review.customerId}</p>
                                                    <p className="text-sm text-gray-500">{new Date(review.timestamp).toLocaleDateString()} {new Date(review.timestamp).toLocaleTimeString()}</p>
                                                </div>
                                                <div className="flex items-center text-yellow-500">
                                                    <Star size={16} fill="currentColor" />
                                                    <span className="ml-1 font-bold">{review.rating}</span>
                                                </div>
                                            </div>
                                            <p className="text-gray-700 whitespace-pre-line">{review.review}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default ProductDetails;
