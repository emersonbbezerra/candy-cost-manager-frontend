import React, { ReactNode, useEffect } from 'react';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { ExitToApp as LogoutIcon } from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
    children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout, isAuthenticated } = useAuth();

    // Log de depuração
    useEffect(() => {
        console.log('Layout - Renderizando');
        console.log('Layout - Localização atual:', location.pathname);
        console.log('Layout - Usuário autenticado:', isAuthenticated);
        console.log('Layout - Dados do usuário:', user);
    }, [location, isAuthenticated, user]);

    const handleLogout = async () => {
        try {
            console.log('Layout - Realizando logout');
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    // Não renderize o AppBar na página de login
    if (location.pathname === '/login') {
        return <Outlet />;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {isAuthenticated && (
                <AppBar position="static">
                    <Toolbar>
                        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                            <img
                                src="/path/to/your/logo.png"
                                alt="Logo"
                                style={{ height: 40, marginRight: 16, cursor: 'pointer' }}
                                onClick={() => navigate('/')}
                            />
                        </Box>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Bem-vindo, {user?.name || user?.email || 'Usuário'}
                        </Typography>
                        <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
                            Sair
                        </Button>
                    </Toolbar>
                </AppBar>
            )}

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    // Adicione estilos para garantir que o conteúdo seja visível
                    minHeight: isAuthenticated ? 'calc(100vh - 64px)' : '100vh', // Ajusta altura baseado na autenticação
                    backgroundColor: '#f4f4f4' // Cor de fundo para visualização
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout;