import { Product } from '../types/Product';
import ProductCard from './ProductCard';
import { FiAlertCircle, FiPackage } from 'react-icons/fi';

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
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <FiAlertCircle className="error-icon" />
                <h3>Oops! Something went wrong</h3>
                <p>{error}</p>
                <button className="btn btn-primary" onClick={onRetry}>
                    Try Again
                </button>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="empty-state">
                <FiPackage className="empty-icon" />
                <h3>No products yet</h3>
                <p>Get started by adding your first product!</p>
            </div>
        );
    }

    return (
        <div className="product-grid">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
