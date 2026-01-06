import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import { packageService } from "../../services/package.service";
import type { Package } from "../../types/api.types";

const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  return date.toLocaleDateString();
};

export default function PackageDetails() {
  const { packageId } = useParams();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        const result = await packageService.getPackageById(packageId);
        if (isMounted) {
          setPkg(result);
        }
      } catch {
        if (isMounted) {
          setError("Unable to load package details.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPackage();

    return () => {
      isMounted = false;
    };
  }, [packageId]);

  const statusColor = useMemo(() => {
    if (pkg?.status === "PUBLISHED") return "success" as const;
    if (pkg?.status === "DRAFT") return "warning" as const;
    return "light" as const;
  }, [pkg?.status]);

  return (
    <>
      <PageMeta title="Packages | AG Office" description="Package details" />
      <PageBreadCrumb
        pageTitle="Package details"
        routes={[
          { path: "/packages", breadcrumbName: "Packages" },
          { breadcrumbName: pkg?.name ?? "Details" },
        ]}
      />

      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            {pkg?.name ?? "Package details"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            View package status, validity and metadata.
          </p>
        </div>
        <Link
          to="/packages"
          className="text-sm font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400"
        >
          Back to list
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
            {loading ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loading package...
              </p>
            ) : error ? (
              <p className="text-sm text-error-500">{error}</p>
            ) : pkg ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    {pkg.name}
                  </h3>
                  <Badge size="sm" color={statusColor}>
                    {pkg.status}
                  </Badge>
                </div>

                <p className="text-gray-600 dark:text-gray-300">
                  {pkg.description || "No description available."}
                </p>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Code
                    </p>
                    <p className="text-base font-medium text-gray-800 dark:text-white/90">
                      {pkg.code}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Validity
                    </p>
                    <p className="text-base font-medium text-gray-800 dark:text-white/90">
                      {formatDate(pkg.valid_from)} - {formatDate(pkg.valid_to)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Pax limits
                    </p>
                    <p className="text-base font-medium text-gray-800 dark:text-white/90">
                      {pkg.min_pax ?? "-"} - {pkg.max_pax ?? "-"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Published at
                    </p>
                    <p className="text-base font-medium text-gray-800 dark:text-white/90">
                      {formatDate(pkg.published_at)}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
            <h4 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">
              Metadata
            </h4>
            {loading ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loading metadata...
              </p>
            ) : error ? (
              <p className="text-sm text-error-500">{error}</p>
            ) : pkg ? (
              <dl className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-gray-500 dark:text-gray-400">Created by</dt>
                  <dd className="font-medium text-gray-800 dark:text-white/90">
                    {pkg.created_by ?? "-"}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-gray-500 dark:text-gray-400">Updated by</dt>
                  <dd className="font-medium text-gray-800 dark:text-white/90">
                    {pkg.updated_by ?? "-"}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-gray-500 dark:text-gray-400">Created at</dt>
                  <dd className="font-medium text-gray-800 dark:text-white/90">
                    {formatDate(pkg.created_at)}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-gray-500 dark:text-gray-400">Updated at</dt>
                  <dd className="font-medium text-gray-800 dark:text-white/90">
                    {formatDate(pkg.updated_at)}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No metadata available.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}