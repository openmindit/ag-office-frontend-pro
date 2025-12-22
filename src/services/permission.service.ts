import { apiClient } from "./apiClient";
import { APP_CONFIG } from "../config/app.config";
import type { Permission } from "../types/api.types";

export interface PermissionDto {
  id: string;
  code: string;
  resource: string;
  action: string;
  description?: string;
}

export const permissionService = {
  async myPermissions(): Promise<string[]> {
    const { data } = await apiClient.get(
      "/auth/me/permissions"
    );

    // 🔁 On ne garde que les codes
    return data.permissions.map((p: PermissionDto) => p.code);
  },
  async getPermissions(): Promise<Permission[]> {
    const response = await apiClient.get<Permission[]>(
      APP_CONFIG.endpoints.permissions.list
    );
    return response.data;
  },
};
