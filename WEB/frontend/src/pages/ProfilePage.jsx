import React from 'react';
import { User, Mail, Calendar, Settings, Edit3, Shield, Package } from 'lucide-react';
import { mockReviews, mockProducts } from '../data/mockData';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  // Mock data for logged in user
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    joinDate: 'March 2023',
    tier: 'Gold Member'
  };

  const userReviews = mockReviews.filter(r => r.userId === "John Doe" || r.userId === "Sarah Smith"); // Mock matching some strings
  const orderHistory = mockProducts.slice(0, 3); // Mock ordered items

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar: Profile Details */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] text-center relative overflow-hidden group">
               <div className="absolute top-4 right-4 text-blue-600 bg-blue-50 p-2 rounded-full cursor-pointer hover:bg-blue-100 transition">
                  <Edit3 className="w-5 h-5" />
               </div>
               
               <div className="w-32 h-32 mx-auto bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-4xl text-white font-bold mb-6 shadow-md ring-4 ring-blue-50">
                 {user.name.charAt(0)}
               </div>
               
               <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-1">{user.name}</h2>
               <p className="text-gray-500 dark:text-gray-400 font-medium mb-6">{user.email}</p>
               
               <div className="flex justify-center gap-4 mb-8">
                  <div className="bg-yellow-50 px-4 py-2 rounded-xl text-yellow-700 font-bold border border-yellow-100 flex items-center">
                    <Shield className="w-4 h-4 mr-2" /> {user.tier}
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300 font-medium border border-gray-100 dark:border-gray-700 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" /> {user.joinDate}
                  </div>
               </div>
               
               <button className="w-full py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-900 hover:border-gray-300 dark:border-gray-600 transition-colors">
                 <Settings className="w-5 h-5 mr-3" /> Account Settings
               </button>
            </div>
          </div>

          {/* Right Main Content */}
          <div className="w-full lg:w-2/3 space-y-8">
             
             {/* Order History Mock */}
             <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                     <Package className="w-6 h-6 mr-3 text-blue-600" /> Recent Orders
                   </h3>
                   <span className="text-blue-600 font-semibold cursor-pointer hover:underline text-sm">View All</span>
                </div>
                
                <div className="space-y-4">
                  {orderHistory.map(order => (
                    <div key={order.id} className="flex items-center p-4 border border-gray-100 dark:border-gray-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900 transition group cursor-pointer">
                      <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 flex-shrink-0 mr-4">
                         <img src={order.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                      </div>
                      <div className="flex-1">
                         <h4 className="font-bold text-gray-900 dark:text-gray-100 text-lg line-clamp-1">{order.name}</h4>
                         <p className="text-sm text-gray-500 dark:text-gray-400">Delivered on {new Date().toLocaleDateString()}</p>
                      </div>
                      <div className="font-black text-gray-900 dark:text-gray-100 text-xl">${order.price.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
             </div>

             {/* Past Reviews */}
             <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center mb-6">
                  <Edit3 className="w-6 h-6 mr-3 text-green-600" /> My Reviews
                </h3>
                
                {userReviews.length > 0 ? (
                  <div className="space-y-6">
                    {userReviews.map(review => {
                      const product = mockProducts.find(p => p.id === review.productId);
                      return (
                        <div key={review.id} className="border-b border-gray-100 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                          <Link to={`/product/${product?.id}`} className="font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 transition mb-2 block">{product?.name}</Link>
                          <div className="flex text-yellow-400 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            ))}
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl text-sm italic border border-gray-100 dark:border-gray-700">"{review.text}"</p>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                   <p className="text-gray-500 dark:text-gray-400">You haven't written any reviews yet.</p>
                )}
             </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
