import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import api from '../services/api'; // Ajuste o caminho conforme necessário

interface Product {
  id: string; // O ID é uma string, conforme a resposta da API
  name: string;
  description: string;
  category: string;
  productionCost: number;
  yield: number;
  unitOfMeasure: string;
  salePrice?: number; // O preço de venda pode não estar presente em todos os produtos
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products'); // Usando o serviço api
        console.log(response.data); // Verifique a estrutura da resposta
        setProducts(response.data.products); // Acesse o array de produtos
      } catch (err) {
        setError('Erro ao carregar os produtos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

  // Verifique se products é um array antes de usar map
  if (!Array.isArray(products)) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6" color="error">
          Dados de produtos inválidos.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Lista de Produtos
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Custo de Produção</TableCell>
              <TableCell>Rendimento</TableCell>
              <TableCell>Unidade de Medida</TableCell>
              <TableCell>Preço de Venda</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.productionCost.toFixed(2)}</TableCell>
                <TableCell>{product.yield}</TableCell>
                <TableCell>{product.unitOfMeasure}</TableCell>
                <TableCell>
                  {product.salePrice ? product.salePrice.toFixed(2) : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProductList;
