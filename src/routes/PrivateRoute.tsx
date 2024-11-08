import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ReactNode } from 'react';

interface PrivateRouteProps {
    children: ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const { isAuthenticated, loading, user } = useAuth();
    const location = useLocation();

    console.group('PrivateRoute - Verificação de Acesso');
    console.log('Loading:', loading);
    console.log('IsAuthenticated:', isAuthenticated);
    console.log('User:', user);
    console.log('Current Location:', location.pathname);
    console.groupEnd();

    if (loading) {
        console.log('PrivateRoute - Renderizando carregando');
        return <div>Carregando...</div>;
    }

    if (!isAuthenticated) {
        console.warn('PrivateRoute - Não autenticado, redirecionando para login');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    console.log('PrivateRoute - Renderizando children');
    return <>{children}</>;
};