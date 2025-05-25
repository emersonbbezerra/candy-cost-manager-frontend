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
import EditProductModal from '../components/EditProductModal';
import ProductCard from '../components/ProductCard';
import { IProduct } from '../interfaces/product/IProduct';
import api from '../services/api';

const getId = (product: IProduct) => product.id as string;

const ListProducts: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredPage, setFilteredPage] = useState(1);
  const [filteredTotalPages, setFilteredTotalPages] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // New state for delete confirmation snackbar
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);

  const ITEMS_PER_PAGE = 12;

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCloseConfirmDelete = () => {
    setConfirmDeleteOpen(false);
    setProductToDelete(null);
  };

  const fetchProducts = useCallback(async () => {
    setSnackbar({ open: false, message: '', severity: 'success' });
    setLoading(true);
    try {
      if (categoryFilter) {
        const response = await api.get<{
          products: IProduct[];
          pagination: {
            total: number;
            totalPages: number;
            currentPage: number;
          };
        }>('/products', {
          params: {
            page: filteredPage,
            limit: ITEMS_PER_PAGE,
            category: categoryFilter,
          },
        });

        const { products: responseProducts, pagination } = response.data;
        if (responseProducts && Array.isArray(responseProducts)) {
          setProducts(responseProducts);
          setFilteredTotalPages(pagination?.totalPages || 1);
          if (!categoryFilter) {
            const categories = Array.from(
              new Set(responseProducts.map((prod) => prod.category).filter(Boolean))
            );
            setAllCategories(categories);
          }
        } else {
          setProducts([]);
          setFilteredTotalPages(1);
        }
      } else {
        const response = await api.get<{
          products: IProduct[];
          pagination: {
            total: number;
            totalPages: number;
            currentPage: number;
          };
        }>('/products', {
          params: {
            page,
            limit: ITEMS_PER_PAGE,
          },
        });

        const { products: responseProducts, pagination } = response.data;
        if (responseProducts && Array.isArray(responseProducts)) {
          setProducts(responseProducts);
          setTotalPages(pagination?.totalPages || 1);
          if (!categoryFilter) {
            const categories = Array.from(
              new Set(responseProducts.map((prod) => prod.category).filter(Boolean))
            );
            setAllCategories(categories);
          }
        } else {
          setProducts([]);
          setTotalPages(1);
        }
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao carregar os produtos. Por favor, verifique se o servidor está rodando e tente novamente.',
        severity: 'error',
      });
      setProducts([]);
      setTotalPages(1);
      setFilteredTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, filteredPage, categoryFilter]);

  const searchProducts = useCallback(async (name: string) => {
    setSnackbar({ open: false, message: '', severity: 'success' });
    setLoading(true);
    try {
      const results = await api.searchProductsByName(name);
      const filteredResults = categoryFilter
        ? results.filter((prod) => prod.category === categoryFilter)
        : results;
      setProducts(filteredResults);
      setTotalPages(1);
      setPage(1);
      if (!categoryFilter) {
        const categories = Array.from(
          new Set(results.map((prod) => prod.category).filter(Boolean))
        );
        setAllCategories(categories);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao buscar produtos. Por favor, tente novamente.',
        severity: 'error',
      });
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [categoryFilter]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      fetchProducts();
    } else {
      searchProducts(searchTerm);
    }
  }, [fetchProducts, searchProducts, searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleEditClick = (product: IProduct) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  // New handler to open snackbar confirmation for delete
  const handleDeleteClick = (product: IProduct) => {
    setProductToDelete(product);
    setConfirmDeleteOpen(true);
  };

  // Confirm delete handler triggered by snackbar "Sim" button
  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      try {
        await api.delete(`/products/${getId(productToDelete)}`);
        setConfirmDeleteOpen(false);
        setProductToDelete(null);
        if (searchTerm.trim() === '') {
          fetchProducts();
        } else {
          searchProducts(searchTerm);
        }
        setSnackbar({
          open: true,
          message: 'Produto excluído com sucesso!',
          severity: 'success',
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Erro ao deletar o produto. Por favor, tente novamente.',
          severity: 'error',
        });
      }
    }
  };

  const handleSave = () => {
    setEditModalOpen(false);
    setSelectedProduct(null);
    if (searchTerm.trim() === '') {
      fetchProducts();
    } else {
      searchProducts(searchTerm);
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
      <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
        Lista de Produtos
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, mt: 2, alignItems: 'center' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/products/add')}
          sx={{ height: '56px' }}
        >
          Adicionar Produto
        </Button>
        <TextField
          label="Buscar produtos pelo nome"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Digite o nome do produto"
          margin="none"
        />
        <TextField
          select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setFilteredPage(1);
          }}
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
              <Button color="inherit" size="small" onClick={handleDeleteConfirm}>
                Sim
              </Button>
              <Button color="inherit" size="small" onClick={handleCloseConfirmDelete}>
                Não
              </Button>
            </>
          }
          sx={{ width: '100%' }}
        >
          Tem certeza que deseja excluir este produto?
        </Alert>
      </Snackbar>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ flexGrow: 1, mb: 4 }}>
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={getId(product)}>
                  <ProductCard
                    id={getId(product)}
                    name={product.name}
                    category={product.category}
                    yield={product.yield}
                    unitOfMeasure={product.unitOfMeasure}
                    productionCost={product.productionCost ?? 0}
                    productionCostRatio={product.productionCostRatio ?? 0}
                    isComponent={false}
                    onEdit={(id: string) => {
                      const prod = products.find((p) => getId(p) === id);
                      if (prod) {
                        handleEditClick(prod);
                      }
                    }}
                    onDelete={(id: string) => {
                      const prod = products.find((p) => getId(p) === id);
                      if (prod) {
                        handleDeleteClick(prod);
                      }
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          {products.length > 0 && (
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

      {/* Modal de edição */}
      {selectedProduct && (
        <EditProductModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          product={{
            ...selectedProduct,
            components: selectedProduct.components.map((c) => ({
              ...c,
              unitOfMeasure: c.unitOfMeasure || '',
            })),
          }}
          onSave={handleSave}
        />
      )}
    </Container>
  );
};

export default ListProducts;
