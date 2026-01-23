// src/pages/Administration/ActivityLogsPage.tsx
import { useCallback, useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ActivityLogDataTable from "../../components/audit/ActivityLogDataTable";
import ActivityLogDetailModal from "../../components/audit/ActivityLogDetailModal";
import { auditService } from "../../services/audit.service";
import type { ActivityLog, AuditStatistics } from "../../types/audit.types";

export default function ActivityLogsPage() {
    // État pour les logs
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    // État pour les filtres
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [search, setSearch] = useState("");
    const [entityType, setEntityType] = useState("");
    const [action, setAction] = useState("");
    const [severity, setSeverity] = useState("");
    const [status, setStatus] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // État pour les statistiques
    const [statistics, setStatistics] = useState<AuditStatistics | null>(null);
    const [statsLoading, setStatsLoading] = useState(true);

    // État pour le modal de détails
    const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // État pour le dropdown d'actions
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Charger les logs
    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const data = await auditService.getActivityLogs({
                page,
                page_size: pageSize,
                search: search || undefined,
                entity_type: entityType || undefined,
                action: action || undefined,
                severity: severity || undefined,
                status: status || undefined,
                start_date: startDate || undefined,
                end_date: endDate || undefined,
            });
            setLogs(data.items);
            setTotal(data.total);
        } catch (error) {
            console.error("Erreur lors du chargement des logs:", error);
            setLogs([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, search, entityType, action, severity, status, startDate, endDate]);

    // Charger les statistiques
    const fetchStatistics = useCallback(async () => {
        setStatsLoading(true);
        try {
            const stats = await auditService.getStatistics(
                startDate || undefined,
                endDate || undefined
            );
            setStatistics(stats);
        } catch (error) {
            console.error("Erreur lors du chargement des statistiques:", error);
            setStatistics(null);
        } finally {
            setStatsLoading(false);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    useEffect(() => {
        fetchStatistics();
    }, [fetchStatistics]);

    // Handlers
    const handleSearchChange = (value: string) => {
        setPage(1);
        setSearch(value);
    };

    const handlePageSizeChange = (value: number) => {
        setPage(1);
        setPageSize(value);
    };

    const handleEntityTypeChange = (value: string) => {
        setPage(1);
        setEntityType(value);
    };

    const handleActionChange = (value: string) => {
        setPage(1);
        setAction(value);
    };

    const handleSeverityChange = (value: string) => {
        setPage(1);
        setSeverity(value);
    };

    const handleStatusChange = (value: string) => {
        setPage(1);
        setStatus(value);
    };

    const handleStartDateChange = (value: string) => {
        setPage(1);
        setStartDate(value);
    };

    const handleEndDateChange = (value: string) => {
        setPage(1);
        setEndDate(value);
    };

    const handleResetFilters = () => {
        setPage(1);
        setSearch("");
        setEntityType("");
        setAction("");
        setSeverity("");
        setStatus("");
        setStartDate("");
        setEndDate("");
    };

    const handleViewDetails = (log: ActivityLog) => {
        setSelectedLog(log);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedLog(null);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleExport = async (format: "json" | "csv") => {
        // TODO: Implémenter l'export
        console.log(`Export en ${format}`);
        setIsDropdownOpen(false);
    };

    return (
        <>
            <PageMeta
                title="Logs d'activité | AG Office - Administration"
                description="Consultation des logs d'activité et traçabilité des actions"
            />

            <PageBreadcrumb pageTitle="Logs d'activité" />

            {/* Header avec titre et actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                        Logs d'activité
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Traçabilité complète des actions dans l'application
                    </p>
                </div>

                <div className="relative inline-block">
                    <button
                        onClick={toggleDropdown}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                        Actions
                        <svg
                            className={`duration-200 ease-in-out stroke-current ${isDropdownOpen ? "rotate-180" : ""}`}
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M4.5 6.75L9 11.25L13.5 6.75"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 z-40 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-white/10 dark:bg-gray-900">
                            <button
                                onClick={() => handleExport("json")}
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/[0.05]"
                            >
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.75 11.25V14.25C15.75 14.6478 15.592 15.0294 15.3107 15.3107C15.0294 15.592 14.6478 15.75 14.25 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0294 2.25 14.6478 2.25 14.25V11.25M5.25 7.5L9 11.25M9 11.25L12.75 7.5M9 11.25V2.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Exporter en JSON
                            </button>
                            <button
                                onClick={() => handleExport("csv")}
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/[0.05]"
                            >
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.75 11.25V14.25C15.75 14.6478 15.592 15.0294 15.3107 15.3107C15.0294 15.592 14.6478 15.75 14.25 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0294 2.25 14.6478 2.25 14.25V11.25M5.25 7.5L9 11.25M9 11.25L12.75 7.5M9 11.25V2.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Exporter en CSV
                            </button>
                            <hr className="my-1 border-gray-200 dark:border-white/10" />
                            <button
                                onClick={() => {
                                    fetchLogs();
                                    fetchStatistics();
                                    setIsDropdownOpen(false);
                                }}
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/[0.05]"
                            >
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.5 9C1.5 10.4834 1.93987 11.9334 2.76398 13.1668C3.58809 14.4001 4.75943 15.3614 6.12987 15.9291C7.50032 16.4968 9.00832 16.6453 10.4632 16.3559C11.918 16.0665 13.2544 15.3522 14.3033 14.3033C15.3522 13.2544 16.0665 11.918 16.3559 10.4632C16.6453 9.00832 16.4968 7.50032 15.9291 6.12987C15.3614 4.75943 14.4001 3.58809 13.1668 2.76398C11.9334 1.93987 10.4834 1.5 9 1.5V5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Actualiser
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Cartes de statistiques */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-500/10">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand-500">
                                <path d="M10 6.66667V10M10 13.3333H10.0083M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total activités</p>
                            <p className="text-xl font-semibold text-gray-800 dark:text-white">
                                {statsLoading ? "..." : (statistics?.total_activities ?? total).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-50 dark:bg-success-500/10">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-success-500">
                                <path d="M16.6667 5L7.5 14.1667L3.33333 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Succès</p>
                            <p className="text-xl font-semibold text-gray-800 dark:text-white">
                                {statsLoading ? "..." : (statistics?.activities_by_status?.SUCCESS ?? 0).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-error-50 dark:bg-error-500/10">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-error-500">
                                <path d="M12.5 7.5L7.5 12.5M7.5 7.5L12.5 12.5M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Échecs</p>
                            <p className="text-xl font-semibold text-gray-800 dark:text-white">
                                {statsLoading ? "..." : (statistics?.activities_by_status?.FAILURE ?? 0).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-50 dark:bg-warning-500/10">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-warning-500">
                                <path d="M8.57465 3.21665L1.51632 15C1.37079 15.252 1.29379 15.5377 1.29298 15.8288C1.29216 16.1199 1.36756 16.406 1.51167 16.6588C1.65579 16.9116 1.86359 17.1223 2.11441 17.2699C2.36523 17.4174 2.65032 17.4968 2.94132 17.5H17.058C17.349 17.4968 17.6341 17.4174 17.8849 17.2699C18.1357 17.1223 18.3435 16.9116 18.4876 16.6588C18.6318 16.406 18.7072 16.1199 18.7063 15.8288C18.7055 15.5377 18.6285 15.252 18.483 15L11.4247 3.21665C11.2761 2.97174 11.0669 2.76925 10.8173 2.62872C10.5677 2.48819 10.2861 2.41431 9.99965 2.41431C9.71321 2.41431 9.43159 2.48819 9.18199 2.62872C8.93238 2.76925 8.72321 2.97174 8.57465 3.21665Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M10 7.5V10.8333M10 14.1667H10.0083" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Haute sévérité</p>
                            <p className="text-xl font-semibold text-gray-800 dark:text-white">
                                {statsLoading ? "..." : ((statistics?.activities_by_severity?.HIGH ?? 0) + (statistics?.activities_by_severity?.CRITICAL ?? 0)).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table des logs */}
            <ActivityLogDataTable
                logs={logs}
                loading={loading}
                search={search}
                onSearch={handleSearchChange}
                page={page}
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
                total={total}
                onPageChange={setPage}
                entityType={entityType}
                onEntityTypeChange={handleEntityTypeChange}
                action={action}
                onActionChange={handleActionChange}
                severity={severity}
                onSeverityChange={handleSeverityChange}
                status={status}
                onStatusChange={handleStatusChange}
                startDate={startDate}
                onStartDateChange={handleStartDateChange}
                endDate={endDate}
                onEndDateChange={handleEndDateChange}
                onResetFilters={handleResetFilters}
                onViewDetails={handleViewDetails}
            />

            {/* Modal de détails */}
            <ActivityLogDetailModal
                log={selectedLog}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </>
    );
}