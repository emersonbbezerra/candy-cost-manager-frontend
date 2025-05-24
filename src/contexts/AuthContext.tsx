import React, { createContext, useContext, useEffect, useState } from 'react';
import { IAuthContextData, IUser } from '../interfaces/utils/IUserAuth';
import api from '../services/api';

const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoredData() {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          api.defaults.headers.common['Authorization'] =
            `Bearer ${storedToken}`;

          const response = await api.get('/users/validate-token');
          const validatedUser = response.data.user;

          setUser(validatedUser);
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          api.defaults.headers.common['Authorization'] = '';
          setUser(null);
        }
      }
      setLoading(false);
    }
    loadStoredData();
  }, []);

  const login = async (email: string, password: string): Promise<IUser> => {
    const response = await api.post('/users/login', { email, password });
    const { token, user: userData } = response.data;

    const userToStore: IUser = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
    };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userToStore));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userToStore);
    return userToStore;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
