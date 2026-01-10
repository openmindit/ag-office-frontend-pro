import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
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
import { productService } from "../../services/product.service";
import type {
  Destination,
  ProductCategory,
  ProductWithRelations,
} from "../../types/api.types";

interface TabItem {
  id: "info" | "services";
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

const formatDateValue = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString() : "-";

const buildDestinationLabel = (destination?: Destination) => {
  if (!destination) {
    return "-";
  }
  return (
    destination.city ||
    destination.region ||
    destination.country ||
    destination.code ||
    "-"
  );
};

const formatSpecificationValue = (value: unknown) => {
  if (value === null || value === undefined) {
    return "-";
  }
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
};

export default function ProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState<ProductWithRelations | null>(null);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabItem["id"]>("info");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError("Product ID is missing.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await productService.getProductById(productId);
        setProduct(result);
      } catch (fetchError) {
        setProduct(null);
        setError("Unable to load product details.");
      } finally {
        setLoading(false);
      }
    };

    void fetchProduct();
  }, [productId]);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!productId) {
        setCategoriesError("Product ID is missing.");
        setCategories([]);
        return;
      }

      setCategoriesLoading(true);
      setCategoriesError(null);

      try {
        const categoriesResult = await productService.getProductCategories(
          productId,
          true
        );
        setCategories(categoriesResult);
      } catch (fetchError) {
        setCategories([]);
        setCategoriesError("Unable to load service information.");
      } finally {
        setCategoriesLoading(false);
      }
    };

    void fetchCategories();
  }, [productId]);

  const serviceCount = categories.length;

  const tabs: TabItem[] = useMemo(
    () => [
      { id: "info", label: "Info" },
      { id: "services", label: "Services", count: serviceCount },
    ],
    [serviceCount]
  );

  const renderInfoContent = () => {
    if (loading) {
      return (
        <div className="py-8 text-sm text-gray-500 dark:text-gray-400">
          Loading product details...
        </div>
      );
    }

    if (error) {
      return <div className="py-8 text-sm text-error-500">{error}</div>;
    }

    if (!product) {
      return (
        <div className="py-8 text-sm text-gray-500 dark:text-gray-400">
          No product details available.
        </div>
      );
    }

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/40">
          <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
            General
          </h4>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500 dark:text-gray-400">Name</dt>
              <dd className="font-medium text-gray-800 dark:text-white/90">
                {product.name}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500 dark:text-gray-400">Code</dt>
              <dd className="text-gray-800 dark:text-white/90">
                {product.code}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500 dark:text-gray-400">Status</dt>
              <dd className="text-gray-800 dark:text-white/90">
                {product.is_active ? "Active" : "Inactive"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500 dark:text-gray-400">Created</dt>
              <dd className="text-gray-800 dark:text-white/90">
                {formatDateValue(product.created_at)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500 dark:text-gray-400">Updated</dt>
              <dd className="text-gray-800 dark:text-white/90">
                {formatDateValue(product.updated_at)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/40">
          <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Details
          </h4>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500 dark:text-gray-400">Type</dt>
              <dd className="text-gray-800 dark:text-white/90">
                {product.product_type?.name || product.product_type?.code || "-"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500 dark:text-gray-400">Destination</dt>
              <dd className="text-gray-800 dark:text-white/90">
                {buildDestinationLabel(product.destination)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500 dark:text-gray-400">Supplier</dt>
              <dd className="text-gray-800 dark:text-white/90">
                {product.supplier?.name || product.supplier?.code || "-"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500 dark:text-gray-400">Description</dt>
              <dd className="text-gray-800 dark:text-white/90">
                {product.description || "-"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    );
  };

  const renderServicesContent = () => {
    if (categoriesLoading) {
      return (
        <div className="py-8 text-sm text-gray-500 dark:text-gray-400">
          Loading service information...
        </div>
      );
    }

    if (categoriesError) {
      return (
        <div className="py-8 text-sm text-error-500">{categoriesError}</div>
      );
    }

    if (!categories.length) {
      return (
        <div className="py-8 text-sm text-gray-500 dark:text-gray-400">
          No service information available.
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
                Service
              </TableCell>
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
                Category
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 border border-gray-100 text-left text-theme-xs font-medium text-gray-700 dark:border-white/[0.05] dark:text-gray-400"
              >
                Capacity
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
                Specifications
              </TableCell>
              <TableCell
                isHeader
                className="px-4 py-3 border border-gray-100 text-left text-theme-xs font-medium text-gray-700 dark:border-white/[0.05] dark:text-gray-400"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="px-4 py-4 border border-gray-100 text-theme-sm text-gray-700 dark:border-white/[0.05] dark:text-gray-300">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-gray-800 dark:text-white/90">
                      {category.name}
                    </span>
                    {category.description ? (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {category.description}
                      </span>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-4 border border-gray-100 text-theme-sm font-medium text-gray-800 dark:border-white/[0.05] dark:text-white/90">
                  {category.code}
                </TableCell>
                <TableCell className="px-4 py-4 border border-gray-100 text-theme-sm text-gray-700 dark:border-white/[0.05] dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    {category.category_type?.icon ? (
                      <span>{category.category_type.icon}</span>
                    ) : null}
                    <span>{category.category_type?.name ?? "-"}</span>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-4 border border-gray-100 text-theme-sm text-gray-700 dark:border-white/[0.05] dark:text-gray-300">
                  {category.capacity ?? "-"}
                </TableCell>
                <TableCell className="px-4 py-4 border border-gray-100 text-theme-sm text-gray-700 dark:border-white/[0.05] dark:text-gray-300">
                  {category.unit ?? "-"}
                </TableCell>
                <TableCell className="px-4 py-4 border border-gray-100 text-theme-sm text-gray-700 dark:border-white/[0.05] dark:text-gray-300">
                  {category.specifications &&
                  Object.keys(category.specifications).length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(category.specifications).map(
                        ([key, value]) => (
                          <Badge key={key} size="sm" color="light">
                            {key}: {formatSpecificationValue(value)}
                          </Badge>
                        )
                      )}
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="px-4 py-4 border border-gray-100 text-theme-sm dark:border-white/[0.05]">
                  <Badge size="sm" color={category.is_active ? "success" : "error"}>
                    {category.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const tabContent = {
    info: renderInfoContent(),
    services: renderServicesContent(),
  };

  return (
    <>
      <PageMeta
        title="Product Details"
        description="Product details overview"
      />
      <PageBreadcrumb pageTitle="Product Details" />

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <Link
                to="/products"
                className="text-brand-500 hover:text-brand-600"
              >
                Products
              </Link>
              <span className="px-2">/</span>
              <span className="text-gray-700 dark:text-gray-300">
                {product?.name ?? productId ?? "Product"}
              </span>
            </p>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
              {product?.name ?? "Product Details"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {product ? (
              <Badge color={product.is_active ? "success" : "error"} size="sm">
                {product.is_active ? "Active" : "Inactive"}
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/40">
          <div className="border-b border-gray-100 dark:border-white/[0.05]">
            <nav className="flex flex-wrap gap-4">
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
          <div className="pt-6">{tabContent[activeTab]}</div>
        </div>
      </div>
    </>
  );
}