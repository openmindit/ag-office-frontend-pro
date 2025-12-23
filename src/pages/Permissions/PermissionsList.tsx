import { useEffect, useMemo, useState } from "react";
import PermissionDataTable from "../../components/permissions/PermissionDataTable";
import { permissionService } from "../../services/permission.service";
import type { Permission } from "../../types/api.types";

export default function PermissionsList() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const data = await permissionService.getPermissions();
      setPermissions(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const filteredPermissions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) {
      return permissions;
    }

    return permissions.filter((permission) => {
      const haystack = [
        permission.resource,
        permission.action,
        permission.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [permissions, search]);

  const total = filteredPermissions.length;

  const paginatedPermissions = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredPermissions.slice(start, start + pageSize);
  }, [filteredPermissions, page, pageSize]);

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
    <PermissionDataTable
      permissions={paginatedPermissions}
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