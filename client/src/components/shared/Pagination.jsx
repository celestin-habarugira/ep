import React, { useEffect } from 'react';

export function usePagination(items, initialPageSize = 10) {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(initialPageSize);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  useEffect(() => setPage((current) => Math.min(current, pageCount)), [pageCount]);
  return {
    page,
    pageSize,
    setPage,
    setPageSize: (value) => { setPageSize(Number(value)); setPage(1); },
    pageCount,
    items: items.slice((page - 1) * pageSize, page * pageSize),
  };
}

export default function Pagination({ page, pageSize, pageCount, total, setPage, setPageSize }) {
  if (!total) return null;
  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);
  return (
    <div className="pagination-bar">
      <span className="text-sm text-gray-500">Showing {first}–{last} of {total}</span>
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-sm text-gray-600">Rows
          <select aria-label="Rows per page" className="pagination-select" value={pageSize} onChange={(event) => setPageSize(event.target.value)}>
            {[10, 20, 50, 100].map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
        </label>
        <button type="button" className="pagination-button" onClick={() => setPage(1)} disabled={page <= 1} aria-label="First page">«</button>
        <button type="button" className="pagination-button" onClick={() => setPage(page - 1)} disabled={page <= 1}>Previous</button>
        <span className="text-sm text-gray-600">Page {page} of {pageCount}</span>
        <button type="button" className="pagination-button" onClick={() => setPage(page + 1)} disabled={page >= pageCount}>Next</button>
        <button type="button" className="pagination-button" onClick={() => setPage(pageCount)} disabled={page >= pageCount} aria-label="Last page">»</button>
      </div>
    </div>
  );
}
