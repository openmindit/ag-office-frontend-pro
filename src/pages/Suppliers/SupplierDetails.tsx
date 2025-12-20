import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import DataTableThree from "../../components/tables/DataTables/TableThree/DataTableThree";
import { supplierService } from "../../services/supplier.service";
import type { SupplierWithContacts } from "../../types/api.types";

interface TabItem {
  id: "info" | "contacts" | "products" | "files";
  label: string;
  count?: number;
}

const TabButton: React.FC<{
  tab: TabItem;
  isActive: boolean;
  onClick: () => void;
}> = ({ tab, isActive, onClick }) => (
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

export default function SupplierDetails() {
  const { supplierId } = useParams();
  const [supplier, setSupplier] = useState<SupplierWithContacts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabItem["id"]>("info");

  const contactsCount = supplier?.contacts?.length ?? 0;
  const productsCount = 0;
  const filesCount = 0;

  const tabs: TabItem[] = [
    { id: "info", label: "Info" },
    { id: "contacts", label: "Contacts list", count: contactsCount },
    { id: "products", label: "Products list", count: productsCount },
    { id: "files", label: "Files list", count: filesCount },
  ];
  useEffect(() => {
    const fetchSupplier = async () => {
      if (!supplierId) {
        setError("Supplier ID is missing.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const supplierData = await supplierService.getSupplierById(supplierId);
        setSupplier(supplierData);
      } catch (err) {
        setError("Unable to load supplier details.");
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [supplierId]);
  const tabContent = {
    info: supplier ? (
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/40">
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

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/40">
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

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/40">
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
      <div className="rounded-xl border border-gray-200 dark:border-gray-800">
        <DataTableThree />
      </div>
    ),
    products: (
      <div className="rounded-xl border border-gray-200 dark:border-gray-800">
        <DataTableThree />
      </div>
    ),
    files: (
      <div className="rounded-xl border border-gray-200 dark:border-gray-800">
        <DataTableThree />
      </div>
    ),
  };
  return (
    <>
      <PageMeta
        title="Supplier Details"
        description="Supplier details overview"
      />
      <PageBreadcrumb pageTitle="Supplier Details" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
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