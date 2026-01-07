import { Product } from '../types/Product';
import { Grid, CircularProgress, Alert, Box, Typography } from '@mui/material';
import { Inventory as InventoryIcon } from '@mui/icons-material';
import ProductCard from './ProductCard';

interface ProductListProps {
    products: Product[];
    loading: boolean;
    error: string | null;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
    onRetry: () => void;
}

export default function ProductList({
    products,
    loading,
    error,
    onEdit,
    onDelete,
    onRetry,
}: ProductListProps) {
    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 400,
                    gap: 2,
                }}
            >
                <CircularProgress size={48} />
                <Typography color="text.secondary">Loading products...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 400,
                    gap: 2,
                    textAlign: 'center',
                }}
            >
                <Alert
                    severity="error"
                    sx={{ maxWidth: 500 }}
                    action={
                        <button onClick={onRetry} style={{ cursor: 'pointer' }}>
                            Try Again
                        </button>
                    }
                >
                    <Typography variant="h6" gutterBottom>
                        Oops! Something went wrong
                    </Typography>
                    <Typography variant="body2">{error}</Typography>
                </Alert>
            </Box>
        );
    }

    if (products.length === 0) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 400,
                    gap: 2,
                    textAlign: 'center',
                }}
            >
                <InventoryIcon sx={{ fontSize: 80, color: 'text.disabled', opacity: 0.5 }} />
                <Typography variant="h5">No products yet</Typography>
                <Typography color="text.secondary">
                    Get started by adding your first product!
                </Typography>
            </Box>
        );
    }

    return (
        <Grid container spacing={3}>
            {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <ProductCard
                        product={product}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                </Grid>
            ))}
        </Grid>
    );
}
