import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, ShoppingCart } from 'lucide-react';
import { mockProducts } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import { toast } from 'react-hot-toast';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showDecisionBox, setShowDecisionBox] = useState(false);
  const [decisionStage, setDecisionStage] = useState(0); 
  const [budget, setBudget] = useState('');

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(items);
  }, []);

  const updateCart = (newItems) => {
    setCartItems(newItems);
    localStorage.setItem('cart', JSON.stringify(newItems));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (id) => {
    const item = cartItems.find(i => i.id === id);
    updateCart(cartItems.filter(item => item.id !== id));
    toast.success(`${item?.name || 'Item'} removed from cart`);
  };

  const updateQuantity = (id, delta) => {
    const newItems = cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    });
    updateCart(newItems);
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const startDecisionFlow = () => {
    setShowDecisionBox(true);
    setDecisionStage(1);
  };

  const getRecommendation = (e) => {
    e.preventDefault();
    if(!budget) {
       toast.error("Please enter a budget to get recommendations.");
       return;
    }
    setDecisionStage(2);
  };

  const suggestion = budget && parseInt(budget) < totalPrice 
    ? { text: `Since your budget is $${budget}, consider waiting for the upcoming "Great Indian Festival" on Amazon for massive discounts, or explore refurbished options.`, isPositive: false }
    : { text: `Great! The best valid platform to buy these products right now considering quick delivery and warranty is Amazon. Total price: $${totalPrice.toFixed(2)}.`, isPositive: true };

  const relatedProducts = mockProducts.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cart Header */}
        <div className="flex justify-between items-center mb-8 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight">Shopping Cart</h1>
            {cartItems.length > 0 && <p className="text-gray-500 dark:text-gray-400 mt-1">{totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart</p>}
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center">
            <div className="text-center py-24 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] w-full mb-12">
              <div className="bg-gray-50 dark:bg-gray-900 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Your cart is empty</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto text-lg leading-relaxed">Before proceed to checkout you must add some products to your shopping cart.</p>
              <Link to="/products" className="px-8 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-sm text-lg">
                Start Shopping
              </Link>
            </div>
            
            <div className="w-full">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 border-t border-gray-200 dark:border-gray-700 pt-8">You might also like</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left: Cart Items */}
            <div className="flex-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700/80 overflow-hidden divide-y divide-gray-100 dark:divide-gray-700/80">
              {cartItems.map(item => (
                <div key={item.id} className="p-6 transition-colors hover:bg-white/80 dark:hover:bg-gray-800/80 flex flex-col sm:flex-row gap-6 group">
                  <Link to={`/product/${item.id}`} className="w-full sm:w-32 h-32 flex-shrink-0 border border-gray-100 dark:border-gray-700/80 rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900 block">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  </Link>
                  <div className="flex-1 flex flex-col pt-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 transition-colors line-clamp-1">
                           <Link to={`/product/${item.id}`}>{item.name}</Link>
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize mt-0.5">{item.category}</p>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition"
                        title="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                      
                      <div className="flex items-center bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-1">
                         <button 
                           onClick={() => updateQuantity(item.id, -1)}
                           className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:bg-gray-800 hover:text-blue-600 transition disabled:opacity-50"
                           disabled={item.quantity <= 1}
                         >
                           <Minus className="w-4 h-4" />
                         </button>
                         <span className="w-10 text-center font-bold text-gray-900 dark:text-gray-100">{item.quantity}</span>
                         <button 
                           onClick={() => updateQuantity(item.id, 1)}
                           className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:bg-gray-800 hover:text-blue-600 transition"
                         >
                           <Plus className="w-4 h-4" />
                         </button>
                      </div>

                      <div className="text-right">
                         <span className="font-extrabold text-2xl text-gray-900 dark:text-gray-100">${(item.price * item.quantity).toFixed(2)}</span>
                         {item.quantity > 1 && <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">${item.price.toFixed(2)} each</div>}
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Price Summary & Decision Flow */}
            <div className="w-full lg:w-[400px]">
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-700 p-6 sm:p-8 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Order Summary</h3>
                
                <div className="space-y-4 text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between items-center text-gray-700 dark:text-gray-300">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Shipping Estimate</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                {/* Thick Order Total separator */}
                <div className="mt-6 mb-8 pt-6 border-t-2 border-gray-100 dark:border-gray-700 flex justify-between items-end">
                  <span className="text-lg font-bold text-gray-900 dark:text-gray-100">Total Price</span>
                  <span className="text-3xl font-black text-gray-900 dark:text-gray-100">${totalPrice.toFixed(2)}</span>
                </div>

                {!showDecisionBox ? (
                  <button 
                    onClick={startDecisionFlow}
                    className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors shadow-sm flex justify-center items-center"
                  >
                    Proceed to Checkout <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                ) : (
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                    {decisionStage === 1 && (
                      <form onSubmit={getRecommendation}>
                        <h4 className="font-bold text-blue-900 mb-2">Let's optimize your purchase!</h4>
                        <p className="text-sm text-blue-800 mb-4">Enter your budget and we'll compare platforms for you.</p>
                        <input 
                          type="number"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          placeholder="Your available budget..."
                          className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                        <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition">
                          Get Platform Suggestion
                        </button>
                        <button 
                           type="button"
                           onClick={() => setShowDecisionBox(false)}
                           className="w-full py-2 mt-2 text-blue-600 text-sm font-semibold hover:text-blue-800"
                        >
                          Skip recommendation
                        </button>
                      </form>
                    )}

                    {decisionStage === 2 && (
                      <div className="text-center">
                        <div className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4 ${suggestion.isPositive ? 'bg-green-100 text-green-600 ring-4 ring-green-50' : 'bg-orange-100 text-orange-600 ring-4 ring-orange-50'}`}>
                          <ShoppingCart className="w-7 h-7" />
                        </div>
                        <p className={`text-sm font-semibold mb-6 leading-relaxed ${suggestion.isPositive ? 'text-green-800' : 'text-orange-800'}`}>
                          {suggestion.text}
                        </p>
                        <button 
                          onClick={() => {
                             toast.success('Redirecting to external platform checkout...');
                          }}
                          className={`w-full py-3 text-white rounded-lg font-bold transition shadow-sm ${suggestion.isPositive ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'}`}
                        >
                          Confirm & Buy
                        </button>
                        <button 
                          onClick={() => {setDecisionStage(0); setShowDecisionBox(false)}}
                          className="w-full py-2 mt-2 text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          Back to Cart
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
