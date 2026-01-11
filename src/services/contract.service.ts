import { apiClient } from './apiClient';
import { APP_CONFIG } from '../config/app.config';
import type { Contract, PaginatedResponse } from '../types/api.types';

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
};