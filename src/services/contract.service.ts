import { apiClient } from './apiClient';
import { APP_CONFIG } from '../config/app.config';
import type { Contract, ContractEnhanced, PaginatedResponse } from '../types/api.types';

export const contractService = {
  async getContracts(): Promise<Contract[]> {
    const response = await apiClient.get<Contract[] | PaginatedResponse<Contract>>(
      APP_CONFIG.endpoints.contracts.list
    );
    const { data } = response;

    if (Array.isArray(data)) {
      return data;
    }

    return data.items ?? [];
  },
  async getContractEnhancedById(id: string): Promise<ContractEnhanced> {
    const response = await apiClient.get<ContractEnhanced>(
      APP_CONFIG.endpoints.contracts.enhancedById(id)
    );
    return response.data;
  },
};