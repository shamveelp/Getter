import axios from 'axios';
import { toast } from 'sonner';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    withCredentials: true, // For cookies (refresh token)
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

let store: any = null;
let logoutAction: any = null;
let adminLogoutAction: any = null;

export const setupInterceptors = (_store: any, _logoutAction: any, _adminLogoutAction: any) => {
    store = _store;
    logoutAction = _logoutAction;
    adminLogoutAction = _adminLogoutAction;
};

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Tokens are handled via httpOnly cookies, so we don't need to manually set the Authorization header
        // if the backend is configured to read from cookies.
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for token refresh and error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const isAdminRequest = originalRequest.url?.includes('/api/admin');
        const refreshUrl = isAdminRequest ? '/api/admin/auth/refresh-token' : '/api/users/auth/refresh-token';

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/login') &&
            !originalRequest.url?.includes('/refresh-token')
        ) {
            originalRequest._retry = true;

            try {
                const { data } = await axiosInstance.post(refreshUrl);
                if (data.success) {
                    // Update header if using Authorization header (though we moved to cookies)
                    // If backend expects cookie only, this line might be redundant but harmless
                    // originalRequest.headers.Authorization = `Bearer ${data.accessToken}`; 
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                // Refresh token failed, logout user
                if (store) {
                    if (isAdminRequest) {
                        if (adminLogoutAction) store.dispatch(adminLogoutAction());
                    } else {
                        if (logoutAction) store.dispatch(logoutAction());
                    }
                }

                // httpOnly cookies are cleared by the backend /logout or expiration
                // We just redirect here
                if (typeof window !== 'undefined' && !window.location.pathname.includes('/login') && !originalRequest.url?.includes('/auth/me')) {
                    if (isAdminRequest) {
                        toast.error('Admin session expired. Please login again.');
                        window.location.href = '/admin/login';
                    } else {
                        toast.error('Session expired. Please login again.');
                        window.location.href = '/login';
                    }
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