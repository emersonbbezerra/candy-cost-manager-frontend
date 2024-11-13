import { Box, Typography } from '@mui/material';
import React from 'react';

interface Component {
  componentId: string;
  componentName: string;
  quantity: number;
}

interface ProductCardProps {
  name: string;
  description: string;
  category: string;
  productionCost: number;
  yield: number;
  unitOfMeasure: string;
  salePrice?: number;
  components: Component[];
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  description,
  category,
  productionCost,
  yield: productYield,
  unitOfMeasure,
  salePrice,
  components,
}) => {
  return (
    <Box
      sx={{
        border: '1px solid #ccc',
        borderRadius: 2,
        padding: 2,
        backgroundColor: '#f9f9f9',
        boxShadow: 2,
        height: '300px', // Altura padrão para todos os cards
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Aplicando cor de fundo ao nome do produto */}
      <Typography
        variant="h6"
        sx={{
          backgroundColor: '#282c34', // Cor da AppBar
          color: 'white', // Cor do texto
          padding: '8px', // Adicionando um pouco de padding
          borderRadius: '4px', // Bordas arredondadas
        }}
      >
        {name}
      </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        {description}
      </Typography>
      <Typography variant="body2" sx={{ color: '#555' }}>
        Categoria: {category}
      </Typography>
      <Typography variant="body2" sx={{ color: '#4caf50' }}>
        Custo de Produção: R$ {productionCost.toFixed(2)}
      </Typography>
      <Typography variant="body2">
        Rendimento: {productYield} {unitOfMeasure}
      </Typography>
      <Typography variant="body2" sx={{ color: '#f44336' }}>
        Preço de Venda: R$ {salePrice?.toFixed(2)}
      </Typography>

      <Typography variant="h6" sx={{ mt: 2, color: '#1976d2' }}>
        Componentes:
      </Typography>
      <Box
        sx={{
          overflowY: 'auto', // Permite rolagem vertical
          maxHeight: '100px', // Altura máxima para a lista de componentes
          border: '1px solid #ccc',
          borderRadius: 1,
          padding: 1,
          backgroundColor: '#fff',
          flexGrow: 1, // Faz com que a lista de componentes ocupe o espaço restante
        }}
      >
        {components.length > 0 ? (
          components.map((component) => (
            <Typography variant="body2" key={component.componentId}>
              {component.componentName} - Quantidade: {component.quantity}
            </Typography>
          ))
        ) : (
          <Typography variant="body2">Nenhum componente disponível.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default ProductCard;
