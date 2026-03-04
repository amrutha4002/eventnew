import axios from 'axios';

// Create standard axios instance
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Depending on deployment, might be process.env.VITE_API_URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the JWT token to every request
api.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const parsedUserInfo = JSON.parse(userInfo);
            if (parsedUserInfo && parsedUserInfo.token) {
                config.headers.Authorization = `Bearer ${parsedUserInfo.token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
