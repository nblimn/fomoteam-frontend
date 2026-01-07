import { Product } from '../types/Product';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Typography,
    Button,
    Chip,
    Box,
    Avatar,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Inventory as InventoryIcon } from '@mui/icons-material';
import { format } from 'date-fns';

interface ProductCardProps {
    product: Product;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
}

export default function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
    const getStockStatus = (stock: number) => {
        if (stock === 0) return { label: 'Out of Stock', color: 'error' as const };
        if (stock < 10) return { label: 'Low Stock', color: 'warning' as const };
        return { label: 'In Stock', color: 'success' as const };
    };

    const stockStatus = getStockStatus(product.stock);

    return (
        <Card>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <InventoryIcon />
                    </Avatar>
                }
                action={
                    <Chip
                        label={stockStatus.label}
                        color={stockStatus.color}
                        size="small"
                    />
                }
                title={
                    <Typography variant="h6" component="div">
                        {product.name}
                    </Typography>
                }
            />

            <CardContent>
                {product.description && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {product.description}
                    </Typography>
                )}

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 2,
                        p: 2,
                        bgcolor: 'rgba(99, 102, 241, 0.05)',
                        borderRadius: 1,
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                            PRICE
                        </Typography>
                        <Typography variant="h6" color="primary.main" fontWeight={600}>
                            ${product.price.toFixed(2)}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                            STOCK
                        </Typography>
                        <Typography variant="h6" fontWeight={600}>
                            {product.stock} units
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                        Created: {format(new Date(product.createdAt), 'MMM dd, yyyy')}
                    </Typography>
                    {product.updatedAt && (
                        <Typography variant="caption" color="text.secondary" display="block">
                            Updated: {format(new Date(product.updatedAt), 'MMM dd, yyyy')}
                        </Typography>
                    )}
                </Box>
            </CardContent>

            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => onEdit(product)}
                    fullWidth
                    sx={{ mr: 1 }}
                >
                    Edit
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => onDelete(product)}
                    fullWidth
                >
                    Delete
                </Button>
            </CardActions>
        </Card>
    );
}
