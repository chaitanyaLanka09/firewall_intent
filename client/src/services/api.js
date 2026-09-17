import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  getDashboard: () => axios.get(`${API_URL}/dashboard`),
  getApps: () => axios.get(`${API_URL}/apps`),
  getApp: (id) => axios.get(`${API_URL}/apps/${id}`),
  getEvents: (appId) => axios.get(`${API_URL}/events${appId ? `?appId=${appId}` : ''}`),
  analyzeRequest: (data) => axios.post(`${API_URL}/analysis/analyze`, data),
  runSafeDemo: () => axios.post(`${API_URL}/demo/safe`),
  runSuspiciousDemo: () => axios.post(`${API_URL}/demo/suspicious`),
};
