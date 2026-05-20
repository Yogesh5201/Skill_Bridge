import apiClient from './client';

export const uploadDocument = async (file, recipientId = null) => {
  const formData = new FormData();
  formData.append('file', file);
  if (recipientId) formData.append('recipientId', recipientId);
  const res = await apiClient.post('/api/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const getDocuments = (recipientId = null) => {
  const params = recipientId ? `?recipientId=${recipientId}` : '';
  return apiClient.get(`/api/documents${params}`).then(r => r.data);
};

export const deleteDocument = (id) => apiClient.delete(`/api/documents/${id}`).then(r => r.data);
