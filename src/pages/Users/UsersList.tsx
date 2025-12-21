import { useEffect, useMemo, useState } from "react";
import { userService } from "../../services/user.service";
import UserDataTable from "../../components/users/UserDataTable";
import type { User } from "../../types/api.types";

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) {
      return users;
    }
    const term = search.toLowerCase();
    return users.filter((user) => {
      return (
        user.full_name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term)
      );
    });
  }, [users, search]);

  const total = filteredUsers.length;
  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, page, pageSize]);

  const handleSearchChange = (value: string) => {
    setPage(1);
    setSearch(value);
  };

  const handlePageSizeChange = (value: number) => {
    setPage(1);
    setPageSize(value);
  };

  return (
    <UserDataTable
      users={paginatedUsers}
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