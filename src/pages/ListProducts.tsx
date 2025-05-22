import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import EditProductModal from '../components/EditProductModal';
import { IProduct } from '../interfaces/product/IProduct';
import api from '../services/api';

const getId = (product: any) => product._id ?? product.id;

const ListProducts: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Erro ao buscar produtos', error);
    }
  };

  const handleEditClick = (product: IProduct) => {
    console.log('Componentes desse produto:', product.components);
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (product: IProduct) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      try {
        await api.delete(`/products/${getId(productToDelete)}`);
        setDeleteDialogOpen(false);
        setProductToDelete(null);
        fetchProducts();
      } catch (error) {
        console.error('Erro ao deletar produto', error);
      }
    }
  };

  const handleSave = () => {
    setEditModalOpen(false);
    setSelectedProduct(null);
    fetchProducts();
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Lista de Produtos</Typography>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={getId(product)}>
            <div style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
              <Typography variant="h6">{product.name}</Typography>
              <Typography variant="body2">Categoria: {product.category}</Typography>
              <Typography variant="body2">Rendimento: {product.yield} {product.unitOfMeasure}</Typography>
              <Typography variant="body2">Custo Total de Produção: R$ {product.productionCost?.toFixed(2) ?? '0.00'}</Typography>
              <Typography variant="body2">Taxa de Custo de Produção: R${product.productionCostRatio?.toFixed(4) ?? '0.0000'}/{product.unitOfMeasure}</Typography>
              <Typography variant="body2">Preço de Venda: R$ {product.salePrice.toFixed(2)}</Typography>
              <div style={{ marginTop: 8 }}>
                <IconButton color="primary" onClick={() => handleEditClick(product)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDeleteClick(product)}>
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
          </Grid>
        ))}
      </Grid>

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

      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmação</DialogTitle>
        <DialogContent>Tem certeza que deseja excluir este produto?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button color="error" onClick={handleDeleteConfirm}>Excluir</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ListProducts;
