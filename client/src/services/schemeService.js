import api from './api';

export const listSchemes = async (params = {}) => {
  const response = await api.get('/schemes', { params });
  return response.data;
};

export const getScheme = async (schemeId) => {
  const response = await api.get(`/schemes/${schemeId}`);
  return response.data;
};

export const searchSchemes = async (q, params = {}) => {
  const response = await api.get('/schemes/search', { params: { q, ...params } });
  return response.data;
};

export const saveScheme = async (schemeId) => {
  const response = await api.post(`/saved-schemes/${schemeId}`);
  return response.data;
};

export const deleteSavedScheme = async (schemeId) => {
  const response = await api.delete(`/saved-schemes/${schemeId}`);
  return response.data;
};

export const checkSavedSchemeStatus = async (schemeId) => {
  const response = await api.get(`/saved-schemes/${schemeId}/status`);
  return response.data;
};

export const getRecommendations = async () => {
  const response = await api.get('/recommendations');
  return response.data;
};