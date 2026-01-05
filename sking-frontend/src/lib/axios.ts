import axios from 'axios';
import { store } from '../redux/store';
import { logout } from '../redux/features/authSlice';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/users',
    withCredentials: true, // For cookies (refresh token)
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add access token
axiosInstance.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for token refresh and error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const { data } = await axiosInstance.post('/auth/refresh-token');
                if (data.success && data.accessToken) {
                    localStorage.setItem('accessToken', data.accessToken);
                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                // Refresh token failed, logout user
                store.dispatch(logout());
                localStorage.removeItem('accessToken');
                if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                    toast.error('Session expired. Please login again.');
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }

        // Handle other common errors
        if (error.response?.status === 429) {
            toast.error('Too many requests. Please try again later.');
        } else if (error.response?.status >= 500) {
            toast.error('Server error. Please try again later.');
        } else if (error.code === 'ECONNABORTED') {
            toast.error('Request timeout. Please check your connection.');
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;