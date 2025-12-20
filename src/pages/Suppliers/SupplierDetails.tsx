import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { supplierService } from "../../services/supplier.service";
import type { SupplierWithContacts } from "../../types/api.types";

export default function SupplierDetails() {
  const { supplierId } = useParams();
  const [supplier, setSupplier] = useState<SupplierWithContacts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        const { data } = await supplierService.getSupplierById(supplierId);
        setSupplier(data);
      } catch (err) {
        setError("Unable to load supplier details.");
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [supplierId]);

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
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
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
                  <dt className="text-gray-500 dark:text-gray-400">Postal code</dt>
                  <dd className="text-gray-800 dark:text-white/90">
                    {supplier.postal_code ?? "-"}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/40">
              <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
                Contacts
              </h4>
              <div className="mt-4 space-y-4">
                {supplier.contacts?.length ? (
                  supplier.contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="rounded-lg border border-gray-200 p-4 text-sm dark:border-gray-800"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-medium text-gray-800 dark:text-white/90">
                          {contact.first_name} {contact.last_name}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {contact.position ?? "Contact"}
                        </span>
                      </div>
                      <div className="mt-2 text-gray-600 dark:text-gray-400">
                        {contact.email ?? "-"}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {contact.phone ?? contact.mobile ?? "-"}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No contacts available.
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}