import apiClient from './client';

export const searchUsersBySkill = async (skill = '') => {
  const params = skill ? `?skill=${encodeURIComponent(skill)}` : '';
  const res = await apiClient.get(`/api/users${params}`);
  return res.data;
};
