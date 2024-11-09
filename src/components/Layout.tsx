import { ExitToApp as LogoutIcon } from '@mui/icons-material';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import React, { ReactNode } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };
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
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
            >
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
          minHeight: isAuthenticated ? 'calc(100vh - 64px)' : '100vh',
          backgroundColor: '#f4f4f4',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
