import { apiRequest } from './client';

export const getSessions = () => {
  return apiRequest('/api/sessions');
};

export const createSession = ({ requestId, scheduledTime }) => {
  return apiRequest('/api/sessions', {
    method: 'POST',
    body: JSON.stringify({ requestId, scheduledTime })
  });
};
