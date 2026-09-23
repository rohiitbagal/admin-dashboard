import axios from 'axios';

// Create a centralized Axios instance
const api = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // If the server returns a 401, the token might be expired or invalid
      if (error.response.status === 401) {
        // Optionally clear token and redirect to login
        // localStorage.removeItem('token');
        // localStorage.removeItem('user');
        // window.location.href = '/login';
      }
      
      // Return the error message from the API if available
      const errorMessage = error.response.data?.message || 'Something went wrong';
      return Promise.reject(new Error(errorMessage));
    }
    
    // Fallback for network errors
    return Promise.reject(new Error('Network error. Please try again later.'));
  }
);

export default api;
