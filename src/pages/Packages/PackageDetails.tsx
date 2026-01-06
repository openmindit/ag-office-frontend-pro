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
                   {pkg.highlight ? (
                    <Badge size="sm" color="info">
                      Highlighted
                    </Badge>
                  ) : null}
                </div>

                <p className="text-gray-600 dark:text-gray-300">
                  {pkg.description || "No description available."}
                </p>
                {pkg.featured_image_url ? (
                  <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm dark:border-gray-800">
                    <img
                      src={pkg.featured_image_url}
                      alt={pkg.name}
                      className="h-48 w-full object-cover"
                    />
                  </div>
                ) : null}

                {pkg.tags && pkg.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {pkg.tags.map((tag) => (
                      <Badge key={tag} size="sm" color="gray">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : null}
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

                <div className="rounded-2xl border border-gray-100 p-4 dark:border-gray-800">
                  <h4 className="mb-3 text-sm font-semibold text-gray-800 dark:text-white/90">
                    Components
                  </h4>
                  {pkg.components && pkg.components.length > 0 ? (
                    <div className="space-y-3">
                      {pkg.components.map((component) => (
                        <div
                          key={component.id}
                          className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                                {component.display_name ?? "Component"}
                              </p>
                              <Badge size="xs" color="gray">
                                {component.inclusion_mode}
                              </Badge>
                              {component.option_group ? (
                                <Badge size="xs" color="info">
                                  {component.option_group}
                                </Badge>
                              ) : null}
                            </div>
                            {component.highlight ? (
                              <Badge size="xs" color="warning">
                                Highlight
                              </Badge>
                            ) : null}
                          </div>
                          <div className="mt-2 grid grid-cols-1 gap-2 text-xs text-gray-600 dark:text-gray-300 md:grid-cols-2">
                            <p>
                              Quantity: {component.quantity} (min {component.min_quantity}
                              {component.max_quantity ? ` / max ${component.max_quantity}` : ""})
                            </p>
                            <p>
                              Mandatory: {component.is_mandatory ? "Yes" : "No"} · Default:
                              {" "}
                              {component.is_default_selected ? "Selected" : "Not selected"}
                            </p>
                            <p>Price handling: {component.price_handling}</p>
                            <p>Sort order: {component.sort_order ?? "-"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No components configured.
                    </p>
                  )}
                </div>

                <div className="rounded-2xl border border-gray-100 p-4 dark:border-gray-800">
                  <h4 className="mb-3 text-sm font-semibold text-gray-800 dark:text-white/90">
                    Pricing policy
                  </h4>
                  {pkg.pricing_policy ? (
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div className="rounded-xl bg-gray-50 p-3 text-sm dark:bg-gray-800/50">
                        <p className="text-gray-500 dark:text-gray-400">Mode</p>
                        <p className="font-medium text-gray-800 dark:text-white/90">
                          {pkg.pricing_policy.pricing_mode}
                        </p>
                      </div>
                      <div className="rounded-xl bg-gray-50 p-3 text-sm dark:bg-gray-800/50">
                        <p className="text-gray-500 dark:text-gray-400">Fixed price</p>
                        <p className="font-medium text-gray-800 dark:text-white/90">
                          {pkg.pricing_policy.fixed_price ?? "-"}
                        </p>
                      </div>
                      <div className="rounded-xl bg-gray-50 p-3 text-sm dark:bg-gray-800/50">
                        <p className="text-gray-500 dark:text-gray-400">From price</p>
                        <p className="font-medium text-gray-800 dark:text-white/90">
                          {pkg.pricing_policy.is_from_price ? "Yes" : "No"}
                        </p>
                      </div>
                      <div className="rounded-xl bg-gray-50 p-3 text-sm dark:bg-gray-800/50">
                        <p className="text-gray-500 dark:text-gray-400">Notes</p>
                        <p className="font-medium text-gray-800 dark:text-white/90">
                          {pkg.pricing_policy.notes ?? "-"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No pricing policy available.
                    </p>
                  )}
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

                <div className="flex items-start justify-between gap-4">
                  <dt className="text-gray-500 dark:text-gray-400">Meta info</dt>
                  <dd className="text-right font-medium text-gray-800 dark:text-white/90">
                    {pkg.meta_info ? (
                      <div className="space-y-1 text-left">
                        {Object.entries(pkg.meta_info).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between gap-3">
                            <span className="text-gray-500 dark:text-gray-400">{key}</span>
                            <span>{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      "-"
                    )}
                  </dd>
                </div>

                <div>
                  <dt className="text-gray-500 dark:text-gray-400">Destinations</dt>
                  {pkg.destinations && pkg.destinations.length > 0 ? (
                    <ul className="mt-2 space-y-2 text-left">
                      {pkg.destinations.map((destination) => (
                        <li
                          key={destination.id}
                          className="rounded-lg bg-gray-50 p-3 text-xs dark:bg-gray-800/50"
                        >
                          <p className="font-semibold text-gray-800 dark:text-white/90">
                            {destination.destination_name ?? destination.destination_id}
                          </p>
                          <p className="text-gray-500 dark:text-gray-400">
                            {destination.destination_country ?? "Unknown country"}
                            {destination.destination_region
                              ? ` · ${destination.destination_region}`
                              : ""}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-500 dark:text-gray-400">No destinations.</p>
                  )}
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