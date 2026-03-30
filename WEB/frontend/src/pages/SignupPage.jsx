import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';

const SignupPage = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await authAPI.register({ 
        name, 
        email, 
        password,
        location: location || "Unknown" 
      });
      
      // Auto-login after registration
      const { access_token, customerId } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('customerId', customerId);
      localStorage.setItem('userName', name);
      localStorage.setItem('isAuthenticated', 'true');
      
      toast.success('Account created successfully!');
      if (onLogin) onLogin();
      navigate('/');
    } catch (error) {
      if (error.response?.status === 422) {
        // Detailed Pydantic validation errors
        const details = error.response.data.detail;
        if (Array.isArray(details)) {
          const firstError = details[0];
          const field = firstError.loc[firstError.loc.length - 1];
          toast.error(`${field}: ${firstError.msg}`);
        } else {
          toast.error("Invalid data provided.");
        }
      } else {
        const errorMessage = error.response?.data?.detail || 'Registration failed. Please try again.';
        toast.error(errorMessage);
      }
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

      {/* Register Card */}
      <div className="bg-white/95 backdrop-blur-sm dark:bg-gray-800/95 w-full max-w-[500px] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 relative overflow-hidden">
        
        {/* Subtle decorative accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8cc63f] to-[#004b36]"></div>

        <div className="flex justify-between items-center mb-8">
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Register</h2>
           <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
             Have an account? <Link to="/login" className="font-semibold text-[#004b36] hover:text-[#003828] dark:text-[#8cc63f] dark:hover:text-[#6fa82f] transition-colors">Login</Link>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
           <div>
             <input 
               type="text" 
               placeholder="Name" 
               value={name}
               onChange={(e) => setName(e.target.value)}
               className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
             />
           </div>

           <div>
             <input 
               type="email" 
               placeholder="Email address" 
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
             />
           </div>
           
           <div className="grid grid-cols-2 gap-4">
             <input 
               type="password" 
               placeholder="Password" 
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
             />
             <input 
               type="password" 
               placeholder="Confirm Password" 
               value={confirmPassword}
               onChange={(e) => setConfirmPassword(e.target.value)}
               className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
             />
           </div>

           <div className="pt-2">
             <label className="flex items-start text-sm text-gray-600 dark:text-gray-300 cursor-pointer text-left">
               <input type="checkbox" required className="mt-1 mr-2 w-4 h-4 text-[#004b36] rounded border-gray-300 dark:border-gray-600 focus:ring-[#004b36] cursor-pointer" />
               <span className="font-medium">I accept the <Link to="/help" className="text-[#004b36] dark:text-[#8cc63f] hover:underline">terms</Link> and <Link to="/help" className="text-[#004b36] dark:text-[#8cc63f] hover:underline">privacy policy</Link></span>
             </label>
           </div>

           <button 
             type="submit" 
             disabled={isLoading}
             className="w-full py-3 px-4 bg-[#004b36] text-white font-bold rounded-lg shadow-md hover:bg-[#003828] transition duration-200 mt-6 disabled:opacity-50"
           >
             {isLoading ? 'Registering...' : 'Register'}
           </button>
        </form>

      </div>
    </div>
  );
};

export default SignupPage;
