import { Product } from '../types/Product';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

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
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Confirm Deletion</h2>
                    <button className="btn-close" onClick={onCancel} disabled={isDeleting}>
                        <FiX />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="warning-icon">
                        <FiAlertTriangle />
                    </div>
                    <p className="confirmation-message">
                        Are you sure you want to delete <strong>{product.name}</strong>?
                    </p>
                    <p className="confirmation-warning">This action cannot be undone.</p>
                </div>

                <div className="modal-footer">
                    <button
                        className="btn btn-secondary"
                        onClick={onCancel}
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete Product'}
                    </button>
                </div>
            </div>
        </div>
    );
}
