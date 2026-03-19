import React, { useState } from 'react';
import { addReview } from '../services/api';

const ReviewForm = ({ onSuccess }) => {
    const [productId, setProductId] = useState('');
    const [productName, setProductName] = useState('');
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await addReview({
                productId,
                productName,
                rating: parseFloat(rating),
                review: reviewText
            });
            setProductId('');
            setProductName('');
            setRating(5);
            setReviewText('');
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.message || 'An error occurred while adding the review.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-2xl shadow-md p-6 bg-white mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Add a Review</h2>
            {error && <p className="text-red-500 text-sm mt-1 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 mb-1 font-medium">Product ID</label>
                        <input 
                            required 
                            type="text" 
                            className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            value={productId} 
                            onChange={(e) => setProductId(e.target.value)} 
                            placeholder="e.g. P-101"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1 font-medium">Product Name</label>
                        <input 
                            required 
                            type="text" 
                            className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            value={productName} 
                            onChange={(e) => setProductName(e.target.value)} 
                            placeholder="e.g. Awesome Gadget"
                        />
                    </div>
                </div>
                
                <div>
                    <label className="block text-gray-700 mb-1 font-medium">Rating (1-5): {rating}</label>
                    <input 
                        type="range" 
                        min="1" max="5" step="0.5" 
                        value={rating} 
                        onChange={(e) => setRating(e.target.value)} 
                        className="w-full cursor-pointer accent-blue-600"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1 font-medium">Review</label>
                    <textarea 
                        required 
                        rows="3"
                        className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        value={reviewText} 
                        onChange={(e) => setReviewText(e.target.value)} 
                        placeholder="What do you think about this product?"
                    />
                </div>

                <button 
                    disabled={loading}
                    type="submit" 
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {loading ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;
