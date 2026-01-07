import { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Product, CreateProductDto, UpdateProductDto } from './types/Product';
import { productService } from './services/productService';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import DeleteConfirmation from './components/DeleteConfirmation';
import { theme } from './theme';

interface Toast {
  message: string;
  type: 'success' | 'error';
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (productDto: CreateProductDto) => {
    try {
      const newProduct = await productService.createProduct(productDto);
      setProducts((prev) => [...prev, newProduct]);
      setShowForm(false);
      showToast('Product created successfully!', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to create product', 'error');
      throw err;
    }
  };

  const handleUpdateProduct = async (productDto: UpdateProductDto) => {
    if (!selectedProduct) return;

    try {
      const updatedProduct = await productService.updateProduct(
        selectedProduct.id,
        productDto
      );
      setProducts((prev) =>
        prev.map((p) => (p.id === selectedProduct.id ? updatedProduct : p))
      );
      setShowForm(false);
      setSelectedProduct(undefined);
      showToast('Product updated successfully!', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to update product', 'error');
      throw err;
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      setIsDeleting(true);
      await productService.deleteProduct(productToDelete.id);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      setProductToDelete(null);
      showToast('Product deleted successfully!', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to delete product', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedProduct(undefined);
  };

  const handleCancelDelete = () => {
    setProductToDelete(null);
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleCloseToast = () => {
    setToast(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: 'rgba(19, 24, 37, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Toolbar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" component="h1" fontWeight={600}>
                Product Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your product inventory
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowForm(true)}
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                },
              }}
            >
              Add Product
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: 4 }}>
          <ProductList
            products={products}
            loading={loading}
            error={error}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onRetry={fetchProducts}
          />
        </Container>

        {showForm && (
          <ProductForm
            product={selectedProduct}
            onSubmit={selectedProduct ? handleUpdateProduct : handleCreateProduct}
            onClose={handleCloseForm}
          />
        )}

        {productToDelete && (
          <DeleteConfirmation
            product={productToDelete}
            onConfirm={handleDeleteProduct}
            onCancel={handleCancelDelete}
            isDeleting={isDeleting}
          />
        )}

        <Snackbar
          open={!!toast}
          autoHideDuration={3000}
          onClose={handleCloseToast}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseToast}
            severity={toast?.type}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {toast?.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;
