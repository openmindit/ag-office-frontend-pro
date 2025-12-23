import { useEffect, useState } from "react";
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
const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const data = await supplierService.getSuppliers({
        skip: (page - 1) * pageSize,
        limit: pageSize,
        search,
      });
      setSuppliers(data.items);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [page, search, pageSize]);

  const handleSearchChange = (value: string) => {
    setPage(1);
    setSearch(value);
  };

  const handlePageSizeChange = (value: number) => {
    setPage(1);
    setPageSize(value);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
      <>
        <PageMeta
            title="React.js Suppliers List | TailAdmin - React.js Admin Dashboard Template"
            description="This is React.js Suppliers List page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
        />


        <div className="flex flex-wrap items-center justify-between gap-3 pb-6" x-data="{ pageName: `Data Tables`}">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90" x-text="pageName">Suppliers</h2>
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
                className="absolute left-0 top-full z-40 mt-2 w-full min-w-[200px] rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-[#1E2635]"
            >
              <ul className="flex flex-col gap-1">
                <li>
                  <DropdownItem
                      onItemClick={closeDropdown}
                      className="flex rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                  >
                    Add
                  </DropdownItem>
                </li>
                <li>
                  <DropdownItem
                      onItemClick={closeDropdown}
                      className="flex rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                  >
                    Delete
                  </DropdownItem>
                </li>
                <li>
                  <DropdownItem
                      onItemClick={closeDropdown}
                      className="flex rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                  >
                    Active
                  </DropdownItem>
                </li>
                <li>
                  <DropdownItem
                      onItemClick={closeDropdown}
                      className="flex rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
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
        />
      </>
  );
}