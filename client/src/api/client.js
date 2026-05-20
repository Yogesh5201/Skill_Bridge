import axios from 'axios';

// Check if we are in production, and if so fallback to the live Render URL
// otherwise fallback to localhost for local development
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://skill-bridge-zcin.onrender.com' : 'http://localhost:5000');
export const getToken = () => localStorage.getItem('token');

export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const clearToken = () => {
  localStorage.removeItem('token');
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add interceptor to include token
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const apiRequest = async (path, options = {}) => {
  try {
    const response = await apiClient({
      url: path,
      method: options.method || 'GET',
      data: options.body,
      headers: options.headers
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error || error.message || 'API request failed';
    throw new Error(message);
  }
};

export default apiClient;
