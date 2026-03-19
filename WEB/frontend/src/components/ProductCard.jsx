import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';

const ProductCard = ({ productId, name, avgRating, reviewCount }) => {
    const navigate = useNavigate();

    return (
        <div 
            onClick={() => navigate(`/product/${productId}`)}
            className="rounded-2xl shadow-md p-6 bg-white cursor-pointer hover:shadow-lg transition flex flex-col items-start gap-3"
        >
            <h3 className="text-xl font-bold text-gray-800">{name}</h3>
            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">ID: {productId}</span>
            <div className="flex items-center gap-2 mt-auto">
                <div className="flex items-center text-yellow-500">
                    <Star size={18} fill="currentColor" />
                    <span className="ml-1 font-semibold">{avgRating.toFixed(1)}</span>
                </div>
                <span className="text-gray-400 text-sm">({reviewCount} reviews)</span>
            </div>
        </div>
    );
};

export default ProductCard;
