import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Card, CardContent, IconButton, Typography } from '@mui/material';
import React from 'react';

interface ComponentCardProps {
  id: string;
  name: string;
  manufacturer: string;
  price: number;
  packageQuantity: number;
  unitOfMeasure: string;
  category: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  id,
  name,
  manufacturer,
  price,
  packageQuantity,
  unitOfMeasure,
  category,
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
        <Typography color="text.secondary">
          Fabricante: {manufacturer}
        </Typography>
        <Typography color="text.secondary">
          Preço: R$ {price.toFixed(2)}
        </Typography>
        <Typography color="text.secondary">
          Quantidade por pacote: {packageQuantity} {unitOfMeasure}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          Categoria: {category}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <IconButton
            color="primary"
            onClick={() => {
              console.log('ComponentCard - Props recebidas:', {
                id,
                name,
                manufacturer,
                price,
                packageQuantity,
                unitOfMeasure,
                category,
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

export default ComponentCard;
