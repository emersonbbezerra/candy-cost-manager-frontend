import React, { useState } from 'react';
import {
    Paper,
    Typography,
    Button,
    Container,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Switch,
    Divider,
    IconButton,
    Alert,
    Snackbar
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Ingredient {
    ingredientId: string;
    quantity: number;
}

const AddProduct = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [severity, setSeverity] = useState<'success' | 'error'>('success');

    const [productData, setProductData] = useState({
        name: '',
        description: '',
        category: '',
        yield: 0,
        unitOfMeasure: '',
        salePrice: 0,
        isIngredient: false,
        ingredients: [] as Ingredient[]
    });

    const [ingredients, setIngredients] = useState<Ingredient[]>([
        { ingredientId: '', quantity: 0 }
    ]);

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { ingredientId: '', quantity: 0 }]);
    };

    const handleRemoveIngredient = (index: number) => {
        const newIngredients = ingredients.filter((_, i) => i !== index);
        setIngredients(newIngredients);
    };

    const handleIngredientChange = (index: number, field: keyof Ingredient, value: string | number) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = {
            ...newIngredients[index],
            [field]: value
        };
        setIngredients(newIngredients);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Aqui você fará a chamada API para salvar o produto
            await await api.post('/products', {
                ...productData,
                ingredients: ingredients
            })

            setSnackbarMessage('Produto criado com sucesso!');
            setSeverity('success');
            setOpenSnackbar(true);

            // Redirecionar para a lista de produtos após sucesso
            setTimeout(() => {
                navigate('/products');
            }, 2000);

        } catch (error) {
            console.error('Erro:', error);
            setSnackbarMessage('Erro ao criar produto');
            setSeverity('error');
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
                                onChange={(e) => setProductData({ ...productData, name: e.target.value })}
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
                                    onChange={(e) => setProductData({ ...productData, category: e.target.value })}
                                    required
                                >
                                    <MenuItem value="doces">Doces</MenuItem>
                                    <MenuItem value="bolos">Bolos</MenuItem>
                                    <MenuItem value="chocolates">Chocolates</MenuItem>
                                    <MenuItem value="outros">Outros</MenuItem>
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
                                onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                                sx={{ mb: 2 }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Rendimento"
                                type="number"
                                value={productData.yield}
                                onChange={(e) => setProductData({ ...productData, yield: Number(e.target.value) })}
                                sx={{ mb: 2 }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Unidade de Medida</InputLabel>
                                <Select
                                    value={productData.unitOfMeasure}
                                    label="Unidade de Medida"
                                    onChange={(e) => setProductData({ ...productData, unitOfMeasure: e.target.value })}
                                >
                                    <MenuItem value="g">Gramas (g)</MenuItem>
                                    <MenuItem value="kg">Quilogramas (kg)</MenuItem>
                                    <MenuItem value="ml">Mililitros (ml)</MenuItem>
                                    <MenuItem value="l">Litros (l)</MenuItem>
                                    <MenuItem value="un">Unidades (un)</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Preço de Venda"
                                type="number"
                                value={productData.salePrice}
                                onChange={(e) => setProductData({ ...productData, salePrice: Number(e.target.value) })}
                                InputProps={{
                                    startAdornment: 'R$',
                                }}
                                sx={{ mb: 2 }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={productData.isIngredient}
                                        onChange={(e) => setProductData({ ...productData, isIngredient: e.target.checked })}
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
                            {ingredients.map((ingredient, index) => (
                                <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField
                                            fullWidth
                                            label="ID do Ingrediente"
                                            value={ingredient.ingredientId}
                                            onChange={(e) => handleIngredientChange(index, 'ingredientId', e.target.value)}
                                            required
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            fullWidth
                                            label="Quantidade"
                                            type="number"
                                            value={ingredient.quantity}
                                            onChange={(e) => handleIngredientChange(index, 'quantity', Number(e.target.value))}
                                            required
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 2 }}>
                                        <IconButton onClick={() => handleRemoveIngredient(index)} color="error">
                                            <RemoveIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            ))}
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={handleAddIngredient}
                            >
                                Adicionar Ingrediente
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
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity={severity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AddProduct;