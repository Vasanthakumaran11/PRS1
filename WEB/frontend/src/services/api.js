import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Since the backend wraps error messages in standard envelope,
// but returning 400+ status code throws an Axios error.
// We can intercept the error response to easily extract the message.
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response && error.response.data && error.response.data.message) {
            return Promise.reject(new Error(error.response.data.message));
        }
        return Promise.reject(error);
    }
);

export const loginUser = async (data) => {
    return await api.post('/login', data);
};

export const registerUser = async (data) => {
    return await api.post('/register', data);
};

export const addProduct = async (data) => {
    return await api.post('/add-product', data);
};

export const addReview = async (data) => {
    return await api.post('/add-review', data);
};

export const getProduct = async (id) => {
    return await api.get(`/product/${id}`);
};

export const getTopProducts = async (n) => {
    return await api.get(`/top-products?n=${n}`);
};
