import { apiClient } from "./apiClient";
import type { ApplicationConfig } from "../types/api.types";

export const applicationConfigService = {
  async getConfig(): Promise<ApplicationConfig> {
    const { data } = await apiClient.get<ApplicationConfig>("/api/v1/application-config");
    return data;
  },
  async updateConfig(payload: ApplicationConfig): Promise<ApplicationConfig> {
    const { data } = await apiClient.put<ApplicationConfig>("/api/v1/application-config", payload);
    return data;
  },
};