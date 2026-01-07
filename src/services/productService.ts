import axios from 'axios';
import { Product, CreateProductDto, UpdateProductDto } from '../types/Product';

const API_BASE_URL = '/api/products';

export const productService = {
    /**
     * Get all products
     */
    async getAllProducts(): Promise<Product[]> {
        try {
            const response = await axios.get<Product[]>(API_BASE_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw new Error('Failed to fetch products. Please try again.');
        }
    },

    /**
     * Get a product by ID
     */
    async getProductById(id: number): Promise<Product> {
        try {
            const response = await axios.get<Product>(`${API_BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching product ${id}:`, error);
            throw new Error('Failed to fetch product. Please try again.');
        }
    },

    /**
     * Create a new product
     */
    async createProduct(product: CreateProductDto): Promise<Product> {
        try {
            const response = await axios.post<Product>(API_BASE_URL, product);
            return response.data;
        } catch (error) {
            console.error('Error creating product:', error);
            throw new Error('Failed to create product. Please check your input and try again.');
        }
    },

    /**
     * Update an existing product
     */
    async updateProduct(id: number, product: UpdateProductDto): Promise<Product> {
        try {
            const response = await axios.put<Product>(`${API_BASE_URL}/${id}`, product);
            return response.data;
        } catch (error) {
            console.error(`Error updating product ${id}:`, error);
            throw new Error('Failed to update product. Please check your input and try again.');
        }
    },

    /**
     * Delete a product
     */
    async deleteProduct(id: number): Promise<void> {
        try {
            await axios.delete(`${API_BASE_URL}/${id}`);
        } catch (error) {
            console.error(`Error deleting product ${id}:`, error);
            throw new Error('Failed to delete product. Please try again.');
        }
    },
};
