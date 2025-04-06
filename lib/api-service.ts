import axios, { AxiosRequestConfig } from 'axios';

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BIBLE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to dynamically set Authorization
apiClient.interceptors.request.use((config) => {
  config.headers['Authorization'] = `Bearer ${process.env.EXPO_PUBLIC_BIBLE_API_KEY}`;
  return config;
});

const apiRequest = async (
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  data?: any,
  config: AxiosRequestConfig = {}
) => {

  const fullUrl = url.startsWith('http') ? url : `${process.env.EXPO_PUBLIC_BIBLE_BASE_URL}/${url.replace(/^\/+/, '')}`;

  try {
    const response = await apiClient({
      method,
      url: fullUrl,
      data,
      ...config,
    });
    return response.data;
  } catch (error: any) {
    console.error(`API error (${method} ${fullUrl}):`, error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const apiService = {
  get: (url: string, config?: AxiosRequestConfig) => apiRequest('GET', url, null, config),
  post: (url: string, data?: any, config?: AxiosRequestConfig) => apiRequest('POST', url, data, config),
  put: (url: string, data?: any, config?: AxiosRequestConfig) => apiRequest('PUT', url, data, config),
  delete: (url: string, config?: AxiosRequestConfig) => apiRequest('DELETE', url, null, config),
};
