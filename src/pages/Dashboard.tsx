import { Box, Button, Container, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
    ShoppingBag,
    Inventory,
    Calculate,
    PieChart,
    Add as AddIcon,
    List as ListIcon,
    Assessment
} from '@mui/icons-material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
    const navigate = useNavigate();
    const { loading, isAuthenticated, user } = useAuth();

    console.log('Dashboard - Renderizando');
    console.log('Dashboard - Loading:', loading);
    console.log('Dashboard - IsAuthenticated:', isAuthenticated);
    console.log('Dashboard - User:', user);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            console.log('Redirecionando para login');
            navigate('/login');
        }
    }, [loading, isAuthenticated, navigate, user]);

    if (loading) {
        console.log('Dashboard - Renderizando carregando');
        return <div>Carregando...</div>;
    }

    if (!isAuthenticated) {
        console.log('Dashboard - Não autenticado, retornando null');
        return null;
    }

    console.log('Dashboard - Renderizando conteúdo');
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
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>
                            Total de Produtos
                        </Typography>
                        <Typography component="p" variant="h4">
                            42
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
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>
                            Total de Ingredientes
                        </Typography>
                        <Typography component="p" variant="h4">
                            156
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
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>
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
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>
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
                        >
                            Lista de Produtos
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<Assessment />}
                            fullWidth
                        >
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
                        >
                            Adicionar Novo Ingrediente
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<ListIcon />}
                            fullWidth
                            sx={{ mb: 1 }}
                        >
                            Lista de Ingredientes
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<Calculate />}
                            fullWidth
                        >
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
                        <Button
                            variant="outlined"
                            startIcon={<Assessment />}
                            fullWidth
                        >
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