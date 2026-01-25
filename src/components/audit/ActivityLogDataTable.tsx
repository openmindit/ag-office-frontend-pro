// src/components/audit/ActivityLogDataTable.tsx
import { useEffect, useRef, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Pagination from "../tables/DataTables/TableThree/Pagination";
import type {
    ActivityLog
} from "../../types/audit.types";

type ActivityLogDataTableProps = {
    logs: ActivityLog[];
    loading: boolean;
    search: string;
    onSearch: (value: string) => void;
    page: number;
    pageSize: number;
    onPageSizeChange: (value: number) => void;
    total: number;
    onPageChange: (page: number) => void;
    entityType: string;
    onEntityTypeChange: (value: string) => void;
    action: string;
    onActionChange: (value: string) => void;
    severity: string;
    onSeverityChange: (value: string) => void;
    status: string;
    onStatusChange: (value: string) => void;
    startDate: string;
    onStartDateChange: (value: string) => void;
    endDate: string;
    onEndDateChange: (value: string) => void;
    onResetFilters: () => void;
    onViewDetails: (log: ActivityLog) => void;
};

const ENTITY_TYPES: { value: string; label: string }[] = [
    { value: '', label: 'Tous les types' },
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

const ACTIONS: { value: string; label: string }[] = [
    { value: '', label: 'Toutes les actions' },
    { value: 'CREATE', label: 'Création' },
    { value: 'READ', label: 'Lecture' },
    { value: 'UPDATE', label: 'Modification' },
    { value: 'DELETE', label: 'Suppression' },
    { value: 'LOGIN', label: 'Connexion' },
    { value: 'LOGOUT', label: 'Déconnexion' },
    { value: 'EXPORT', label: 'Export' },
    { value: 'IMPORT', label: 'Import' },
];

const SEVERITIES: { value: string; label: string }[] = [
    { value: '', label: 'Toutes les sévérités' },
    { value: 'INFO', label: 'Info' },
    { value: 'LOW', label: 'Faible' },
    { value: 'MEDIUM', label: 'Moyen' },
    { value: 'HIGH', label: 'Élevé' },
    { value: 'CRITICAL', label: 'Critique' },
];

const STATUSES: { value: string; label: string }[] = [
    { value: '', label: 'Tous les statuts' },
    { value: 'SUCCESS', label: 'Succès' },
    { value: 'FAILURE', label: 'Échec' },
    { value: 'PENDING', label: 'En attente' },
];

export default function ActivityLogDataTable({
    logs,
    loading,
    search,
    onSearch,
    page,
    pageSize,
    onPageSizeChange,
    total,
    onPageChange,
    entityType,
    onEntityTypeChange,
    action,
    onActionChange,
    severity,
    onSeverityChange,
    status,
    onStatusChange,
    startDate,
    onStartDateChange,
    endDate,
    onEndDateChange,
    onResetFilters,
    onViewDetails,
}: ActivityLogDataTableProps) {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const [showFilter, setShowFilter] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);
    const startIndex = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const endIndex = Math.min(page * pageSize, total);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setShowFilter(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getSeverityColor = (sev: string): "light" | "primary" | "success" | "warning" | "error" => {
        switch (sev) {
            case 'INFO': return 'light';
            case 'LOW': return 'primary';
            case 'MEDIUM': return 'warning';
            case 'HIGH': return 'error';
            case 'CRITICAL': return 'error';
            default: return 'light';
        }
    };

    const getStatusColor = (stat: string): "light" | "primary" | "success" | "warning" | "error" => {
        switch (stat) {
            case 'SUCCESS': return 'success';
            case 'FAILURE': return 'error';
            case 'PENDING': return 'warning';
            default: return 'light';
        }
    };

    const getActionColor = (act: string): "light" | "primary" | "success" | "warning" | "error" => {
        switch (act) {
            case 'CREATE': return 'success';
            case 'READ': return 'light';
            case 'UPDATE': return 'primary';
            case 'DELETE': return 'error';
            case 'LOGIN': return 'success';
            case 'LOGOUT': return 'warning';
            default: return 'light';
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }).format(date);
    };

    const getEntityTypeLabel = (type: string) => {
        const found = ENTITY_TYPES.find(e => e.value === type);
        return found ? found.label : type;
    };

    const getActionLabel = (act: string) => {
        const found = ACTIONS.find(a => a.value === act);
        return found ? found.label : act;
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            {/* Header avec recherche et filtres */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-4 dark:border-white/[0.05]">
                {/* Recherche */}
                <div className="relative w-full max-w-sm">
                    <input
                        type="text"
                        placeholder="Rechercher dans les logs..."
                        value={search}
                        onChange={(e) => onSearch(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-transparent py-2 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-0 dark:border-white/10 dark:text-white/90 dark:placeholder-white/40"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.75 15.75L12.5 12.5M14.25 8.25C14.25 11.5637 11.5637 14.25 8.25 14.25C4.93629 14.25 2.25 11.5637 2.25 8.25C2.25 4.93629 4.93629 2.25 8.25 2.25C11.5637 2.25 14.25 4.93629 14.25 8.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </span>
                </div>

                {/* Bouton filtres */}
                <div className="relative" ref={filterRef}>
                    <button
                        onClick={() => setShowFilter(!showFilter)}
                        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/80 dark:hover:bg-white/[0.05]"
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.75 5.25H14.25M6 9H12M8.25 12.75H9.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Filtres
                        {(entityType || action || severity || status || startDate || endDate) && (
                            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-xs text-white">
                                {[entityType, action, severity, status, startDate, endDate].filter(Boolean).length}
                            </span>
                        )}
                    </button>

                    {/* Panel des filtres */}
                    {showFilter && (
                        <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-white/10 dark:bg-gray-900">
                            <div className="space-y-4">
                                {/* Type d'entité */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-white/80">
                                        Type d'entité
                                    </label>
                                    <select
                                        value={entityType}
                                        onChange={(e) => onEntityTypeChange(e.target.value)}
                                        className="w-full rounded-lg border border-gray-200 bg-transparent py-2 px-3 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-white/10 dark:text-white/90"
                                    >
                                        {ENTITY_TYPES.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Action */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-white/80">
                                        Action
                                    </label>
                                    <select
                                        value={action}
                                        onChange={(e) => onActionChange(e.target.value)}
                                        className="w-full rounded-lg border border-gray-200 bg-transparent py-2 px-3 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-white/10 dark:text-white/90"
                                    >
                                        {ACTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Sévérité */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-white/80">
                                        Sévérité
                                    </label>
                                    <select
                                        value={severity}
                                        onChange={(e) => onSeverityChange(e.target.value)}
                                        className="w-full rounded-lg border border-gray-200 bg-transparent py-2 px-3 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-white/10 dark:text-white/90"
                                    >
                                        {SEVERITIES.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Statut */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-white/80">
                                        Statut
                                    </label>
                                    <select
                                        value={status}
                                        onChange={(e) => onStatusChange(e.target.value)}
                                        className="w-full rounded-lg border border-gray-200 bg-transparent py-2 px-3 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-white/10 dark:text-white/90"
                                    >
                                        {STATUSES.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Dates */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-white/80">
                                            Date début
                                        </label>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => onStartDateChange(e.target.value)}
                                            className="w-full rounded-lg border border-gray-200 bg-transparent py-2 px-3 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-white/10 dark:text-white/90"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-white/80">
                                            Date fin
                                        </label>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => onEndDateChange(e.target.value)}
                                            className="w-full rounded-lg border border-gray-200 bg-transparent py-2 px-3 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-white/10 dark:text-white/90"
                                        />
                                    </div>
                                </div>

                                {/* Bouton reset */}
                                <button
                                    onClick={onResetFilters}
                                    className="w-full rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-white/80 dark:hover:bg-white/[0.05]"
                                >
                                    Réinitialiser les filtres
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell isHeader className="px-4 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                                Date / Heure
                            </TableCell>
                            <TableCell isHeader className="px-4 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                                Action
                            </TableCell>
                            <TableCell isHeader className="px-4 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                                Type
                            </TableCell>
                            <TableCell isHeader className="px-4 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                                Ressource
                            </TableCell>
                            <TableCell isHeader className="px-4 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                                IP
                            </TableCell>
                            <TableCell isHeader className="px-4 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                                Sévérité
                            </TableCell>
                            <TableCell isHeader className="px-4 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                                Statut
                            </TableCell>
                            <TableCell isHeader className="px-4 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                                    Chargement des logs...
                                </TableCell>
                            </TableRow>
                        ) : logs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                                    Aucun log d'activité trouvé
                                </TableCell>
                            </TableRow>
                        ) : (
                            logs.map((log) => (
                                <TableRow key={log.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                                    <TableCell className="px-4 py-3 text-sm text-gray-800 dark:text-white/90">
                                        {formatDate(log.timestamp)}
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <Badge color={getActionColor(log.action)}>
                                            {getActionLabel(log.action)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                        {getEntityTypeLabel(log.entity_type)}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate" title={log.resource}>
                                        {log.resource}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-sm font-mono text-gray-600 dark:text-gray-400">
                                        {log.ip_address}
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <Badge color={getSeverityColor(log.severity)}>
                                            {log.severity}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <Badge color={getStatusColor(log.status)}>
                                            {log.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => onViewDetails(log)}
                                            className="inline-flex items-center justify-center rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.05] dark:hover:text-white"
                                            title="Voir les détails"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1.5 9C1.5 9 3.75 3.75 9 3.75C14.25 3.75 16.5 9 16.5 9C16.5 9 14.25 14.25 9 14.25C3.75 14.25 1.5 9 1.5 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Footer avec pagination */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 p-4 dark:border-white/[0.05]">
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        Afficher
                    </span>
                    <select
                        value={pageSize}
                        onChange={(e) => onPageSizeChange(Number(e.target.value))}
                        className="rounded-lg border border-gray-200 bg-transparent py-1.5 px-2 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-white/10 dark:text-white/90"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        sur {total} résultats
                    </span>
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {startIndex} - {endIndex} sur {total}
                </div>

                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    );
}