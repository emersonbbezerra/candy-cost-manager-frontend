import axios, { AxiosInstance } from 'axios';
import { IProduct } from '../interfaces/product/IProduct';

// Definir interface estendida
interface ExtendedAxiosInstance extends AxiosInstance {
  fetchAvailableComponents: () => Promise<IProduct[]>;
  searchProductsByName: (name: string) => Promise<IProduct[]>;
  searchComponentsByName: (name: string) => Promise<any[]>;
}

// Criar instância axios com type assertion
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
}) as ExtendedAxiosInstance;

// Configurar interceptors
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

// Adicionar método customizado
api.fetchAvailableComponents = async (): Promise<IProduct[]> => {
  try {
    const response = await api.get('/components?limit=1000');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar componentes disponíveis:', error);
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
