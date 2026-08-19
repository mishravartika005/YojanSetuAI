import api from './api';
export const listSchemes = (params) => api.get('/schemes', { params });
export const getScheme = (schemeId) => api.get(`/schemes/${schemeId}`);