import axios from 'axios';

const API_URL = import.meta.env.MODE === "production" 
  ? "/api/v1" 
  : "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // IMPORTANT: Allows sending cookies to backend
});

// Optional: Add an interceptor to handle 401 (Unauthorized) errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If 401, it means the token expired or is invalid.
      // We will handle logout in the UI later.
      console.log('Session expired');
    }
    return Promise.reject(error);
  }
);

export default api;