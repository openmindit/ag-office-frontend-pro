import {apiClient} from "./apiClient";
import {APP_CONFIG} from "../config/app.config";
import type {UserProfile, UserProfileUpdatePayload} from "../types/api.types";

export const userProfileService = {
    async getMyProfile(): Promise<UserProfile> {
        const {data} = await apiClient.get<UserProfile>(APP_CONFIG.endpoints.userProfiles.me);
        return data;
    },

    async updateMyProfile(payload: UserProfileUpdatePayload): Promise<UserProfile> {
        const {data} = await apiClient.patch<UserProfile>(APP_CONFIG.endpoints.userProfiles.me, payload);
        return data;
    },
};