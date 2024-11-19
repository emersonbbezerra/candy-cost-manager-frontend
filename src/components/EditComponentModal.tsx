import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useEffect, useState } from 'react';
import { IComponentCard } from '../interfaces/IComponent';

interface EditComponentModalProps {
  open: boolean;
  onClose: () => void;
  component: IComponentCard | null;
  onSave: (updatedComponent: IComponentCard) => void;
}

const EditComponentModal: React.FC<EditComponentModalProps> = ({
  open,
  onClose,
  component,
  onSave,
}) => {
  const [formData, setFormData] = useState<IComponentCard | null>(null);

  useEffect(() => {
    if (component) {
      setFormData(component);
    }
  }, [component]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    if (formData) {
      const { name, value } = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]:
          name === 'price' || name === 'packageQuantity'
            ? Number(value)
            : value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !formData.id) {
      return;
    }

    // Validar campos obrigatórios
    if (
      !formData.name ||
      !formData.manufacturer ||
      !formData.price ||
      !formData.packageQuantity ||
      !formData.unitOfMeasure ||
      !formData.category
    ) {
      return;
    }

    // Garantir que price e packageQuantity são números positivos
    const updatedComponent = {
      ...formData,
      price: Number(formData.price),
      packageQuantity: Number(formData.packageQuantity),
    };

    await onSave(updatedComponent);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 600 },
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 3,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" component="h2" gutterBottom>
          Editar Componente
        </Typography>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="name"
                label="Nome do Componente"
                value={formData?.name || ''}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="manufacturer"
                label="Fabricante"
                value={formData?.manufacturer || ''}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="price" // Corrigido: removido espaço extra no nome
                label="Preço"
                type="number"
                value={formData?.price || ''}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="packageQuantity"
                label="Quantidade da Embalagem"
                type="number"
                value={formData?.packageQuantity || ''}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Unidade de Medida</InputLabel>
                <Select
                  name="unitOfMeasure"
                  value={formData?.unitOfMeasure || ''}
                  onChange={(e: SelectChangeEvent<string>) =>
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    handleChange(e as any)
                  }
                  required
                >
                  <MenuItem value="Gramas">Gramas</MenuItem>
                  <MenuItem value="Quilogramas">Quilogramas</MenuItem>
                  <MenuItem value="Mililitros">Mililitros</MenuItem>
                  <MenuItem value="Litros">Litros</MenuItem>
                  <MenuItem value="Unidades">Unidades</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Categoria</InputLabel>
                <Select
                  name="category"
                  value={formData?.category || ''}
                  onChange={(e: SelectChangeEvent<string>) =>
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    handleChange(e as any)
                  }
                  required
                >
                  <MenuItem value="Açúcares">Açúcares</MenuItem>
                  <MenuItem value="Chocolates">Chocolates</MenuItem>
                  <MenuItem value="Corantes">Corantes</MenuItem>
                  <MenuItem value="Diversos">Diversos</MenuItem>
                  <MenuItem value="Embalagens">Embalagens</MenuItem>
                  <MenuItem value="Farinhas">Farinhas</MenuItem>
                  <MenuItem value="Lácteos">Lácteos</MenuItem>
                  <MenuItem value="Perecíveis">Perecíveis</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Atualizar Componente
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default EditComponentModal;
