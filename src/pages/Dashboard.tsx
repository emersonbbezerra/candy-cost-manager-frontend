import {
  Add as AddIcon,
  Assessment,
  Calculate,
  Inventory,
  List as ListIcon,
  PieChart,
  ShoppingBag,
} from '@mui/icons-material';
import { Box, Button, CircularProgress, Container, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { loading, isAuthenticated, user } = useAuth();
  const [totalComponentes, setTotalComponentes] = useState<number | null>(null);
  const [loadingComponentes, setLoadingComponentes] = useState<boolean>(true);
  const [totalProdutos, setTotalProdutos] = useState<number | null>(null);
  const [loadingProdutos, setLoadingProdutos] = useState<boolean>(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [loading, isAuthenticated, navigate, user]);

  useEffect(() => {
    const fetchTotalComponentes = async () => {
      try {
        setLoadingComponentes(true);
        const data = await api.fetchAvailableComponents();
        if (data && data.pagination && typeof data.pagination.total === 'number') {
          setTotalComponentes(data.pagination.total);
        } else {
          setTotalComponentes(null);
        }
      } catch (error) {
        console.error('Erro ao buscar total de componentes:', error);
        setTotalComponentes(null);
      } finally {
        setLoadingComponentes(false);
      }
    };

    fetchTotalComponentes();
  }, []);

  useEffect(() => {
    const fetchTotalProdutos = async () => {
      try {
        setLoadingProdutos(true);
        const data = await api.fetchAvailableProducts();
        if (data && data.pagination && typeof data.pagination.total === 'number') {
          setTotalProdutos(data.pagination.total);
        } else {
          setTotalProdutos(null);
        }
      } catch (error) {
        console.error('Erro ao buscar total de produtos:', error);
        setTotalProdutos(null);
      } finally {
        setLoadingProdutos(false);
      }
    };

    fetchTotalProdutos();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Seção de Cards com Estatísticas */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              Total de Produtos
            </Typography>
            <Typography component="p" variant="h4">
              {loadingProdutos ? <CircularProgress size={24} /> : (totalProdutos !== null ? totalProdutos : '—')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ShoppingBag sx={{ mr: 1 }} />
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              Total de Ingredientes
            </Typography>
            <Typography component="p" variant="h4">
              {loadingComponentes ? <CircularProgress size={24} /> : (totalComponentes !== null ? totalComponentes : '—')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Inventory sx={{ mr: 1 }} />
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              Custo Médio
            </Typography>
            <Typography component="p" variant="h4">
              R$ 235,50
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Calculate sx={{ mr: 1 }} />
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              Margem Média
            </Typography>
            <Typography component="p" variant="h4">
              32%
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PieChart sx={{ mr: 1 }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {/* Seção de Ações Rápidas */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Gerenciar Produtos
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              fullWidth
              sx={{ mb: 1 }}
              onClick={() => navigate('/products/add')}
            >
              Adicionar Novo Produto
            </Button>
            <Button
              variant="outlined"
              startIcon={<ListIcon />}
              fullWidth
              sx={{ mb: 1 }}
              onClick={() => navigate('/products')}
            >
              Lista de Produtos
            </Button>
            <Button variant="outlined" startIcon={<Assessment />} fullWidth>
              Relatório de Produtos
            </Button>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Gerenciar Ingredientes
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              fullWidth
              sx={{ mb: 1 }}
              onClick={() => navigate('/components/add')}
            >
              Adicionar Novo Ingrediente
            </Button>
            <Button
              variant="outlined"
              startIcon={<ListIcon />}
              fullWidth
              sx={{ mb: 1 }}
              onClick={() => navigate('/components')}
            >
              Lista de Ingredientes
            </Button>
            <Button variant="outlined" startIcon={<Calculate />} fullWidth>
              Atualizar Preços
            </Button>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Análises
            </Typography>
            <Button
              variant="contained"
              startIcon={<Calculate />}
              fullWidth
              sx={{ mb: 1 }}
            >
              Cálculo de Custos
            </Button>
            <Button
              variant="outlined"
              startIcon={<PieChart />}
              fullWidth
              sx={{ mb: 1 }}
            >
              Relatório de Margens
            </Button>
            <Button variant="outlined" startIcon={<Assessment />} fullWidth>
              Histórico de Preços
            </Button>
          </Paper>
        </Grid>
      </Grid>
      {/* Seção de Atividades Recentes */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Atividades Recentes
            </Typography>
            {/* Aqui você pode adicionar uma lista de atividades recentes */}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
