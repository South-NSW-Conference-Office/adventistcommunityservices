import { useState, useMemo } from 'react';
import { ChurchCard } from '../components/ChurchCard';
import { Filter, RefreshCw, Search, MapPin } from 'lucide-react';
import { usePublicChurches } from '../hooks/useChurches';
import { useCMSPage } from '../hooks/useCMSContent';
import type { Church } from '../types/church.types';

const AU_STATES = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'];

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

  const [searchQuery,    setSearchQuery]    = useState('');
  const [selectedState,  setSelectedState]  = useState('All States');
  const [selectedConf,   setSelectedConf]   = useState('All Conferences');

  const { conferences, filteredChurches } = useMemo(() => {
    const confSet    = new Set<string>();
    const searchLower = searchQuery.toLowerCase();

    const filtered = churches.filter((church) => {
      const confName = getChurchConferenceName(church);
      const state    = getChurchState(church);

      if (confName) confSet.add(confName);

      const stateMatch = selectedState  === 'All States'       || state    === selectedState;
      const confMatch  = selectedConf   === 'All Conferences'  || confName === selectedConf;
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

  return (
    <div>
      {/* Hero */}
      <div className="bg-[#F8F7F5] py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[#F44314] text-sm font-semibold tracking-wider uppercase mb-4">{heroLabel}</p>
          <h1 className="text-[#1F2937] text-5xl md:text-6xl font-bold mb-6 leading-tight">{heroTitle}</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">{heroSubtitle}</p>

          {/* Search */}
          <div className="mt-10 max-w-xl mx-auto">
            <div className="flex items-center gap-3 px-5 py-4 bg-white rounded-2xl shadow-md border border-gray-200">
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search churches, cities, or conferences..."
                className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters + Content */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Filter Bar */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <Filter className="w-5 h-5 text-gray-400" />
              <h2 className="text-[#1F2937] text-xl font-semibold">Filter Churches</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="state" className="block text-gray-600 text-sm mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  State
                </label>
                <select
                  id="state"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:border-[#F44314] transition-colors"
                >
                  <option value="All States">All States</option>
                  {AU_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="conference" className="block text-gray-600 text-sm mb-2">
                  Conference
                </label>
                <select
                  id="conference"
                  value={selectedConf}
                  onChange={(e) => setSelectedConf(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:border-[#F44314] transition-colors"
                >
                  {conferences.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-gray-500 text-sm">
                Showing <span className="font-semibold text-[#1F2937]">{filteredChurches.length}</span>{' '}
                church{filteredChurches.length !== 1 ? 'es' : ''}
                {selectedState !== 'All States' && ` in ${selectedState}`}
                {selectedConf !== 'All Conferences' && ` · ${selectedConf}`}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F44314]"></div>
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
                  <RefreshCw className="w-5 h-5" />
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Church Grid */}
          {!loading && !error && filteredChurches.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChurches.map((church) => (
                <ChurchCard key={church._id} church={church} />
              ))}
            </div>
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
