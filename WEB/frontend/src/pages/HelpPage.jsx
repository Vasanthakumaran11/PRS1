import React, { useState } from 'react';
import { Search, Info, MapPin, CreditCard, RotateCcw, Box, ArrowRight, MessageSquare, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const HelpPage = () => {
   const [activeAccordion, setActiveAccordion] = useState(null);

   const toggleAccordion = (index) => {
     setActiveAccordion(activeAccordion === index ? null : index);
   };

   const faqs = [
     { q: "How do I add a review?", a: "Navigate to the product page and scroll down to the 'Write a Review' section. Choose a star rating, add your text, and click submit." },
     { q: "Can I edit my review?", a: "Currently, you cannot edit an existing review. If you've made a mistake, please reach out via the contact form to have it removed." },
     { q: "How is the average rating calculated?", a: "The average rating is calculated by taking the sum of all star ratings divided by the total number of reviews left by verified users." },
     { q: "How do I search for a product?", a: "Use the main search bar in the top navigation. The search automatically looks for matches in product names and IDs as you type." },
     { q: "Where can I see products I've reviewed?", a: "Log in and navigate to your Profile page. Under the 'My Reviews' tab, you'll see a complete history of all your product reviews." },
   ];

   const commonQueries = [
    { text: "Where are my past reviews?", href: "/profile" },
    { text: "Why can't I review a product twice?", href: "#" },
    { text: "How does the best platform suggestion work?", href: "#" }
   ];

   const handleContactSubmit = (e) => {
     e.preventDefault();
     toast.success("Message sent! Support will contact you shortly.");
     e.target.reset();
   };

   return (
     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-24">
       
       {/* Support Header */}
       <div className="bg-blue-600 text-white py-16 px-4">
         <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-extrabold mb-6 tracking-tight">How can we help you?</h1>
            <div className="relative max-w-2xl mx-auto">
               <Search className="absolute left-4 top-3.5 h-6 w-6 text-gray-400" />
               <input 
                 type="text" 
                 placeholder="Search for articles, queries, or topics..." 
                 className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 dark:text-gray-100 border-0 focus:ring-4 focus:ring-blue-300 shadow-lg text-lg outline-none"
               />
            </div>
         </div>
       </div>

       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          
          {/* Quick Find Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 hover:-translate-y-1 transition duration-300 cursor-pointer">
              <Box className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2">Getting Started</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Learn how to navigate and find things.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 hover:-translate-y-1 transition duration-300 cursor-pointer">
              <MessageSquare className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2">Adding Reviews</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">How to write, read, and manage reviews.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 hover:-translate-y-1 transition duration-300 cursor-pointer">
              <Search className="w-8 h-8 text-purple-600 mb-4" />
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2">Searching Products</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Advanced filtering and finding items.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 hover:-translate-y-1 transition duration-300 cursor-pointer">
              <ShoppingCart className="w-8 h-8 text-orange-600 mb-4" />
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2">Managing Cart</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Adding, removing, and platform suggestions.</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left Col: FAQ & Contact */}
            <div className="w-full lg:w-2/3">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Frequently Asked Questions</h2>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-12 overflow-hidden">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <button 
                      onClick={() => toggleAccordion(index)}
                      className="w-full flex justify-between items-center p-6 text-left focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      <span className="font-medium text-gray-900 dark:text-gray-100 text-lg">{faq.q}</span>
                      {activeAccordion === index ? <Minus className="text-blue-600 flex-shrink-0" /> : <Plus className="text-gray-400 flex-shrink-0" />}
                    </button>
                    {activeAccordion === index && (
                      <div className="px-6 pb-6 text-gray-600 dark:text-gray-400 text-base leading-relaxed animate-in fade-in">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Contact Form */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                 <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Still need help?</h2>
                 <p className="text-gray-500 dark:text-gray-400 mb-6">Send us a message and we'll get back to you within 24 hours.</p>
                 <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                        <select className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800">
                          <option>General Inquiry</option>
                          <option>Report a Bug</option>
                          <option>Account Issue</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Email</label>
                        <input type="email" required placeholder="name@example.com" className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message Description</label>
                      <textarea rows="5" required placeholder="Describe what you need help with..." className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 resize-none"></textarea>
                    </div>
                    <button type="submit" className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition shadow-sm">
                      Submit Ticket
                    </button>
                 </form>
              </div>

            </div>

            {/* Right Col: Common Queries */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
                 <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">Common Queries</h3>
                 <ul className="space-y-4">
                   {commonQueries.map((query, i) => (
                     <li key={i}>
                       <Link to={query.href} className="flex items-center text-blue-600 hover:text-blue-800 font-medium group transition">
                          <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                          {query.text}
                       </Link>
                     </li>
                   ))}
                 </ul>
                 
                 <div className="mt-8 bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <Info className="w-8 h-8 text-blue-600 mb-3" />
                    <h4 className="font-bold text-blue-900 mb-1">Did you know?</h4>
                    <p className="text-sm text-blue-800">You can also hit "Guide" in the Navbar Help dropdown to see an instant overlay guide on how to navigate the app.</p>
                 </div>
              </div>
            </div>

          </div>

       </div>
     </div>
   );
};

export default HelpPage;
