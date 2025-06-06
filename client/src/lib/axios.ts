import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

const options = {
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

const API = axios.create(options);

const APIRefresh = axios.create(options);

APIRefresh.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/sign-in';
    }
  },
);

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          // No refresh token available, redirect to login
          window.location.href = '/sign-in';
          return Promise.reject(error);
        }

        // Call refresh token endpoint
        const response = await APIRefresh.post('/auth/refresh-token', {
          refreshToken,
        });

        const { accessToken } = response.data.data;

        // Update access token
        localStorage.setItem('accessToken', accessToken);

        // Update auth header
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Retry original request
        return API(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/sign-in';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default API;
