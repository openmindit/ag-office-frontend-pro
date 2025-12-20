import { useEffect, useState } from "react";
import { supplierService } from "../../services/supplier.service";
import SupplierDataTable from "../../components/suppliers/SupplierDataTable";
import type { Supplier } from "../../types/api.types";

export default function SuppliersList() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const { data } = await supplierService.getSuppliers({
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

  return (
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
  );
}