import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, ShoppingCart, X, CheckCircle, ThumbsUp, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { mockProducts, mockReviews } from '../data/mockData';

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = mockProducts.find(p => p.id === productId);
  
  const [activeImage, setActiveImage] = useState(product?.image);
  const [reviewViewMode, setReviewViewMode] = useState('summary');
  const [ratingInput, setRatingInput] = useState(5);
  const [reviewKeyword, setReviewKeyword] = useState('');
  const [showDetailedReview, setShowDetailedReview] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewFilter, setReviewFilter] = useState('All');
  
  useEffect(() => {
    // Reset state on navigation change
    if (product) {
      setActiveImage(product.image);
    }
  }, [productId, product]);

  if (!product) {
    return <div className="pt-24 text-center min-h-screen">Product Not Found</div>;
  }

  const relatedProducts = mockProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const reviews = mockReviews.filter(r => r.productId === product.id);
  const filteredReviews = reviewFilter === 'All' ? reviews : reviews.filter(r => r.rating === parseInt(reviewFilter));

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewKeyword && !showDetailedReview) {
      toast.error('Please select a quick response or write a detailed review.');
      return;
    }
    if (showDetailedReview && !reviewText.trim()) {
      toast.error('Please enter a detailed review.');
      return;
    }
    toast.success(`Review Submitted Successfully!`);
    setReviewText('');
    setReviewKeyword('');
    setShowDetailedReview(false);
    setRatingInput(5);
    setReviewViewMode('read');
  };

  const addToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = existingCart.find(i => i.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
      localStorage.setItem('cart', JSON.stringify(existingCart));
    } else {
      localStorage.setItem('cart', JSON.stringify([...existingCart, { ...product, quantity: 1 }]));
    }
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success(`${product.name} added to cart!`);
  };

  // Fake Histogram Data
  const histogram = [
    { stars: 5, pct: 68 },
    { stars: 4, pct: 18 },
    { stars: 3, pct: 8 },
    { stars: 2, pct: 4 },
    { stars: 1, pct: 2 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-36">
      
      {/* Breadcrumbs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 mb-6 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/category/${product.category}`} className="hover:text-blue-600 transition capitalize">{product.category}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-gray-100 font-medium">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row gap-12 bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-700 mb-8">
          
          {/* Left: Images */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm mb-4 border border-gray-100 dark:border-gray-700 group">
              <img 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-full object-cover origin-center group-hover:scale-110 transition-transform duration-500 cursor-zoom-in"
              />
            </div>
            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              <button 
                onClick={() => setActiveImage(product.image)}
                className={`w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === product.image ? 'border-blue-600 shadow-md ring-2 ring-blue-100' : 'border-gray-200 dark:border-gray-700 opacity-70 hover:opacity-100 hover:border-blue-300'}`}
              >
                <img src={product.image} className="w-full h-full object-cover" />
              </button>
              {product.thumbnails.map((thumb, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(thumb)}
                  className={`w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === thumb ? 'border-blue-600 shadow-md ring-2 ring-blue-100' : 'border-gray-200 dark:border-gray-700 opacity-70 hover:opacity-100 hover:border-blue-300'}`}
                >
                  <img src={thumb} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div className="w-full md:w-1/2 flex flex-col justify-start">
            <span className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold mb-2">{product.category}</span>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">{product.name}</h1>
            
            <div className="flex items-center mb-6 border-b border-gray-100 dark:border-gray-700 pb-6">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="text-lg font-medium text-blue-600">{product.rating}</span>
              <span className="mx-2 text-gray-300">|</span>
              <a href="#reviews" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 cursor-pointer underline underline-offset-4">{product.reviewsCount?.toLocaleString()} ratings</a>
            </div>

            <div className="text-5xl font-black text-gray-900 dark:text-gray-100 mb-8 inline-flex items-baseline gap-2 tabular-nums tracking-tight">
              ${product.price.toFixed(2)}
              <span className="text-lg text-green-600 font-medium tracking-normal ml-2">In Stock</span>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8">{product.description}</p>
            
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 mb-8">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Platform Decision Suggestion</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Add this item to your cart to get the best platform and price suggestions tailored to your budget!</p>
              <button 
                  onClick={addToCart}
                  className="w-full sm:w-auto px-8 py-4 bg-yellow-400 text-gray-900 dark:text-gray-100 rounded-xl font-bold hover:bg-yellow-500 transition-colors shadow-sm flex items-center justify-center"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
              </button>
            </div>

            {/* Specifications Section */}
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-xl mb-4">Specifications</h3>
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden text-sm">
              <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <div className="w-1/3 p-3 font-semibold text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">Brand</div>
                <div className="w-2/3 p-3 text-gray-600 dark:text-gray-400">PremiumMaker</div>
              </div>
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <div className="w-1/3 p-3 font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">Model Name</div>
                <div className="w-2/3 p-3 text-gray-600 dark:text-gray-400">{product.name}</div>
              </div>
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <div className="w-1/3 p-3 font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">Color</div>
                <div className="w-2/3 p-3 text-gray-600 dark:text-gray-400">Matte Black</div>
              </div>
              <div className="flex">
                <div className="w-1/3 p-3 font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">Warranty</div>
                <div className="w-2/3 p-3 text-gray-600 dark:text-gray-400">1 Year Manufacturer Warranty</div>
              </div>
            </div>

          </div>
        </div>

        {/* Full Width Division */}
        <hr className="my-12 border-t border-gray-200 dark:border-gray-800" />

        {/* Reviews Section */}
        {/* Reviews Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-10 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-700 mb-8" id="reviews">
          
          {/* STATE: SUMMARY (Default View) */}
          {reviewViewMode === 'summary' && (
            <div className="max-w-2xl mx-auto flex flex-col items-center text-center animate-in fade-in duration-300">
              <h2 className="text-3xl font-black text-gray-900 dark:text-gray-100 mb-3">Customer Reviews</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md leading-relaxed">Honest feedback from verified purchasers to help you make the best decision for your needs.</p>
              
              <div className="flex flex-col items-center mb-10 bg-gray-50 dark:bg-gray-900 w-full py-10 rounded-3xl border border-gray-100 dark:border-gray-700/80 shadow-inner">
                <div className="flex items-center mb-2">
                  <Star className="w-12 h-12 fill-current text-yellow-400 mr-4 drop-shadow-sm" />
                  <span className="text-6xl font-black text-gray-900 dark:text-gray-100 tracking-tighter">{product.rating}</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-bold mb-1">out of 5.0</p>
                <p className="text-sm font-semibold text-gray-400 dark:text-gray-500 mt-2">{product.reviewsCount?.toLocaleString()} global ratings</p>
                
                {/* Visual Histogram */}
                <div className="w-full max-w-sm mt-8 space-y-3.5 px-6">
                  {histogram.map((row) => (
                    <div key={row.stars} className="flex items-center text-sm font-bold">
                      <span className="text-gray-700 dark:text-gray-300 w-12">{row.stars} star</span>
                      <div className="flex-1 mx-4 bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden shadow-inner">
                        <div className="bg-yellow-400 h-full rounded-full transition-all duration-1000" style={{width: `${row.pct}%`}}></div>
                      </div>
                      <span className="text-gray-500 dark:text-gray-400 w-10 text-right">{row.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <button 
                  onClick={() => setReviewViewMode('write')}
                  className="px-8 py-4 bg-[#004b36] text-white font-bold rounded-xl hover:bg-[#1a2b22] dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white transition-all shadow-md text-lg"
                >
                  Write Honest Review
                </button>
                <button 
                  onClick={() => setReviewViewMode('read')}
                  className="px-8 py-4 bg-white dark:bg-gray-800 text-[#004b36] dark:text-gray-100 border-2 border-[#004b36] dark:border-gray-600 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-lg"
                >
                  Read All Reviews ({filteredReviews.length})
                </button>
              </div>
            </div>
          )}

          {/* STATE: WRITE REVIEW */}
          {reviewViewMode === 'write' && (
            <div className="w-full lg:w-3/4 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
               <div className="flex justify-between items-center mb-8 border-b border-gray-100 dark:border-gray-700 pb-5">
                 <div>
                   <h3 className="text-2xl font-black text-gray-900 dark:text-gray-100">Contribute your feedback</h3>
                   <p className="text-gray-500 dark:text-gray-400 mt-1">Your honesty helps thousands of users make better choices.</p>
                 </div>
                 <button onClick={() => setReviewViewMode('summary')} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 p-2.5 rounded-full">
                    <X className="w-5 h-5" />
                 </button>
               </div>
               
               <form onSubmit={handleReviewSubmit} className="space-y-8">
                  {/* Star Rating Area */}
                  <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700/80 p-6 sm:p-8 rounded-2xl shadow-sm">
                    <label className="block text-base font-bold text-gray-900 dark:text-gray-100 mb-4">1. Rate your overall experience</label>
                    <div className="flex gap-2.5">
                      {[1,2,3,4,5].map(star => (
                        <button 
                          type="button" 
                          key={star} 
                          onClick={() => setRatingInput(star)}
                          className={`p-1.5 transition-transform hover:scale-110 ${ratingInput >= star ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-300 dark:text-gray-700'}`}
                        >
                          <Star className="w-10 h-10 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Keyword Selection */}
                  <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700/80 p-6 sm:p-8 rounded-2xl shadow-sm">
                    <label className="block text-base font-bold text-gray-900 dark:text-gray-100 mb-4">2. Choose a quick response summarizing your thoughts</label>
                    <div className="flex flex-wrap gap-3">
                      {['Super', 'Good', 'Average', 'Poor'].map(kw => (
                        <button
                          type="button"
                          key={kw}
                          onClick={() => setReviewKeyword(kw)}
                          className={`px-8 py-3 rounded-full border-2 text-base font-bold transition-all ${reviewKeyword === kw ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        >
                          {kw}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Detailed Review Option */}
                  <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700/80 p-6 sm:p-8 rounded-2xl shadow-inner">
                    <label className="flex items-start sm:items-center cursor-pointer group mb-1">
                      <input 
                        type="checkbox" 
                        className="w-6 h-6 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer mt-0.5 sm:mt-0 shadow-sm"
                        checked={showDetailedReview}
                        onChange={(e) => setShowDetailedReview(e.target.checked)}
                      />
                      <span className="ml-4 text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors">
                        I am ready to provide a detailed review in a sentence or paragraph.
                      </span>
                    </label>

                    {showDetailedReview && (
                      <div className="animate-in fade-in slide-in-from-top-2 duration-300 mt-6">
                        <textarea 
                          required={showDetailedReview}
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          rows="8" 
                          className="w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-5 py-5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none text-base text-gray-900 dark:text-gray-100 shadow-inner"
                          placeholder="Write your honest detailed review here. Be highly descriptive about what you liked or disliked. Your original input acts as crucial guidance for thousands of daily purchasers!"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setReviewViewMode('summary')} className="px-8 py-4 bg-transparent border-2 border-gray-300 dark:border-gray-600 font-bold rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-lg">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 py-4 bg-[#004b36] text-white font-bold rounded-xl hover:bg-[#1a2b22] dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white transition-all shadow-md text-lg flex justify-center items-center">
                      Submit Honest Review <CheckCircle className="ml-2 w-6 h-6" />
                    </button>
                  </div>
               </form>
            </div>
          )}

          {/* STATE: READ REVIEWS */}
          {reviewViewMode === 'read' && (
             <div className="w-full lg:w-4/5 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
               
               <div className="flex justify-between items-center mb-10 border-b border-gray-100 dark:border-gray-700 pb-5">
                 <div className="flex items-center gap-5">
                   <button onClick={() => setReviewViewMode('summary')} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors bg-gray-100 dark:bg-gray-700/80 hover:bg-gray-200 dark:hover:bg-gray-600 p-3 rounded-full hidden sm:flex border border-gray-200 dark:border-gray-600 shadow-sm">
                      <ChevronRight className="w-6 h-6 rotate-180" />
                   </button>
                   <div>
                     <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Customer Feedback</h3>
                     <p className="text-gray-500 dark:text-gray-400 mt-1">Read what others have to say.</p>
                   </div>
                 </div>
                 <button onClick={() => setReviewViewMode('write')} className="px-6 py-3 bg-[#004b36] text-white font-bold rounded-xl hover:bg-[#1a2b22] dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white transition-all shadow-md">
                    Add Review
                 </button>
               </div>

               {/* Review Filters */}
               <div className="flex flex-wrap items-center gap-3 mb-10 bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                 <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider pl-2 pr-1">Filter:</span>
                 {['All', '5', '4', '3', '2', '1'].map(val => (
                   <button 
                     key={val}
                     onClick={() => setReviewFilter(val)}
                     className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${reviewFilter === val ? 'bg-[#004b36] text-white dark:bg-gray-100 dark:text-gray-900 shadow-md' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                   >
                     {val === 'All' ? 'All Reviews' : `${val} Stars`}
                   </button>
                 ))}
               </div>

               <div className="space-y-6">
                 {filteredReviews.length > 0 ? filteredReviews.map(review => (
                   <div key={review.id} className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700/80 p-8 rounded-3xl block w-full transition-shadow hover:shadow-md">
                     <div className="flex items-center justify-between mb-5">
                       <div className="flex items-center">
                         <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 font-black text-xl mr-5 object-cover shadow-sm border-2 border-white dark:border-gray-800 relative z-0">
                           {review.userId.charAt(0)}
                           <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-4 h-4 border-2 border-white dark:border-gray-800 z-10"></div>
                         </div>
                         <div>
                           <h4 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-tight">{review.userId}</h4>
                           <p className="text-sm font-semibold text-gray-400 mt-1">Reviewed on {new Date(review.timestamp).toLocaleDateString()}</p>
                         </div>
                       </div>
                     </div>
                     
                     <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5 pb-5 border-b border-gray-100 dark:border-gray-700/50">
                       <div className="flex items-center bg-gray-50 dark:bg-gray-900 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700 w-fit">
                         <div className="flex text-yellow-400 mr-2.5">
                           {[...Array(5)].map((_, i) => (
                             <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200 dark:text-gray-700'}`} />
                           ))}
                         </div>
                         <span className="text-sm font-black text-gray-900 dark:text-gray-100">{review.rating}.0</span>
                       </div>
                       
                       {/* Mocking the Keyword logic */}
                       <span className="text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/80 px-4 py-2 rounded-xl border border-transparent dark:border-gray-600 shadow-sm w-fit">
                          {review.rating >= 4 ? 'Super' : review.rating === 3 ? 'Average' : 'Poor'}
                       </span>

                       {review.rating >= 4 && (
                          <span className="text-xs font-bold text-green-700 flex items-center bg-green-50 px-3 py-2 rounded-xl border border-green-200 ml-auto mr-0">
                            <CheckCircle className="w-4 h-4 mr-1.5" /> Verified Purchase
                          </span>
                       )}
                     </div>

                     <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 text-base lg:text-lg">{review.text}</p>
                     
                     <div className="flex items-center gap-5 pt-2">
                        <button className="flex items-center text-sm text-gray-600 dark:text-gray-400 font-bold hover:text-blue-600 dark:hover:text-blue-400 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-5 py-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition flex-shrink-0 shadow-sm">
                           <ThumbsUp className="w-4 h-4 mr-2" /> Helpful (12)
                        </button>
                        <span className="text-sm font-semibold text-gray-400 border-l border-gray-200 dark:border-gray-700 pl-5 cursor-pointer hover:text-red-500 dark:hover:text-red-400 transition-colors">Report</span>
                     </div>
                   </div>
                 )) : (
                   <div className="py-20 text-center bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl">
                     <p className="text-gray-500 dark:text-gray-400 font-bold mb-4 text-xl">No reviews matching this specific filter.</p>
                     <button onClick={() => setReviewFilter('All')} className="text-[#004b36] dark:text-[#8cc63f] font-bold hover:underline">Clear Filters</button>
                   </div>
                 )}
               </div>

               <div className="mt-10 flex justify-center pb-6">
                 <button className="px-10 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition shadow-sm text-lg">
                   Load More Reviews
                 </button>
               </div>
             </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Related products you might like</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {relatedProducts.map(rp => (
                <Link to={`/product/${rp.id}`} key={rp.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition group block">
                   <div className="aspect-square bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden mb-4">
                     <img src={rp.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                   </div>
                   <h4 className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-1 mb-1">{rp.name}</h4>
                   <div className="flex text-yellow-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < Math.floor(rp.rating) ? 'fill-current' : 'text-gray-300'}`} />
                      ))}
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">{rp.reviewsCount}</span>
                    </div>
                   <span className="font-bold text-gray-900 dark:text-gray-100">${rp.price.toFixed(2)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-3 px-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between sm:justify-end gap-3 sm:gap-6">
          <div className="hidden sm:flex items-center mr-auto">
            <img src={product.image} className="w-14 h-14 rounded-lg object-cover mr-4 border border-gray-200 dark:border-gray-700 shadow-sm" />
            <div>
              <p className="font-bold text-gray-900 dark:text-gray-100 truncate max-w-[250px]">{product.name}</p>
              <div className="flex items-center text-yellow-400 mt-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`} />
                  ))}
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1 font-medium">{product.reviewsCount}</span>
              </div>
            </div>
          </div>
          
          <div className="hidden sm:flex flex-col items-end mr-4">
             <span className="text-2xl font-black text-gray-900 dark:text-gray-100 leading-none">${product.price.toFixed(2)}</span>
             <span className="text-xs text-green-600 font-bold uppercase mt-1">In Stock</span>
          </div>

          <button 
            onClick={() => navigate(-1)}
            className="flex-1 sm:flex-none flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl font-bold transition-colors"
          >
             Skip / Back
          </button>
          <button 
            onClick={addToCart}
            className="flex-1 sm:flex-none flex items-center justify-center px-8 py-3 bg-yellow-400 text-gray-900 dark:text-gray-100 rounded-xl font-bold hover:bg-yellow-500 transition-colors shadow-sm"
          >
            <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
          </button>
        </div>
      </div>

    </div>
  );
};

export default ProductDetailsPage;
