import { apiRequest } from './client';

export const getMeetings = () => apiRequest('/api/meetings');
export const createMeeting = (data) => apiRequest('/api/meetings', { method: 'POST', body: JSON.stringify(data) });
export const updateMeeting = (id, data) => apiRequest(`/api/meetings/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteMeeting = (id) => apiRequest(`/api/meetings/${id}`, { method: 'DELETE' });
