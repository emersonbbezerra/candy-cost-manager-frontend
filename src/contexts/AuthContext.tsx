import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface User {
    id: string;
    name: string;
    email: string;
}

// Modifique a interface para permitir o retorno de um usuário
interface AuthContextData {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    login(email: string, password: string): Promise<User>; // Mudança aqui
    logout(): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('AuthProvider - Initial Render');
        async function loadStoredData() {
            console.log('Loading stored data...');
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            console.log('Stored Token:', !!storedToken);
            console.log('Stored User:', storedUser);

            if (storedToken && storedUser) {
                try {
                    // Definir o token nos headers antes de definir o usuário
                    api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

                    const parsedUser = JSON.parse(storedUser);
                    console.log('Parsed User:', parsedUser);

                    // Usar setState com função de atualização para garantir atualização
                    setUser(prevUser => {
                        // Só atualizar se for diferente
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

    async function login(email: string, password: string): Promise<User> { // Adicione o tipo de retorno
        try {
            setLoading(true);
            const response = await api.post('/users/login', {
                email,
                password
            });

            console.log('Login Response:', response.data);

            const { token, user: userData } = response.data;

            if (!token) {
                throw new Error('Token ou usuário inválido');
            }

            const userToStore: User = { // Use a interface User
                id: userData.id || '',
                name: userData.name || '',
                email: userData.email || ''
            };

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userToStore));

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setUser(userToStore);
            setLoading(false);

            return userToStore; // Retorne o usuário
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
                logout
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