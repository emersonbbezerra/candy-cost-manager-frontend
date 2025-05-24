import DeleteIcon from '@mui/icons-material/Delete';
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Snackbar,
    TextField,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface ComponentData {
    componentId: string;
    componentName: string;
    quantity: number;
    unitOfMeasure: string | undefined;
}

interface ProductData {
    id: string;
    _id?: string;
    name: string;
    description: string;
    category: string;
    components: ComponentData[];
    yield: number;
    unitOfMeasure: string;
    salePrice: number;
    productionCost?: number;
    productionCostRatio?: number;
}

interface EditProductModalProps {
    open: boolean;
    onClose: () => void;
    product: ProductData;
    onSave: (updatedProduct: ProductData) => void;
}

const emptyComponent: ComponentData = {
    componentId: '',
    componentName: '',
    quantity: 0,
    unitOfMeasure: '',
};

const EditProductModal: React.FC<EditProductModalProps> = ({ open, onClose, product, onSave }) => {
    const [formState, setFormState] = useState<ProductData>({ ...product });
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        setFormState({ ...product });
    }, [product]);

    const handleInputChange = (field: keyof ProductData, value: any) => {
        setFormState((prev) => ({ ...prev, [field]: value }));
    };

    const handleComponentChange = (index: number, field: keyof ComponentData, value: any) => {
        setFormState((prev) => {
            const updatedComponents = prev.components.map((comp, i) =>
                i === index ? { ...comp, [field]: value } : comp
            );
            return { ...prev, components: updatedComponents };
        });
    };

    const handleRemoveComponent = (index: number) => {
        const updated = formState.components.filter((_, i) => i !== index);
        setFormState((prev) => ({ ...prev, components: updated }));
    };

    const handleAddComponent = () => {
        setFormState((prev) => ({
            ...prev,
            components: [...prev.components, { ...emptyComponent }],
        }));
    };

    const handleSubmit = async () => {
        try {
            const productId = formState._id || formState.id;
            if (!productId) {
                setErrorMessage('ID do produto não encontrado.');
                setShowError(true);
                return;
            }
            // <<<< SOLUÇÃO: Normalize antes do PUT!
            const updateBody = { ...formState };
            updateBody.components = updateBody.components.map((c, index) => {
                const originalComponent = product.components[index];
                return {
                    ...c,
                    unitOfMeasure:
                        c.unitOfMeasure && c.unitOfMeasure.trim() !== ''
                            ? c.unitOfMeasure
                            : originalComponent?.unitOfMeasure ?? '',
                };
            });

            if ('_id' in updateBody) delete (updateBody as any)._id;
            if ('id' in updateBody) delete (updateBody as any).id;

            console.log('updateBody enviado:', updateBody); // Verifique aqui!

            const response = await api.put(`/products/${productId}`, updateBody);
            setShowSuccess(true);
            onSave(response.data.product);
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || 'Erro ao atualizar produto.');
            setShowError(true);
        }
    };

    const handleClose = () => {
        setShowError(false);
        setShowSuccess(false);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>Editar Produto</DialogTitle>
            <DialogContent>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            label="Nome"
                            value={formState.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            label="Categoria"
                            value={formState.category}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            label="Rendimento"
                            type="number"
                            value={formState.yield}
                            onChange={(e) => handleInputChange('yield', Number(e.target.value))}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            label="Unidade de Medida"
                            value={formState.unitOfMeasure}
                            onChange={(e) => handleInputChange('unitOfMeasure', e.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            label="Preço de Venda"
                            type="number"
                            value={formState.salePrice}
                            onChange={(e) => handleInputChange('salePrice', Number(e.target.value))}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            Custo Total de Produção: R$ {formState.productionCost?.toFixed(2) ?? '0.00'}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            Taxa de Custo de Produção: R${formState.productionCostRatio?.toFixed(4) ?? '0.0000'}/{formState.unitOfMeasure}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Descrição"
                            value={formState.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            fullWidth
                            multiline
                            minRows={2}
                        />
                    </Grid>
                </Grid>

                <Typography variant="h6" sx={{ mt: 3 }}>Ingredientes do Produto</Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    {formState.components.map((component, idx) => (
                        <React.Fragment key={idx}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Nome do Ingrediente"
                                    value={component.componentName}
                                    onChange={(e) => handleComponentChange(idx, 'componentName', e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    label="Quantidade"
                                    type="number"
                                    value={component.quantity}
                                    onChange={(e) => handleComponentChange(idx, 'quantity', Number(e.target.value))}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <TextField
                                    label="Unidade"
                                    value={component.unitOfMeasure}
                                    onChange={(e) => handleComponentChange(idx, 'unitOfMeasure', e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={1} sx={{ display: 'flex', alignItems: 'center' }}>
                                <IconButton color="error" onClick={() => handleRemoveComponent(idx)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        </React.Fragment>
                    ))}
                </Grid>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleAddComponent}
                    sx={{ mt: 2 }}
                >
                    Adicionar Ingrediente
                </Button>

                <Snackbar open={showSuccess} autoHideDuration={2000} onClose={() => setShowSuccess(false)}>
                    <Alert severity="success">Produto atualizado com sucesso!</Alert>
                </Snackbar>
                <Snackbar open={showError} autoHideDuration={3000} onClose={() => setShowError(false)}>
                    <Alert severity="error">{errorMessage}</Alert>
                </Snackbar>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditProductModal;
