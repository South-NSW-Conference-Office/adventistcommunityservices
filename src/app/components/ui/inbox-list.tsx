/**
 * InboxList Component
 * Ported from MasterGuide — Gmail-style inbox list with spring-bounce row animations.
 */

import { ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

export interface InboxColumn<T> {
  key: string;
  header?: string;
  width?: string;
  align?: 'left' | 'right';
  render: (item: T) => ReactNode;
}

export interface InboxListProps<T> {
  title?: string;
  data: T[];
  columns: InboxColumn<T>[];
  getRowKey: (item: T) => string;
  onRowClick?: (item: T) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  page?: number;
  totalPages?: number;
  total?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  toolbar?: ReactNode;
  filterArea?: ReactNode;
  emptyIcon?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  rowClassName?: string;
  loading?: boolean;
}

// =============================================================================
// INBOX LIST
// =============================================================================

export default function InboxList<T>({
  title,
  data,
  columns,
  getRowKey,
  onRowClick,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  page = 1,
  totalPages = 1,
  total = 0,
  pageSize = 25,
  onPageChange,
  toolbar,
  filterArea,
  emptyIcon,
  emptyTitle = 'No items found',
  emptyDescription = 'Try adjusting your filters',
  rowClassName,
  loading = false,
}: InboxListProps<T>) {
  const rangeStart = Math.min((page - 1) * pageSize + 1, total);
  const rangeEnd = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      {(title || onSearchChange || toolbar) && (
        <div className="flex items-center gap-4 px-4 py-3">
          {title && <h1 className="text-xl font-semibold text-gray-900 flex-shrink-0">{title}</h1>}
          <div className="flex-1" />
          {onSearchChange && (
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg bg-gray-100 border-0 focus:outline-none focus:ring-2 focus:ring-[#F44314]/30 placeholder-gray-400"
              />
            </div>
          )}
          {toolbar}
        </div>
      )}

      {filterArea}

      {/* List body */}
      <div className="relative flex-1">
        {/* Loading overlay (when refreshing with existing data) */}
        {loading && data.length > 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-[#F44314] rounded-full animate-spin" />
          </div>
        )}

        {/* Column headers */}
        {data.length > 0 && (
          <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-200 bg-gray-50/50">
            {columns.map((col) => (
              <div
                key={col.key}
                className={`${col.width ? `${col.width} flex-shrink-0` : 'flex-1 min-w-0'} ${
                  col.align === 'right' ? 'text-right' : ''
                } text-xs font-medium text-gray-500 uppercase tracking-wider`}
              >
                {col.header}
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && data.length === 0 ? (
          <div className="text-center py-20">
            {emptyIcon && <div className="flex justify-center mb-3 text-gray-300">{emptyIcon}</div>}
            <p className="text-gray-600 font-medium">{emptyTitle}</p>
            <p className="text-gray-400 text-sm mt-1">{emptyDescription}</p>
          </div>
        ) : (
          data.map((item) => (
            <div
              key={getRowKey(item)}
              onClick={onRowClick ? () => onRowClick(item) : undefined}
              className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-all duration-[900ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.03] hover:-translate-y-[3px] hover:shadow-[0_12px_35px_rgba(0,0,0,0.12)] hover:z-10 relative rounded-lg hover:bg-white border-b border-gray-50 last:border-0 ${rowClassName || ''}`}
            >
              {columns.map((col) => (
                <div
                  key={col.key}
                  className={`${col.width ? `${col.width} flex-shrink-0` : 'flex-1 min-w-0'} ${
                    col.align === 'right' ? 'text-right' : ''
                  }`}
                >
                  {col.render(item)}
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {total > 0 && (
        <div className="flex items-center px-4 py-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            {rangeStart}–{rangeEnd} of {total}
          </span>
          <div className="flex items-center gap-0.5 ml-3">
            <button
              onClick={() => onPageChange?.(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// HELPERS
// =============================================================================

const TAG_COLORS: Record<string, string> = {
  green:  'bg-emerald-100 text-emerald-700',
  blue:   'bg-blue-100 text-blue-700',
  orange: 'bg-orange-100 text-orange-700',
  red:    'bg-red-100 text-red-700',
  amber:  'bg-amber-100 text-amber-700',
  gray:   'bg-gray-100 text-gray-500',
};

export function InboxTag({ children, color = 'gray' }: { children: ReactNode; color?: string }) {
  const cls = TAG_COLORS[color] || TAG_COLORS.gray;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap ${cls}`}>
      {children}
    </span>
  );
}

export function InboxAvatar({ name, size = 'w-8 h-8' }: { name: string; size?: string }) {
  const letter = (name?.[0] || '?').toUpperCase();
  return (
    <div className={`${size} rounded-full bg-[#F44314]/10 flex items-center justify-center flex-shrink-0`}>
      <span className="text-xs font-semibold text-[#F44314]">{letter}</span>
    </div>
  );
}

export function InboxSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="animate-pulse">
      <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-100">
        <div className="h-5 bg-gray-100 rounded w-32" />
        <div className="flex-1" />
        <div className="h-8 bg-gray-100 rounded-lg w-48" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-gray-50">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex-shrink-0" />
          <div className="h-4 bg-gray-100 rounded w-40" />
          <div className="h-4 bg-gray-50 rounded w-20" />
          <div className="flex-1 h-4 bg-gray-50 rounded" />
          <div className="h-4 bg-gray-50 rounded w-16" />
          <div className="h-4 bg-gray-50 rounded w-12 ml-auto" />
        </div>
      ))}
    </div>
  );
}
