import axios from 'axios';

// Create axios instance with backend URL
const API = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;