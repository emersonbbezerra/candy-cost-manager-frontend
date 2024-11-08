import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextData {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login(email: string, password: string): Promise<User>;
  logout(): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoredData() {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          api.defaults.headers.common['Authorization'] =
            `Bearer ${storedToken}`;
          const parsedUser = JSON.parse(storedUser);
          setUser((prevUser) => {
            return JSON.stringify(prevUser) !== JSON.stringify(parsedUser)
              ? parsedUser
              : prevUser;
          });
          setLoading(false);
        } catch (error) {
          console.error('Erro ao carregar usuário:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    loadStoredData();
  }, []);

  async function login(email: string, password: string): Promise<User> {
    try {
      setLoading(true);
      const response = await api.post('/users/login', {
        email,
        password,
      });
      const { token, user: userData } = response.data;
      if (!token) {
        throw new Error('Token ou usuário inválido');
      }
      const userToStore: User = {
        id: userData.id || '',
        name: userData.name || '',
        email: userData.email || '',
      };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userToStore));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userToStore);
      setLoading(false);
      return userToStore;
    } catch (error) {
      console.error('Erro no login:', error);
      setLoading(false);
      throw error;
    }
  }

  async function logout() {
    try {
      setLoading(true);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
