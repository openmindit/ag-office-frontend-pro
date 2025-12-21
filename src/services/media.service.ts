import { apiClient } from "./apiClient";
import type { Media } from "../types/api.types";
import { APP_CONFIG } from "../config/app.config";

export const mediaService = {
  async getSupplierMedia(supplierId: string): Promise<Media[]> {
    const response = await apiClient.get<Media[]>(
      APP_CONFIG.endpoints.media.bySupplier(supplierId)
    );
    return response.data;
  },
};