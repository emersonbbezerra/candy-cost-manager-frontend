import axios from 'axios';
import { IComponent } from '../interfaces/component/IComponent';
import { IProduct } from '../interfaces/product/IProduct';
import { IApiResponse, IExtendedAxiosInstance } from '../interfaces/utils/IUtils';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
}) as IExtendedAxiosInstance;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message || 'Erro na operação';
    console.error('Axios error:', errorMessage);
    return Promise.reject(new Error(errorMessage));
  }
);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

api.fetchAvailableComponents = async (): Promise<IApiResponse<IComponent>> => {
  try {
    const response = await api.get('/components?limit=1000');
    
    return {
      items: response.data.components,
      pagination: response.data.pagination,
    };
  } catch (error) {
    console.error('Erro ao buscar componentes disponíveis:', error);
    throw error;
  }
};

api.fetchAvailableProducts = async (): Promise<IApiResponse<IProduct>> => {
  try {
    const response = await api.get('/products?limit=1000');
    
    return {
      items: response.data.products,
      pagination: response.data.pagination,
    };
  } catch (error) {
    console.error('Erro ao buscar produtos disponíveis:', error);
    throw error;
  }
};

api.searchProductsByName = async (name: string): Promise<IProduct[]> => {
  try {
    const response = await api.get('/products/search', {
      params: { name },
    });
    return response.data.products || response.data;
  } catch (error) {
    console.error('Erro ao buscar produtos por nome:', error);
    throw error;
  }
};

api.searchComponentsByName = async (name: string): Promise<any[]> => {
  try {
    const response = await api.get('/components/search', {
      params: { name },
    });
    return response.data.components || response.data;
  } catch (error) {
    console.error('Erro ao buscar componentes por nome:', error);
    throw error;
  }
};

export default api;
