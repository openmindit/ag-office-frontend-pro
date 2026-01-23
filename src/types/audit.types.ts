// src/types/audit.types.ts

/**
 * Types d'entités pour l'audit
 */
export type EntityType =
    | 'USER'
    | 'ROLE'
    | 'PERMISSION'
    | 'SUPPLIER'
    | 'PRODUCT'
    | 'CONTRACT'
    | 'PACKAGE'
    | 'BOOKING'
    | 'CLIENT'
    | 'DESTINATION'
    | 'MEDIA'
    | 'CONFIGURATION'
    | 'DEPARTMENT'
    | 'ACTIVITY_LOG'
    | 'SECURITY_EVENT';

/**
 * Types d'actions pour l'audit
 */
export type ActionType =
    | 'CREATE'
    | 'READ'
    | 'UPDATE'
    | 'DELETE'
    | 'LOGIN'
    | 'LOGOUT'
    | 'EXPORT'
    | 'IMPORT'
    | 'APPROVE'
    | 'REJECT'
    | 'ARCHIVE'
    | 'RESTORE';

/**
 * Méthodes HTTP
 */
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Niveaux de sévérité
 */
export type Severity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/**
 * Statuts d'opération
 */
export type OperationStatus = 'SUCCESS' | 'FAILURE' | 'PENDING';

/**
 * Types d'accès aux données
 */
export type AccessType = 'VIEW' | 'LIST' | 'SEARCH' | 'EXPORT' | 'DOWNLOAD';

/**
 * Types d'événements de sécurité
 */
export type SecurityEventType =
    | 'LOGIN_FAILED'
    | 'LOGIN_SUCCESS'
    | 'LOGOUT'
    | 'PASSWORD_CHANGED'
    | 'PASSWORD_RESET'
    | 'PERMISSION_DENIED'
    | 'SUSPICIOUS_ACTIVITY'
    | 'BRUTE_FORCE_ATTEMPT'
    | 'SESSION_EXPIRED'
    | 'TOKEN_INVALID'
    | 'IP_BLOCKED';

/**
 * Log d'activité
 */
export interface ActivityLog {
    id: string;
    user_id: string;
    entity_type: EntityType;
    entity_id?: string;
    action: ActionType;
    resource: string;
    method: HTTPMethod;
    ip_address: string;
    user_agent?: string;
    changes?: Record<string, unknown>;
    old_values?: Record<string, unknown>;
    new_values?: Record<string, unknown>;
    request_metadata?: Record<string, unknown>;
    severity: Severity;
    status: OperationStatus;
    error_message?: string;
    session_id?: string;
    timestamp: string;
    duration_ms?: number;
    // Relations (optionnelles, peuvent être populées)
    user?: {
        id: string;
        email: string;
        full_name?: string;
    };
}

/**
 * Réponse paginée pour les logs d'activité
 */
export interface ActivityLogListResponse {
    items: ActivityLog[];
    total: number;
    page: number;
    page_size: number;
}

/**
 * Filtres pour les logs d'activité
 */
export interface ActivityLogFilters {
    page?: number;
    page_size?: number;
    user_id?: string;
    entity_type?: EntityType | string;
    action?: ActionType | string;
    severity?: Severity | string;
    status?: OperationStatus | string;
    start_date?: string;
    end_date?: string;
    search?: string;
}

/**
 * Log d'accès aux données
 */
export interface DataAccessLog {
    id: string;
    user_id: string;
    entity_type: EntityType;
    entity_id: string;
    access_type: AccessType;
    fields_accessed?: string[];
    reason?: string;
    ip_address: string;
    user_agent?: string;
    timestamp: string;
}

/**
 * Événement de sécurité
 */
export interface SecurityEvent {
    id: string;
    event_type: SecurityEventType;
    user_id?: string;
    ip_address: string;
    user_agent?: string;
    details?: Record<string, unknown>;
    severity: Severity;
    resolved: boolean;
    resolved_at?: string;
    resolved_by?: string;
    resolution_notes?: string;
    timestamp: string;
}

/**
 * Statistiques d'audit
 */
export interface AuditStatistics {
    total_activities: number;
    activities_by_action: Record<string, number>;
    activities_by_entity_type: Record<string, number>;
    activities_by_severity: Record<string, number>;
    activities_by_status: Record<string, number>;
    top_users: Array<{
        user_id: string;
        count: number;
    }>;
    activity_timeline: Array<{
        date: string;
        count: number;
    }>;
}

/**
 * Options pour les filtres d'interface
 */
export const ENTITY_TYPE_OPTIONS: { value: EntityType; label: string }[] = [
    { value: 'USER', label: 'Utilisateur' },
    { value: 'ROLE', label: 'Rôle' },
    { value: 'PERMISSION', label: 'Permission' },
    { value: 'SUPPLIER', label: 'Fournisseur' },
    { value: 'PRODUCT', label: 'Produit' },
    { value: 'CONTRACT', label: 'Contrat' },
    { value: 'PACKAGE', label: 'Package' },
    { value: 'BOOKING', label: 'Réservation' },
    { value: 'CLIENT', label: 'Client' },
    { value: 'DESTINATION', label: 'Destination' },
    { value: 'MEDIA', label: 'Média' },
    { value: 'CONFIGURATION', label: 'Configuration' },
    { value: 'DEPARTMENT', label: 'Département' },
];

export const ACTION_TYPE_OPTIONS: { value: ActionType; label: string }[] = [
    { value: 'CREATE', label: 'Création' },
    { value: 'READ', label: 'Lecture' },
    { value: 'UPDATE', label: 'Modification' },
    { value: 'DELETE', label: 'Suppression' },
    { value: 'LOGIN', label: 'Connexion' },
    { value: 'LOGOUT', label: 'Déconnexion' },
    { value: 'EXPORT', label: 'Export' },
    { value: 'IMPORT', label: 'Import' },
    { value: 'APPROVE', label: 'Approbation' },
    { value: 'REJECT', label: 'Rejet' },
    { value: 'ARCHIVE', label: 'Archivage' },
    { value: 'RESTORE', label: 'Restauration' },
];

export const SEVERITY_OPTIONS: { value: Severity; label: string }[] = [
    { value: 'INFO', label: 'Info' },
    { value: 'LOW', label: 'Faible' },
    { value: 'MEDIUM', label: 'Moyen' },
    { value: 'HIGH', label: 'Élevé' },
    { value: 'CRITICAL', label: 'Critique' },
];

export const STATUS_OPTIONS: { value: OperationStatus; label: string }[] = [
    { value: 'SUCCESS', label: 'Succès' },
    { value: 'FAILURE', label: 'Échec' },
    { value: 'PENDING', label: 'En attente' },
];