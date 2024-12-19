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
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { IEditProductModalProps } from '../interfaces/product/IEditProductModalProps';
import { IProduct, IProductComponent } from '../interfaces/product/IProduct';

const categoryOptions = [
  'Cake Box',
  'Caseirinhos',
  'Chocotones',
  'Coberturas',
  'Diversos',
  'Massas',
  'Ovos Trufados',
  'Recheios',
  'Sobremesas',
  'Tortas Tradicionais',
  'Tortas Especiais',
  'TortasNoffee',
];

const unitOptions = [
  { value: 'G', label: 'g' },
  { value: 'ML', label: 'mL' },
  { value: 'UND', label: 'und' },
];

interface ExtendedProduct extends IProduct {
  unitOfMeasure: string;
}

const EditProductModal: React.FC<IEditProductModalProps> = ({
  open,
  onClose,
  product,
  onSave,
}) => {
  const [formData, setFormData] = useState<ExtendedProduct | null>(null);
  const [productComponents, setProductComponents] = useState<
    IProductComponent[]
  >([]);

  useEffect(() => {
    if (product) {
      setFormData(product as ExtendedProduct);
      setProductComponents(product.components);
    }
  }, [product]);

  const handleBasicInfoChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [name]: ['yield', 'salePrice'].includes(name)
              ? Number(value)
              : value,
          }
        : null
    );
  };

  const handleComponentAdd = () => {
    setProductComponents([
      ...productComponents,
      { componentId: '', componentName: '', quantity: 0 },
    ]);
  };

  const handleComponentRemove = (index: number) => {
    setProductComponents((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleComponentNameChange = (index: number, newName: string) => {
    const updatedComponents = [...productComponents];
    updatedComponents[index] = {
      ...updatedComponents[index],
      componentName: newName,
    };
    setProductComponents(updatedComponents);
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const updatedComponents = [...productComponents];
    updatedComponents[index] = {
      ...updatedComponents[index],
      quantity,
    };
    setProductComponents(updatedComponents);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      const updatedProduct: IProduct = {
        ...formData,
        components: productComponents,
      };
      onSave(updatedProduct);
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
          width: { xs: '90%', sm: 800 },
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

        <Typography variant="h6" sx={{ mb: 2 }}>
          Editar Produto
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 8 }}>
              <TextField
                name="name"
                label="Nome do Produto"
                value={formData?.name || ''}
                onChange={handleBasicInfoChange}
                fullWidth
                size="small"
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth size="small" required>
                <InputLabel>Categoria</InputLabel>
                <Select
                  name="category"
                  label="Categoria"
                  value={formData?.category || ''}
                  onChange={handleBasicInfoChange}
                >
                  {categoryOptions.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <TextField
                name="description"
                label="Descrição"
                value={formData?.description || ''}
                onChange={handleBasicInfoChange}
                fullWidth
                multiline
                rows={3}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    name="yield"
                    label="Rendimento"
                    type="number"
                    value={formData?.yield || ''}
                    onChange={handleBasicInfoChange}
                    size="small"
                    required
                    sx={{ flex: 1 }}
                  />
                  <FormControl size="small" required sx={{ flex: 1 }}>
                    <InputLabel>Unidade</InputLabel>
                    <Select
                      name="unitOfMeasure"
                      label="Unidade"
                      value={formData?.unitOfMeasure?.toUpperCase() || 'G'}
                      onChange={handleBasicInfoChange}
                    >
                      {unitOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <NumericFormat
                  name="salePrice"
                  label="Preço de Venda"
                  value={formData?.salePrice || '0'}
                  onChange={handleBasicInfoChange}
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  customInput={TextField}
                  fullWidth
                  size="small"
                  required
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData?.isComponent || false}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData((prev) =>
                        prev ? { ...prev, isComponent: e.target.checked } : null
                      )
                    }
                  />
                }
                label="Este produto também é um componente"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Componentes do Produto
              </Typography>

              {productComponents.map((comp, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    label="Componente"
                    value={comp.componentName}
                    onChange={(e) =>
                      handleComponentNameChange(index, e.target.value)
                    }
                    size="small"
                    sx={{ flex: 2 }}
                    autoComplete="off"
                  />
                  <TextField
                    type="number"
                    label="Quantidade"
                    value={comp.quantity}
                    onChange={(e) =>
                      handleQuantityChange(index, Number(e.target.value))
                    }
                    size="small"
                  />
                  <IconButton
                    onClick={() => handleComponentRemove(index)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}

              <Button
                variant="outlined"
                onClick={handleComponentAdd}
                sx={{ mt: 1 }}
              >
                Adicionar Componente
              </Button>
            </Grid>
          </Grid>

          <Box
            sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}
          >
            <Button variant="outlined" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained">
              Salvar
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default EditProductModal;
