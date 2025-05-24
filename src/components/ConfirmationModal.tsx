import { Box, Button, Modal, Typography } from '@mui/material';
import React from 'react';
import { IConfirmationModalProps } from '../interfaces/utils/IConfirmationModalProps';

const ConfirmationModal: React.FC<IConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  message,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2">
          {message}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button onClick={onClose} color="secondary" sx={{ mr: 1 }}>
            Cancelar
          </Button>
          <Button onClick={onConfirm} color="primary">
            Confirmar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;
