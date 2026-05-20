import { apiRequest } from './client';

export const login = (data) => apiRequest('/api/auth/login', { method: 'POST', body: JSON.stringify(data) });
export const register = (data) => apiRequest('/api/auth/register', { method: 'POST', body: JSON.stringify(data) });
export const getCurrentUser = () => apiRequest('/api/auth/me');
