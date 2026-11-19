"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface DataTableColumn {
  key: string;
  label: string;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  pageSize = 10,
}: {
  columns: DataTableColumn[];
  data: T[];
  pageSize?: number;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const filtered = data.filter((row) =>
    columns.some((col) =>
      String(row[col.key] ?? "").toLowerCase().includes(search.toLowerCase()),
    ),
  );

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex h-9 w-[250px] rounded-sm border-oj-border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-oj-red"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-oj-border bg-oj-gray-50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn("px-4 py-3 text-left text-xs font-semibold text-oj-gray-800", col.className)}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-oj-border/50">
            {paginated.map((row, i) => (
              <tr key={i} className="border-b border-oj-border/50 hover:bg-oj-gray-100 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className={cn("px-4 py-3 text-sm text-oj-black", col.className)}>
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-oj-gray-800">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-2 text-sm">
          <span className="text-oj-gray-800">
            Page {currentPage} of {totalPages} ({filtered.length} items)
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-oj-border hover:bg-oj-gray-100 disabled:opacity-50 disabled:pointer-events-none"
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-oj-border hover:bg-oj-gray-100 disabled:opacity-50 disabled:pointer-events-none"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}