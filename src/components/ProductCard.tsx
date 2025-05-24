import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Card, CardContent, IconButton, Typography } from '@mui/material';
import React from 'react';
import { IProductCardProps } from '../interfaces/product/IProductCardProps';

const ProductCard: React.FC<IProductCardProps> = ({
  id,
  name,
  category,
  yield: productYield,
  unitOfMeasure,
  isComponent,
  productionCost,
  productionCostRatio,
  onEdit,
  onDelete,
}) => {
  return (
    <Card
      sx={{
        minWidth: 285,
        maxWidth: 345,
        margin: 2,
        backgroundColor: '#ffffff',
        boxShadow: 3,
        '&:hover': {
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {name}
        </Typography>
        <Typography color="text.secondary">Categoria: {category}</Typography>
        <Typography color="text.secondary">
          Rendimento: {productYield} {unitOfMeasure || ''}
        </Typography>
        <Typography color="text.secondary">
          Custo de Produção: R$ {productionCost.toFixed(2)}
        </Typography>
        <Typography color="text.secondary">
          Custo por Unidade: R$ {productionCostRatio.toFixed(2)}
        </Typography>
        {isComponent && (
          <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Usado como ingrediente
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <IconButton
            color="primary"
            onClick={() => {
              console.log('ProductCard - Props recebidas:', {
                id,
                name,
                category,
                productYield,
                isComponent,
                productionCost,
                productionCostRatio,
              });
              onEdit(id);
            }}
            sx={{ mr: 1 }}
          >
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => onDelete(id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
