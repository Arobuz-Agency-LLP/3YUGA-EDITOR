// API Configuration
// Supports both development and production environments

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  REMOVE_BACKGROUND: `${API_BASE_URL}/remove-bg`,
};

export default API_BASE_URL;

