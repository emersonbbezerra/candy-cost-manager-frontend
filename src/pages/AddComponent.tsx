import { Add as AddIcon } from '@mui/icons-material';
import {
  Alert,
  Button,
  Container,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AddComponent: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [severity, setSeverity] = useState<'success' | 'error'>('success');
  const [severityVariant, setSeverityVariant] = useState<'filled'>('filled');

  const [componentData, setComponentData] = useState({
    name: '',
    manufacturer: '',
    price: 0,
    packageQuantity: 0,
    unitOfMeasure: '',
    category: '',
  });

  const handleComponentChange = (
    field: keyof typeof componentData,
    value: string | number
  ) => {
    setComponentData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
      await api.post('/components', componentData);
      setSnackbarMessage('Componente criado com sucesso!');
      setSeverity('success');
      setSeverityVariant('filled');
      setOpenSnackbar(true);

      setComponentData({
        name: '',
        manufacturer: '',
        price: 0,
        packageQuantity: 0,
        unitOfMeasure: '',
        category: '',
      });

      setTimeout(() => {
        navigate('/components');
      }, 2000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (
        error.message.includes(
          'Component with this name and manufacturer already exists'
        )
      ) {
        setSnackbarMessage('Componente com esse nome e fabricante já existe!');
        setSeverity('error');
        setOpenSnackbar(true);
      } else {
        setSnackbarMessage('Erro ao criar componente!');
        setSeverity('error');
        setOpenSnackbar(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Adicionar Novo Componente
        </Typography>
        <Divider sx={{ mb: 4 }} />
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Nome"
                value={componentData.name}
                onChange={(e) => handleComponentChange('name', e.target.value)}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Fabricante"
                value={componentData.manufacturer}
                onChange={(e) =>
                  handleComponentChange('manufacturer', e.target.value)
                }
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <NumericFormat
                value={componentData.price}
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
                customInput={TextField}
                fullWidth
                label="Preço"
                type="text"
                onValueChange={(values) => {
                  const { floatValue } = values;
                  setComponentData({
                    ...componentData,
                    price: floatValue || 0,
                  });
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Quantidade do Pacote"
                type="number"
                value={componentData.packageQuantity}
                onChange={(e) =>
                  handleComponentChange(
                    'packageQuantity',
                    Number(e.target.value)
                  )
                }
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Unidade de Medida</InputLabel>
                <Select
                  value={componentData.unitOfMeasure}
                  label="Unidade de Medida"
                  onChange={(e) =>
                    handleComponentChange('unitOfMeasure', e.target.value)
                  }
                  required
                >
                  {unitOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Categoria</InputLabel>
                <Select
                  value={componentData.category}
                  label="Categoria"
                  onChange={(e) =>
                    handleComponentChange('category', e.target.value)
                  }
                  required
                >
                  <MenuItem value="acucares">Açúcares</MenuItem>
                  <MenuItem value="chocolates">Chocolates</MenuItem>
                  <MenuItem value="corantes">Corantes</MenuItem>
                  <MenuItem value="diversos">Diversos</MenuItem>
                  <MenuItem value="embalagens">Embalagens</MenuItem>
                  <MenuItem value="farinhas">Farinhas</MenuItem>
                  <MenuItem value="lacteos">Lácteos</MenuItem>
                  <MenuItem value="pereciveis">Perecíveis</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                disabled={loading}
              >
                {loading ? 'Adicionando...' : 'Adicionar Componente'}
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
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddComponent;
