import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, Settings, Edit3, Shield, Package, MapPin } from 'lucide-react';
import { productAPI, authAPI, reviewAPI } from '../services/api';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await authAPI.getMe();
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (isLoading) {
    return <div className="pt-24 text-center min-h-screen">Loading Profile...</div>;
  }

  if (!user) {
    return <div className="pt-24 text-center min-h-screen">User Not Found. Please log in.</div>;
  }

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
               
               <div className="flex flex-col gap-3 mb-8">
                  <div className="bg-yellow-50 px-4 py-2 rounded-xl text-yellow-700 font-bold border border-yellow-100 flex items-center justify-center">
                    <Shield className="w-4 h-4 mr-2" /> Verified Member
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300 font-medium border border-gray-100 dark:border-gray-700 flex items-center justify-center">
                    <MapPin className="w-4 h-4 mr-2" /> {user.location}
                  </div>
               </div>
               
               <button className="w-full py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-900 hover:border-gray-300 dark:border-gray-600 transition-colors">
                 <Settings className="w-5 h-5 mr-3" /> Account Settings
               </button>
            </div>
          </div>

          {/* Right Main Content placeholder */}
          <div className="w-full lg:w-2/3 space-y-8">
             <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Welcome back, {user.name}!</h3>
                <p className="text-gray-500 dark:text-gray-400">This is your personal dashboard. Here you can manage your account, view your activity, and see your customized product recommendations from our Smart Decision Engine.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
