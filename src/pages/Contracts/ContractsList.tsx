import { useMemo, useState } from "react";
import ContractDataTable from "../../components/contracts/ContractDataTable";
import type { Contract } from "../../types/api.types";

const CONTRACTS_SEED: Contract[] = [
  {
    id: "contract-001",
    code: "CT-2024-001",
    name: "Corporate Travel 2024",
    supplier_name: "Atlas Voyages",
    start_date: "2024-01-01",
    end_date: "2024-12-31",
    is_active: true,
  },
  {
    id: "contract-002",
    code: "CT-2024-014",
    name: "Premium Hotels Paris",
    supplier_name: "Hotel Lumiere",
    start_date: "2024-03-15",
    end_date: "2025-03-14",
    is_active: true,
  },
  {
    id: "contract-003",
    code: "CT-2023-110",
    name: "Transport Intercity",
    supplier_name: "Nova Transport",
    start_date: "2023-06-01",
    end_date: "2024-05-31",
    is_active: false,
  },
];

export default function ContractsList() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredContracts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return CONTRACTS_SEED;
    }

    return CONTRACTS_SEED.filter((contract) =>
      [contract.name, contract.code, contract.supplier_name]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(normalizedSearch))
    );
  }, [search]);

  const paginatedContracts = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredContracts.slice(startIndex, endIndex);
  }, [filteredContracts, page, pageSize]);

  const handleSearchChange = (value: string) => {
    setPage(1);
    setSearch(value);
  };

  const handlePageSizeChange = (value: number) => {
    setPage(1);
    setPageSize(value);
  };

  return (
    <ContractDataTable
      contracts={paginatedContracts}
      loading={false}
      search={search}
      onSearch={handleSearchChange}
      page={page}
      pageSize={pageSize}
      onPageSizeChange={handlePageSizeChange}
      total={filteredContracts.length}
      onPageChange={setPage}
    />
  );
}