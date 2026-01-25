/**
 * Service d'authentification avec support "Rester connecté"
 *
 * FICHIER À REMPLACER: src/services/auth.service.ts
 */

import { apiClient } from "./apiClient";
import type { User } from "../types/api.types";

// ============================================================================
// TYPES
// ============================================================================

export interface AuthTokenResponse {
    access_token: string;
    token_type: "bearer" | string;
    expires_in: number;
}

export interface AuthTokenWithRefreshResponse extends AuthTokenResponse {
    refresh_token: string;
    refresh_expires_in: number;
}

export interface RefreshTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    refresh_expires_in: number;
}

export interface SessionInfo {
    id: string;
    device_info: string | null;
    ip_address: string | null;
    created_at: string;
    last_used_at: string | null;
    is_current: boolean;
}

export interface SessionListResponse {
    sessions: SessionInfo[];
    total: number;
}

interface PermissionsResponse {
    permissions: { code: string }[];
}

// ============================================================================
// STORAGE KEYS
// ============================================================================

const STORAGE_KEYS = {
    ACCESS_TOKEN: "access_token",
    REFRESH_TOKEN: "refresh_token",
    REMEMBER_ME: "remember_me",
    TOKEN_EXPIRY: "token_expiry",
} as const;

// ============================================================================
// SERVICE
// ============================================================================

export const authService = {
    /**
     * Connexion avec option "Rester connecté"
     */
    async login(
        email: string,
        password: string,
        rememberMe: boolean = false
    ): Promise<AuthTokenResponse | AuthTokenWithRefreshResponse> {
        const body = new URLSearchParams();
        body.append("username", email);
        body.append("password", password);

        const { data } = await apiClient.post<AuthTokenResponse | AuthTokenWithRefreshResponse>(
            `/auth/login?remember_me=${rememberMe}`,
            body,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        // Stocker les tokens selon le mode
        this.storeTokens(data, rememberMe);

        return data;
    },

    /**
     * Stocke les tokens de manière sécurisée
     */
    storeTokens(
        data: AuthTokenResponse | AuthTokenWithRefreshResponse,
        rememberMe: boolean
    ): void {
        const storage = rememberMe ? localStorage : sessionStorage;

        // Access token
        storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.access_token);

        // Calculer et stocker l'heure d'expiration
        const expiryTime = Date.now() + (data.expires_in * 1000);
        storage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString());

        // Remember me flag
        localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, rememberMe.toString());

        // Refresh token (seulement si remember_me)
        if ("refresh_token" in data && data.refresh_token) {
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token);
        }

        // Aussi dans localStorage pour la réhydratation (access_token)
        if (rememberMe) {
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.access_token);
        }
    },

    /**
     * Récupère l'access token actuel
     */
    getAccessToken(): string | null {
        // D'abord vérifier sessionStorage, puis localStorage
        return sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
            || localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    },

    /**
     * Récupère le refresh token
     */
    getRefreshToken(): string | null {
        return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    },

    /**
     * Vérifie si remember_me était activé
     */
    isRememberMeEnabled(): boolean {
        return localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === "true";
    },

    /**
     * Vérifie si le token est expiré ou proche de l'expiration
     */
    isTokenExpired(bufferSeconds: number = 60): boolean {
        const expiryStr = sessionStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY)
            || localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);

        if (!expiryStr) return true;

        const expiryTime = parseInt(expiryStr, 10);
        const bufferMs = bufferSeconds * 1000;

        return Date.now() >= (expiryTime - bufferMs);
    },

    /**
     * Rafraîchit les tokens
     */
    async refreshTokens(): Promise<RefreshTokenResponse> {
        const refreshToken = this.getRefreshToken();

        if (!refreshToken) {
            throw new Error("No refresh token available");
        }

        const { data } = await apiClient.post<RefreshTokenResponse>(
            "/auth/refresh",
            { refresh_token: refreshToken }
        );

        // Mettre à jour les tokens stockés
        this.storeTokens(data, true);

        return data;
    },

    /**
     * Récupère les informations de l'utilisateur connecté
     */
    async me(): Promise<User> {
        const { data } = await apiClient.get<User>("/users/me");
        return data;
    },

    /**
     * Récupère les permissions de l'utilisateur
     */
    async getMyPermissions(): Promise<string[]> {
        const { data } = await apiClient.get<PermissionsResponse>(
            "/auth/me/permissions"
        );
        return data.permissions.map((p) => p.code);
    },

    /**
     * Déconnexion
     */
    async logout(): Promise<void> {
        const refreshToken = this.getRefreshToken();

        try {
            if (refreshToken) {
                await apiClient.post("/auth/logout", {
                    refresh_token: refreshToken
                });
            }
        } catch (error) {
            // Ignorer les erreurs de logout côté serveur
            console.warn("Logout API call failed:", error);
        }

        // Nettoyer le stockage local
        this.clearTokens();
    },

    /**
     * Déconnexion de tous les appareils
     */
    async logoutAll(currentPassword: string): Promise<{ revoked_sessions: number }> {
        const { data } = await apiClient.post<{ message: string; revoked_sessions: number }>(
            "/auth/logout-all",
            { current_password: currentPassword }
        );

        // Nettoyer le stockage local
        this.clearTokens();

        return data;
    },

    /**
     * Récupère la liste des sessions actives
     */
    async getSessions(): Promise<SessionListResponse> {
        const refreshToken = this.getRefreshToken();

        const { data } = await apiClient.get<SessionListResponse>(
            "/auth/sessions",
            {
                headers: refreshToken ? {
                    "X-Refresh-Token": refreshToken
                } : undefined
            }
        );

        return data;
    },

    /**
     * Révoque une session spécifique
     */
    async revokeSession(sessionId: string): Promise<void> {
        await apiClient.delete(`/auth/sessions/${sessionId}`);
    },

    /**
     * Nettoie tous les tokens du stockage
     */
    clearTokens(): void {
        // Nettoyer sessionStorage
        sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        sessionStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);

        // Nettoyer localStorage
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
        localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
    },

    /**
     * Vérifie si l'utilisateur a une session valide
     */
    hasValidSession(): boolean {
        const token = this.getAccessToken();
        if (!token) return false;

        // Si remember_me et token expiré, on peut potentiellement rafraîchir
        if (this.isRememberMeEnabled() && this.getRefreshToken()) {
            return true;
        }

        return !this.isTokenExpired();
    }
};