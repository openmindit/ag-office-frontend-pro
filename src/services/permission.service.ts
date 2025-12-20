import { apiClient } from "./apiClient";

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
};
