import axios from 'axios';

const api = axios.create({
    baseURL: 'http://10.60.0.50:3333',
});

export default api;