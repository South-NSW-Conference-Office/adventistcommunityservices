import { useState, useMemo } from 'react';
import { ChurchCard } from '../components/ChurchCard';
import { RefreshCw, Search } from 'lucide-react';
import { usePublicChurches } from '../hooks/useChurches';
import { useCMSPage } from '../hooks/useCMSContent';
import type { Church } from '../types/church.types';

const AU_STATES = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'];
const INITIAL_COUNT = 12;
const LOAD_MORE_COUNT = 12;

function getChurchConferenceName(church: Church): string | null {
  if (typeof church.conferenceId === 'object' && church.conferenceId?.name) {
    return church.conferenceId.name;
  }
  if (typeof church.conference === 'object' && church.conference?.name) {
    return church.conference.name;
  }
  return null;
}

function getChurchState(church: Church): string | null {
  return church.location?.address?.state ?? null;
}

export function Churches(): JSX.Element {
  const { getBlock } = useCMSPage('churches');

  const heroLabel    = getBlock('hero', 'section_label') || 'Churches Directory';
  const heroTitle    = getBlock('hero', 'title')         || 'Find a Church';
  const heroSubtitle =
    getBlock('hero', 'subtitle') ||
    'Browse Adventist churches across New South Wales and beyond. Find a community near you.';

  const { churches, loading, error, refetch } = usePublicChurches();

  const [searchQuery,   setSearchQuery]   = useState('');
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedConf,  setSelectedConf]  = useState('All Conferences');
  const [visibleCount,  setVisibleCount]  = useState(INITIAL_COUNT);

  const { conferences, filteredChurches } = useMemo(() => {
    const confSet     = new Set<string>();
    const searchLower = searchQuery.toLowerCase();

    const filtered = churches.filter((church) => {
      const confName = getChurchConferenceName(church);
      const state    = getChurchState(church);

      if (confName) confSet.add(confName);

      const stateMatch  = selectedState === 'All States'      || state    === selectedState;
      const confMatch   = selectedConf  === 'All Conferences' || confName === selectedConf;
      const searchMatch =
        !searchQuery ||
        church.name?.toLowerCase().includes(searchLower) ||
        (church.locationShort && church.locationShort.toLowerCase().includes(searchLower)) ||
        (confName && confName.toLowerCase().includes(searchLower));

      return stateMatch && confMatch && searchMatch;
    });

    return {
      conferences: ['All Conferences', ...Array.from(confSet).sort()],
      filteredChurches: filtered,
    };
  }, [churches, searchQuery, selectedState, selectedConf]);

  // Reset visible count whenever filters change
  const handleFilterChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setter(e.target.value);
    setVisibleCount(INITIAL_COUNT);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setVisibleCount(INITIAL_COUNT);
  };

  const visibleChurches  = filteredChurches.slice(0, visibleCount);
  const hasMore          = filteredChurches.length > visibleCount;

  return (
    <div>
      {/* Hero */}
      <div className="relative h-[460px] md:h-[520px] overflow-hidden">
        <iframe
          src="https://www.youtube-nocookie.com/embed/Mzwy_gkPjbw?autoplay=1&mute=1&loop=1&playlist=Mzwy_gkPjbw&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&start=80"
          allow="autoplay; encrypted-media"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ width: 'max(100%, 177.78vh)', height: 'max(100%, 56.25vw)' }}
          title="ACS background video"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
        <div className="relative h-full flex items-end pb-10">
          <div className="max-w-4xl mx-auto px-6 text-center w-full">
            <p className="text-white/80 text-sm font-semibold tracking-wider uppercase mb-4">{heroLabel}</p>
            <h1 className="text-white text-5xl md:text-6xl font-bold mb-4 leading-tight">{heroTitle}</h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">{heroSubtitle}</p>
            {/* Search */}
            <div className="max-w-xl mx-auto">
              <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-md border border-gray-200">
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search churches, cities, or conferences..."
                  className="flex-1 bg-transparent outline-none text-gray-900 text-sm placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters + Content */}
      <div className="bg-white py-10">
        <div className="max-w-7xl mx-auto px-6">

          {/* Compact Filter Bar */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span className="text-gray-500 text-xs font-medium uppercase tracking-wide">Filter by</span>

            <select
              value={selectedState}
              onChange={handleFilterChange(setSelectedState)}
              className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 text-sm focus:outline-none focus:border-[#F44314] transition-colors cursor-pointer"
            >
              <option value="All States">All States</option>
              {AU_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              value={selectedConf}
              onChange={handleFilterChange(setSelectedConf)}
              className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 text-sm focus:outline-none focus:border-[#F44314] transition-colors cursor-pointer"
            >
              {conferences.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {(searchQuery || selectedState !== 'All States' || selectedConf !== 'All Conferences') && (
              <button
                onClick={() => { setSearchQuery(''); setSelectedState('All States'); setSelectedConf('All Conferences'); setVisibleCount(INITIAL_COUNT); }}
                className="text-[#F44314] text-xs font-semibold hover:underline"
              >
                Clear filters
              </button>
            )}

            <span className="text-gray-400 text-xs ml-auto">
              {filteredChurches.length} church{filteredChurches.length !== 1 ? 'es' : ''}
              {selectedState !== 'All States' && ` in ${selectedState}`}
              {selectedConf !== 'All Conferences' && ` · ${selectedConf}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </span>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F44314]" />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-16">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 max-w-md mx-auto">
                <p className="text-gray-700 text-lg mb-4">{error}</p>
                <button
                  onClick={() => refetch()}
                  className="inline-flex items-center gap-2 bg-[#F44314] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#d93a10] transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Church Grid */}
          {!loading && !error && visibleChurches.length > 0 && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleChurches.map((church) => (
                  <ChurchCard key={church._id} church={church} />
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="mt-10 text-center">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_COUNT)}
                    className="inline-flex items-center gap-2 bg-[#F44314] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#d93a10] transition-colors shadow-sm"
                  >
                    View More Churches
                    <span className="text-white/70 text-sm">
                      ({filteredChurches.length - visibleCount} remaining)
                    </span>
                  </button>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!loading && !error && filteredChurches.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-[#F8F7F5] border border-gray-200 rounded-2xl p-12 max-w-lg mx-auto">
                <p className="text-[#1F2937] text-xl font-semibold mb-2">No churches found</p>
                <p className="text-gray-500 mb-6">
                  {churches.length === 0
                    ? 'No churches have been listed yet. Check back soon.'
                    : 'Try adjusting your filters or search term.'}
                </p>
                {(searchQuery || selectedState !== 'All States' || selectedConf !== 'All Conferences') && (
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedState('All States'); setSelectedConf('All Conferences'); }}
                    className="text-[#F44314] font-semibold hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
