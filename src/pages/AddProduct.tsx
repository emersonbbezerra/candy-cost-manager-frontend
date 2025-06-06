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
import { IComponent, IComponentCard } from '../interfaces/component/IComponent';
import api from '../services/api';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
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
    components: [] as IComponent[],
  });

  const [components, setComponents] = useState<IComponent[]>([
    { componentId: '', quantity: 0 },
  ]);

  const [componentOptions, setComponentOptions] = useState<IComponentCard[]>(
    []
  );

  const searchComponentsOrProducts = async (searchTerm: string) => {
    try {
      // Primeiro, busque ingredientes
      const componentResponse = await api.get(
        `/components/search?name=${searchTerm}`
      );

      // Se encontrar ingredientes, atualize a lista de opções
      if (componentResponse.data.length > 0) {
        setComponentOptions(componentResponse.data);
      } else {
        // Se não encontrar, busque produtos
        const productResponse = await api.get(
          `/products/search?name=${searchTerm}`
        );
        setComponentOptions(productResponse.data); // Atualiza a lista com produtos
      }
    } catch (error) {
      console.error('Erro ao buscar ingredientes ou produtos:', error);
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
    field: keyof IComponent,
    value: string | number
  ) => {
    const newComponents = [...components];
    newComponents[index] = {
      ...newComponents[index],
      [field]: value,
    };
    setComponents(newComponents);
  };

  const renderComponentFields = (component: IComponent, index: number) => (
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
            searchComponentsOrProducts(newInputValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Nome do Ingrediente" required />
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
    { value: 'G', label: 'g' },
    { value: 'Ml', label: 'mL' },
    { value: 'Und', label: 'Und' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // const currentDate = new Date();
      await api.post('/products', {
        // createdAt: currentDate.toISOString(),
        // updatedAt: currentDate.toISOString(),
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

  const handleCancelClick = () => {
    setConfirmCancelOpen(true);
  };

  const handleConfirmCancel = () => {
    setConfirmCancelOpen(false);
    navigate('/');
  };

  const handleCloseCancelSnackbar = () => {
    setConfirmCancelOpen(false);
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
                label="Este produto também é um ingrediente"
              />
            </Grid>
            {/* Seção de Ingredientes */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Ingredientes
              </Typography>
              {components.map((component, index) =>
                renderComponentFields(component, index)
              )}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddComponent}
              >
                Adicionar Ingrediente
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 4 }}>
            <Grid>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? 'Adicionando...' : 'Salvar'}
              </Button>
            </Grid>
            <Grid>
              <Button
                variant="outlined"
                color="secondary"
                disabled={loading}
                onClick={handleCancelClick}
                sx={{ ml: 2 }}
              >
                Cancelar
              </Button>
            </Grid>
          </Grid>
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

      <Snackbar
        open={confirmCancelOpen}
        onClose={handleCloseCancelSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="warning"
          variant="filled"
          action={
            <>
              <Button color="inherit" size="small" onClick={handleConfirmCancel}>
                Sim
              </Button>
              <Button color="inherit" size="small" onClick={handleCloseCancelSnackbar}>
                Não
              </Button>
            </>
          }
          sx={{ width: '100%' }}
        >
          Deseja mesmo cancelar o cadastro?
        </Alert>
      </Snackbar>
    </Container>
  );
};
export default AddProduct;
