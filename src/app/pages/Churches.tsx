import { useState, useEffect, useRef } from 'react';
import { MapPin, RefreshCw, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChurches } from '../hooks/useChurches';
import InboxList, {
  InboxAvatar,
  InboxTag,
  InboxSkeleton,
  type InboxColumn,
} from '../components/ui/inbox-list';
import type { ChurchListItem } from '../types/church.types';

const PAGE_LIMIT = 25;

// =============================================================================
// COLUMN DEFINITIONS — renders only server-provided fields, no derivation
// =============================================================================

const columns: InboxColumn<ChurchListItem>[] = [
  {
    key: 'avatar',
    width: 'w-8',
    render: (c) => <InboxAvatar name={c.name ?? '?'} />,
  },
  {
    key: 'name',
    header: 'Church',
    width: 'w-56',
    render: (c) => (
      <span className="text-sm font-medium text-gray-900 truncate block">{c.name}</span>
    ),
  },
  {
    key: 'conference',
    header: 'Conference',
    width: 'w-28',
    render: (c) =>
      c.conference?.name ? (
        <InboxTag color="orange">{c.conference.name}</InboxTag>
      ) : (
        <span className="text-xs text-gray-300">—</span>
      ),
  },
  {
    key: 'location',
    header: 'Location',
    width: 'w-40',
    render: (c) => (
      <span className="text-sm text-gray-500 truncate block">
        {c.locationShort ?? <span className="text-gray-300 italic text-xs">—</span>}
      </span>
    ),
  },
  {
    key: 'address',
    header: 'Address',
    render: (c) => (
      <span className="text-sm text-gray-400 truncate block">
        {c.location?.address?.street ?? <span className="italic text-gray-300 text-xs">No address</span>}
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    width: 'w-20',
    align: 'right',
    render: (c) => (
      <InboxTag color={c.isActive ? 'green' : 'gray'}>
        {c.isActive ? 'Active' : 'Inactive'}
      </InboxTag>
    ),
  },
];

// Known states — static, avoids an extra API call
const AU_STATES = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'];

// =============================================================================
// PAGE
// =============================================================================

export function Churches(): JSX.Element {
  const navigate = useNavigate();

  // Server-driven state
  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedState, setSelectedState]     = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search — avoid Atlas query on every keystroke
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // reset to page 1 on new search
    }, 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search]);

  // Reset page when state filter changes
  const handleStateChange = (s: string) => {
    setSelectedState(s);
    setPage(1);
  };

  const { churches, pagination, loading, error, refetch } = useChurches({
    page,
    limit: PAGE_LIMIT,
    search: debouncedSearch || undefined,
    state: selectedState || undefined,
  });

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F44314] text-white text-sm font-medium hover:bg-[#d63a10] transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Churches</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {loading
              ? 'Loading…'
              : `${pagination.total} church${pagination.total !== 1 ? 'es' : ''}${selectedState ? ` in ${selectedState}` : ''}`}
          </p>
        </div>

        <div className="flex-1" />

        {/* Search — debounced, hits server */}
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search churches…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-100 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#F44314]/30 placeholder-gray-400"
          />
        </div>

        {/* State filter */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <select
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            className="pl-9 pr-8 py-2 text-sm bg-gray-100 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#F44314]/30 text-gray-700 appearance-none cursor-pointer"
          >
            <option value="">All States</option>
            {AU_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="px-2">
        {loading && churches.length === 0 ? (
          <InboxSkeleton rows={PAGE_LIMIT} />
        ) : (
          <InboxList<ChurchListItem>
            data={churches as ChurchListItem[]}
            columns={columns}
            getRowKey={(c) => c._id}
            onRowClick={(c) => navigate(`/churches/${c._id}`)}
            loading={loading}
            emptyIcon={<MapPin className="w-12 h-12" />}
            emptyTitle="No churches found"
            emptyDescription={
              debouncedSearch || selectedState
                ? 'Try adjusting your search or filter'
                : 'No churches have been added yet'
            }
          />
        )}
      </div>

      {/* Pagination — lives outside InboxList so it's always in normal document flow */}
      {pagination.total > 0 && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-white">
          <span className="text-xs text-gray-400">
            {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} churches
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {/* Page number pills */}
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                if (idx > 0 && typeof arr[idx - 1] === 'number' && (p as number) - (arr[idx - 1] as number) > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === '...' ? (
                  <span key={`ellipsis-${i}`} className="px-1 text-gray-300 text-xs">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`min-w-[28px] h-7 px-2 rounded-lg text-xs font-medium transition-colors ${
                      p === page
                        ? 'bg-[#F44314] text-white'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
              disabled={page >= pagination.totalPages}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
