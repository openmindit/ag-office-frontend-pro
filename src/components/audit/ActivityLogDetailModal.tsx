// src/components/audit/ActivityLogDetailModal.tsx
import { useEffect, useRef } from "react";
import Badge from "../ui/badge/Badge";
import type { ActivityLog } from "../../types/audit.types";

type ActivityLogDetailModalProps = {
    log: ActivityLog | null;
    isOpen: boolean;
    onClose: () => void;
};

export default function ActivityLogDetailModal({
    log,
    isOpen,
    onClose,
}: ActivityLogDetailModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.addEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.removeEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    if (!isOpen || !log) return null;

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }).format(date);
    };

    const getSeverityColor = (sev: string): "light" | "primary" | "success" | "warning" | "error" => {
        switch (sev) {
            case "INFO": return "light";
            case "LOW": return "primary";
            case "MEDIUM": return "warning";
            case "HIGH": return "error";
            case "CRITICAL": return "error";
            default: return "light";
        }
    };

    const getStatusColor = (stat: string): "light" | "primary" | "success" | "warning" | "error" => {
        switch (stat) {
            case "SUCCESS": return "success";
            case "FAILURE": return "error";
            case "PENDING": return "warning";
            default: return "light";
        }
    };

    const renderJsonValue = (value: unknown) => {
        if (value === null || value === undefined) {
            return <span className="text-gray-400 italic">null</span>;
        }
        if (typeof value === "object") {
            return (
                <pre className="rounded-lg bg-gray-50 p-3 text-xs text-gray-700 overflow-x-auto dark:bg-gray-800 dark:text-gray-300">
                    {JSON.stringify(value, null, 2)}
                </pre>
            );
        }
        return <span>{String(value)}</span>;
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div
                ref={modalRef}
                className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-900"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-white/10">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Détails de l'activité
                    </h3>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/[0.05] dark:hover:text-white"
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="max-h-[calc(90vh-120px)] overflow-y-auto p-6">
                    <div className="space-y-6">
                        {/* Informations principales */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                    Date / Heure
                                </label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {formatDate(log.timestamp)}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                    Durée
                                </label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {log.duration_ms ? `${log.duration_ms} ms` : "-"}
                                </p>
                            </div>
                        </div>

                        {/* Action et statut */}
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                    Action
                                </label>
                                <div className="mt-1">
                                    <Badge color="primary">{log.action}</Badge>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                    Sévérité
                                </label>
                                <div className="mt-1">
                                    <Badge color={getSeverityColor(log.severity)}>{log.severity}</Badge>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                    Statut
                                </label>
                                <div className="mt-1">
                                    <Badge color={getStatusColor(log.status)}>{log.status}</Badge>
                                </div>
                            </div>
                        </div>

                        {/* Entité et ressource */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                    Type d'entité
                                </label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {log.entity_type}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                    ID de l'entité
                                </label>
                                <p className="mt-1 text-sm font-mono text-gray-900 dark:text-white">
                                    {log.entity_id || "-"}
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                Ressource
                            </label>
                            <p className="mt-1 text-sm font-mono text-gray-900 dark:text-white break-all">
                                <span className="mr-2 rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                    {log.method}
                                </span>
                                {log.resource}
                            </p>
                        </div>

                        {/* Informations réseau */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                    Adresse IP
                                </label>
                                <p className="mt-1 text-sm font-mono text-gray-900 dark:text-white">
                                    {log.ip_address}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                    Session ID
                                </label>
                                <p className="mt-1 text-sm font-mono text-gray-900 dark:text-white truncate" title={log.session_id || "-"}>
                                    {log.session_id || "-"}
                                </p>
                            </div>
                        </div>

                        {log.user_agent && (
                            <div>
                                <label className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                    User Agent
                                </label>
                                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 break-all">
                                    {log.user_agent}
                                </p>
                            </div>
                        )}

                        {/* Erreur (si présente) */}
                        {log.error_message && (
                            <div>
                                <label className="text-xs font-medium uppercase text-red-500">
                                    Message d'erreur
                                </label>
                                <div className="mt-1 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                                    {log.error_message}
                                </div>
                            </div>
                        )}

                        {/* Changements */}
                        {log.changes && Object.keys(log.changes).length > 0 && (
                            <div>
                                <label className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                    Changements
                                </label>
                                <div className="mt-1">{renderJsonValue(log.changes)}</div>
                            </div>
                        )}

                        {/* Anciennes valeurs */}
                        {log.old_values && Object.keys(log.old_values).length > 0 && (
                            <div>
                                <label className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                    Anciennes valeurs
                                </label>
                                <div className="mt-1">{renderJsonValue(log.old_values)}</div>
                            </div>
                        )}

                        {/* Nouvelles valeurs */}
                        {log.new_values && Object.keys(log.new_values).length > 0 && (
                            <div>
                                <label className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                    Nouvelles valeurs
                                </label>
                                <div className="mt-1">{renderJsonValue(log.new_values)}</div>
                            </div>
                        )}

                        {/* Métadonnées */}
                        {log.request_metadata && Object.keys(log.request_metadata).length > 0 && (
                            <div>
                                <label className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                    Métadonnées de la requête
                                </label>
                                <div className="mt-1">{renderJsonValue(log.request_metadata)}</div>
                            </div>
                        )}

                        {/* ID technique */}
                        <div className="border-t border-gray-200 pt-4 dark:border-white/10">
                            <label className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                ID du log
                            </label>
                            <p className="mt-1 text-xs font-mono text-gray-500 dark:text-gray-500">
                                {log.id}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 px-6 py-4 dark:border-white/10">
                    <button
                        onClick={onClose}
                        className="w-full rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-white/[0.05] dark:text-white/80 dark:hover:bg-white/[0.08]"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
}