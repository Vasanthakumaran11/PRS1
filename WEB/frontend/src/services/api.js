import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 Unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Check if it's NOT a login/register request
      const isAuthRequest = error.config && error.config.url && 
        (error.config.url.includes('/login') || error.config.url.includes('/register'));
      
      if (!isAuthRequest) {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('token');
        localStorage.removeItem('customerId');
        localStorage.removeItem('userName');
        
        // Redirect to login page if we aren't already there
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/register', data),
  login: (data) => api.post('/login', data),
  getMe: () => api.get('/me'),
};

export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/product/${id}`),
  getByCategory: (category) => api.get(`/products/category/${category}`),
  getTopRated: () => api.get('/products/top-rated'),
  search: (query) => api.get(`/search?query=${query}`),
};

export const reviewAPI = {
  getByProduct: (productId) => api.get(`/reviews/${productId}`),
  addReview: (data) => api.post('/add-review', data),
  updateReview: (reviewId, data) => api.put(`/update-review/${reviewId}`, data),
  deleteReview: (reviewId) => api.delete(`/delete-review/${reviewId}`),
};

export const cartAPI = {
  get: (customerId) => api.get(`/cart/${customerId}`),
  add: (data) => api.post('/cart/add', data),
  updateQuantity: (productId, quantity) => api.patch(`/cart/update-quantity?productId=${productId}&quantity=${quantity}`),
  remove: (data) => api.delete('/cart/remove', { data }),
};

export const decisionAPI = {
  getPurchaseDecision: (data) => api.post('/purchase-decision', data),
};

export const wishlistAPI = {
  get: () => api.get('/wishlist'),
  add: (data) => api.post('/wishlist/add', data),
  remove: (productId) => api.delete(`/wishlist/remove/${productId}`),
};

export default api;
