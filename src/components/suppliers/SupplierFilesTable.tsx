import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import type { Media } from "../../types/api.types";

interface SupplierFilesTableProps {
  files: Media[];
  isLoading: boolean;
  error?: string | null;
}

const formatFileSize = (size?: number) => {
  if (!size) return "-";
  const units = ["B", "KB", "MB", "GB"];
  let value = size;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${
    units[unitIndex]
  }`;
};

export default function SupplierFilesTable({
  files,
  isLoading,
  error,
}: SupplierFilesTableProps) {
  if (isLoading) {
    return (
      <div className="px-4 py-6 text-sm text-gray-500 dark:text-gray-400">
        Loading files list...
      </div>
    );
  }

  if (error) {
    return <div className="px-4 py-6 text-sm text-error-500">{error}</div>;
  }

  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell
              isHeader
              className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
            >
              <span className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                Title
              </span>
            </TableCell>
            <TableCell
              isHeader
              className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
            >
              <span className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                Type
              </span>
            </TableCell>
            <TableCell
              isHeader
              className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
            >
              <span className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                Storage
              </span>
            </TableCell>
            <TableCell
              isHeader
              className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
            >
              <span className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                File name
              </span>
            </TableCell>
            <TableCell
              isHeader
              className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
            >
              <span className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                Size
              </span>
            </TableCell>
            <TableCell
              isHeader
              className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
            >
              <span className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                Link
              </span>
            </TableCell>
            <TableCell
              isHeader
              className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]"
            >
              <span className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                Primary
              </span>
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
              >
                No files found for this supplier.
              </TableCell>
            </TableRow>
          ) : (
            files.map((file) => (
              <TableRow key={file.id}>
                <TableCell className="px-4 py-4 border border-gray-100 dark:border-white/[0.05] text-theme-sm text-gray-800 dark:text-white/90">
                  {file.title || file.file_name || "-"}
                </TableCell>
                <TableCell className="px-4 py-4 border border-gray-100 dark:border-white/[0.05] text-theme-sm text-gray-500 dark:text-gray-400">
                  {file.media_type || "-"}
                </TableCell>
                <TableCell className="px-4 py-4 border border-gray-100 dark:border-white/[0.05] text-theme-sm text-gray-500 dark:text-gray-400">
                  {file.storage_type || "-"}
                </TableCell>
                <TableCell className="px-4 py-4 border border-gray-100 dark:border-white/[0.05] text-theme-sm text-gray-800 dark:text-white/90">
                  {file.file_name || "-"}
                </TableCell>
                <TableCell className="px-4 py-4 border border-gray-100 dark:border-white/[0.05] text-theme-sm text-gray-500 dark:text-gray-400">
                  {formatFileSize(file.file_size)}
                </TableCell>
                <TableCell className="px-4 py-4 border border-gray-100 dark:border-white/[0.05] text-theme-sm text-brand-500">
                  {file.file_url || file.external_url ? (
                    <a
                      href={file.file_url || file.external_url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-2"
                    >
                      Open
                    </a>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="px-4 py-4 border border-gray-100 dark:border-white/[0.05] text-theme-sm text-gray-500 dark:text-gray-400">
                  {file.is_primary ? "Yes" : "No"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}