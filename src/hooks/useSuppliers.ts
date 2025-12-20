import { useEffect, useState } from 'react';
import { supplierService } from '../services/supplier.service';
import SupplierDataTable from '../components/suppliers/SupplierDataTable';
import type { Supplier } from '../types/api.types';

export default function SuppliersListPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 10;

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const { data } = await supplierService.getSuppliers({
        skip: (page - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
        search,
      });
      setSuppliers(data.items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [page, search]);

  return (
    <SupplierDataTable
      suppliers={suppliers}
      loading={loading}
      search={search}
      onSearch={setSearch}
      page={page}
      onPageChange={setPage}
    />
  );
}
