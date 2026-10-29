import { useMemo, useState } from 'react';

export function useSortableData(items, initialKey = '') {
  const [sort, setSort] = useState({ key: initialKey, direction: 'asc' });
  const sortedItems = useMemo(() => {
    if (!sort.key) return items;
    return [...items].sort((a, b) => {
      const left = getSortValue(a, sort.key);
      const right = getSortValue(b, sort.key);
      const leftValue = left == null ? '' : left;
      const rightValue = right == null ? '' : right;
      const result = typeof leftValue === 'number' && typeof rightValue === 'number'
        ? leftValue - rightValue
        : String(leftValue).localeCompare(String(rightValue), undefined, { numeric: true, sensitivity: 'base' });
      return sort.direction === 'asc' ? result : -result;
    });
  }, [items, sort]);
  const sortBy = (key) => setSort((current) => ({
    key,
    direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
  }));
  return { items: sortedItems, sort, sortBy };
}

function getSortValue(item, key) {
  if (key === 'name') return `${item.firstName || item.student?.firstName || ''} ${item.lastName || item.student?.lastName || ''}`;
  if (key === 'studentName') return `${item.student?.firstName || ''} ${item.student?.lastName || ''}`;
  const value = key.split('.').reduce((current, part) => current?.[part], item);
  return key === 'score' || key === 'year' ? Number(value || 0) : value;
}

export function SortHeader({ label, sort, sortBy, value }) {
  const active = sort.key === value;
  return <button type="button" onClick={() => sortBy(value)} className="inline-flex items-center gap-1 font-semibold text-gray-700 hover:text-blue-800" aria-label={`Sort by ${label}`} aria-pressed={active}>
    {label}<span aria-hidden="true" className="text-[10px] text-blue-700">{active ? (sort.direction === 'asc' ? '▲' : '▼') : '↕'}</span>
  </button>;
}
