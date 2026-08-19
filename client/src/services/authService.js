import api from './api';
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (details) => api.post('/auth/register', details);