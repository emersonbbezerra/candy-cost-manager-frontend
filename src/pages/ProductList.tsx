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
import EditProductModal from '../components/EditProductModal'; // Importando o modal de edição
import ProductCard from '../components/ProductCard';
import { IProduct } from '../interfaces/IProduct';
import api from '../services/api';

const ConfirmDeleteModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
}> = ({ open, onClose, onConfirm, productName }) => {
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
          Deseja realmente excluir o produto &quot;{productName}&quot;?
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

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false); // Estado para o modal de edição
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [severity, setSeverity] = useState<'success' | 'error'>('success');

  // Paginação
  const [page, setPage] = useState(1);
  const itemsPerPage = 6; // Número de produtos por página

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data.products);
      } catch (err) {
        setError('Erro ao carregar os produtos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleEditClick = (product: IProduct) => {
    setSelectedProduct(product);
    setOpenEditModal(true); // Abre o modal de edição
  };

  const handleDelete = (product: IProduct) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedProduct) {
      try {
        await api.delete(`/products/${selectedProduct.id}`);
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== selectedProduct.id)
        );
        setSnackbarMessage('Produto excluído com sucesso!');
        setSeverity('success');
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
        setSnackbarMessage('Erro ao excluir o produto.');
        setSeverity('error');
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

  // Cálculo de produtos a serem exibidos na página atual
  const indexOfLastProduct = page * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Lista de Produtos
      </Typography>
      <Grid container spacing={2}>
        {currentProducts.map((product) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
            <Fade in={true} timeout={500}>
              <div>
                <ProductCard
                  {...product}
                  onEdit={() => handleEditClick(product)}
                  onDelete={() => handleDelete(product)}
                />
              </div>
            </Fade>
          </Grid>
        ))}
      </Grid>

      <Pagination
        count={Math.ceil(products.length / itemsPerPage)}
        page={page}
        onChange={(event, value) => setPage(value)}
        color="primary"
        sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
      />

      <ConfirmDeleteModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleConfirmDelete}
        productName={selectedProduct?.name || ''}
      />

      <EditProductModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        product={selectedProduct}
        onSave={(updatedProduct: IProduct) => {
          setProducts((prevProducts) =>
            prevProducts.map((prod) =>
              prod.id === updatedProduct.id ? updatedProduct : prod
            )
          );
          setOpenEditModal(false);
        }}
      />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
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
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductList;
