import { Product } from '../types/Product';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    IconButton,
} from '@mui/material';
import { Warning as WarningIcon, Close as CloseIcon } from '@mui/icons-material';

interface DeleteConfirmationProps {
    product: Product;
    onConfirm: () => void;
    onCancel: () => void;
    isDeleting: boolean;
}

export default function DeleteConfirmation({
    product,
    onConfirm,
    onCancel,
    isDeleting,
}: DeleteConfirmationProps) {
    return (
        <Dialog
            open={true}
            onClose={onCancel}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Confirm Deletion
                <IconButton onClick={onCancel} disabled={isDeleting} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        py: 2,
                    }}
                >
                    <Box
                        sx={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            bgcolor: 'error.light',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2,
                            opacity: 0.2,
                        }}
                    >
                        <WarningIcon sx={{ fontSize: 32, color: 'error.main' }} />
                    </Box>

                    <Typography variant="body1" gutterBottom>
                        Are you sure you want to delete <strong>{product.name}</strong>?
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        This action cannot be undone.
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onCancel} disabled={isDeleting}>
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color="error"
                    disabled={isDeleting}
                >
                    {isDeleting ? 'Deleting...' : 'Delete Product'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
