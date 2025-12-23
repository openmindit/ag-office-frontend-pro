import {apiClient} from './apiClient';
import type {PaginatedResponse, Supplier, SupplierContract, SupplierWithContacts} from '../types/api.types';
import {APP_CONFIG} from '../config/app.config';

export interface SupplierFilters {
    skip?: number;
    limit?: number;
    search?: string;
    country?: string;
    is_active?: boolean;
}

export const supplierService = {

    /**
     * Récupérer la liste des fournisseurs avec pagination
     */
    async getSuppliers(filters: SupplierFilters = {}): Promise<PaginatedResponse<Supplier>> {
        const params = new URLSearchParams();

        if (filters.skip !== undefined) params.append('skip', filters.skip.toString());
        if (filters.limit !== undefined) params.append('limit', filters.limit.toString());
        if (filters.search) params.append('search', filters.search);
        if (filters.country) params.append('country', filters.country);
        if (filters.is_active !== undefined) params.append('is_active', filters.is_active.toString());

        const response = await apiClient.get<PaginatedResponse<Supplier>>(
            `${APP_CONFIG.endpoints.suppliers.list}?${params.toString()}`
        );

        return response.data;
    },

    /**
     * Récupérer un fournisseur par son ID
     */
    async getSupplierById(id: string): Promise<SupplierWithContacts> {
        const response = await apiClient.get<SupplierWithContacts>(
            APP_CONFIG.endpoints.suppliers.byId(id)
        );
        return response.data;
    },

    /**
     * Récupérer un fournisseur par son code
     */
    async getSupplierByCode(code: string): Promise<Supplier> {
        const response = await apiClient.get<Supplier>(
            APP_CONFIG.endpoints.suppliers.byCode(code)
        );
        return response.data;
    },

    /**
     * Créer un nouveau fournisseur
     */
    async createSupplier(data: Partial<Supplier>): Promise<Supplier> {
        const response = await apiClient.post<Supplier>(
            APP_CONFIG.endpoints.suppliers.list,
            data
        );
        return response.data;
    },

    /**
     * Mettre à jour un fournisseur
     */
    async updateSupplier(id: string, data: Partial<Supplier>): Promise<Supplier> {
        const response = await apiClient.put<Supplier>(
            APP_CONFIG.endpoints.suppliers.byId(id),
            data
        );
        return response.data;
    },

    /**
     * Supprimer un fournisseur (soft delete par défaut)
     */
    async deleteSupplier(id: string, hardDelete = false): Promise<void> {
        await apiClient.delete(
            `${APP_CONFIG.endpoints.suppliers.byId(id)}?hard_delete=${hardDelete}`
        );
    },

    /**
     * Récupérer la liste des pays
     */
    async getCountries(): Promise<string[]> {
        const response = await apiClient.get<string[]>(
            APP_CONFIG.endpoints.suppliers.countries
        );
        return response.data;
    },

    /**
     * Récupérer les contrats d'un fournisseur
     */
    async getSupplierContracts(id: string): Promise<SupplierContract[]> {
        const response = await apiClient.get<SupplierContract[]>(
            APP_CONFIG.endpoints.suppliers.contractsBySupplier(id)
        );
        return response.data;
    },
};