import api from './api';

export const getProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

export const updateProfile = async (profile) => {
  const response = await api.put('/users/profile', profile);
  return response.data;
};

export const getSavedSchemes = async () => {
  const response = await api.get('/saved-schemes');
  return response.data;
};