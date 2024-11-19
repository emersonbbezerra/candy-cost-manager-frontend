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
import Grid from '@mui/material/Grid2';
import { SelectChangeEvent } from '@mui/material/Select';
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
      const { name, value } = e.target as HTMLInputElement;
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
          width: { xs: '90%', sm: 800 }, // Responsividade
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 3,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto', // Permitir rolagem se necessário
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Editar Produto
        </Typography>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="name"
                label="Nome do Produto"
                value={formData?.name || ''}
                onChange={handleChange}
                required
                fullWidth
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small">
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
                  <MenuItem value="Cake Box">Cake Box</MenuItem>
                  <MenuItem value="Caseirinhos">Caseirinhos</MenuItem>
                  <MenuItem value="Chocotones">Chocotones</MenuItem>
                  <MenuItem value="Coberturas">Coberturas</MenuItem>
                  <MenuItem value="Diversos">Diversos</MenuItem>
                  <MenuItem value="Massas">Massas</MenuItem>
                  <MenuItem value="Ovos Trufados">Ovos Trufados</MenuItem>
                  <MenuItem value="Recheios">Recheios</MenuItem>
                  <MenuItem value="Sobremesas">Sobremesas</MenuItem>
                  <MenuItem value="Tortas Tradicionais">
                    Tortas Tradicionais
                  </MenuItem>
                  <MenuItem value="Tortas Especiais">Tortas Especiais</MenuItem>
                  <MenuItem value="TortasNoffee">TortasNoffee</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                name="description"
                label="Descrição"
                value={formData?.description || ''}
                onChange={handleChange}
                fullWidth
                size="small"
                multiline
                rows={2}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                name="yield"
                label="Rendimento"
                type="number"
                value={formData?.yield || ''}
                onChange={handleChange}
                fullWidth
                required
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                name="salePrice"
                label="Preço de Venda"
                type="number"
                value={formData?.salePrice || ''}
                onChange={handleChange}
                fullWidth
                required
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
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

          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Componentes do Produto
            </Typography>
            <Box
              sx={{
                maxHeight: '200px',
                overflowY: 'auto',
                overflowX: 'hidden',
                pr: 1,
              }}
            >
              {formData?.components.map((component, index) => (
                <Grid container spacing={2} key={index} sx={{ mb: 1 }}>
                  <Grid size={{ xs: 12, sm: 8 }}>
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
                      size="small"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 3 }}>
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
                      size="small"
                    />
                  </Grid>
                  <Grid
                    size={{ xs: 12, sm: 1 }}
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <MuiIconButton
                      size="small"
                      onClick={() => handleRemoveComponent(index)}
                    >
                      <DeleteIcon />
                    </MuiIconButton>
                  </Grid>
                </Grid>
              ))}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddComponent}
              size="small"
            >
              Adicionar Componente
            </Button>
            <Box>
              <Button
                variant="outlined"
                color="error"
                onClick={onClose}
                sx={{ mr: 2 }}
                size="small"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="small"
              >
                Salvar
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default EditProductModal;
