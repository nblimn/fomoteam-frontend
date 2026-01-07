import { Product } from '../types/Product';
import { FiEdit2, FiTrash2, FiPackage } from 'react-icons/fi';
import { format } from 'date-fns';

interface ProductCardProps {
    product: Product;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
}

export default function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
    const getStockStatus = (stock: number) => {
        if (stock === 0) return { label: 'Out of Stock', className: 'stock-out' };
        if (stock < 10) return { label: 'Low Stock', className: 'stock-low' };
        return { label: 'In Stock', className: 'stock-in' };
    };

    const stockStatus = getStockStatus(product.stock);

    return (
        <div className="product-card">
            <div className="product-card-header">
                <div className="product-icon">
                    <FiPackage />
                </div>
                <span className={`stock-badge ${stockStatus.className}`}>
                    {stockStatus.label}
                </span>
            </div>

            <div className="product-card-body">
                <h3 className="product-name">{product.name}</h3>
                {product.description && (
                    <p className="product-description">{product.description}</p>
                )}

                <div className="product-details">
                    <div className="detail-item">
                        <span className="detail-label">Price</span>
                        <span className="detail-value price">${product.price.toFixed(2)}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Stock</span>
                        <span className="detail-value">{product.stock} units</span>
                    </div>
                </div>

                <div className="product-meta">
                    <div className="meta-item">
                        <span className="meta-label">Created:</span>
                        <span className="meta-value">
                            {format(new Date(product.createdAt), 'MMM dd, yyyy')}
                        </span>
                    </div>
                    {product.updatedAt && (
                        <div className="meta-item">
                            <span className="meta-label">Updated:</span>
                            <span className="meta-value">
                                {format(new Date(product.updatedAt), 'MMM dd, yyyy')}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="product-card-footer">
                <button
                    className="btn btn-secondary btn-icon"
                    onClick={() => onEdit(product)}
                    title="Edit product"
                >
                    <FiEdit2 />
                    <span>Edit</span>
                </button>
                <button
                    className="btn btn-danger btn-icon"
                    onClick={() => onDelete(product)}
                    title="Delete product"
                >
                    <FiTrash2 />
                    <span>Delete</span>
                </button>
            </div>
        </div>
    );
}
