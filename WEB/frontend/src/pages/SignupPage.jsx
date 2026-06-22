import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, MapPin, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';

const SignupPage = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [location, setLocation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/10 to-slate-100 dark:from-slate-950 dark:via-teal-950/20 dark:to-slate-900 flex items-center justify-center p-0 lg:p-8 relative overflow-hidden transition-colors duration-300 z-0">
      
      {/* Dynamic Glowing Accent Blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-teal-500/10 to-blue-500/5 blur-[120px] dark:from-teal-500/5 dark:to-transparent pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tl from-teal-950/20 to-blue-500/5 blur-[150px] dark:from-teal-950/20 dark:to-transparent pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '12s' }}></div>
      <div className="absolute top-[40%] right-[30%] w-[30%] h-[30%] rounded-full bg-teal-500/5 blur-[90px] dark:bg-teal-500/5 pointer-events-none -z-10"></div>

      {/* Tech Dot Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] dark:bg-[radial-gradient(#0f766e_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.06] dark:opacity-[0.04] pointer-events-none -z-10"></div>

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
              <span className="font-extrabold text-2xl leading-none uppercase tracking-tight text-slate-800 dark:text-white">Revu</span>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500">.com.au</span>
            </div>
          </div>

          {/* Core Content */}
          <div className="my-auto py-8">
            <span className="text-xs font-black tracking-widest text-teal-600 dark:text-teal-400 uppercase block mb-3">
              Join the Ratings Revolution
            </span>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-800 dark:text-white leading-tight mb-6">
              BECOME PART OF <span className="relative inline-block z-10 before:content-[''] before:absolute before:bottom-1 before:left-0 before:w-full before:h-3 before:bg-teal-50 dark:before:bg-teal-950/60 before:-z-10 px-1">THE TRUTH.</span><br />COMPARE &amp; CONTRIBUTE.
            </h1>
            
            {/* Opacity Brand Circles */}
            <div className="flex gap-1.5 mb-8">
              <div className="w-5 h-5 rounded-full bg-teal-700"></div>
              <div className="w-5 h-5 rounded-full bg-teal-500"></div>
              <div className="w-5 h-5 rounded-full bg-teal-300"></div>
            </div>
            
            <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm mb-4">
              Already have an account?
            </p>
            <Link 
              to="/login" 
              className="inline-flex items-center gap-1.5 font-bold text-teal-700 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 pb-0.5 border-b-2 border-transparent hover:border-current transition-all text-base group"
            >
              Log in here 
              <ArrowRight className="w-4 h-4 transform translate-x-0 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>



        </div>

        {/* Right Side: Image + Overlay + Glass Form */}
        <div className="lg:col-span-7 relative flex items-center justify-center p-6 lg:p-12 bg-slate-100 dark:bg-slate-950 overflow-hidden lg:rounded-r-[2.5rem] min-h-[500px] lg:min-h-0">
          
          {/* Background Photo */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[15s] hover:scale-105"
            style={{ backgroundImage: `url('/login_bg.png')` }}
          />
          
          {/* Green Brand Tint Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-teal-950/80 via-teal-900/60 to-slate-900/40 mix-blend-multiply" />

          {/* Floating Top Indicators */}
          <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-10 pointer-events-none">
            <div className="flex items-center gap-1.5 bg-black/45 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-white text-[11px] font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              Community Feedback Platform
            </div>
            <div className="hidden sm:block text-white/80 text-xs font-semibold drop-shadow-md">
              Trusted reviews across all devices
            </div>
          </div>

          {/* Glass Card Register Form */}
          <div className="relative z-10 w-full max-w-md bg-white/75 dark:bg-slate-900/75 backdrop-blur-md rounded-2xl border border-white/30 dark:border-white/10 shadow-2xl p-6 lg:p-8 transition-all duration-300 hover:bg-white/80 dark:hover:bg-slate-900/80 my-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-0.5">Register your account</h3>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold mb-5">Enter your details to create an account</p>
            
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Name Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-450">
                    <User className="w-3.5 h-3.5" />
                  </span>
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-900 dark:text-white text-sm font-medium transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-455">
                    <Mail className="w-3.5 h-3.5" />
                  </span>
                  <input 
                    type="email" 
                    placeholder="name@company.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-900 dark:text-white text-sm font-medium transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Password Inputs Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Password Input */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-455">
                      <Lock className="w-3.5 h-3.5" />
                    </span>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-8 py-2.5 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 dark:text-white text-xs font-medium transition-all shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Confirm Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-455">
                      <Lock className="w-3.5 h-3.5" />
                    </span>
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-8 py-2.5 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 dark:text-white text-xs font-medium transition-all shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Location Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Location (Optional)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-455">
                    <MapPin className="w-3.5 h-3.5" />
                  </span>
                  <input 
                    type="text" 
                    placeholder="Sydney, Australia" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-900 dark:text-white text-sm font-medium transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1 select-none">
                <label className="flex items-start text-xs text-slate-600 dark:text-slate-300 cursor-pointer text-left font-semibold">
                  <input 
                    type="checkbox" 
                    required 
                    className="mt-0.5 mr-2 w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-teal-700 focus:ring-teal-500 cursor-pointer accent-teal-700" 
                  />
                  <span>
                    I accept the{' '}
                    <Link to="/help" className="text-teal-700 dark:text-teal-400 hover:underline">
                      terms
                    </Link>{' '}
                    and{' '}
                    <Link to="/help" className="text-teal-700 dark:text-teal-400 hover:underline">
                      privacy policy
                    </Link>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-3 px-4 bg-teal-700 text-white font-bold rounded-xl shadow-lg hover:bg-teal-800 active:scale-[0.99] transition duration-200 mt-4 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center text-sm tracking-wide"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : 'Create account'}
              </button>

            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SignupPage;
