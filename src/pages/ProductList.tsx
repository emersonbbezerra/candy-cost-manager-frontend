import { Box, CircularProgress, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

interface Component {
  componentId: string; // ID do componente
  componentName: string; // Nome do componente
  quantity: number; // Quantidade do componente
}

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  productionCost: number;
  yield: number;
  unitOfMeasure: string;
  salePrice?: number;
  isComponent: boolean; // Certifique-se de que esta propriedade está aqui
  components: Component[];
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
      <Typography variant="h4" gutterBottom>
        Lista de Produtos
      </Typography>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
            <ProductCard
              name={product.name}
              description={product.description}
              category={product.category}
              productionCost={product.productionCost}
              yield={product.yield}
              unitOfMeasure={product.unitOfMeasure}
              salePrice={product.salePrice}
              components={product.components.map((component) => ({
                componentId: component.componentId,
                componentName: component.componentName,
                quantity: component.quantity,
              }))}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductList;
