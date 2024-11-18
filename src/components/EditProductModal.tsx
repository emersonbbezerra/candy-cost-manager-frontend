import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  IconButton as MuiIconButton,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2'; // Importando Grid2
import { SelectChangeEvent } from '@mui/material/Select'; // Importando SelectChangeEvent
import React, { useEffect, useState } from 'react';
import { IProduct } from '../interfaces/IProduct';

interface EditProductModalProps {
  open: boolean;
  onClose: () => void;
  product: IProduct | null;
  onSave: (updatedProduct: IProduct) => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  open,
  onClose,
  product,
  onSave,
}) => {
  const [formData, setFormData] = useState<IProduct | null>(null);

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    if (formData) {
      const { name, value } = e.target as HTMLInputElement; // Garantindo que o tipo é HTMLInputElement
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({
        ...formData,
        isComponent: e.target.checked,
      });
    }
  };

  const handleComponentChange = (
    index: number,
    field: keyof IProduct['components'][number],
    value: string | number
  ) => {
    if (formData) {
      const updatedComponents = [...formData.components];
      updatedComponents[index] = {
        ...updatedComponents[index],
        [field]: value,
      };
      setFormData({
        ...formData,
        components: updatedComponents,
      });
    }
  };

  const handleAddComponent = () => {
    if (formData) {
      setFormData({
        ...formData,
        components: [
          ...formData.components,
          { componentId: '', componentName: '', quantity: 0 },
        ],
      });
    }
  };

  const handleRemoveComponent = (index: number) => {
    if (formData) {
      const updatedComponents = formData.components.filter(
        (_, i) => i !== index
      );
      setFormData({
        ...formData,
        components: updatedComponents,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" gutterBottom>
          Editar Produto
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                name="name"
                label="Nome do Produto"
                value={formData?.name || ''}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
                slotProps={{
                  input: { style: { height: '40px' } }, // Ajustando a altura
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                name="description"
                label="Descrição"
                value={formData?.description || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
                rows={2}
                slotProps={{
                  input: { style: { height: '40px' } }, // Ajustando a altura
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Categoria</InputLabel>
                <Select
                  name="category"
                  value={formData?.category || ''}
                  onChange={(e: SelectChangeEvent<string>) =>
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    handleChange(e as any)
                  } // Cast para evitar erro de tipo
                  required
                  slotProps={{
                    input: { style: { height: '40px' } }, // Ajustando a altura
                  }}
                >
                  <MenuItem value="doces">Doces</MenuItem>
                  <MenuItem value="salgados">Salgados</MenuItem>
                  <MenuItem value="bebidas">Bebidas</MenuItem>
                  {/* Adicione outras categorias conforme necessário */}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                name="yield"
                label="Rendimento"
                type="number"
                value={formData?.yield || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                slotProps={{
                  input: { style: { height: '40px' } }, // Ajustando a altura
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                name="salePrice"
                label="Preço de Venda"
                type="number"
                value={formData?.salePrice || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                slotProps={{
                  input: { style: { height: '40px' } }, // Ajustando a altura
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData?.isComponent || false}
                    onChange={handleSwitchChange}
                    name="isComponent"
                  />
                }
                label="É um Componente?"
              />
            </Grid>
          </Grid>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Componentes do Produto
          </Typography>
          <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
            {/* Adicionando a barra de rolagem */}
            {formData?.components.map((component, index) => (
              <Grid container spacing={2} key={index}>
                <Grid size={{ xs: 8 }}>
                  <TextField
                    name={`componentName-${index}`}
                    label="Nome do Componente"
                    value={component.componentName}
                    onChange={(e) =>
                      handleComponentChange(
                        index,
                        'componentName',
                        e.target.value
                      )
                    }
                    fullWidth
                    margin="normal"
                    slotProps={{
                      input: { style: { height: '40px' } }, // Ajustando a altura
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 3 }}>
                  <TextField
                    name={`quantity-${index}`}
                    label="Quantidade"
                    type="number"
                    value={component.quantity}
                    onChange={(e) =>
                      handleComponentChange(
                        index,
                        'quantity',
                        Number(e.target.value)
                      )
                    }
                    fullWidth
                    margin="normal"
                    slotProps={{
                      input: { style: { height: '40px' } }, // Ajustando a altura
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 1 }}>
                  <MuiIconButton
                    aria-label="Excluir componente"
                    onClick={() => handleRemoveComponent(index)}
                  >
                    <DeleteIcon />
                  </MuiIconButton>
                </Grid>
              </Grid>
            ))}
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddComponent}
            sx={{ mt: 2 }}
          >
            Adicionar Componente
          </Button>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              color="error"
              onClick={onClose}
              sx={{ mr: 2 }}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Salvar
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default EditProductModal;
