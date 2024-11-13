import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
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
        sx={
          {
            /* Estilos do modal */
          }
        }
      >
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6">Editar Produto</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            name="name"
            label="Nome do Produto"
            value={formData?.name || ''}
            onChange={handleChange}
            required
          />
          {/* Adicione outros campos do produto aqui */}
          <Button type="submit">Salvar</Button>
        </form>
      </Box>
    </Modal>
  );
};

export default EditProductModal;
