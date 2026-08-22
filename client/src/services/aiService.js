import api from './api';

export const askSchemeQuestion = async (message) => {
  const language = localStorage.getItem('language') || 'en';
  const response = await api.post('/ai/chat', { message, language });
  return response.data;
};

export const getSchemeInsights = async (schemeId) => {
  const language = localStorage.getItem('language') || 'en';
  const response = await api.post('/ai/chat', {
    message: `Summarize this scheme in detail: ${schemeId}`,
    language
  });
  return response.data;
};

export const queryNavigator = async (textNeed, selectedCategory) => {
  const response = await api.post('/ai/navigator', { textNeed, selectedCategory });
  return response.data;
};