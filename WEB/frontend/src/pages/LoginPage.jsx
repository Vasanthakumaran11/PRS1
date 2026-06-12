import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9f4] via-[#f8fafc] to-[#f5fdf7] dark:from-[#05110d] dark:via-[#0b0f19] dark:to-[#07130e] flex items-center justify-center p-0 lg:p-8 relative overflow-hidden transition-colors duration-300 z-0">
      
      {/* Dynamic Glowing Accent Blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-[#bdf584]/25 to-[#8cc63f]/15 blur-[120px] dark:from-[#8cc63f]/10 dark:to-transparent pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tl from-[#004b36]/15 to-[#bdf584]/10 blur-[150px] dark:from-[#004b36]/25 dark:to-transparent pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '12s' }}></div>
      <div className="absolute top-[40%] right-[30%] w-[30%] h-[30%] rounded-full bg-[#8cc63f]/5 blur-[90px] dark:bg-[#8cc63f]/5 pointer-events-none -z-10"></div>

      {/* Tech Dot Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#004b36_1px,transparent_1px)] dark:bg-[radial-gradient(#8cc63f_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.06] dark:opacity-[0.04] pointer-events-none -z-10"></div>

      {/* Main Container Card (Glassmorphic) */}
      <div className="w-full max-w-7xl bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl lg:rounded-[2.5rem] shadow-2xl overflow-hidden min-h-screen lg:min-h-[760px] grid grid-cols-1 lg:grid-cols-12 border border-white/50 dark:border-gray-800/50 relative z-10">
        
        {/* Left Side: Product Branding & Info */}
        <div className="lg:col-span-5 flex flex-col justify-between p-8 lg:p-12 bg-white/30 dark:bg-gray-900/20 backdrop-blur-md border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-gray-800">
          
          {/* Logo Header */}
          <div className="flex items-center gap-2 mb-12 lg:mb-0">
            <img 
              src="/Designer (1).png" 
              alt="Logo" 
              className="w-10 h-10 object-contain" 
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl leading-none uppercase tracking-tight text-[#004b36] dark:text-[#fbfefd]">Revu</span>
              <span className="text-[10px] font-bold tracking-widest text-[#004b36] dark:text-[#fbfefd]">.com.au</span>
            </div>
          </div>

          {/* Core Content */}
          <div className="my-auto py-8">
            <span className="text-xs font-black tracking-widest text-[#004b36] dark:text-[#8cc63f] uppercase block mb-3">
              Verified Multi-Platform Reviews
            </span>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#1a2b22] dark:text-white leading-tight mb-6">
              POWERED BY <span className="relative inline-block z-10 before:content-[''] before:absolute before:bottom-1 before:left-0 before:w-full before:h-3 before:bg-[#bdf584]/80 dark:before:bg-[#004b36]/60 before:-z-10 px-1">COMMUNITY TRUTH.</span><br />AHEAD OF THE REST.
            </h1>
            
            {/* Opacity Brand Circles */}
            <div className="flex gap-1.5 mb-8">
              <div className="w-5 h-5 rounded-full bg-[#004b36]"></div>
              <div className="w-5 h-5 rounded-full bg-[#8cc63f]"></div>
              <div className="w-5 h-5 rounded-full bg-[#bdf584]"></div>
            </div>
            
            <p className="text-gray-500 dark:text-gray-400 font-semibold text-sm mb-4">
              Don't have an account?
            </p>
            <Link 
              to="/signup" 
              className="inline-flex items-center gap-1.5 font-bold text-[#004b36] hover:text-[#003828] dark:text-[#8cc63f] dark:hover:text-[#6fa82f] pb-0.5 border-b-2 border-transparent hover:border-current transition-all text-base group"
            >
              Create account 
              <ArrowRight className="w-4 h-4 transform translate-x-0 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          

        </div>

        {/* Right Side: Image + Overlay + Glass Form */}
        <div className="lg:col-span-7 relative flex items-center justify-center p-6 lg:p-12 bg-gray-150 dark:bg-gray-950 overflow-hidden lg:rounded-r-[2.5rem] min-h-[500px] lg:min-h-0">
          
          {/* Background Photo */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[15s] hover:scale-105"
            style={{ backgroundImage: `url('/login_bg.png')` }}
          />
          
          {/* Green Brand Tint Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#004b36]/75 via-[#004b36]/65 to-[#8cc63f]/30 mix-blend-multiply" />

          {/* Floating Top Indicators */}
          <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-10 pointer-events-none">
            <div className="flex items-center gap-1.5 bg-black/45 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-white text-[11px] font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#8cc63f] animate-pulse"></span>
              Community Feedback Platform
            </div>
            <div className="hidden sm:block text-white/80 text-xs font-semibold drop-shadow-md">
              Trusted reviews across all devices
            </div>
          </div>

          {/* Glass Card Login Form */}
          <div className="relative z-10 w-full max-w-md bg-white/75 dark:bg-gray-900/75 backdrop-blur-md rounded-2xl border border-white/30 dark:border-white/10 shadow-2xl p-8 lg:p-10 transition-all duration-300 hover:bg-white/80 dark:hover:bg-gray-900/80">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Login to your account</h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold mb-8">Enter your details to access the platform</p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider block">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input 
                    type="email" 
                    placeholder="name@company.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004b36] focus:border-[#004b36] text-gray-900 dark:text-white text-sm font-medium transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider block">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-white/80 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004b36] focus:border-[#004b36] text-gray-900 dark:text-white text-sm font-medium transition-all shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Options Row */}
              <div className="flex justify-between items-center text-xs pt-1">
                <label className="flex items-center text-gray-600 dark:text-gray-300 cursor-pointer font-bold select-none">
                  <input 
                    type="checkbox" 
                    className="mr-2 w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-[#004b36] focus:ring-[#004b36] cursor-pointer accent-[#004b36]" 
                  />
                  Remember me
                </label>
                <button 
                  type="button" 
                  className="font-bold text-[#004b36] hover:text-[#003828] dark:text-[#8cc63f] dark:hover:text-[#6fa82f] transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-[#004b36] text-white font-bold rounded-xl shadow-lg hover:bg-[#003828] active:scale-[0.99] transition duration-200 mt-6 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center text-sm tracking-wide"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign in'}
              </button>

            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default LoginPage;
