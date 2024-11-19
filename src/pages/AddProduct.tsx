import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import {
  Alert,
  Autocomplete,
  Button,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Component {
  componentId: string;
  quantity: number;
}

interface ComponentSearch {
  id: string;
  name: string;
  unitOfMeasure: string;
}

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [severity, setSeverity] = useState<'success' | 'error'>('success');
  const [severityVariant, setSeverityVariant] = useState<'filled'>('filled');
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    category: '',
    yield: 0,
    unitOfMeasure: '',
    salePrice: 0,
    isComponent: false,
    components: [] as Component[],
  });

  const [components, setComponents] = useState<Component[]>([
    { componentId: '', quantity: 0 },
  ]);

  const [componentOptions, setComponentOptions] = useState<ComponentSearch[]>(
    []
  );

  const searchComponents = async (searchTerm: string) => {
    try {
      const response = await api.get(`/components/search?name=${searchTerm}`);
      setComponentOptions(response.data);
    } catch (error) {
      console.error('Erro ao buscar componentes:', error);
    }
  };

  const handleAddComponent = () => {
    setComponents([...components, { componentId: '', quantity: 0 }]);
  };

  const handleRemoveComponent = (index: number) => {
    const newComponents = components.filter((_, i) => i !== index);
    setComponents(newComponents);
  };

  const handleComponentChange = (
    index: number,
    field: keyof Component,
    value: string | number
  ) => {
    const newComponents = [...components];
    newComponents[index] = {
      ...newComponents[index],
      [field]: value,
    };
    setComponents(newComponents);
  };

  const renderComponentFields = (component: Component, index: number) => (
    <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Autocomplete
          fullWidth
          options={componentOptions}
          getOptionLabel={(option) => option.name}
          onChange={(_, newValue) => {
            if (newValue) {
              handleComponentChange(index, 'componentId', newValue.id);
            }
          }}
          onInputChange={(_, newInputValue) => {
            searchComponents(newInputValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Nome do Componente" required />
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          label="Quantidade"
          type="number"
          value={component.quantity}
          onChange={(e) =>
            handleComponentChange(index, 'quantity', Number(e.target.value))
          }
          required
        />
      </Grid>
      <Grid size={{ xs: 12, md: 2 }}>
        <IconButton onClick={() => handleRemoveComponent(index)} color="error">
          <RemoveIcon />
        </IconButton>
      </Grid>
    </Grid>
  );

  const unitOptions = [
    { value: 'Gramas', label: 'Gramas' },
    { value: 'Quilogramas', label: 'Quilogramas' },
    { value: 'Mililitros', label: 'Mililitros' },
    { value: 'Litros', label: 'Litros' },
    { value: 'Unidades', label: 'Unidades' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await await api.post('/products', {
        ...productData,
        components: components,
      });
      setSnackbarMessage('Produto criado com sucesso!');
      setSeverity('success');
      setSeverityVariant('filled');
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate('/products');
      }, 2000);
    } catch (error) {
      console.error('Erro:', error);
      setSnackbarMessage('Erro ao criar produto');
      setSeverity('error');
      setSeverityVariant('filled');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Adicionar Novo Produto
        </Typography>
        <Divider sx={{ mb: 4 }} />
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Informações Básicas */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Nome do Produto"
                value={productData.name}
                onChange={(e) =>
                  setProductData({ ...productData, name: e.target.value })
                }
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Categoria</InputLabel>
                <Select
                  value={productData.category}
                  label="Categoria"
                  onChange={(e) =>
                    setProductData({ ...productData, category: e.target.value })
                  }
                  required
                >
                  <MenuItem value="cakebox">Cake Box</MenuItem>
                  <MenuItem value="caseirinhos">Caseirinhos</MenuItem>
                  <MenuItem value="chocotones">Chocotones</MenuItem>
                  <MenuItem value="coberturas">Coberturas</MenuItem>
                  <MenuItem value="diversos">Diversos</MenuItem>
                  <MenuItem value="massas">Massas</MenuItem>
                  <MenuItem value="ovos">Ovos Trufados</MenuItem>
                  <MenuItem value="recheios">Recheios</MenuItem>
                  <MenuItem value="sobremesas">Sobremesas</MenuItem>
                  <MenuItem value="tortas-tradicionais">
                    Tortas Tradicionais
                  </MenuItem>
                  <MenuItem value="tortas-especiais">Tortas Especiais</MenuItem>
                  <MenuItem value="tortasnoffee">TortasNoffee</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Descrição"
                multiline
                rows={3}
                value={productData.description}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    description: e.target.value,
                  })
                }
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Rendimento"
                type="number"
                value={productData.yield}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value >= 0) {
                    setProductData({
                      ...productData,
                      yield: value,
                    });
                  }
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Unidade de Medida</InputLabel>
                <Select
                  value={productData.unitOfMeasure}
                  label="Unidade de Medida"
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      unitOfMeasure: e.target.value,
                    })
                  }
                >
                  {unitOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <NumericFormat
                value={productData.salePrice}
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
                customInput={TextField}
                fullWidth
                label="Preço de Venda"
                type="text"
                onValueChange={(values) => {
                  const { floatValue } = values;
                  setProductData({
                    ...productData,
                    salePrice: floatValue || 0,
                  });
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={productData.isComponent}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
                        isComponent: e.target.checked,
                      })
                    }
                  />
                }
                label="Este produto também é um componente"
              />
            </Grid>
            {/* Seção de Componentes */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Componentes
              </Typography>
              {components.map((component, index) =>
                renderComponentFields(component, index)
              )}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddComponent}
              >
                Adicionar Componente
              </Button>
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 4 }}
            disabled={loading}
          >
            {loading ? 'Adicionando...' : 'Adicionar Produto'}
          </Button>
        </form>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={severity}
          variant={severityVariant}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddProduct;
