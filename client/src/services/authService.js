import api from './api';

export const login = async (credentials) => {
  if (!api) {
    return Promise.resolve({ data: null });
  }

  throw new Error('Authentication API is not implemented yet.');
};

export const register = async (details) => {
  if (!api) {
    return Promise.resolve({ data: null });
  }

  throw new Error('Registration API is not implemented yet.');
};

export const logout = async () => {
  throw new Error('Logout API is not implemented yet.');
};