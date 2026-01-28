import { useCallback, useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { supplierService } from "../../services/supplier.service";
import SupplierDataTable from "../../components/suppliers/SupplierDataTable";
import type { Supplier } from "../../types/api.types";
import { Dropdown } from "../../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../../components/ui/dropdown/DropdownItem";

export default function SuppliersList() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [country, setCountry] = useState("");
  const [statusFilters, setStatusFilters] = useState({
    active: true,
    inactive: true,
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);
  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      const isActiveFilter =
        statusFilters.active === statusFilters.inactive
          ? undefined
          : statusFilters.active;

      const data = await supplierService.getSuppliers({
        skip: (page - 1) * pageSize,
        limit: pageSize,
        search,
         country: country || undefined,
        is_active: isActiveFilter,
      });
      setSuppliers(data.items);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, [country, page, pageSize, search, statusFilters]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handleSearchChange = (value: string) => {
    setPage(1);
    setSearch(value);
  };

  const handlePageSizeChange = (value: number) => {
    setPage(1);
    setPageSize(value);
  };

  const handleCountryChange = (value: string) => {
    setPage(1);
    setCountry(value);
  };

  const handleStatusFilterChange = (
    key: "active" | "inactive",
    checked: boolean
  ) => {
    setPage(1);
    setStatusFilters((prev) => ({ ...prev, [key]: checked }));
  };

  const handleResetFilters = () => {
    setPage(1);
    setStatusFilters({ active: true, inactive: true });
    setCountry("");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };
  const hasSelection = selectedCount > 0;
  const selectionItemClasses = hasSelection
    ? ""
    : "cursor-not-allowed text-gray-400 hover:bg-transparent dark:text-gray-500";
  return (
      <>
      <PageMeta
        title="React.js Suppliers List | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Suppliers List page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />

        <div
        className="flex flex-wrap items-center justify-between gap-3 pb-6"
        x-data="{ pageName: `Data Tables` }"
      >
        <h2
          className="text-xl font-semibold text-gray-800 dark:text-white/90"
          x-text="pageName"
        >
          Suppliers
        </h2>
        <div className="relative inline-block">
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 rounded-lg dropdown-toggle bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Actions
            <svg
              className={`duration-200 ease-in-out stroke-current ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.79199 7.396L10.0003 12.6043L15.2087 7.396"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

            <Dropdown
            isOpen={isDropdownOpen}
            onClose={closeDropdown}
            className="absolute right-0 top-full z-40 mt-2 w-full min-w-[200px] rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-[#1E2635]"
          >
            <ul className="flex flex-col gap-1">
              <li>
                <DropdownItem
                  onItemClick={hasSelection ? closeDropdown : undefined}
                  disabled={!hasSelection}
                  className={`flex rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 ${selectionItemClasses}`}
                >
                  Add
                </DropdownItem>
              </li>
              <li>
                <DropdownItem
                  onItemClick={hasSelection ? closeDropdown : undefined}
                  disabled={!hasSelection}
                  className={`flex rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 ${selectionItemClasses}`}
                >
                  Delete
                </DropdownItem>
              </li>
              <li>
                <DropdownItem
                  onItemClick={hasSelection ? closeDropdown : undefined}
                  disabled={!hasSelection}
                  className={`flex rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 ${selectionItemClasses}`}
                >
                  Active
                </DropdownItem>
              </li>
              <li>
                <DropdownItem
                  onItemClick={hasSelection ? closeDropdown : undefined}
                  disabled={!hasSelection}
                  className={`flex rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 ${selectionItemClasses}`}
                >
                  Desactive
                </DropdownItem>
              </li>
            </ul>
          </Dropdown>
        </div>
      </div>
      <SupplierDataTable
        suppliers={suppliers}
        loading={loading}
        search={search}
        onSearch={handleSearchChange}
        page={page}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        total={total}
        onPageChange={setPage}
        country={country}
        onCountryChange={handleCountryChange}
        statusFilters={statusFilters}
        onStatusFilterChange={handleStatusFilterChange}
        onResetFilters={handleResetFilters}
      />
    </>
  );
}