import { useState, useEffect } from 'react';
import { Product, CreateProductDto, UpdateProductDto } from '../types/Product';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    IconButton,
    Grid,
    CircularProgress,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface ProductFormProps {
    product?: Product;
    onSubmit: (product: CreateProductDto | UpdateProductDto) => Promise<void>;
    onClose: () => void;
}

export default function ProductForm({ product, onSubmit, onClose }: ProductFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description || '',
                price: product.price.toString(),
                stock: product.stock.toString(),
            });
        }
    }, [product]);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Product name is required';
        } else if (formData.name.length > 200) {
            newErrors.name = 'Product name cannot exceed 200 characters';
        }

        if (formData.description && formData.description.length > 1000) {
            newErrors.description = 'Description cannot exceed 1000 characters';
        }

        const price = parseFloat(formData.price);
        if (!formData.price || isNaN(price)) {
            newErrors.price = 'Price is required';
        } else if (price <= 0) {
            newErrors.price = 'Price must be greater than 0';
        }

        const stock = parseInt(formData.stock);
        if (formData.stock === '' || isNaN(stock)) {
            newErrors.stock = 'Stock is required';
        } else if (stock < 0) {
            newErrors.stock = 'Stock cannot be negative';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);
        try {
            const productData = {
                name: formData.name.trim(),
                description: formData.description.trim() || undefined,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
            };

            await onSubmit(productData);
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <Dialog
            open={true}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundImage: 'none',
                },
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {product ? 'Edit Product' : 'Add New Product'}
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Product Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                error={!!errors.name}
                                helperText={errors.name}
                                required
                                inputProps={{ maxLength: 200 }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                error={!!errors.description}
                                helperText={errors.description}
                                multiline
                                rows={4}
                                inputProps={{ maxLength: 1000 }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Price"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                error={!!errors.price}
                                helperText={errors.price}
                                required
                                inputProps={{ step: '0.01', min: '0.01' }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Stock"
                                name="stock"
                                type="number"
                                value={formData.stock}
                                onChange={handleChange}
                                error={!!errors.stock}
                                helperText={errors.stock}
                                required
                                inputProps={{ min: '0' }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                    >
                        {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
