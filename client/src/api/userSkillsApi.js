import { apiRequest } from './client';

export const getUserSkills = () => {
  return apiRequest('/api/user-skills');
};

export const addUserSkill = (skillId) => {
  return apiRequest('/api/user-skills', {
    method: 'POST',
    body: JSON.stringify({ skillId })
  });
};

export const removeUserSkill = (skillId) => {
  return apiRequest(`/api/user-skills/${skillId}`, {
    method: 'DELETE'
  });
};
