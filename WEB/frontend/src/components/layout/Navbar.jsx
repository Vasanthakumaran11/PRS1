import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, Package, User, LogOut, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';
import HelpDropdown from './HelpDropdown';
import GuideModal from './GuideModal';
import { mockProducts } from '../../data/mockData';

const Navbar = ({ onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [guideOpen, setGuideOpen] = useState(false);
  
  // Theme & Language
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Dictionary for basic translations in Navbar
  const t = {
    en: {
      home: "Home",
      products: "Products",
      topRated: "Top Rated",
      cart: "MyCart",
      signIn: "Sign in",
      writeReview: "Write a review",
      profile: "Profile",
      signOut: "Sign Out",
      searchHint: "Search...",
      themeLabel: "Theme",
      langLabel: "Language"
    },
    ta: {
      home: "முகப்பு",
      products: "பொருட்கள்",
      topRated: "சிறந்தவை",
      cart: "வண்டி",
      signIn: "உள்நுழைக",
      writeReview: "மதிப்பாய்வு",
      profile: "சுயவிவரம்",
      signOut: "வெளியேறு",
      searchHint: "தேடு...",
      themeLabel: "தீம் (Theme)",
      langLabel: "மொழி (Language)"
    }
  }[language];

  // Profile & User State
  const isLoggedIn = true; // Guaranteed true since Navbar only renders when authenticated via App.jsx
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const userName = localStorage.getItem('userName') || 'User';
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    };
    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    setProfileOpen(false);
    toast.success(language === 'ta' ? 'வெற்றிகரமாக வெளியேறினீர்' : 'Logged out successfully');
    if (onLogout) onLogout();
  };

  const handleLogin = () => {};

  const handleLangChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    toast.success(lang === 'ta' ? 'மொழி தமிழுக்கு மாற்றப்பட்டது' : 'Language changed to English');
  };

  const filteredProducts = mockProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    if (path === '/top-rated' && location.pathname === '/top-rated') return true;
    if (path === '/products' && location.pathname === '/products') return true;
    if (path === '/cart' && location.pathname === '/cart') return true;
    return location.pathname === path;
  };

  const NavLinkItem = ({ to, children, className = '' }) => {
    const active = isActive(to);
    return (
      <Link 
        to={to} 
        className={`font-bold transition-colors px-3 py-2 flex items-center rounded ${active ? 'text-white bg-[#004b36] dark:bg-white/10 dark:text-white' : 'text-[#004b36] hover:bg-[#004b36]/10 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/5'} ${className}`}
      >
        {children}
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 w-full bg-[#bdf584] dark:bg-gray-900 border-b border-[#004b36]/15 dark:border-white/10 transition-colors duration-300 z-50 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[72px]">
          
          {/* Left: Logo & Search */}
          <div className="flex items-center flex-1 gap-4 lg:gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-1.5 flex-shrink-0 transition-colors">
              <Package className="w-8 h-8 text-[#004b36] dark:text-[#8cc63f]" strokeWidth={2.5} />
              <div className="flex flex-col">
                <span className="font-bold text-2xl leading-none uppercase tracking-tight text-[#004b36] dark:text-[#fbfefd]">Revu</span>
                <span className="text-[10px] font-bold tracking-widest text-[#004b36] dark:text-[#fbfefd]">.com.au</span>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:block max-w-[400px] w-full relative">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(true);
                  }}
                  onFocus={() => setShowSearchResults(searchQuery.length > 0)}
                  onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                  className="block w-full pl-9 pr-3 py-2.5 border-none rounded-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#004b36] shadow-inner text-sm transition-all"
                  placeholder={t.searchHint}
                />
                
                {/* Search Suggestions Dropdown */}
                {showSearchResults && searchQuery && (
                  <div className="absolute top-full mt-1 w-full bg-white dark:bg-gray-800 shadow-xl rounded-md border border-gray-100 dark:border-gray-700 py-2 z-50">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(product => (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 dark:hover:bg-gray-700 transition-colors border-b last:border-0 border-gray-50 dark:border-gray-700"
                          onClick={() => { setSearchQuery(''); setShowSearchResults(false); }}
                        >
                          <div className="w-10 h-10 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden mr-3 flex-shrink-0">
                            <img src={product.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{product.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{product.category}</p>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">No matching products found.</div>
                    )}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Right: Nav Links & Buttons */}
          <div className="hidden lg:flex items-center gap-1 ml-auto">
            <NavLinkItem to="/products">{t.products}</NavLinkItem>
            <NavLinkItem to="/top-rated">{t.topRated}</NavLinkItem>
            <div className="relative group flex items-center h-full">
              <Link to="/cart" className="font-bold text-[#004b36] hover:text-[#1a2b22] dark:text-gray-300 dark:hover:text-white transition-colors px-3 py-2 flex items-center relative">
                {t.cart}
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 text-center rounded-full leading-[16px]">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
            </div>
            
            <HelpDropdown />

            {/* Vertical Divider */}
            <div className="w-px h-6 bg-[#004b36]/20 mx-3"></div>

            <div className="flex items-center gap-4 relative" ref={profileRef}>
              {isLoggedIn ? (
                <>
                  <button 
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 text-[#004b36] dark:text-gray-300 font-bold hover:text-[#1a2b22] dark:hover:text-white transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#004b36] text-white flex items-center justify-center border border-white/20 shadow-sm text-sm">
                       {userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline-block">{userName}</span>
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-50 text-gray-900 dark:text-white">
                      
                      <Link to="/profile" onClick={() => setProfileOpen(false)} className="px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-900 dark:hover:bg-gray-700 flex items-center transition-colors">
                        <User className="w-4 h-4 mr-3" /> {t.profile}
                      </Link>

                      {/* Theme & Language Setting */}
                      <div className="px-4 py-2 border-y border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-2">{t.themeLabel}</p>
                        <div className="flex items-center gap-3 mb-4">
                          <label className="flex items-center text-sm cursor-pointer">
                            <input type="radio" name="theme" value="light" checked={theme === 'light'} onChange={() => setTheme('light')} className="mr-1.5 accent-[#8cc63f]" /> Light
                          </label>
                          <label className="flex items-center text-sm cursor-pointer">
                            <input type="radio" name="theme" value="dark" checked={theme === 'dark'} onChange={() => setTheme('dark')} className="mr-1.5 accent-[#8cc63f]" /> Dark
                          </label>
                        </div>

                        <p className="text-xs font-bold text-gray-400 uppercase mb-2">{t.langLabel}</p>
                        <div className="flex flex-col gap-2 mb-2">
                          <label className="flex items-center text-sm cursor-pointer">
                            <input type="radio" name="language" value="en" checked={language === 'en'} onChange={() => handleLangChange('en')} className="mr-1.5 accent-[#8cc63f]" /> English
                          </label>
                          <label className="flex items-center text-sm cursor-pointer">
                            <input type="radio" name="language" value="ta" checked={language === 'ta'} onChange={() => handleLangChange('ta')} className="mr-1.5 accent-[#8cc63f]" /> Tamil (தமிழ்)
                          </label>
                        </div>
                      </div>

                      <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-900 dark:hover:bg-gray-700 flex items-center transition-colors">
                        <LogOut className="w-4 h-4 mr-3" /> {t.signOut}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button onClick={handleLogin} className="text-[#004b36] dark:text-gray-300 font-bold hover:text-[#1a2b22] dark:hover:text-white transition-colors">
                  {t.signIn}
                </button>
              )}
              
              <Link 
                to="/products" 
                className="px-5 py-2.5 bg-[#004b36] text-white font-bold rounded-sm hover:bg-[#003828] shadow-md transition-colors text-sm flex items-center whitespace-nowrap"
              >
                {t.writeReview}
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-4 ml-auto">
            <Link to="/cart" className="relative text-[#004b36] dark:text-gray-300 hover:text-white p-2">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#004b36] hover:text-white focus:outline-none p-2"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
          
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-800 shadow-xl pb-6 border-t border-gray-100 dark:border-gray-700">
          <div className="px-4 pt-4 pb-2">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-[#8cc63f]"
                  placeholder={t.searchHint}
                />
              </div>
            </form>
            <div className="flex flex-col space-y-1">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={`px-4 py-3 rounded-lg font-medium transition-colors ${isActive('/') ? 'bg-[#8cc63f]/10 text-[#004b36]' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'}`}>{t.home}</Link>
              <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className={`px-4 py-3 rounded-lg font-medium transition-colors ${isActive('/products') ? 'bg-[#8cc63f]/10 text-[#004b36]' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'}`}>{t.products}</Link>
              <Link to="/top-rated" onClick={() => setIsMobileMenuOpen(false)} className={`px-4 py-3 rounded-lg font-medium transition-colors ${isActive('/top-rated') ? 'bg-[#8cc63f]/10 text-[#004b36]' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'}`}>{t.topRated}</Link>
              
              <div className="h-px bg-gray-100 dark:bg-gray-800 my-2"></div>
              
              <Link to="/help" onClick={() => setIsMobileMenuOpen(false)} className={`px-4 py-3 rounded-lg font-medium transition-colors ${isActive('/help') ? 'bg-[#8cc63f]/10 text-[#004b36]' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'}`}>Help Center / உதவி</Link>
              <button onClick={() => { setIsMobileMenuOpen(false); setGuideOpen(true); }} className="w-full text-left px-4 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                Guide Tutorial
              </button>

              <div className="h-px bg-gray-100 dark:bg-gray-800 my-2"></div>
              
              {isLoggedIn ? (
                <>
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-4 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900">
                     <User className="w-5 h-5 mr-3 text-gray-400" /> {t.profile}
                  </Link>

                  {/* Settings section in mobile menu */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 my-2 border border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">{t.themeLabel}</p>
                    <div className="flex items-center gap-4 mb-4">
                      <label className="flex items-center text-sm cursor-pointer text-gray-700 dark:text-gray-300">
                        <input type="radio" name="mobile_theme" value="light" checked={theme === 'light'} onChange={() => setTheme('light')} className="mr-1.5 accent-[#8cc63f]" /> Light
                      </label>
                      <label className="flex items-center text-sm cursor-pointer text-gray-700 dark:text-gray-300">
                        <input type="radio" name="mobile_theme" value="dark" checked={theme === 'dark'} onChange={() => setTheme('dark')} className="mr-1.5 accent-[#8cc63f]" /> Dark
                      </label>
                    </div>
                    
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">{t.langLabel}</p>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center text-sm cursor-pointer text-gray-700 dark:text-gray-300">
                        <input type="radio" name="mobile_language" value="en" checked={language === 'en'} onChange={() => handleLangChange('en')} className="mr-1.5 accent-[#8cc63f]" /> English
                      </label>
                      <label className="flex items-center text-sm cursor-pointer text-gray-700 dark:text-gray-300">
                        <input type="radio" name="mobile_language" value="ta" checked={language === 'ta'} onChange={() => handleLangChange('ta')} className="mr-1.5 accent-[#8cc63f]" /> Tamil (தமிழ்)
                      </label>
                    </div>
                  </div>

                  <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="w-full flex items-center px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50">
                     <LogOut className="w-5 h-5 mr-3" /> {t.signOut}
                  </button>
                  <Link 
                    to="/products" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center px-4 py-3 bg-[#004b36] text-white rounded-lg font-bold shadow-sm mt-2 flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" /> {t.writeReview}
                  </Link>
                </>
              ) : (
                <>
                  <button onClick={() => { handleLogin(); setIsMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900">
                    {t.signIn}
                  </button>
                  <Link 
                    to="/products" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center px-4 py-3 bg-[#004b36] text-white rounded-lg font-bold shadow-sm mt-2"
                  >
                    {t.writeReview}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Overlay Guide Modal */}
      <GuideModal 
        isOpen={guideOpen}
        onClose={() => setGuideOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
