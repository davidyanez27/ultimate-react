import axios from 'axios';

const InventoryApi = axios.create({
    baseURL: `${import.meta.env.VITE_HOST_URL}`,
    withCredentials: true, // This ensures cookies are sent with requests
});

// Request interceptor
InventoryApi.interceptors.request.use(
    (config) => {
        // Cookies are automatically handled by the browser
        // No need to manually set authorization headers
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling auth errors
InventoryApi.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle 401 errors (unauthorized) - but avoid infinite loops
        if (error.response?.status === 401) {
            // Only redirect if we're not already on auth pages
            const currentPath = window.location.pathname;
            if (!currentPath.startsWith('/auth/')) {
                // Redirect to login only if not already on auth pages
                window.location.href = '/auth/login';
            }
        }
        return Promise.reject(error);
    }
);

export default InventoryApi;