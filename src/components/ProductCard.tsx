import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { IProduct } from '../interfaces/IProduct';

const ProductCard: React.FC<
  IProduct & { onEdit: () => void; onDelete: () => void }
> = ({
  name,
  description,
  category,
  productionCost,
  yield: productYield,
  unitOfMeasure,
  salePrice,
  components,
  onEdit,
  onDelete,
}) => {
  return (
    <Box
      sx={{
        border: '1px solid #ccc',
        borderRadius: 2,
        padding: 2,
        backgroundColor: '#f9f9f9',
        boxShadow: 2,
        height: '350px', // Define a altura fixa do card
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          backgroundColor: '#282c34',
          color: 'white',
          padding: '8px',
          borderRadius: '4px',
        }}
      >
        {name}
      </Typography>

      <Grid container spacing={2} sx={{ mt: 1, flexGrow: 1 }}>
        {/* Coluna da esquerda com os dados do produto */}
        <Grid item xs={8}>
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
        </Grid>

        {/* Coluna da direita com os ícones de editar e excluir */}
        <Grid
          item
          xs={4}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        >
          <Tooltip title="Editar">
            <IconButton
              onClick={onEdit}
              sx={{ color: '#4caf50', fontSize: '1.5rem' }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton
              onClick={onDelete}
              sx={{ color: '#f44336', fontSize: '1.5rem' }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>

      {/* Seção para exibir componentes */}
      <Typography variant="h6" sx={{ mt: 2, color: '#1976d2' }}>
        Componentes:
      </Typography>
      <Box
        sx={{
          overflowY: 'auto',
          maxHeight: '100px', // Mantemos a altura máxima para a lista de componentes
          border: '1px solid #ccc',
          borderRadius: 1,
          padding: 1,
          backgroundColor: '#fff',
          mt: 1, // Margem superior para separar dos dados do produto
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
