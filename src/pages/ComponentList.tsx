import CloseIcon from '@mui/icons-material/Close';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Fade,
  IconButton,
  Modal,
  Pagination,
  Snackbar,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ComponentCard from '../components/ComponentCard';
import EditComponentModal from '../components/EditComponentModal';
import { IComponentCard } from '../interfaces/IComponent';
import api from '../services/api';

const ConfirmDeleteModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  componentName: string;
}> = ({ open, onClose, onConfirm, componentName }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          padding: 4,
          backgroundColor: 'white',
          borderRadius: 2,
          maxWidth: 400,
          margin: 'auto',
          mt: '10%',
        }}
      >
        <Typography variant="h6">
          Deseja realmente excluir o componente &quot;{componentName}&quot;?
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="contained" color="error" onClick={onConfirm}>
            SIM
          </Button>
          <Button variant="outlined" onClick={onClose}>
            NÃO
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const ComponentList: React.FC = () => {
  const navigate = useNavigate();
  const [components, setComponents] = useState<IComponentCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedComponent, setSelectedComponent] =
    useState<IComponentCard | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [severity, setSeverity] = useState<'success' | 'error'>('success');
  const [severityVariant, setSeverityVariant] = useState<'filled'>('filled');

  const [page, setPage] = useState(1);
  const itemsPerPage = 12;
  const [totalPages, setTotalPages] = useState(0); // Para armazenar o total de páginas

  const fetchComponents = async () => {
    setLoading(true); // Inicia o carregamento
    try {
      const response = await api.get('/components', {
        params: {
          page: page, // Passa a página atual
          limit: itemsPerPage, // Passa o limite de componentes por página
        },
      });
      setComponents(response.data.components);
      setTotalPages(response.data.pagination.totalPages); // Armazena o total de páginas
      console.log(
        'Total de componentes carregados:',
        response.data.components.length
      );
    } catch (err) {
      setError('Erro ao carregar os componentes');
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  useEffect(() => {
    fetchComponents();
  }, [page]); // Dependência da página para refazer a requisição

  const handleEditClick = (component: IComponentCard) => {
    setSelectedComponent(component);
    setOpenEditModal(true);
  };

  const handleDelete = (component: IComponentCard) => {
    setSelectedComponent(component);
    setOpenModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedComponent) {
      try {
        await api.delete(`/components/${selectedComponent.id}`);
        setComponents((prevComponents) =>
          prevComponents.filter(
            (component) => component.id !== selectedComponent.id
          )
        );
        setSnackbarMessage('Componente excluído com sucesso!');
        setSeverity('success');
        setSeverityVariant('filled');
      } catch (error) {
        setSnackbarMessage('Erro ao excluir o componente.');
        setSeverity('error');
        setSeverityVariant('filled');
      } finally {
        setOpenModal(false);
        setOpenSnackbar(true);
      }
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Lista de Componentes
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/components/add')} // Navega para a página de adicionar componente
            sx={{ marginRight: 2 }}
          >
            Adicionar Componente
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/')} // Redireciona para o Dashboard
          >
            Ir para Dashboard
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {components.map((component) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={component.id}>
            <Fade in={true} timeout={500}>
              <div>
                <ComponentCard
                  {...component}
                  onEdit={() => handleEditClick(component)}
                  onDelete={() => handleDelete(component)}
                />
              </div>
            </Fade>
          </Grid>
        ))}
      </Grid>

      <Pagination
        count={totalPages} // Atualiza o count com o total de páginas
        page={page}
        onChange={(event, value) => setPage(value)} // Atualiza a página atual
        color="primary"
        sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
      />

      <ConfirmDeleteModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleConfirmDelete}
        componentName={selectedComponent?.name || ''}
      />

      <EditComponentModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        component={selectedComponent}
        onSave={async (updatedComponent: IComponentCard) => {
          try {
            const response = await api.put(
              `/components/${updatedComponent.id}`,
              {
                name: updatedComponent.name,
                manufacturer: updatedComponent.manufacturer,
                price: Number(updatedComponent.price),
                packageQuantity: Number(updatedComponent.packageQuantity),
                unitOfMeasure: updatedComponent.unitOfMeasure,
                category: updatedComponent.category,
              }
            );

            setComponents((prevComponents) =>
              prevComponents.map((comp) =>
                comp.id === updatedComponent.id ? response.data.component : comp
              )
            );
            setSnackbarMessage('Componente atualizado com sucesso!');
            setSeverity('success');
            setSeverityVariant('filled');
            setOpenSnackbar(true);
            setOpenEditModal(false);
          } catch (error) {
            setSnackbarMessage('Erro ao atualizar o componente.');
            setSeverity('error');
            setSeverityVariant('filled');
            setOpenSnackbar(true);
          }
        }}
      />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setOpenSnackbar(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={severity}
          variant={severityVariant}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ComponentList;
