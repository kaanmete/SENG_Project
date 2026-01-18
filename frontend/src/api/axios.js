import axios from 'axios';

// Backend address
const api = axios.create({
    baseURL: 'https://backend-production-6792.up.railway.app/',
});

// --- 1. REQUEST INTERCEPTOR ---
// Intercepts every request before sending to add the Token.
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- 2. RESPONSE INTERCEPTOR ---
// Catches errors returned from the Backend.
api.interceptors.response.use(
    (response) => {
        // If the response is successful, continue as is
        return response;
    },
    (error) => {
        // If the error is 401 (Unauthorized), it means the Token is invalid.
        if (error.response && error.response.status === 401) {
            console.warn("Oturum süresi doldu, çıkış yapılıyor...");
            
            // Clear tokens
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Redirect user to Login page (React Router hooks don't work here, using window)
            // If already on the login page, do not redirect again
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
