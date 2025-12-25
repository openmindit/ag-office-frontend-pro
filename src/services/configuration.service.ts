import { apiClient } from "./apiClient";
import type { Configuration } from "../types/api.types";

export const configurationService = {
    async getMyConfiguration(): Promise<Configuration> {
        const { data } = await apiClient.get<Configuration>("/configuration/me");
        return data;
    },
};