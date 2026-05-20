import { apiRequest } from './client';

export const getUserInterests = () => {
  return apiRequest('/api/user-interests');
};

export const addUserInterest = (skillId) => {
  return apiRequest('/api/user-interests', {
    method: 'POST',
    body: JSON.stringify({ skillId })
  });
};

export const removeUserInterest = (skillId) => {
  return apiRequest(`/api/user-interests/${skillId}`, {
    method: 'DELETE'
  });
};
