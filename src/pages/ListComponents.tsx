import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Pagination,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useCallback, useEffect, useState } from 'react';
import ComponentCard from '../components/ComponentCard';
import ConfirmationModal from '../components/ConfirmationModal';
import EditComponentModal from '../components/EditComponentModal';
import { IComponentCard } from '../interfaces/component/IComponent';
import { IEditComponentData } from '../interfaces/component/IEditComponentData';
import api from '../services/api';

const ListComponents: React.FC = () => {
  const [components, setComponents] = useState<IComponentCard[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredPage, setFilteredPage] = useState(1);
  const [filteredTotalPages, setFilteredTotalPages] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [componentToDelete, setComponentToDelete] =
    useState<IComponentCard | null>(null);
  const [componentToEdit, setComponentToEdit] = useState<IComponentCard | null>(
    null
  );
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
        message: 'Erro ao carregar os componentes. Por favor, verifique se o servidor está rodando e tente novamente.',
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
        message: 'Erro ao buscar componentes. Por favor, tente novamente.',
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

  useEffect(() => {
  }, [components]);

  const handleSaveEdit = async (data: IEditComponentData) => {
    if (componentToEdit) {
      try {
        await api.put(`/components/${componentToEdit.id}`, data);
        setSnackbar({
          open: true,
          message: 'Componente atualizado com sucesso!',
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
            'Erro ao atualizar o componente. Por favor, tente novamente.',
          severity: 'error',
        });
      } finally {
        setEditModalOpen(false);
        setComponentToEdit(null);
      }
    }
  };

  const handleDelete = (id: string) => {
    const component = components.find((comp) => comp.id === id);
    if (component) {
      setComponentToDelete(component);
      setDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (componentToDelete) {
      try {
        await api.delete(`/components/${componentToDelete.id}`);
        setSnackbar({
          open: true,
          message: 'Componente excluído com sucesso!',
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
          message: 'Erro ao deletar o componente. Por favor, tente novamente.',
          severity: 'error',
        });
      } finally {
        setDeleteModalOpen(false);
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
        Lista de Componentes
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, mt: 2 }}>
        <TextField
          label="Buscar componentes pelo nome"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Digite o nome do componente"
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
          sx={{ width: 250 }}
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

      <ConfirmationModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        message={`Você tem certeza que deseja excluir o componente "${componentToDelete?.name}"?`}
      />

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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};
export default ListComponents;
