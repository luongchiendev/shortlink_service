import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';
const FRONTEND_URL = 'http://localhost:5173';

export const shortenUrl = async (originalUrl) => {
    const response = await axios.post(`${API_BASE_URL}/shorten`, { originalUrl });
    return response.data;
};

export const listAllUrls = async (page = 1, limit = 10) => {
    const response = await axios.get(`${API_BASE_URL}/urls`, { params: { page, limit } });
    return response.data;
};

export const deleteUrl = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/urls/${id}`);
    return response.data;
};

export const getUrlInfo = async (code) => {
    const response = await axios.get(`${API_BASE_URL}/urls/${code}`);
    return response.data;
};

export const getShortLink = async (shortCode) => {
    // Pointing to frontend redirect page instead of backend
    const response = await axios.get(`${API_BASE_URL}/urls/info/${shortCode}`);
    return response.data;
};
