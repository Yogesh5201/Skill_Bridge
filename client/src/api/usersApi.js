import { apiRequest } from './client';

export const getUserById = (id) => apiRequest(`/api/users/${id}`);
export const updateUser = (id, data) => apiRequest(`/api/users/profile`, { method: 'PUT', body: JSON.stringify(data) });
