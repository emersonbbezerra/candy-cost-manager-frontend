import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import api from '../services/api'; // Ajuste o caminho conforme necessário

interface Component {
  id: string;
  name: string;
  manufacturer: string;
  price: number;
  packageQuantity: number;
  unitOfMeasure: string;
  category: string;
}

const ComponentList: React.FC = () => {
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const response = await api.get('/components'); // Usando o serviço api
        setComponents(response.data.components);
      } catch (err) {
        setError('Erro ao carregar os componentes');
      } finally {
        setLoading(false);
      }
    };

    fetchComponents();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Lista de Componentes
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Fabricante</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Quantidade do Pacote</TableCell>
              <TableCell>Unidade de Medida</TableCell>
              <TableCell>Categoria</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {components.map((component) => (
              <TableRow key={component.id}>
                <TableCell>{component.id}</TableCell>
                <TableCell>{component.name}</TableCell>
                <TableCell>{component.manufacturer}</TableCell>
                <TableCell>{component.price.toFixed(2)}</TableCell>
                <TableCell>{component.packageQuantity}</TableCell>
                <TableCell>{component.unitOfMeasure}</TableCell>
                <TableCell>{component.category}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ComponentList;
