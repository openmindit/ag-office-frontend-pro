import {apiClient} from "./apiClient";
import {APP_CONFIG} from "../config/app.config";
import type {ProductWithRelations, SupplierProductWithRelations} from "../types/api.types";

export const productService = {
    async getProducts(): Promise<ProductWithRelations[]> {
        const response = await apiClient.get<ProductWithRelations[]>(
            APP_CONFIG.endpoints.products.list
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