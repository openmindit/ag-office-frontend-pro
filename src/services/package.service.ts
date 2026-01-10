import { apiClient } from "./apiClient";
import type {
  PaginatedPackageResponse,
  Package,
  PackageEnhanced,
} from "../types/api.types";
import { APP_CONFIG } from "../config/app.config";

export interface PackageFilters {
  skip?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export const packageService = {
  async getPackages(filters: PackageFilters = {}): Promise<PaginatedPackageResponse> {
    const params = new URLSearchParams();

    if (filters.skip !== undefined) params.append("skip", filters.skip.toString());
    if (filters.limit !== undefined) params.append("limit", filters.limit.toString());
    if (filters.search) params.append("search", filters.search);
    if (filters.status) params.append("status", filters.status);

    const response = await apiClient.get<PaginatedPackageResponse>(
      `${APP_CONFIG.endpoints.packages.list}?${params.toString()}`
    );

    return response.data;
  },

  async getPackageById(id: string): Promise<Package> {
    const response = await apiClient.get<Package>(APP_CONFIG.endpoints.packages.byId(id));
    return response.data;
  },
async getPackageEnhancedById(
    id: string,
    includePricing = true
  ): Promise<PackageEnhanced> {
    const params = new URLSearchParams();
    if (includePricing) {
      params.append("include_pricing", "true");
    }

    const response = await apiClient.get<PackageEnhanced>(
      `${APP_CONFIG.endpoints.packages.enhancedById(id)}?${params.toString()}`
    );
    return response.data;
  },
};