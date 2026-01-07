export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
    createdAt: string;
    updatedAt?: string;
}

export interface CreateProductDto {
    name: string;
    description?: string;
    price: number;
    stock: number;
}

export interface UpdateProductDto {
    name: string;
    description?: string;
    price: number;
    stock: number;
}
