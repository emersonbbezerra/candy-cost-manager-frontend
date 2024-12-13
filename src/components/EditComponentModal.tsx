import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { IEditComponentData } from '../interfaces/component/IEditComponentData';
import { IEditComponentModalProps } from '../interfaces/component/IEditComponentModalProps';

const EditComponentModal: React.FC<IEditComponentModalProps> = ({
  open,
  onClose,
  onSave,
  component,
}) => {
  const [formData, setFormData] = useState<IEditComponentData>(() => ({
    name: component.name,
    manufacturer: component.manufacturer,
    price: component.price,
    packageQuantity: component.packageQuantity,
    unitOfMeasure: component.unitOfMeasure,
    category: component.category,
  }));

  useEffect(() => {
    console.log('Modal recebeu novo componente:', component);
    setFormData({
      name: component.name,
      manufacturer: component.manufacturer,
      price: component.price,
      packageQuantity: component.packageQuantity,
      unitOfMeasure: component.unitOfMeasure,
      category: component.category,
    });
    console.log('FormData atualizado:', formData);
  }, [component]);

  const handleChange = (
    field: keyof IEditComponentData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const unitOptions = [
    { value: 'G', label: 'g' },
    { value: 'Ml', label: 'mL' },
    { value: 'Und', label: 'Und' },
  ];

  const categoryOptions = [
    'Açúcares',
    'Chocolates',
    'Corantes',
    'Diversos',
    'Embalagens',
    'Farinhas',
    'Lácteos',
    'Perecíveis',
  ];

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="edit-component-modal">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Editar Componente
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nome"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Fabricante"
            value={formData.manufacturer}
            onChange={(e) => handleChange('manufacturer', e.target.value)}
            margin="normal"
            required
          />
          <NumericFormat
            value={formData.price}
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            decimalScale={2}
            fixedDecimalScale
            allowNegative={false}
            customInput={TextField}
            fullWidth
            label="Preço"
            margin="normal"
            onValueChange={(values) => {
              const { floatValue } = values;
              handleChange('price', floatValue || 0);
            }}
            required
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <NumericFormat
              sx={{ width: '50%' }}
              label="Quantidade do Pacote"
              value={formData.packageQuantity}
              decimalSeparator=","
              decimalScale={2}
              allowNegative={false}
              isAllowed={(values) => {
                const { floatValue } = values;
                return floatValue ? floatValue > 0 : false;
              }}
              customInput={TextField}
              onValueChange={(values) => {
                const { floatValue } = values;
                handleChange('packageQuantity', floatValue || 1);
              }}
              margin="normal"
              required
            />
            <FormControl sx={{ width: '50%' }} margin="normal">
              <InputLabel>Unidade de Medida</InputLabel>
              <Select
                value={formData.unitOfMeasure}
                label="Unidade de Medida"
                onChange={(e) => handleChange('unitOfMeasure', e.target.value)}
              >
                {unitOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <FormControl fullWidth margin="normal">
            <InputLabel>Categoria</InputLabel>
            <Select
              value={formData.category}
              label="Categoria"
              onChange={(e) => handleChange('category', e.target.value)}
            >
              {categoryOptions.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box
            sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}
          >
            <Button onClick={onClose} color="inherit">
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
export default EditComponentModal;
