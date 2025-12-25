import { apiClient } from "./apiClient";
import type { AppConfiguration } from "../types/api.types";

export const configurationService = {
    async getMyConfiguration(): Promise<AppConfiguration> {
        const { data } = await apiClient.get<AppConfiguration>("/configuration/me");
        return data;
    },
};