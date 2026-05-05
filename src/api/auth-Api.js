import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:4000/api',
});

export const registerUser = async (formData) => {
    const response = await API.post('/auth/register', formData);
    return response.data;
};

export const loginUser = async (formData) => {
    const response = await API.post('/auth/login', formData);
    return response.data;
};