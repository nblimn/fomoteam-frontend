import { useState, useEffect } from 'react';
import { Product, CreateProductDto, UpdateProductDto } from './types/Product';
import { productService } from './services/productService';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import DeleteConfirmation from './components/DeleteConfirmation';
import { FiPlus } from 'react-icons/fi';
import './App.css';

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

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

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

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <div>
              <h1>Product Management</h1>
              <p className="header-subtitle">Manage your product inventory</p>
            </div>
          </div>
          <button className="btn btn-primary btn-icon" onClick={() => setShowForm(true)}>
            <FiPlus />
            <span>Add Product</span>
          </button>
        </div>
      </header>

      <main className="app-main">
        <ProductList
          products={products}
          loading={loading}
          error={error}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onRetry={fetchProducts}
        />
      </main>

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

      {toast && (
        <div className={`toast ${toast.type}`}>
          <span className="toast-message">{toast.message}</span>
        </div>
      )}
    </div>
  );
}

export default App;
