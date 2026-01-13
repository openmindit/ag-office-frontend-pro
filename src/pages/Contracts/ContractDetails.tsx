import {useEffect, useMemo, useState} from "react";
import {Link, useParams} from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import {contractService} from "../../services/contract.service";
import type {
    ContractEnhanced,
    ContractItemEnhanced,
    ContractPrice,
} from "../../types/api.types";

interface TabItem {
    id: "info" | "items" | "prices";
    label: string;
    count?: number;
}

interface ContractPriceRow extends ContractPrice {
    item: ContractItemEnhanced;
}

const TabButton: React.FC<{
    tab: TabItem;
    isActive: boolean;
    onClick: () => void;
}> = ({tab, isActive, onClick}) => (
    <button
        className={`inline-flex items-center gap-2 border-b-2 px-2.5 py-2 text-sm font-medium transition-colors duration-200 ease-in-out ${
            isActive
                ? "text-brand-500 border-brand-500 dark:border-brand-400 dark:text-brand-400"
                : "border-transparent bg-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        }`}
        onClick={onClick}
    >
        {tab.label}
        {tab.count !== undefined ? (
            <span
                className="inline-block items-center justify-center rounded-full bg-brand-50 px-2 py-0.5 text-center text-xs font-medium text-brand-500 dark:bg-brand-500/15 dark:text-brand-400">
        {tab.count}
      </span>
        ) : null}
    </button>
);

const formatDateValue = (value?: string | null) =>
    value ? new Date(value).toLocaleDateString() : "-";

const getStatusColor = (status: string) => {
    const normalized = status.toLowerCase();
    if (normalized === "active") {
        return "success";
    }
    if (normalized === "terminated" || normalized === "inactive") {
        return "error";
    }
    return "warning";
};

export default function ContractDetails() {
    const {contractId} = useParams();
    const [contract, setContract] = useState<ContractEnhanced | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabItem["id"]>("info");

    useEffect(() => {
        const fetchContract = async () => {
            if (!contractId) {
                setError("Contract ID is missing.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const contractData = await contractService.getContractEnhancedById(
                    contractId
                );
                setContract(contractData);
            } catch (err) {
                setError("Unable to load contract details.");
                setContract(null);
            } finally {
                setLoading(false);
            }
        };

        fetchContract();
    }, [contractId]);

    const itemsCount = contract?.items?.length ?? 0;
    const pricesCount = contract?.total_prices ?? 0;

    const tabs: TabItem[] = [
        {id: "info", label: "Info"},
        {id: "items", label: "Items", count: itemsCount},
        {id: "prices", label: "Prices", count: pricesCount},
    ];

    const priceRows = useMemo<ContractPriceRow[]>(() => {
        if (!contract?.items) {
            return [];
        }
        return contract.items.flatMap((item) =>
            item.prices.map((price) => ({...price, item}))
        );
    }, [contract?.items]);

    const renderItemsTable = () => {
        if (!contract?.items?.length) {
            return (
                <div className="py-8 text-sm text-gray-500 dark:text-gray-400">
                    No items found for this contract.
                </div>
            );
        }

        return (
            <div className="max-w-full overflow-x-auto custom-scrollbar">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell
                                isHeader
                                className="px-4 py-3 border border-gray-100 text-left text-theme-xs font-medium text-gray-700 dark:border-white/[0.05] dark:text-gray-400"
                            >
                                Product
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-4 py-3 border border-gray-100 text-left text-theme-xs font-medium text-gray-700 dark:border-white/[0.05] dark:text-gray-400"
                            >
                                Category
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-4 py-3 border border-gray-100 text-left text-theme-xs font-medium text-gray-700 dark:border-white/[0.05] dark:text-gray-400"
                            >
                                Pricing model
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-4 py-3 border border-gray-100 text-left text-theme-xs font-medium text-gray-700 dark:border-white/[0.05] dark:text-gray-400"
                            >
                                Currency
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-4 py-3 border border-gray-100 text-left text-theme-xs font-medium text-gray-700 dark:border-white/[0.05] dark:text-gray-400"
                            >
                                Qty range
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-4 py-3 border border-gray-100 text-left text-theme-xs font-medium text-gray-700 dark:border-white/[0.05] dark:text-gray-400"
                            >
                                Conditions
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-4 py-3 border border-gray-100 text-left text-theme-xs font-medium text-gray-700 dark:border-white/[0.05] dark:text-gray-400"
                            >
                                Status
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-4 py-3 border border-gray-100 text-left text-theme-xs font-medium text-gray-700 dark:border-white/[0.05] dark:text-gray-400"
                            >
                                Prices
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contract.items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="px-4 py-4 border border-gray-100 text-theme-sm font-medium text-gray-800 dark:border-white/[0.05] dark:text-white/90">
                                    {item.product?.name ?? "-"}
                                </TableCell>
                                <TableCell className="px-4 py-4 border border-gray-100 text-theme-sm text-gray-700 dark:border-white/[0.05] dark:text-gray-300">
                                    {item.product?.category ?? "-"}
                                </TableCell>
                                <TableCell className="px-4 py-4 border border-gray-100 text-theme-sm text-gray-700 dark:border-white/[0.05] dark:text-gray-300">
                                    {item.pricing_model}
                                </TableCell>
                                <TableCell className="px-4 py-4 border border-gray-100 text-theme-sm text-gray-700 dark:border-white/[0.05] dark:text-gray-300">
                                    {item.currency}
                                </TableCell>
                                <TableCell className="px-4 py-4 border border-gray-100 text-theme-sm text-gray-700 dark:border-white/[0.05] dark:text-gray-300">
                                    {item.min_qty} - {item.max_qty}
                                </TableCell>
                                <TableCell className="px-4 py-4 border border-gray-100 text-theme-sm text-gray-700 dark:border-white/[0.05] dark:text-gray-300">
                                    {item.conditions ?? "-"}
                                </TableCell>
                                <TableCell className="px-4 py-4 border border-gray-100 text-theme-sm dark:border-white/[0.05]">
                                    <Badge size="sm" color={item.is_active ? "success" : "error"}>
                                        {item.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="px-4 py-4 border border-gray-100 text-theme-sm text-gray-700 dark:border-white/[0.05] dark:text-gray-300">
                                    {item.prices.length}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    };

    const renderPricesTable = () => {
        if (!priceRows.length) {
            return (
                <div className="py-8 text-sm text-gray-500 dark:text-gray-400">
                    No prices found for this contract.
                </div>
            );
        }

        return (
            <div className="max-w-full overflow-x-auto custom-scrollbar">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell
                                isHeader
                                className="px-4 py-3 border border-gray-100 text-left text-theme-xs font-medium text-gray-700 dark:border-white/[0.05] dark:text-gray-400"
                            >
                                Product
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-4 py-3 border border-gray-100 text-left text-theme-xs font-medium text-gray-700 dark:border-white/[0.05] dark:text-gray-400"
                            >
                                Category
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-4 py-3 border border-gray-100 text-left text-theme-xs font-medium text-gray-700 dark:border-white/[0.05] dark:text-gray-400"
                            >
                                Amount
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-4 py-3 border border-gray-100 text-left text-theme-xs font-medium text-gray-700 dark:border-white/[0.05] dark:text-gray-400"
                            >
                                Currency
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-4 py-3 border border-gray-100 text-left text-theme-xs font-medium text-gray-700 dark:border-white/[0.05] dark:text-gray-400"
                            >
                                Unit
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-4 py-3 border border-gray-100 text-left text-theme-xs font-medium text-gray-700 dark:border-white/[0.05] dark:text-gray-400"
                            >
                                Occupancy
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-4 py-3 border border-gray-100 text-left text-theme-xs font-medium text-gray-700 dark:border-white/[0.05] dark:text-gray-400"
                            >
                                Validity
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-4 py-3 border border-gray-100 text-left text-theme-xs font-medium text-gray-700 dark:border-white/[0.05] dark:text-gray-400"
                            >
                                Priority
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {priceRows.map((price) => (
                            <TableRow key={price.id}>
                                <TableCell className="px-4 py-4 border border-gray-100 text-theme-sm font-medium text-gray-800 dark:border-white/[0.05] dark:text-white/90">
                                    {price.item.product?.name ?? "-"}
                                </TableCell>
                                <TableCell className="px-4 py-4 border border-gray-100 text-theme-sm text-gray-700 dark:border-white/[0.05] dark:text-gray-300">
                                    {price.item.product?.category ?? "-"}
                                </TableCell>
                                <TableCell className="px-4 py-4 border border-gray-100 text-theme-sm text-gray-700 dark:border-white/[0.05] dark:text-gray-300">
                                    {price.amount}
                                </TableCell>
                                <TableCell className="px-4 py-4 border border-gray-100 text-theme-sm text-gray-700 dark:border-white/[0.05] dark:text-gray-300">
                                    {price.currency}
                                </TableCell>
                                <TableCell className="px-4 py-4 border border-gray-100 text-theme-sm text-gray-700 dark:border-white/[0.05] dark:text-gray-300">
                                    {price.pricing_unit}
                                </TableCell>
                                <TableCell className="px-4 py-4 border border-gray-100 text-theme-sm text-gray-700 dark:border-white/[0.05] dark:text-gray-300">
                                    {price.min_occupancy} - {price.max_occupancy}
                                </TableCell>
                                <TableCell className="px-4 py-4 border border-gray-100 text-theme-sm text-gray-700 dark:border-white/[0.05] dark:text-gray-300">
                                    {formatDateValue(price.valid_from)} -{" "}
                                    {formatDateValue(price.valid_to)}
                                </TableCell>
                                <TableCell className="px-4 py-4 border border-gray-100 text-theme-sm text-gray-700 dark:border-white/[0.05] dark:text-gray-300">
                                    {price.priority}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    };

    const tabContent = {
        info: contract ? (
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/40">
                    <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
                        General
                    </h4>
                    <dl className="mt-4 space-y-3 text-sm">
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Contract</dt>
                            <dd className="font-medium text-gray-800 dark:text-white/90">
                                {contract.contract_number}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Code</dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {contract.code}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Type</dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {contract.contract_type}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Status</dt>
                            <dd>
                                <Badge size="sm" color={getStatusColor(contract.status)}>
                                    {contract.status}
                                </Badge>
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Priority</dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {contract.priority}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Version</dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {contract.version}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Auto renew</dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {contract.auto_renew ? "Yes" : "No"}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Cumulative</dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {contract.is_cumulative ? "Yes" : "No"}
                            </dd>
                        </div>
                    </dl>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/40">
                    <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
                        Dates
                    </h4>
                    <dl className="mt-4 space-y-3 text-sm">
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Signature date</dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {formatDateValue(contract.signature_date)}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Valid from</dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {formatDateValue(contract.valid_from)}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Valid to</dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {formatDateValue(contract.valid_to)}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Terminated</dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {formatDateValue(contract.terminated_at)}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Created</dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {formatDateValue(contract.created_at)}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Updated</dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {formatDateValue(contract.updated_at)}
                            </dd>
                        </div>
                    </dl>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/40">
                    <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
                        Supplier & totals
                    </h4>
                    <dl className="mt-4 space-y-3 text-sm">
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Supplier</dt>
                            <dd className="font-medium text-gray-800 dark:text-white/90">
                                {contract.supplier ? (
                                    <Link
                                        to={`/suppliers/${contract.supplier.id}`}
                                        className="text-brand-500 hover:text-brand-600"
                                    >
                                        {contract.supplier.name}
                                    </Link>
                                ) : (
                                    "-"
                                )}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Supplier type</dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {contract.supplier?.supplier_type ?? "-"}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Total items</dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {contract.total_items}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Active items</dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {contract.active_items}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Total prices</dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {contract.total_prices}
                            </dd>
                        </div>
                        <div className="pt-2 text-sm text-gray-500 dark:text-gray-400">
                            {contract.notes ?? "No notes provided."}
                        </div>
                    </dl>
                </div>
            </div>
        ) : null,
        items: (
            <div className="rounded-xl border border-gray-200 dark:border-gray-800">
                {renderItemsTable()}
            </div>
        ),
        prices: (
            <div className="rounded-xl border border-gray-200 dark:border-gray-800">
                {renderPricesTable()}
            </div>
        ),
    };

    return (
        <>
            <PageMeta title="Contract Details" description="Contract details overview" />
            <PageBreadcrumb pageTitle="Contract Details" />
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            Contract Details
                        </h3>
                        {contract?.contract_number ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {contract.contract_number}
                            </p>
                        ) : null}
                    </div>
                    <Link
                        to="/contracts"
                        className="text-sm font-medium text-brand-500 hover:text-brand-600"
                    >
                        Back to contracts
                    </Link>
                </div>

                {loading ? (
                    <div className="py-8 text-sm text-gray-500 dark:text-gray-400">
                        Loading contract details...
                    </div>
                ) : null}

                {!loading && error ? (
                    <div className="py-8 text-sm text-error-500">{error}</div>
                ) : null}

                {!loading && !error && contract ? (
                    <div className="mt-6 rounded-xl border border-gray-200 p-6 dark:border-gray-800">
                        <div className="border-b border-gray-200 dark:border-gray-800">
                            <nav className="-mb-px flex space-x-2 overflow-x-auto [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 dark:[&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:h-1.5">
                                {tabs.map((tab) => (
                                    <TabButton
                                        key={tab.id}
                                        tab={tab}
                                        isActive={activeTab === tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                    />
                                ))}
                            </nav>
                        </div>
                        <div className="pt-4">{tabContent[activeTab]}</div>
                    </div>
                ) : null}
            </div>
        </>
    );
}