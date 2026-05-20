import { apiRequest } from './client';

export const getIncomingRequests = () => apiRequest('/api/requests').then(res => res.received);
export const getOutgoingRequests = () => apiRequest('/api/requests').then(res => res.sent);
export const sendRequest = (data) => apiRequest('/api/requests', { method: 'POST', body: JSON.stringify(data) });
export const updateRequestStatus = (id, status) => apiRequest(`/api/requests/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
