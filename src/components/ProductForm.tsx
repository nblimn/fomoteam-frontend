import { useState, useEffect } from 'react';
import { Product, CreateProductDto, UpdateProductDto } from '../types/Product';
import { FiX } from 'react-icons/fi';

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
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
                    <button className="btn-close" onClick={onClose}>
                        <FiX />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="product-form">
                    <div className="form-group">
                        <label htmlFor="name">
                            Product Name <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={errors.name ? 'error' : ''}
                            placeholder="Enter product name"
                            maxLength={200}
                        />
                        {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={errors.description ? 'error' : ''}
                            placeholder="Enter product description (optional)"
                            rows={4}
                            maxLength={1000}
                        />
                        {errors.description && (
                            <span className="error-message">{errors.description}</span>
                        )}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="price">
                                Price <span className="required">*</span>
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className={errors.price ? 'error' : ''}
                                placeholder="0.00"
                                step="0.01"
                                min="0.01"
                            />
                            {errors.price && <span className="error-message">{errors.price}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="stock">
                                Stock <span className="required">*</span>
                            </label>
                            <input
                                type="number"
                                id="stock"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                className={errors.stock ? 'error' : ''}
                                placeholder="0"
                                min="0"
                            />
                            {errors.stock && <span className="error-message">{errors.stock}</span>}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
