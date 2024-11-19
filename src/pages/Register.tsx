import {
  Alert,
  Box,
  Button,
  Container,
  Slide,
  SlideProps,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [severity, setSeverity] = useState<'success' | 'error'>('success');
  const [severityVariant, setSeverityVariant] = useState<'filled'>('filled');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

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
    setLoading(true);

    setEmailError(false);
    setPasswordError(false);

    try {
      await api.post('/users', {
        name,
        email,
        password,
      });

      setSnackbarMessage('Usuário cadastrado com sucesso!');
      setSeverity('success');
      setSeverityVariant('filled');
      setOpenSnackbar(true);

      setTimeout(() => {
        navigate('/login');
      }, 3000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      let errorMessage =
        'Desculpe, ocorreu um erro inesperado. Tente novamente em alguns minutos.';
      if (err.response?.data) {
        if (err.response.status === 400 && err.response.data.details) {
          const errorDetail = err.response.data.details.find(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (error: any) =>
              error.path &&
              (error.path.includes('password') ||
                error.path.includes('email')) &&
              error.message
          );
          if (errorDetail) {
            errorMessage = errorDetail.message;
            if (errorDetail.path.includes('email')) {
              setEmailError(true);
              setEmailErrorMessage(errorDetail.message);
            }
            if (errorDetail.path.includes('password')) {
              setPasswordError(true);
              setPasswordErrorMessage(errorDetail.message);
            }
          }
        } else if (err.response.status === 409 && err.response.data.message) {
          if (err.response.data.message.includes('User already exists')) {
            errorMessage = 'Já existe um usuário com este email.';
            setSnackbarMessage(errorMessage);
            setSeverity('error');
            setSeverityVariant('filled');
            setOpenSnackbar(true);
          } else {
            errorMessage = err.response.data.message;
          }
        }
      }
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
              Cadastro de Usuário
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Nome Completo"
                name="name"
                autoComplete="name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
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
                autoComplete="new-password"
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
                disabled={loading}
              >
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </Button>
            </Box>
          </Box>
        </Container>

        <Snackbar
          open={openSnackbar}
          onClose={() => {
            setOpenSnackbar(false);
            setEmailError(false);
            setPasswordError(false);
          }}
          TransitionComponent={SlideTransition}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          autoHideDuration={4000}
        >
          <Alert
            onClose={() => {
              setOpenSnackbar(false);
              setEmailError(false);
              setPasswordError(false);
            }}
            severity={severity}
            variant={severityVariant}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Register;
