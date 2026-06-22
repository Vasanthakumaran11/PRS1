import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Github, Send } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-950 text-gray-600 dark:text-gray-400 text-xs py-12 border-t border-gray-200 dark:border-gray-900 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Logo & Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-gray-200 dark:border-gray-900">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-1.5 transition-colors">
              <img 
                src="/Designer (1).png" 
                alt="Logo" 
                className="w-8 h-8 object-contain" 
              />
              <div className="flex flex-col">
                <span className="font-bold text-xl leading-none uppercase tracking-tight text-slate-850 dark:text-white">Revu</span>
                <span className="text-[8px] font-bold tracking-widest text-slate-400 dark:text-slate-500">.com.au</span>
              </div>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm leading-relaxed">
              Your ultimate platform for discovering top-rated items, reading verified customer reviews, and finding the optimal purchase deals across major online platforms.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3.5 pt-2">
              <a href="#" className="p-2 rounded-full bg-gray-100 hover:bg-teal-700 hover:text-white dark:bg-gray-900 dark:hover:bg-white dark:hover:text-gray-900 text-gray-500 dark:text-gray-400 transition-colors shadow-sm">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-gray-100 hover:bg-teal-700 hover:text-white dark:bg-gray-900 dark:hover:bg-white dark:hover:text-gray-900 text-gray-500 dark:text-gray-400 transition-colors shadow-sm">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-gray-100 hover:bg-teal-700 hover:text-white dark:bg-gray-900 dark:hover:bg-white dark:hover:text-gray-900 text-gray-500 dark:text-gray-400 transition-colors shadow-sm">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-gray-100 hover:bg-teal-700 hover:text-white dark:bg-gray-900 dark:hover:bg-white dark:hover:text-gray-900 text-gray-500 dark:text-gray-400 transition-colors shadow-sm">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Shop */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3.5 text-sm uppercase tracking-wider">Shop Departments</h3>
            <ul className="space-y-2.5">
              <li><Link to="/products?category=electronics" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Electronics & Technology</Link></li>
              <li><Link to="/products?category=home" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Home & Furniture</Link></li>
              <li><Link to="/products?category=fashion" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Fashion & Lifestyle</Link></li>
              <li><Link to="/products?category=household" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Household & Groceries</Link></li>
            </ul>
          </div>

          {/* Column 2: Support */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3.5 text-sm uppercase tracking-wider">Customer Support</h3>
            <ul className="space-y-2.5">
              <li><Link to="/help" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Help Center & FAQ</Link></li>
              <li><Link to="/help" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Track Platform Orders</Link></li>
              <li><Link to="/help" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">User Agreement</Link></li>
              <li><Link to="/help" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Accessibility Statement</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3.5 text-sm uppercase tracking-wider">Get In Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                <span className="truncate">support@revu.com.au</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                <span>+61 (2) 9876 5432</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">Level 12, 100 George St,<br />Sydney NSW 2000, Australia</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section: Copyright & Legal */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-gray-500 dark:text-gray-500">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-center">
            <span>&copy; {currentYear} Revu Pty Ltd. All rights reserved.</span>
            <span className="hidden md:inline text-gray-300 dark:text-gray-800">|</span>
            <div className="flex items-center gap-3">
              <Link to="/help" className="hover:underline hover:text-gray-700 dark:hover:text-gray-300">Privacy Policy</Link>
              <Link to="/help" className="hover:underline hover:text-gray-700 dark:hover:text-gray-300">Terms of Use</Link>
              <Link to="/help" className="hover:underline hover:text-gray-700 dark:hover:text-gray-300">Legal Info</Link>
              <Link to="/help" className="hover:underline hover:text-gray-700 dark:hover:text-gray-300">Site Map</Link>
            </div>
          </div>
          <div className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span>Australia (English)</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
