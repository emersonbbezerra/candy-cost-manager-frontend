import { Add as AddIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Pagination,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ComponentCard from '../components/ComponentCard';
import EditComponentModal from '../components/EditComponentModal';
import { IComponentCard } from '../interfaces/component/IComponent';
import { IEditComponentData } from '../interfaces/component/IEditComponentData';
import api from '../services/api';

const ListComponents: React.FC = () => {
  const navigate = useNavigate();
  const [components, setComponents] = useState<IComponentCard[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredPage, setFilteredPage] = useState(1);
  const [filteredTotalPages, setFilteredTotalPages] = useState(1);
  // Removed deleteModalOpen state
  const [componentToDelete, setComponentToDelete] = useState<IComponentCard | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [componentToEdit, setComponentToEdit] = useState<IComponentCard | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  const ITEMS_PER_PAGE = 12;

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCloseConfirmDelete = () => {
    setConfirmDeleteOpen(false);
    setComponentToDelete(null);
  };

  const fetchComponents = useCallback(async () => {
    setSnackbar({ open: false, message: '', severity: 'success' });
    setLoading(true);
    try {
      if (categoryFilter) {
        // Fetch filtered components with independent pagination
        const response = await api.get<{
          components: IComponentCard[];
          pagination: {
            total: number;
            totalPages: number;
            currentPage: number;
          };
        }>('/components', {
          params: {
            page: filteredPage,
            limit: ITEMS_PER_PAGE,
            category: categoryFilter,
          },
        });

        const { components: responseComponents, pagination } = response.data;
        if (responseComponents && Array.isArray(responseComponents)) {
          setComponents(responseComponents);
          setFilteredTotalPages(pagination?.totalPages || 1);
          // Update allCategories only on initial fetch or when categoryFilter is cleared
          if (!categoryFilter) {
            const categories = Array.from(
              new Set(responseComponents.map((comp) => comp.category).filter(Boolean))
            );
            setAllCategories(categories);
          }
        } else {
          setComponents([]);
          setFilteredTotalPages(1);
        }
      } else {
        // Fetch unfiltered components with main pagination
        const response = await api.get<{
          components: IComponentCard[];
          pagination: {
            total: number;
            totalPages: number;
            currentPage: number;
          };
        }>('/components', {
          params: {
            page,
            limit: ITEMS_PER_PAGE,
          },
        });

        const { components: responseComponents, pagination } = response.data;
        if (responseComponents && Array.isArray(responseComponents)) {
          setComponents(responseComponents);
          setTotalPages(pagination?.totalPages || 1);
          // Update allCategories only on initial fetch or when categoryFilter is cleared
          if (!categoryFilter) {
            const categories = Array.from(
              new Set(responseComponents.map((comp) => comp.category).filter(Boolean))
            );
            setAllCategories(categories);
          }
        } else {
          setComponents([]);
          setTotalPages(1);
        }
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao carregar os ingredientes. Por favor, verifique se o servidor está rodando e tente novamente.',
        severity: 'error',
      });
      setComponents([]);
      setTotalPages(1);
      setFilteredTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, filteredPage, categoryFilter]);

  const searchComponents = useCallback(async (name: string) => {
    setSnackbar({ open: false, message: '', severity: 'success' });
    setLoading(true);
    try {
      const results = await api.searchComponentsByName(name);
      // Filter results by category if categoryFilter is set
      const filteredResults = categoryFilter
        ? results.filter((comp) => comp.category === categoryFilter)
        : results;
      setComponents(filteredResults);
      setTotalPages(1);
      setPage(1);
      // Update allCategories only when search term is empty or categoryFilter is cleared
      if (!categoryFilter) {
        const categories = Array.from(
          new Set(results.map((comp) => comp.category).filter(Boolean))
        );
        setAllCategories(categories);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao buscar ingredientes. Por favor, tente novamente.',
        severity: 'error',
      });
      setComponents([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [categoryFilter]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      fetchComponents();
    } else {
      searchComponents(searchTerm);
    }
  }, [fetchComponents, searchComponents, searchTerm]);

  const handleSaveEdit = async (data: IEditComponentData) => {
    if (componentToEdit) {
      try {
        await api.put(`/components/${componentToEdit.id}`, data);
        setSnackbar({
          open: true,
          message: 'Ingrediente atualizado com sucesso!',
          severity: 'success',
        });
        if (searchTerm.trim() === '') {
          fetchComponents();
        } else {
          searchComponents(searchTerm);
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message:
            'Erro ao atualizar o ingrediente. Por favor, tente novamente.',
          severity: 'error',
        });
      } finally {
        setEditModalOpen(false);
        setComponentToEdit(null);
      }
    }
  };

  // Modified handleDelete to open snackbar confirmation
  const handleDelete = (id: string) => {
    const component = components.find((comp) => comp.id === id);
    if (component) {
      setComponentToDelete(component);
      setConfirmDeleteOpen(true);
    }
  };

  // Confirm delete handler triggered by snackbar "Sim" button
  const confirmDelete = async () => {
    if (componentToDelete) {
      setConfirmDeleteOpen(false); // Close confirmation snackbar immediately
      try {
        await api.delete(`/components/${componentToDelete.id}`);
        // Force snackbar state update by resetting open to false first
        setSnackbar((prev) => ({ ...prev, open: false }));
        setTimeout(() => {
          setSnackbar({
            open: true,
            message: 'Ingrediente excluído com sucesso!',
            severity: 'success',
          });
        }, 100);
        if (searchTerm.trim() === '') {
          fetchComponents();
        } else {
          searchComponents(searchTerm);
        }
      } catch (error) {
        setSnackbar((prev) => ({ ...prev, open: false }));
        setTimeout(() => {
          setSnackbar({
            open: true,
            message: 'Erro ao deletar o ingrediente. Por favor, tente novamente.',
            severity: 'error',
          });
        }, 100);
      } finally {
        setComponentToDelete(null);
      }
    }
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    if (categoryFilter) {
      setFilteredPage(value);
    } else {
      setPage(value);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Lista de Ingredientes
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, mt: 2, alignItems: 'center' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/components/add')}
          sx={{ height: '56px' }}
        >
          Adicionar Ingrediente
        </Button>
        <TextField
          label="Buscar ingredientes pelo nome"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Digite o nome do ingrediente"
          fullWidth
        />
        <TextField
          select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          slotProps={{
            select: {
              native: true,
            }
          }}
          sx={{ width: 270 }}
        >
          <option value="">Todas as categorias</option>
          {allCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </TextField>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ flexGrow: 1, mb: 4 }}>
            <Grid container spacing={3}>
              {components.map((component) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={component.id}>
                  <ComponentCard
                    id={component.id}
                    name={component.name}
                    manufacturer={component.manufacturer}
                    price={component.price}
                    packageQuantity={component.packageQuantity}
                    unitOfMeasure={component.unitOfMeasure}
                    category={component.category}
                    onEdit={() => {
                      setComponentToEdit(component);
                      setEditModalOpen(true);
                    }}
                    onDelete={handleDelete}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          {components.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={categoryFilter ? filteredTotalPages : totalPages}
                page={categoryFilter ? filteredPage : page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          iconMapping={{
            success: <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="#fff" viewBox="0 0 24 24"><path d="M9 16.2l-3.5-3.5 1.41-1.41L9 13.38l7.09-7.09 1.41 1.41z" /></svg>,
            error: <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="#fff" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" /></svg>,
          }}
          sx={{
            backgroundColor: snackbar.severity === 'success' ? '#4caf50' : snackbar.severity === 'error' ? '#f44336' : undefined,
            color: '#fff',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Snackbar
        open={confirmDeleteOpen}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="warning"
          variant="filled"
          action={
            <>
              <Button color="inherit" size="small" onClick={confirmDelete}>
                Sim
              </Button>
              <Button color="inherit" size="small" onClick={handleCloseConfirmDelete}>
                Não
              </Button>
            </>
          }
          sx={{ width: '100%' }}
        >
          Tem certeza que deseja excluir este ingrediente?
        </Alert>
      </Snackbar>

      {componentToEdit && (
        <EditComponentModal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setComponentToEdit(null);
          }}
          onSave={handleSaveEdit}
          component={componentToEdit}
        />
      )}
    </Container>
  );
};

export default ListComponents;
