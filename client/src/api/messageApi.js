import { apiRequest } from './client';

export const sendMessage = (data) => apiRequest('/api/messages', { method: 'POST', body: JSON.stringify(data) });
export const getMessages = (userId) => apiRequest(`/api/messages/${userId}`);
