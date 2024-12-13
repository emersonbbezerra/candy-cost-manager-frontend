import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Pagination,
  Snackbar,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useEffect, useState } from 'react';
import ConfirmationModal from '../components/ConfirmationModal';
import { default as EditProductModal } from '../components/EditProductModal';
import ProductCard from '../components/ProductCard';
import { IProduct } from '../interfaces/product/IProduct';
import api from '../services/api';

const ListProducts: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);
  const [productToEdit, setProductToEdit] = useState<IProduct | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const ITEMS_PER_PAGE = 12;

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchProducts = async () => {
    setError(null);
    setLoading(true);
    try {
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

      console.log('Resposta da API:', response.data);
      const { products: responseProducts, pagination } = response.data;
      if (responseProducts && Array.isArray(responseProducts)) {
        console.log('Produtos recebidos:', responseProducts);
        setProducts(responseProducts);
        setTotalPages(pagination?.totalPages || 1);
      } else {
        console.warn('Invalid response format:', response.data);
        setProducts([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setError(
        'Erro ao carregar os produtos. Por favor, verifique se o servidor está rodando e tente novamente.'
      );
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  useEffect(() => {
    console.log('Estado products atualizado:', products);
  }, [products]);

  const handleSaveEdit = async (data: IProduct) => {
    if (productToEdit) {
      try {
        await api.put(`/products/${productToEdit.id}`, data);
        setSnackbar({
          open: true,
          message: 'Produto atualizado com sucesso!',
          severity: 'success',
        });
        fetchProducts();
      } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        setSnackbar({
          open: true,
          message: 'Erro ao atualizar o produto. Por favor, tente novamente.',
          severity: 'error',
        });
      } finally {
        setEditModalOpen(false);
        setProductToEdit(null);
      }
    }
  };
  const handleDelete = (id: string) => {
    const product = products.find((prod) => prod.id === id);
    if (product) {
      setProductToDelete(product);
      setDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await api.delete(`/products/${productToDelete.id}`);
        setSnackbar({
          open: true,
          message: 'Produto excluído com sucesso!',
          severity: 'success',
        });
        fetchProducts();
      } catch (error) {
        console.error('Erro ao deletar produto:', error);
        setSnackbar({
          open: true,
          message: 'Erro ao deletar o produto. Por favor, tente novamente.',
          severity: 'error',
        });
      } finally {
        setDeleteModalOpen(false);
        setProductToDelete(null);
      }
    }
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Lista de Produtos
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ flexGrow: 1, mb: 4 }}>
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    category={product.category}
                    yield={product.yield}
                    isComponent={product.isComponent}
                    productionCost={product.productionCost}
                    productionCostRatio={product.productionCostRatio}
                    onEdit={() => {
                      console.log('Produto sendo editado:', product);
                      setProductToEdit(product);
                      setEditModalOpen(true);
                    }}
                    onDelete={handleDelete}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          {products.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
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
        message={`Você tem certeza que deseja excluir o produto "${productToDelete?.name}"?`}
      />

      {productToEdit && (
        <EditProductModal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setProductToEdit(null);
          }}
          onSave={handleSaveEdit}
          product={productToEdit}
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

export default ListProducts;
