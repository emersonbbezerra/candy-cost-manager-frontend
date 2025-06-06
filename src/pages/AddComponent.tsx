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
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
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
    { value: 'G', label: 'g' },
    { value: 'Ml', label: 'mL' },
    { value: 'Und', label: 'Und' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/components', componentData);
      setSnackbarMessage('Ingrediente criado com sucesso!');
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
        setSnackbarMessage('Ingrediente com esse nome e fabricante já existe!');
        setSeverity('error');
        setSeverityVariant('filled');
        setOpenSnackbar(true);
      } else {
        setSnackbarMessage('Erro ao criar ingrediente!');
        setSeverity('error');
        setSeverityVariant('filled');
        setOpenSnackbar(true);
      }
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
          Adicionar Novo Ingrediente
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
            <Grid size={{ xs: 12 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                disabled={loading}
              >
                {loading ? 'Adicionando...' : 'Salvar'}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                sx={{ ml: 2 }}
                disabled={loading}
                onClick={handleCancelClick}
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
        >
          Deseja mesmo cancelar o cadastro?
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddComponent;
