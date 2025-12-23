import {apiClient} from './apiClient';
import type {Role} from '../types/api.types';
import {APP_CONFIG} from '../config/app.config';

export const roleService = {
    /**
     * Récupérer la liste des rôles
     */
    async getRoles(): Promise<Role[]> {
        const response = await apiClient.get<Role[]>(
            APP_CONFIG.endpoints.roles.list
        );
        return response.data;
    },
};