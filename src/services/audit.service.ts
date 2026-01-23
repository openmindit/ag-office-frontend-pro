// src/services/audit.service.ts
import { apiClient } from "./apiClient";
import type {
    ActivityLog,
    ActivityLogListResponse,
    ActivityLogFilters,
    DataAccessLog,
    SecurityEvent,
    AuditStatistics
} from "../types/audit.types";

export const auditService = {
    /**
     * Récupérer la liste des logs d'activité avec pagination et filtres
     */
    async getActivityLogs(filters: ActivityLogFilters = {}): Promise<ActivityLogListResponse> {
        const params = new URLSearchParams();

        if (filters.page !== undefined) params.append('page', filters.page.toString());
        if (filters.page_size !== undefined) params.append('page_size', filters.page_size.toString());
        if (filters.user_id) params.append('user_id', filters.user_id);
        if (filters.entity_type) params.append('entity_type', filters.entity_type);
        if (filters.action) params.append('action', filters.action);
        if (filters.severity) params.append('severity', filters.severity);
        if (filters.status) params.append('status', filters.status);
        if (filters.start_date) params.append('start_date', filters.start_date);
        if (filters.end_date) params.append('end_date', filters.end_date);
        if (filters.search) params.append('search', filters.search);

        const response = await apiClient.get<ActivityLogListResponse>(
            `/audit/activity-logs?${params.toString()}`
        );
        return response.data;
    },

    /**
     * Récupérer un log d'activité par son ID
     */
    async getActivityLogById(id: string): Promise<ActivityLog> {
        const response = await apiClient.get<ActivityLog>(`/audit/activity-logs/${id}`);
        return response.data;
    },

    /**
     * Récupérer l'historique d'activité d'un utilisateur
     */
    async getUserActivityHistory(
        userId: string,
        days: number = 30,
        page: number = 1,
        pageSize: number = 50
    ): Promise<ActivityLogListResponse> {
        const params = new URLSearchParams({
            days: days.toString(),
            page: page.toString(),
            page_size: pageSize.toString()
        });

        const response = await apiClient.get<ActivityLogListResponse>(
            `/audit/activity-logs/user/${userId}?${params.toString()}`
        );
        return response.data;
    },

    /**
     * Récupérer l'historique des modifications d'une entité
     */
    async getEntityHistory(
        entityType: string,
        entityId: string,
        page: number = 1,
        pageSize: number = 50
    ): Promise<ActivityLogListResponse> {
        const params = new URLSearchParams({
            page: page.toString(),
            page_size: pageSize.toString()
        });

        const response = await apiClient.get<ActivityLogListResponse>(
            `/audit/activity-logs/entity/${entityType}/${entityId}?${params.toString()}`
        );
        return response.data;
    },

    /**
     * Récupérer les statistiques d'activité
     */
    async getStatistics(startDate?: string, endDate?: string): Promise<AuditStatistics> {
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);

        const response = await apiClient.get<AuditStatistics>(
            `/audit/activity-logs/statistics?${params.toString()}`
        );
        return response.data;
    },

    /**
     * Récupérer les logs d'accès aux données
     */
    async getDataAccessLogs(filters: {
        user_id?: string;
        entity_type?: string;
        start_date?: string;
        end_date?: string;
        page?: number;
        page_size?: number;
    } = {}): Promise<DataAccessLog[]> {
        const params = new URLSearchParams();
        if (filters.user_id) params.append('user_id', filters.user_id);
        if (filters.entity_type) params.append('entity_type', filters.entity_type);
        if (filters.start_date) params.append('start_date', filters.start_date);
        if (filters.end_date) params.append('end_date', filters.end_date);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.page_size) params.append('page_size', filters.page_size.toString());

        const response = await apiClient.get<DataAccessLog[]>(
            `/audit/data-access-logs?${params.toString()}`
        );
        return response.data;
    },

    /**
     * Récupérer les événements de sécurité
     */
    async getSecurityEvents(filters: {
        severity?: string;
        resolved?: boolean;
        page?: number;
        page_size?: number;
    } = {}): Promise<SecurityEvent[]> {
        const params = new URLSearchParams();
        if (filters.severity) params.append('severity', filters.severity);
        if (filters.resolved !== undefined) params.append('resolved', filters.resolved.toString());
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.page_size) params.append('page_size', filters.page_size.toString());

        const response = await apiClient.get<SecurityEvent[]>(
            `/audit/security-events?${params.toString()}`
        );
        return response.data;
    },

    /**
     * Résoudre un événement de sécurité
     */
    async resolveSecurityEvent(eventId: string, resolution: string): Promise<SecurityEvent> {
        const response = await apiClient.patch<SecurityEvent>(
            `/audit/security-events/${eventId}/resolve`,
            { resolution }
        );
        return response.data;
    }
};