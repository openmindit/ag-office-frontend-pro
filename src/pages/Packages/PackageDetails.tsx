import {useEffect, useMemo, useState} from "react";
import {Link, useParams} from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Badge from "../../components/ui/badge/Badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import {packageService} from "../../services/package.service";
import type {
    PackageComponentEnhanced,
    PackageDestination,
    PackageDestinationEnhanced,
    PackageEnhanced,
    PackageUserSummary,
} from "../../types/api.types";

interface TabItem {
    id: "info" | "components" | "pricing" | "destinations" | "metadata";
    label: string;
    count?: number;
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
            <span className="inline-block items-center justify-center rounded-full bg-brand-50 px-2 py-0.5 text-center text-xs font-medium text-brand-500 dark:bg-brand-500/15 dark:text-brand-400">
                {tab.count}
            </span>
        ) : null}
    </button>
);

const formatDateValue = (value?: string | null) =>
    value ? new Date(value).toLocaleDateString() : "-";

const formatUserLabel = (
    user?: PackageUserSummary | null,
    fallback?: string | null
) => {
  if (user) {
        const name = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();
        return name || user.email || user.id;
    }
    return fallback ?? "-";
};


const renderPricingValue = (value?: string | null) => value ?? "-";

export default function PackageDetails() {
    const {packageId} = useParams();
    const [pkg, setPkg] = useState<PackageEnhanced | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabItem["id"]>("info");

    useEffect(() => {
        let isMounted = true;

        const fetchPackage = async () => {
            if (!packageId) {
                setError("Package ID is missing.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const result = await packageService.getPackageEnhancedById(
                    packageId
                );
                if (isMounted) {
                    setPkg(result);
                }
            } catch (err) {
                if (isMounted) {
                    setPkg(null);
                    setError("Unable to load package details.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        void fetchPackage();

        return () => {
            isMounted = false;
        };
    }, [packageId]);

    const statusColor = useMemo(() => {
        if (pkg?.status === "PUBLISHED") return "success" as const;
        if (pkg?.status === "DRAFT") return "warning" as const;
        return "light" as const;
    }, [pkg?.status]);

    const componentsCount = pkg?.components?.length ?? 0;
    const destinationsCount =
        pkg?.destinationsEnhanced?.length ??
        pkg?.destinations?.length ??
        0;

    const tabs: TabItem[] = [
        {id: "info", label: "Info"},
        {id: "components", label: "Components", count: componentsCount},
        {id: "pricing", label: "Pricing"},
        {id: "destinations", label: "Destinations", count: destinationsCount},
        {id: "metadata", label: "Metadata"},
    ];

    const renderComponentsTable = () => {
        if (error) {
            return <div className="py-8 text-sm text-error-500">{error}</div>;
        }
        if (!pkg?.components?.length) {
            return (
                <div className="py-8 text-sm text-gray-500 dark:text-gray-400">
                    No components configured.
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
                                Component
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-4 py-3 border border-gray-100 text-left text-theme-xs font-medium text-gray-700 dark:border-white/[0.05] dark:text-gray-400"
                            >
                                Inclusion
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
                                Product
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-4 py-3 border border-gray-100 text-left text-theme-xs font-medium text-gray-700 dark:border-white/[0.05] dark:text-gray-400"
                            >
                                Supplier
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-4 py-3 border border-gray-100 text-left text-theme-xs font-medium text-gray-700 dark:border-white/[0.05] dark:text-gray-400"
                            >
                                Pricing
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pkg.components.map(
                            (component: PackageComponentEnhanced) => (
                                <TableRow key={component.id}>
                                    <TableCell className="px-4 py-4 border border-gray-100 text-theme-sm font-medium text-gray-800 dark:border-white/[0.05] dark:text-white/90">
                                        <div className="flex flex-col gap-1">
                                            <span>
                                                {component.display_name ?? "Component"}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                Qty {component.quantity} · Sort{" "}
                                                {component.sort_order ?? "-"}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-4 border border-gray-100 text-theme-sm dark:border-white/[0.05]">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Badge size="sm" color="light">
                                                {component.inclusion_mode}
                                            </Badge>
{component.option_group ? (
                                                <Badge size="sm" color="info">
                                                    {component.option_group}
                                                </Badge>
                                            ) : null}
                                            {component.is_mandatory ? (
                                                <Badge size="sm" color="warning">
                                                    Mandatory
                                                </Badge>
                                            ) : null}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-4 border border-gray-100 text-theme-sm text-gray-700 dark:border-white/[0.05] dark:text-gray-300">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-medium text-gray-800 dark:text-white/90">
                                                {component.category_info?.name ?? "-"}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {component.category_info
                                                    ?.category_type_name ?? "-"}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-4 border border-gray-100 text-theme-sm text-gray-700 dark:border-white/[0.05] dark:text-gray-300">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-medium text-gray-800 dark:text-white/90">
                                                {component.category_info?.product_name ??
                                                    "-"}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {component.category_info?.product_code ??
                                                    "-"}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-4 border border-gray-100 text-theme-sm text-gray-700 dark:border-white/[0.05] dark:text-gray-300">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-medium text-gray-800 dark:text-white/90">
                                                {component.category_info
                                                    ?.supplier_name ?? "-"}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {component.category_info
                                                    ?.destination_name ?? "-"}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-4 border border-gray-100 text-theme-sm text-gray-700 dark:border-white/[0.05] dark:text-gray-300">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-medium text-gray-800 dark:text-white/90">
                                                {renderPricingValue(
                                                    component.price_estimate
                                                        ?.total_sell_price
                                                )}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {component.price_estimate
                                                    ?.confidence_level ??
                                                    component.price_handling}
                                            </span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
            </div>
        );
    };
    const infoContent = pkg ? (
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/40">
                <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
                    General
                </h4>
                <dl className="mt-4 space-y-3 text-sm">
                    <div className="flex justify-between gap-4">
                        <dt className="text-gray-500 dark:text-gray-400">Name</dt>
                        <dd className="font-medium text-gray-800 dark:text-white/90">
                            {pkg.name}
                        </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-gray-500 dark:text-gray-400">Code</dt>
                        <dd className="text-gray-800 dark:text-white/90">
                            {pkg.code}
                        </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-gray-500 dark:text-gray-400">
                            Status
                        </dt>
                        <dd>
                            <Badge size="sm" color={statusColor}>
                                {pkg.status}
                            </Badge>
                        </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-gray-500 dark:text-gray-400">
                            Highlight
                        </dt>
                        <dd className="text-gray-800 dark:text-white/90">
                            {pkg.highlight ? "Yes" : "No"}
                        </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-gray-500 dark:text-gray-400">
                            Brochure page
                        </dt>
                        <dd className="text-gray-800 dark:text-white/90">
                            {pkg.brochure_page ?? "-"}
                        </dd>
                    </div>
                </dl>
            </div>

       <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/40">
                <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
                    Validity
                </h4>
                <dl className="mt-4 space-y-3 text-sm">
                    <div className="flex justify-between gap-4">
                        <dt className="text-gray-500 dark:text-gray-400">
                            Valid from
                        </dt>
                        <dd className="text-gray-800 dark:text-white/90">
                            {formatDateValue(pkg.valid_from)}
                        </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-gray-500 dark:text-gray-400">
                            Valid to
                        </dt>
                        <dd className="text-gray-800 dark:text-white/90">
                            {formatDateValue(pkg.valid_to)}
                        </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-gray-500 dark:text-gray-400">
                            Min pax
                        </dt>
                        <dd className="text-gray-800 dark:text-white/90">
                            {pkg.min_pax ?? "-"}
                        </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-gray-500 dark:text-gray-400">
                            Max pax
                        </dt>
                        <dd className="text-gray-800 dark:text-white/90">
                            {pkg.max_pax ?? "-"}
                        </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-gray-500 dark:text-gray-400">
                            Published at
                        </dt>
                        <dd className="text-gray-800 dark:text-white/90">
                            {formatDateValue(pkg.published_at)}
                        </dd>
                    </div>
                </dl>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/40">
                <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
                    Description
                </h4>
                <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">
                    {pkg.description || "No description available."}
                </p>
                {pkg.tags && pkg.tags.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {pkg.tags.map((tag: string) => (
                            <Badge key={tag} size="sm" color="light">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                ) : null}
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/40">
                <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
                    Image
                </h4>
                <div className="mt-4">
                    {pkg.featured_image_url ? (
                        <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm dark:border-gray-800">
                            <img
                                src={pkg.featured_image_url}
                                alt={pkg.name}
                                className="h-48 w-full object-cover"
                            />
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            No image available.
                        </p>
                    )}
                </div>
            </div>
        </div>
    ) : null;

    const pricingContent = pkg ? (
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/40">
                <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
                    Pricing policy
                </h4>
                {pkg.pricing_policy ? (
                    <dl className="mt-4 space-y-3 text-sm">
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">
                                Mode
                            </dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {pkg.pricing_policy.pricing_mode}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">
                                Fixed price
                            </dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {pkg.pricing_policy.fixed_price ?? "-"}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">
                                Base margin %
                            </dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {pkg.pricing_policy.base_margin_pct ?? "-"}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">
                                Base margin
                            </dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {pkg.pricing_policy.base_margin_amount ?? "-"}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">
                                From price
                            </dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {pkg.pricing_policy.is_from_price
                                    ? "Yes"
                                    : "No"}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">
                                Notes Moulay
                            </dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {pkg.pricing_policy.notes ?? "-"}
                            </dd>
                        </div>
                    </dl>
                ) : (
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        No pricing policy available.
                    </p>
                )}
            </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/40">
                <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
                    Pricing summary
                </h4>
                {pkg.pricing_summary ? (
                    <dl className="mt-4 space-y-3 text-sm">
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Components</dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {pkg.pricing_summary.total_components ?? "-"}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Included</dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {pkg.pricing_summary.included_components ?? "-"}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Optional</dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {pkg.pricing_summary.optional_components ?? "-"}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Est. cost</dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {pkg.pricing_summary.total_estimated_cost ?? "-"}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Est. sell</dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {pkg.pricing_summary.total_estimated_sell ?? "-"}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Margin</dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {pkg.pricing_summary.total_estimated_margin ?? "-"}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Avg margin %</dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {pkg.pricing_summary.average_margin_percentage ?? "-"}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Confidence</dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {pkg.pricing_summary.confidence_level ?? "-"}
                            </dd>
                        </div>
                    </dl>
                ) : (
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        No pricing summary available.
                    </p>
                    )}
            </div>
        </div>
    ) : null;
    const destinationsContent = pkg ? (
        <div className="grid gap-6 lg:grid-cols-2">
            {(pkg.destinationsEnhanced ?? pkg.destinations ?? []).length > 0 ? (
                (pkg.destinationsEnhanced ?? pkg.destinations ?? []).map(
                    (
                        destination: PackageDestinationEnhanced | PackageDestination
                    ) => {
                        const isPrimary =
                            "is_primary" in destination && destination.is_primary;

                        return (
                            <div
                                key={destination.id}
                                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/40"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
                                        {destination.destination_name ??
                                            destination.destination_code}
                                    </h4>
                                    {isPrimary ? (
                                        <Badge size="sm" color="info">
                                            Primary
                                        </Badge>
                                    ) : null}
                                </div>
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    {destination.destination_country ?? "-"}
                                    {destination.destination_region
                                        ? ` · ${destination.destination_region}`
                                        : ""}
                                </p>
                            </div>
                        );
                    }
                )
            ) : (
                <div className="rounded-xl border border-dashed border-gray-200 p-6 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
                    No destinations available.
                </div>
         )}
        </div>
    ) : null;
    const metadataContent = pkg ? (
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/40">
                <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
                    Audit
                </h4>
                <dl className="mt-4 space-y-3 text-sm">
                    <div className="flex justify-between gap-4">
                        <dt className="text-gray-500 dark:text-gray-400">Created by</dt>
                        <dd className="text-gray-800 dark:text-white/90">
                            {formatUserLabel(pkg.created_by_user, pkg.created_by_name)}
                        </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-gray-500 dark:text-gray-400">Updated by</dt>
                        <dd className="text-gray-800 dark:text-white/90">
                            {formatUserLabel(pkg.updated_by_user, pkg.updated_by_name)}
                        </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-gray-500 dark:text-gray-400">Published by</dt>
                        <dd className="text-gray-800 dark:text-white/90">
                            {formatUserLabel(pkg.published_by_user, pkg.published_by_name)}
                        </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-gray-500 dark:text-gray-400">Created at</dt>
                        <dd className="text-gray-800 dark:text-white/90">
                            {formatDateValue(pkg.created_at)}
                        </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-gray-500 dark:text-gray-400">Updated at</dt>
                        <dd className="text-gray-800 dark:text-white/90">
                            {formatDateValue(pkg.updated_at)}
                        </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-gray-500 dark:text-gray-400">Published at</dt>
                        <dd className="text-gray-800 dark:text-white/90">
                            {formatDateValue(pkg.published_at)}
                        </dd>
                    </div>
                </dl>
            </div>
            <div
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/40">
                <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
                    Meta info
                </h4>
                {pkg.meta_info ? (
                    <dl className="mt-4 space-y-3 text-sm">
                        {Object.entries(pkg.meta_info).map(
                            ([key, value]) => (
                                <div
                                    key={key}
                                    className="flex justify-between gap-4"
                                >
                                    <dt className="text-gray-500 dark:text-gray-400">
                                        {key}
                                    </dt>
                                    <dd className="text-gray-800 dark:text-white/90">
                                        {String(value)}
                                    </dd>
                                </div>
                            )
                        )}
                    </dl>
                ) : (
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        No meta info available.
                    </p>
                )}
            </div>
        </div>
    ) : null;

    const tabContent: Record<TabItem["id"], React.ReactNode> = {
        info: infoContent,
        components: (
            <div className="rounded-xl border border-gray-200 dark:border-gray-800">
                {renderComponentsTable()}
            </div>
        ),
        pricing: pricingContent,
        destinations: destinationsContent,
        metadata: metadataContent,
    };

    return (
        <>
            <PageMeta title="Package Details" description="Package details overview" />
            <PageBreadcrumb pageTitle="Package Details" />
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        {pkg?.name ?? "Package Details"}
                    </h3>
                    <Link
                        to="/packages"
                        className="text-sm font-medium text-brand-500 hover:text-brand-600"
                    >
                        Back to packages
                    </Link>
                </div>

                {loading ? (
                    <div className="py-8 text-sm text-gray-500 dark:text-gray-400">
                        Loading package details...
                    </div>
                ) : null}

                {!loading && error ? (
                    <div className="py-8 text-sm text-error-500">{error}</div>
                ) : null}

                {!loading && !error && pkg ? (
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