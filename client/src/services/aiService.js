import api from './api';
export const askSchemeQuestion = (question, schemeId) => api.post('/ai/questions', { question, schemeId });