import {
  Alert,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(() => {
    return localStorage.getItem('loginError') || null;
  });
  const [fieldsWithError, setFieldsWithError] = useState(() => {
    return localStorage.getItem('fieldsWithError') === 'true';
  });
  const { login } = useAuth();
  const navigate = useNavigate();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    localStorage.removeItem('loginError');
    localStorage.removeItem('fieldsWithError');
    setLoginError(null);
    setFieldsWithError(false);

    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      let errorMessage = err.response?.data?.message;

      if (err.response?.data?.message.includes('Invalid credentials')) {
        errorMessage = 'Email ou senha inválidos';
        setFieldsWithError(true);
        localStorage.setItem('fieldsWithError', 'true');
      } else {
        errorMessage =
          'Desculpe, ocorreu um erro ao fazer login. Tente novamente em alguns minutos.';
      }

      localStorage.setItem('loginError', errorMessage);
      setLoginError(errorMessage);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        {loginError && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {loginError}
          </Alert>
        )}
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
            onChange={(e) => setEmail(e.target.value)}
            error={fieldsWithError}
            helperText={fieldsWithError ? ' ' : ''}
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
            onChange={(e) => setPassword(e.target.value)}
            error={fieldsWithError}
            helperText={fieldsWithError ? ' ' : ''}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Entrar
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
export default Login;
