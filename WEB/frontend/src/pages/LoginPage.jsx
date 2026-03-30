import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    try {
      setIsLoading(true);
      const response = await authAPI.login({ email, password });
      
      const { access_token, customerId, name } = response.data;
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('customerId', customerId);
      localStorage.setItem('userName', name);
      localStorage.setItem('isAuthenticated', 'true');

      toast.success('Login Successful!');
      if (onLogin) onLogin();
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-transparent">
      {/* Brand Header */}
      <div className="flex items-center gap-2 mb-8 text-[#1a2b22] dark:text-white">
        <Package className="w-10 h-10 text-[#004b36] dark:text-[#8cc63f]" strokeWidth={2.5} />
        <span className="font-black text-4xl leading-none uppercase tracking-tight">Revu</span>
      </div>

      {/* Login Card */}
      <div className="bg-white/95 backdrop-blur-sm dark:bg-gray-800/95 w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 relative overflow-hidden">
        
        {/* Subtle decorative accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8cc63f] to-[#004b36]"></div>

        <div className="flex justify-between items-center mb-8">
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Log in</h2>
           <Link to="/signup" className="text-sm font-semibold text-[#004b36] hover:text-[#003828] dark:text-[#8cc63f] dark:hover:text-[#6fa82f] transition-colors">or Create an account</Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
           <div>
             <input 
               type="email" 
               placeholder="Email address" 
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
             />
           </div>
           
           <div>
             <input 
               type="password" 
               placeholder="Password" 
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
             />
           </div>

           <div className="flex justify-between items-center text-sm pt-1">
             <label className="flex items-center text-gray-600 dark:text-gray-300 cursor-pointer font-medium">
               <input type="checkbox" className="mr-2 w-4 h-4 text-[#004b36] rounded border-gray-300 dark:border-gray-600 focus:ring-[#004b36] cursor-pointer" />
               Remember me
             </label>
             <button type="button" className="font-medium text-[#004b36] hover:text-[#003828] dark:text-[#8cc63f] dark:hover:text-[#6fa82f] transition-colors">
               Forgot Password?
             </button>
           </div>

           <button 
             type="submit" 
             disabled={isLoading}
             className="w-full py-3 px-4 bg-[#004b36] text-white font-bold rounded-lg shadow-md hover:bg-[#003828] transition duration-200 mt-6 disabled:opacity-50"
           >
             {isLoading ? 'Logging in...' : 'Log in'}
           </button>
        </form>

      </div>
    </div>
  );
};

export default LoginPage;
