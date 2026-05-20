import { apiRequest } from './client';

export const getSkills = () => apiRequest('/api/skills');
export const createSkill = (name) => apiRequest('/api/skills', { method: 'POST', body: JSON.stringify({ name }) });
