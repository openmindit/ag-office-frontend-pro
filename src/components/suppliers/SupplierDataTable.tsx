import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { PencilIcon, TrashBinIcon } from "../../icons";
import Checkbox from "../form/input/Checkbox";
import Badge from "../ui/badge/Badge";
import Pagination from "../tables/DataTables/TableThree/Pagination";
import Button from "../ui/button/Button";
import type { Supplier } from "../../types/api.types";

type SupplierDataTableProps = {
  suppliers: Supplier[];
  loading: boolean;
  search: string;
  onSearch: (value: string) => void;
  page: number;
  pageSize: number;
  onPageSizeChange: (value: number) => void;
  total: number;
  onPageChange: (page: number) => void;
  country: string;
  onCountryChange: (value: string) => void;
  statusFilters: {
    active: boolean;
    inactive: boolean;
  };
  onStatusFilterChange: (
    status: "active" | "inactive",
    checked: boolean
  ) => void;
  onResetFilters: () => void;
};

export default function SupplierDataTable({
  suppliers,
  loading,
  search,
  onSearch,
  page,
  pageSize,
  onPageSizeChange,
  country,
  onCountryChange,
  statusFilters,
  onStatusFilterChange,
  onResetFilters,
  total,
  onPageChange,
}: SupplierDataTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const startIndex = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, total);

  const handlePageChange = (nextPage: number) => {
    if (nextPage >= 1 && nextPage <= totalPages) {
      onPageChange(nextPage);
    }
  };

  const handleRowsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const newRowsPerPage = Number(e.target.value);
    onPageSizeChange(newRowsPerPage);
  };
  const allSelected =
    suppliers.length > 0 &&
    suppliers.every((supplier) => selectedIds.has(supplier.id));

  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(suppliers.map((supplier) => supplier.id)));
      return;
    }
    setSelectedIds(new Set());
  };

  const handleToggleRow = (supplierId: string) => (checked: boolean) => {
    setSelectedIds((prevSelected) => {
      const nextSelected = new Set(prevSelected);
      if (checked) {
        nextSelected.add(supplierId);
      } else {
        nextSelected.delete(supplierId);
      }
      return nextSelected;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilter(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <div className="overflow-hidden rounded-xl bg-white dark:bg-white/[0.03]">
      <div className="flex flex-col gap-2 border border-b-0 border-gray-100 px-4 py-4 dark:border-white/[0.05] rounded-t-xl sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-gray-500 dark:text-gray-400"> Show </span>
          <div className="relative z-20 bg-transparent">
            <select
              className="h-9 w-full appearance-none rounded-lg border border-gray-300 bg-transparent py-2 pl-3 pr-8 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              value={pageSize}
              onChange={handleRowsPerPageChange}
            >
              <option
                value="20"
                className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
              >
                20
              </option>
              <option
                value="10"
                className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
              >
                10
              </option>
              <option
                value="5"
                className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
              >
                5
              </option>
            </select>
            <span className="absolute z-30 text-gray-500 -translate-y-1/2 right-2 top-1/2 dark:text-gray-400">
              <svg
                className="stroke-current"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165"
                  stroke=""
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
          <span className="text-gray-500 dark:text-gray-400"> entries </span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <button className="absolute text-gray-500 -translate-y-1/2 left-4 top-1/2 dark:text-gray-400">
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.04199 9.37363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z"
                  fill=""
                />
              </svg>
            </button>

            <input
              type="text"
              placeholder="Search suppliers..."
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-11 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[300px]"
            />
          </div>
          <div className="relative" ref={filterRef}>
            <button
              className="shadow-theme-xs flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 sm:w-auto sm:min-w-[100px] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
              onClick={() => setShowFilter((prev) => !prev)}
              type="button"
            >
                <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M14.6537 5.90414C14.6537 4.48433 13.5027 3.33331 12.0829 3.33331C10.6631 3.33331 9.51206 4.48433 9.51204 5.90415M14.6537 5.90414C14.6537 7.32398 13.5027 8.47498 12.0829 8.47498C10.663 8.47498 9.51204 7.32398 9.51204 5.90415M14.6537 5.90414L17.7087 5.90411M9.51204 5.90415L2.29199 5.90411M5.34694 14.0958C5.34694 12.676 6.49794 11.525 7.91777 11.525C9.33761 11.525 10.4886 12.676 10.4886 14.0958M5.34694 14.0958C5.34694 15.5156 6.49794 16.6666 7.91778 16.6666C9.33761 16.6666 10.4886 15.5156 10.4886 14.0958M5.34694 14.0958L2.29199 14.0958M10.4886 14.0958L17.7087 14.0958"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Filter
            </button>

            {showFilter && (
              <div className="absolute right-0 z-10 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-5">
                  <p className="mb-2 text-xs font-medium text-gray-700 dark:text-gray-300">Status</p>
                  <div className="flex flex-col gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700"
                        checked={statusFilters.active}
                        onChange={(event) =>
                          onStatusFilterChange("active", event.target.checked)
                        }
                      />
                      Active
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700"
                        checked={statusFilters.inactive}
                        onChange={(event) =>
                          onStatusFilterChange("inactive", event.target.checked)
                        }
                      />
                      Inactive
                    </label>
                  </div>
                </div>
                <div className="mb-5">
                  <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Location
                  </label>
                  <input
                    type="text"
                    className="shadow-theme-xs h-10 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    placeholder="Search location..."
                    value={country}
                    onChange={(event) => onCountryChange(event.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    className="w-full"
                    onClick={() => setShowFilter(false)}
                    size="sm"
                  >
                    Apply
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      onResetFilters();
                      setShowFilter(false);
                    }}
                    size="sm"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell
                  isHeader
                  className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      <Checkbox checked={allSelected} onChange={handleToggleAll} />
                      <span className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                        Supplier
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                >
                  <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                    Contact
                  </p>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                >
                  <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                    Location
                  </p>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                >
                  <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                    Status
                  </p>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
                >
                  <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                    Action
                  </p>
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && suppliers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    Loading suppliers...
                  </TableCell>
                </TableRow>
              ) : null}
              {!loading && suppliers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No suppliers found.
                  </TableCell>
                </TableRow>
              ) : null}
              {suppliers.map((supplier) => {
                const isSelected = selectedIds.has(supplier.id);

                return (
                  <TableRow
                    key={supplier.id}
                    className={
                      isSelected
                        ? "bg-brand-50/60 dark:bg-brand-500/10"
                        : undefined
                    }
                  >
                  <TableCell className="px-4 py-4 border border-gray-100 dark:border-white/[0.05] dark:text-white/90 whitespace-nowrap">
                    <div className="flex gap-3">
                      <div className="mt-1">
                        <Checkbox
                          checked={isSelected}
                          onChange={handleToggleRow(supplier.id)}
                        />
                      </div>
                      <div>
                        <Link
                          to={`/suppliers/${supplier.id}`}
                          className="block font-medium text-gray-800 text-theme-sm hover:text-brand-500 dark:text-white/90 dark:hover:text-brand-400"
                        >
                          {supplier.name}
                        </Link>
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                          {supplier.code}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-gray-400 whitespace-nowrap">
                    <div>
                      <p>{supplier.email ?? "-"}</p>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {supplier.phone ?? "-"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap">
                    <div>
                      <p>{supplier.country ?? "-"}</p>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {supplier.city ?? "-"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap">
                    <Badge size="sm" color={supplier.is_active ? "success" : "error"}>
                      {supplier.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap">
                    <div className="flex items-center w-full gap-2">
                      <button className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500">
                        <TrashBinIcon className="size-5" />
                      </button>
                      <button className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90">
                        <PencilIcon className="size-5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="border border-t-0 rounded-b-xl border-gray-100 py-4 pl-[18px] pr-4 dark:border-white/[0.05]">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
          <div className="pb-3 xl:pb-0">
            <p className="pb-3 text-sm font-medium text-center text-gray-500 border-b border-gray-100 dark:border-gray-800 dark:text-gray-400 xl:border-b-0 xl:pb-0 xl:text-left">
              Showing {startIndex} to {endIndex} of {total} entries
            </p>
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}