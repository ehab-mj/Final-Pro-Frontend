import axios from 'axios';

const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL ||
    (typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:4000/api'
        : 'https://final-pro-backend-production.up.railway.app/api');

const API = axios.create({
    baseURL: apiBaseUrl,
});

export const registerUser = async (formData) => {
    const response = await API.post('/auth/register', formData);
    return response.data;
};

export const loginUser = async (formData) => {
    const response = await API.post('/auth/login', formData);
    return response.data;
};