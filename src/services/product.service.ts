import {apiClient} from "./apiClient";
import {APP_CONFIG} from "../config/app.config";
import type {ProductCategory, ProductWithRelations, SupplierProductWithRelations} from "../types/api.types";

export const productService = {
    async getProducts(): Promise<ProductWithRelations[]> {
        const response = await apiClient.get<ProductWithRelations[]>(
            APP_CONFIG.endpoints.products.list
        );
        return response.data;
    },
    async getProductByName(name: string): Promise<ProductWithRelations | null> {
        const response = await apiClient.get<ProductWithRelations[]>(
            APP_CONFIG.endpoints.products.list,
            {
                params: {
                    search: name,
                },
            }
        );
        const normalized = name.trim().toLowerCase();
        const match = response.data.find(
            (product) => product.name?.trim().toLowerCase() === normalized
        );
        return match ?? response.data[0] ?? null;
    },
    async getProductById(productId: string): Promise<ProductWithRelations> {
        const response = await apiClient.get<ProductWithRelations>(
            APP_CONFIG.endpoints.products.byId(productId)
        );
        return response.data;
    },
    async getProductCategories(
        productId: string,
        isActive = true
    ): Promise<ProductCategory[]> {
        const response = await apiClient.get<ProductCategory[]>(
            APP_CONFIG.endpoints.products.categoriesByProduct(productId),
            {
                params: {
                    is_active: isActive,
                },
            }
        );
        return response.data;
    },
    async getProductsBySupplier(
        supplierId: string
    ): Promise<SupplierProductWithRelations[]> {
        const response = await apiClient.get<SupplierProductWithRelations[]>(
            APP_CONFIG.endpoints.products.bySupplier(supplierId)
        );
        return response.data;
    },
};