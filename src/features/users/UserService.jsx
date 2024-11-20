// src/features/user/UserService.js
import axios from 'axios';

const API_URL = 'https://proyecto-final-be-ritinhalamaspro.vercel.app';

export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};

export const registerUser = async (formData) => {
  const response = await axios.post(`${API_URL}/register`, formData);
  return response.data;
};

export const fetchProfile = async (token) => {
  const response = await axios.get(`${API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const logoutUser = async (token) => {
  await axios.post(`${API_URL}/logout`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
