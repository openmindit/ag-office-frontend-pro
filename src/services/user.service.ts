import {apiClient} from "./apiClient";
import {APP_CONFIG} from "../config/app.config";
import type {User as ApiUser} from "../types/api.types";
import type {User as AuthUser} from "../types/auth.types";

export const userService = {
    async me(): Promise<AuthUser> {
        const {data} = await apiClient.get<AuthUser>("/users/me");
        return data;
    },

    async getUsers(): Promise<ApiUser[]> {
        const {data} = await apiClient.get<ApiUser[]>(
            APP_CONFIG.endpoints.users.list
        );
        return data;
    },
};
