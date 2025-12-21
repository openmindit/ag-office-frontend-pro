import {useEffect, useState} from "react";
import {Link, useParams} from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import SupplierFilesTable from "../../components/suppliers/SupplierFilesTable";
import Badge from "../../components/ui/badge/Badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import {supplierService} from "../../services/supplier.service";
import {productService} from "../../services/product.service";
import {mediaService} from "../../services/media.service";

import type {
    SupplierProductWithRelations,
    SupplierWithContacts,
    Media,
} from "../../types/api.types";

interface TabItem {
    id: "info" | "contacts" | "products" | "files";
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
            <span
                className="inline-block items-center justify-center rounded-full bg-brand-50 px-2 py-0.5 text-center text-xs font-medium text-brand-500 dark:bg-brand-500/15 dark:text-brand-400">
        {tab.count}
      </span>
        ) : null}
    </button>
);

export default function SupplierDetails() {
    const {supplierId} = useParams();
    const [supplier, setSupplier] = useState<SupplierWithContacts | null>(null);
    const [mediaFiles, setMediaFiles] = useState<Media[]>([]);
    const [products, setProducts] = useState<SupplierProductWithRelations[]>([]);
    const [loading, setLoading] = useState(true);
    const [filesLoading, setFilesLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [productsLoading, setProductsLoading] = useState(false);
    const [productsError, setProductsError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabItem["id"]>("info");
    const [filesError, setFilesError] = useState<string | null>(null);

    const contactsCount = supplier?.contacts?.length ?? 0;
    const productsCount = products.length;
    const filesCount = mediaFiles.length;

    const tabs: TabItem[] = [
        {id: "info", label: "Info"},
        {id: "contacts", label: "Contacts list", count: contactsCount},
        {id: "products", label: "Products list", count: productsCount},
        {id: "files", label: "Files list", count: filesCount},
    ];
    useEffect(() => {
        const fetchSupplier = async () => {
            if (!supplierId) {
                setError("Supplier ID is missing.");
                setLoading(false);
                setFilesError("Supplier ID is missing.");
                setFilesLoading(false);
                return;
            }

            setLoading(true);
            setFilesLoading(true);
            setError(null);
            setFilesError(null);
            try {
                const supplierData = await supplierService.getSupplierById(supplierId);
                setSupplier(supplierData);
            } catch (err) {
                setError("Unable to load supplier details.");
                const [supplierResult, mediaResult] = await Promise.allSettled([
                    supplierService.getSupplierById(supplierId),
                    mediaService.getSupplierMedia(supplierId),
                ]);

                if (supplierResult.status === "fulfilled") {
                    setSupplier(supplierResult.value);
                } else {
                    setError("Unable to load supplier details.");
                }

                if (mediaResult.status === "fulfilled") {
                    setMediaFiles(mediaResult.value);
                } else {
                    setFilesError("Unable to load supplier files.");
                }
            } finally {
                setLoading(false);
                setFilesLoading(false);
            }
        };

        fetchSupplier();
    }, [supplierId]);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!supplierId) {
                setProductsError("Supplier ID is missing.");
                setProducts([]);
                return;
            }

            setProductsLoading(true);
            setProductsError(null);
            try {
                const productsData = await productService.getProductsBySupplier(
                    supplierId
                );
                setProducts(productsData);
            } catch (err) {
                setProductsError("Unable to load supplier products.");
                setProducts([]);
            } finally {
                setProductsLoading(false);
            }
        };

        fetchProducts();
    }, [supplierId]);

    const renderProductsTable = () => {
        if (productsLoading) {
            return (
                <div className="py-8 text-sm text-gray-500 dark:text-gray-400">
                    Loading products...
                </div>
            );
        }

        if (productsError) {
            return <div className="py-8 text-sm text-error-500">{productsError}</div>;
        }

        if (!products.length) {
            return (
                <div className="py-8 text-sm text-gray-500 dark:text-gray-400">
                    No products found for this supplier.
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
                                Code
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-4 py-3 border border-gray-100 text-left text-theme-xs font-medium text-gray-700 dark:border-white/[0.05] dark:text-gray-400"
                            >
                                Name
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-4 py-3 border border-gray-100 text-left text-theme-xs font-medium text-gray-700 dark:border-white/[0.05] dark:text-gray-400"
                            >
                                Type
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-4 py-3 border border-gray-100 text-left text-theme-xs font-medium text-gray-700 dark:border-white/[0.05] dark:text-gray-400"
                            >
                                Destination
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
                                Created
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => {
                            const destinationParts = [
                                product.destination?.city,
                                product.destination?.country,
                            ].filter(Boolean);
                            const destinationLabel =
                                destinationParts.join(", ") ||
                                product.destination?.code ||
                                "-";

                            return (
                                <TableRow key={product.id}>
                                    <TableCell
                                        className="px-4 py-4 border border-gray-100 text-theme-sm font-medium text-gray-800 dark:border-white/[0.05] dark:text-white/90">
                                        {product.code}
                                    </TableCell>
                                    <TableCell
                                        className="px-4 py-4 border border-gray-100 text-theme-sm text-gray-700 dark:border-white/[0.05] dark:text-gray-300">
                                        <div className="flex flex-col gap-1">
                      <span className="font-medium text-gray-800 dark:text-white/90">
                        {product.name}
                      </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                        {product.description ?? "No description"}
                      </span>
                                        </div>
                                    </TableCell>
                                    <TableCell
                                        className="px-4 py-4 border border-gray-100 text-theme-sm text-gray-700 dark:border-white/[0.05] dark:text-gray-300">
                                        <div className="flex items-center gap-2">
                                            {product.product_type?.icon ? (
                                                <span>{product.product_type.icon}</span>
                                            ) : null}
                                            <span>{product.product_type?.name ?? "-"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell
                                        className="px-4 py-4 border border-gray-100 text-theme-sm text-gray-700 dark:border-white/[0.05] dark:text-gray-300">
                                        {destinationLabel}
                                    </TableCell>
                                    <TableCell
                                        className="px-4 py-4 border border-gray-100 text-theme-sm dark:border-white/[0.05]">
                                        <Badge
                                            size="sm"
                                            color={product.is_active ? "success" : "error"}
                                        >
                                            {product.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell
                                        className="px-4 py-4 border border-gray-100 text-theme-sm text-gray-700 dark:border-white/[0.05] dark:text-gray-300">
                                        {new Date(product.created_at).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        );
    };
    const tabContent = {
        info: supplier ? (
            <div className="grid gap-6 lg:grid-cols-2">
                <div
                    className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/40">
                    <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
                        General
                    </h4>
                    <dl className="mt-4 space-y-3 text-sm">
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Name</dt>
                            <dd className="font-medium text-gray-800 dark:text-white/90">
                                {supplier.name}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Code</dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {supplier.code}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Brand</dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {supplier.brand_name ?? "-"}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Status</dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {supplier.is_active ? "Active" : "Inactive"}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Created</dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {new Date(supplier.created_at).toLocaleDateString()}
                            </dd>
                        </div>
                    </dl>
                </div>

                <div
                    className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/40">
                    <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
                        Contact
                    </h4>
                    <dl className="mt-4 space-y-3 text-sm">
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Email</dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {supplier.email ?? "-"}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Phone</dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {supplier.phone ?? "-"}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Website</dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {supplier.website ?? "-"}
                            </dd>
                        </div>
                    </dl>
                </div>

                <div
                    className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/40">
                    <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
                        Address
                    </h4>
                    <dl className="mt-4 space-y-3 text-sm">
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Country</dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {supplier.country ?? "-"}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">City</dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {supplier.city ?? "-"}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">Address</dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {supplier.address ?? "-"}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500 dark:text-gray-400">
                                Postal code
                            </dt>
                            <dd className="text-gray-800 dark:text-white/90">
                                {supplier.postal_code ?? "-"}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        ) : null,
        contacts: (
            <div className="grid gap-6 lg:grid-cols-2">
                {supplier?.contacts?.length ? (
                    supplier.contacts.map((contact) => (
                        <div
                            key={contact.id}
                            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/40"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
                                        {contact.first_name} {contact.last_name}
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {contact.position ?? "-"}
                                    </p>
                                </div>
                                <span
                                    className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-500 dark:bg-brand-500/15 dark:text-brand-400">
                  {contact.is_primary ? "Primary" : "Secondary"}
                </span>
                            </div>
                            <dl className="mt-4 space-y-3 text-sm">
                                <div className="flex justify-between gap-4">
                                    <dt className="text-gray-500 dark:text-gray-400">
                                        Department
                                    </dt>
                                    <dd className="text-gray-800 dark:text-white/90">
                                        {contact.department ?? "-"}
                                    </dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <dt className="text-gray-500 dark:text-gray-400">Phone</dt>
                                    <dd className="text-gray-800 dark:text-white/90">
                                        {contact.phone ?? "-"}
                                    </dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <dt className="text-gray-500 dark:text-gray-400">Mobile</dt>
                                    <dd className="text-gray-800 dark:text-white/90">
                                        {contact.mobile ?? "-"}
                                    </dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <dt className="text-gray-500 dark:text-gray-400">Email</dt>
                                    <dd className="text-gray-800 dark:text-white/90">
                                        {contact.email ?? "-"}
                                    </dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <dt className="text-gray-500 dark:text-gray-400">Notes</dt>
                                    <dd className="text-gray-800 dark:text-white/90">
                                        {contact.notes ?? "-"}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    ))
                ) : (
                    <div
                        className="rounded-xl border border-dashed border-gray-200 p-6 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
                        No contacts available.
                    </div>
                )}
            </div>
        ),
        products: (
            <div className="rounded-xl border border-gray-200 dark:border-gray-800">
                {renderProductsTable()}
            </div>
        ),
        files: (
            <div className="rounded-xl border border-gray-200 dark:border-gray-800">
                <SupplierFilesTable
                    files={mediaFiles}
                    isLoading={filesLoading}
                    error={filesError}
                />
            </div>
        ),
    };
    return (
        <>
            <PageMeta
                title="Supplier Details"
                description="Supplier details overview"
            />
            <PageBreadcrumb pageTitle="Supplier Details"/>
            <div
                className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Supplier Details
                    </h3>
                    <Link
                        to="/suppliers"
                        className="text-sm font-medium text-brand-500 hover:text-brand-600"
                    >
                        Back to suppliers
                    </Link>
                </div>

                {loading ? (
                    <div className="py-8 text-sm text-gray-500 dark:text-gray-400">
                        Loading supplier details...
                    </div>
                ) : null}

                {!loading && error ? (
                    <div className="py-8 text-sm text-error-500">{error}</div>
                ) : null}

                {!loading && !error && supplier ? (
                    <div className="mt-6 rounded-xl border border-gray-200 p-6 dark:border-gray-800">
                        <div className="border-b border-gray-200 dark:border-gray-800">
                            <nav
                                className="-mb-px flex space-x-2 overflow-x-auto [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 dark:[&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:h-1.5">
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