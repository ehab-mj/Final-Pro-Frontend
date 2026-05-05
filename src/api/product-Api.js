import axios from 'axios';

const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL ||
    (typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:4000/api'
        : 'https://final-pro-backend-production.up.railway.app/api');

const API = axios.create({
    baseURL: apiBaseUrl,
});

export const getProducts = async (filters = {}) => {
    const response = await API.get('/products', {
        params: filters,
    });

    return response.data;
};


export const createProduct = async (productData) => {
    const response = await API.post('/products', productData);
    return response.data;
};

export const updateProduct = async (id, productData) => {
    const response = await API.put(`/products/${id}`, productData);
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await API.delete(`/products/${id}`);
    return response.data;
};

export const getProductById = async (id) => {
    const response = await API.get(`/products/${id}`);
    return response.data;
};