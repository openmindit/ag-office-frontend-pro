// src/services/auth.service.ts
import {apiClient} from "./apiClient";
import type {User} from "../types/api.types";

export interface AuthTokenResponse {
    access_token: string;
    token_type: "bearer" | string;
}

interface PermissionsResponse {
    permissions: { code: string }[];
}

export const authService = {
    async login(email: string, password: string): Promise<AuthTokenResponse> {
        const body = new URLSearchParams();
        body.append("username", email);
        body.append("password", password);

        const {data} = await apiClient.post<AuthTokenResponse>(
            "/auth/login",
            body,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        return data;
    },

    async me(): Promise<User> {
        const {data} = await apiClient.get<User>("/users/me");
        return data;
    },

    async getMyPermissions(): Promise<string[]> {
        const {data} = await apiClient.get<PermissionsResponse>(
            "/auth/me/permissions"
        );

        return data.permissions.map((p) => p.code);
    },

    logout() {
        localStorage.removeItem("access_token");
    },
};
