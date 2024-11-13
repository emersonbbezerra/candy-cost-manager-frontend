import { Box, Button, CircularProgress, Fade, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

interface Component {
  componentId: string;
  componentName: string;
  quantity: number;
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
  isComponent: boolean;
  components: Component[];
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para paginação
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [productsPerPage] = useState<number>(6); // Número de produtos por página

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

  // Calcular os produtos a serem exibidos
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Calcular o número total de páginas
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
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
      <Typography variant="h4" gutterBottom>
        Lista de Produtos
      </Typography>
      <Grid container spacing={2}>
        {currentProducts.map((product, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
            <Fade in={true} timeout={(index + 1) * 200}>
              <div>
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
              </div>
            </Fade>
          </Grid>
        ))}
      </Grid>
      {/* Navegação da página */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Anterior
        </Button>
        <Typography>
          Página {currentPage} de {totalPages}
        </Typography>
        <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Próximo
        </Button>
      </Box>
    </Box>
  );
};

export default ProductList;
