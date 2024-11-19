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
  const [components, setComponents] = useState<IComponentCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setopenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedComponent, setSelectedComponent] =
    useState<IComponentCard | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [severity, setSeverity] = useState<'success' | 'error'>('success');
  const [severityVariant, setSeverityVariant] = useState<'filled'>('filled');

  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const response = await api.get('/components');
        setComponents(response.data.components);
      } catch (err) {
        setError('Erro ao carregar os componentes');
      } finally {
        setLoading(false);
      }
    };
    fetchComponents();
  }, []);

  const handleEditClick = (component: IComponentCard) => {
    setSelectedComponent(component);
    setOpenEditModal(true);
  };

  const handleDelete = (component: IComponentCard) => {
    setSelectedComponent(component);
    setopenModal(true);
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
      } finally {
        setopenModal(false);
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

  const indexOfLastComponent = page * itemsPerPage;
  const indexOfFirstComponent = indexOfLastComponent - itemsPerPage;
  const currentComponents = components.slice(
    indexOfFirstComponent,
    indexOfLastComponent
  );

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Lista de Componentes
      </Typography>
      <Grid container spacing={2}>
        {currentComponents.map((component) => (
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
        count={Math.ceil(components.length / itemsPerPage)}
        page={page}
        onChange={(event, value) => setPage(value)}
        color="primary"
        sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
      />

      <ConfirmDeleteModal
        open={openModal}
        onClose={() => setopenModal(false)}
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
