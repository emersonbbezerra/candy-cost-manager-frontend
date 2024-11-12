import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(() => {
    return localStorage.getItem('loginError') || null;
  });
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loginError) {
      setEmailError(true);
      setPasswordError(true);
      setPasswordErrorMessage(loginError);
      const timer = setTimeout(() => {
        localStorage.removeItem('fieldsWithError');
        localStorage.removeItem('loginError');
        setEmailError(false);
        setPasswordError(false);
        setLoginError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [loginError]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('loginError');
      localStorage.removeItem('fieldsWithError');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError(false);
    setEmailErrorMessage('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError(false);
    setPasswordErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    localStorage.removeItem('loginError');
    localStorage.removeItem('fieldsWithError');
    setLoginError(null);
    setEmailError(false);
    setPasswordError(false);
    setLoading(true);

    try {
      await login(email, password);

      navigate('/dashboard');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      let errorMessage = err.response?.data?.message;

      if (err.response?.data?.message.includes('Invalid credentials')) {
        errorMessage = 'Email ou senha inválidos';
        setEmailError(true);
        setPasswordError(true);
        setEmailErrorMessage('');
        setPasswordErrorMessage(errorMessage);
        localStorage.setItem('fieldsWithError', 'true');
      } else {
        errorMessage =
          'Desculpe, ocorreu um erro inesperado. Tente novamente em alguns minutos.';
      }

      localStorage.setItem('loginError', errorMessage);
      setLoginError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#1976D2',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Box sx={{ mb: 2 }}>
          <img
            src="/images/logo.png"
            alt="Logo"
            style={{ height: 120, marginBottom: 8 }}
          />
        </Box>
        <Container
          component="main"
          maxWidth="sm"
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'white',
              padding: 3,
              borderRadius: 2,
              boxShadow: 3,
              width: '100%',
              margin: '0 auto',
            }}
          >
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={handleEmailChange}
                error={emailError}
                helperText={emailError ? emailErrorMessage : ''}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Senha"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={handlePasswordChange}
                error={passwordError}
                helperText={passwordError ? passwordErrorMessage : ''}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                Não tem uma conta?{' '}
                <Link
                  component={RouterLink}
                  to="/register"
                  sx={{ cursor: 'pointer', textDecoration: 'none' }}
                >
                  Cadastre-se aqui
                </Link>
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Login;
