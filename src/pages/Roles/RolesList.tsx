import { useEffect, useMemo, useState } from "react";
import RoleDataTable from "../../components/roles/RoleDataTable";
import { roleService } from "../../services/role.service";
import type { Role } from "../../types/api.types";

export default function RolesList() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const data = await roleService.getRoles();
      setRoles(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const filteredRoles = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) {
      return roles;
    }

    return roles.filter((role) => {
      const haystack = [role.name, role.code, role.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [roles, search]);

  const total = filteredRoles.length;

  const paginatedRoles = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRoles.slice(start, start + pageSize);
  }, [filteredRoles, page, pageSize]);

  const handleSearchChange = (value: string) => {
    setPage(1);
    setSearch(value);
  };

  const handlePageSizeChange = (value: number) => {
    setPage(1);
    setPageSize(value);
  };

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    if (page > totalPages) {
      setPage(1);
    }
  }, [page, pageSize, total]);

  return (
    <RoleDataTable
      roles={paginatedRoles}
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