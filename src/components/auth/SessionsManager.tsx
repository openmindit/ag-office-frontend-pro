/**
 * Composant de gestion des sessions actives
 *
 * NOUVEAU FICHIER: src/components/auth/SessionsManager.tsx
 *
 * Permet à l'utilisateur de:
 * - Voir toutes ses sessions actives
 * - Identifier l'appareil actuel
 * - Révoquer des sessions individuelles
 * - Se déconnecter de tous les appareils
 */

import { useState, useEffect, useCallback } from "react";
import { authService, SessionInfo } from "../../services/auth.service";
import { useAuthStore } from "../../stores/auth.store";
import Button from "../ui/button/Button";

// ============================================================================
// ICONS
// ============================================================================

const DeviceIcon = ({ deviceInfo }: { deviceInfo: string | null }) => {
    const info = (deviceInfo || "").toLowerCase();

    if (info.includes("mobile") || info.includes("android") || info.includes("ios")) {
        return (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
        );
    }

    // Desktop par défaut
    return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    );
};

// ============================================================================
// COMPONENT
// ============================================================================

interface SessionsManagerProps {
    className?: string;
}

export default function SessionsManager({ className = "" }: SessionsManagerProps) {
    // ========================================================================
    // STATE
    // ========================================================================

    const [sessions, setSessions] = useState<SessionInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [revokingId, setRevokingId] = useState<string | null>(null);

    // Modal pour déconnexion globale
    const [showLogoutAllModal, setShowLogoutAllModal] = useState(false);
    const [logoutAllPassword, setLogoutAllPassword] = useState("");
    const [logoutAllError, setLogoutAllError] = useState<string | null>(null);
    const [isLoggingOutAll, setIsLoggingOutAll] = useState(false);

    // Store
    const logout = useAuthStore((state) => state.logout);

    // ========================================================================
    // HANDLERS
    // ========================================================================

    const loadSessions = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await authService.getSessions();
            setSessions(response.sessions);
        } catch (err) {
            setError("Impossible de charger les sessions");
            console.error("Failed to load sessions:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ========================================================================
    // EFFECTS
    // ========================================================================

    useEffect(() => {
        void loadSessions();
    }, [loadSessions]);

    // ========================================================================
    // MORE HANDLERS
    // ========================================================================

    const handleRevokeSession = async (sessionId: string) => {
        try {
            setRevokingId(sessionId);
            await authService.revokeSession(sessionId);
            setSessions(sessions.filter(s => s.id !== sessionId));
        } catch (err) {
            console.error("Failed to revoke session:", err);
            setError("Impossible de révoquer cette session");
        } finally {
            setRevokingId(null);
        }
    };

    const handleLogoutAll = async () => {
        if (!logoutAllPassword) {
            setLogoutAllError("Veuillez entrer votre mot de passe");
            return;
        }

        try {
            setIsLoggingOutAll(true);
            setLogoutAllError(null);
            await authService.logoutAll(logoutAllPassword);
            // Déconnecter localement
            logout();
            // La redirection vers /signin sera gérée par le ProtectedRoute
        } catch (err) {
            setLogoutAllError("Mot de passe incorrect");
            console.error("Failed to logout all:", err);
        } finally {
            setIsLoggingOutAll(false);
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const closeLogoutAllModal = () => {
        setShowLogoutAllModal(false);
        setLogoutAllPassword("");
        setLogoutAllError(null);
    };

    // ========================================================================
    // RENDER
    // ========================================================================

    if (isLoading) {
        return (
            <div className={`p-6 ${className}`}>
                <div className="flex items-center justify-center py-8">
                    <svg className="w-8 h-8 animate-spin text-brand-500" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                </div>
            </div>
        );
    }

    return (
        <div className={`${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Sessions actives
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {sessions.length} session{sessions.length > 1 ? "s" : ""} active{sessions.length > 1 ? "s" : ""}
                    </p>
                </div>

                {sessions.length > 1 && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowLogoutAllModal(true)}
                        className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/20"
                    >
                        Déconnecter tous les appareils
                    </Button>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="p-3 mb-4 text-sm text-red-600 rounded-lg bg-red-50 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                </div>
            )}

            {/* Sessions List */}
            <div className="space-y-4">
                {sessions.map((session) => (
                    <div
                        key={session.id}
                        className={`p-4 rounded-lg border ${
                            session.is_current
                                ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                        }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                {/* Device Icon */}
                                <div className={`p-2 rounded-lg ${
                                    session.is_current
                                        ? "bg-brand-100 text-brand-600 dark:bg-brand-800 dark:text-brand-300"
                                        : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                }`}>
                                    <DeviceIcon deviceInfo={session.device_info} />
                                </div>

                                {/* Session Info */}
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-800 dark:text-white">
                                            {session.device_info || "Appareil inconnu"}
                                        </span>
                                        {session.is_current && (
                                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-brand-500 text-white">
                                                Cet appareil
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        <p>IP: {session.ip_address || "Inconnue"}</p>
                                        <p>Connecté le: {formatDate(session.created_at)}</p>
                                        {session.last_used_at && (
                                            <p>Dernière activité: {formatDate(session.last_used_at)}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Revoke Button */}
                            {!session.is_current && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRevokeSession(session.id)}
                                    disabled={revokingId === session.id}
                                    className="text-gray-600 dark:text-gray-300"
                                >
                                    {revokingId === session.id ? (
                                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                    ) : (
                                        "Révoquer"
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Logout All Modal */}
            {showLogoutAllModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md p-6 mx-4 bg-white rounded-xl dark:bg-gray-800">
                        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
                            Déconnecter tous les appareils
                        </h3>

                        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                            Cette action vous déconnectera de tous vos appareils, y compris celui-ci.
                            Entrez votre mot de passe pour confirmer.
                        </p>

                        <input
                            type="password"
                            placeholder="Votre mot de passe"
                            value={logoutAllPassword}
                            onChange={(e) => setLogoutAllPassword(e.target.value)}
                            className="w-full px-4 py-2 mb-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />

                        {logoutAllError && (
                            <p className="mb-4 text-sm text-red-600 dark:text-red-400">
                                {logoutAllError}
                            </p>
                        )}

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={closeLogoutAllModal}
                            >
                                Annuler
                            </Button>
                            <Button
                                className="flex-1 bg-red-600 hover:bg-red-700"
                                onClick={handleLogoutAll}
                                disabled={isLoggingOutAll}
                            >
                                {isLoggingOutAll ? "Déconnexion..." : "Confirmer"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}