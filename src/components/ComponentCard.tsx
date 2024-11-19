import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React from 'react';
import { IComponentCard } from '../interfaces/IComponent'; // Importando a interface

const ComponentCard: React.FC<
  IComponentCard & { onEdit: () => void; onDelete: () => void }
> = ({
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
    <Box
      sx={{
        border: '1px solid #ccc',
        borderRadius: 2,
        padding: 2,
        backgroundColor: '#f9f9f9',
        boxShadow: 2,
        height: '150px', // Define a altura fixa do card
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
        {/* Coluna da esquerda com os dados do componente */}
        <Grid size={{ xs: 8 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Fabricante: {manufacturer}
          </Typography>
          <Typography variant="body2" sx={{ color: '#4caf50' }}>
            Preço: R$ {(price || 0).toFixed(2)}
          </Typography>
          <Typography variant="body2">
            Quantidade: {packageQuantity} {unitOfMeasure}
          </Typography>
          <Typography variant="body2" sx={{ color: '#555' }}>
            Categoria: {category}
          </Typography>
        </Grid>

        {/* Coluna da direita com os ícones de editar e excluir */}
        <Grid
          size={{ xs: 4 }}
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
    </Box>
  );
};

export default ComponentCard;
