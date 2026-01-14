import { useState, useMemo } from 'react';
import { ChurchCard } from '../components/ChurchCard';
import { MapPin, Filter, RefreshCw, Search } from 'lucide-react';
import { useChurches } from '../hooks/useChurches';

export function Churches() {
  const { churches, loading, error, refetch } = useChurches();
  const [selectedState, setSelectedState] = useState('All States');
  const [searchQuery, setSearchQuery] = useState('');

  // Derive unique states from fetched data
  const states = useMemo(() => {
    const stateSet = new Set<string>();

    churches.forEach((church) => {
      if (church.location?.address?.state) {
        stateSet.add(church.location.address.state);
      }
    });

    return ['All States', ...Array.from(stateSet).sort()];
  }, [churches]);

  // Filter churches based on selected filters
  const filteredChurches = useMemo(() => {
    return churches.filter((church) => {
      // State filter
      const stateMatch =
        selectedState === 'All States' ||
        church.location?.address?.state === selectedState;

      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const searchMatch =
        !searchQuery ||
        church.name.toLowerCase().includes(searchLower) ||
        church.leadership?.associatePastors?.some((p) =>
          p.name.toLowerCase().includes(searchLower)
        ) ||
        church.leadership?.acsCoordinator?.name?.toLowerCase().includes(searchLower);

      return stateMatch && searchMatch;
    });
  }, [churches, selectedState, searchQuery]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F44314] via-[#F97023] to-[#F98344]">
        {/* Hero Section */}
        <div className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0">
              <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-white/10 blur-3xl"></div>
            </div>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-6 py-32 text-center">
            <p className="text-white/90 text-sm tracking-wider uppercase mb-4">Our Churches</p>
            <h1 className="text-white text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your Local Church
            </h1>
          </div>
        </div>

        {/* Loading spinner */}
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F44314] via-[#F97023] to-[#F98344]">
        {/* Hero Section */}
        <div className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0">
              <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-white/10 blur-3xl"></div>
            </div>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-6 py-32 text-center">
            <p className="text-white/90 text-sm tracking-wider uppercase mb-4">Our Churches</p>
            <h1 className="text-white text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your Local Church
            </h1>
          </div>
        </div>

        {/* Error message */}
        <div className="max-w-7xl mx-auto px-6 pb-24">
          <div className="text-center py-16">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-12 max-w-md mx-auto">
              <p className="text-white text-lg mb-4">{error}</p>
              <button
                onClick={() => refetch()}
                className="inline-flex items-center gap-2 bg-white text-[#F44314] px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F44314] via-[#F97023] to-[#F98344]">
      {/* Hero Section */}
      <div className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Gradient Background with decorative circles */}
        <div className="absolute inset-0">
          <div className="absolute inset-0">
            {/* Decorative circles */}
            <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-white/30"></div>
            <div className="absolute top-1/3 left-1/3 w-3 h-3 rounded-full bg-white/20"></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-32 text-center">
          <p className="text-white/90 text-sm tracking-wider uppercase mb-4">Our Churches</p>
          <h1 className="text-white text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Find Your Local Church
          </h1>
          <p className="text-white/90 text-lg leading-relaxed max-w-3xl mx-auto">
            Connect with Seventh-day Adventist churches across South NSW. Find pastors, ACS
            coordinators, and community service leaders near you.
          </p>
        </div>
      </div>

      {/* Churches Section */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        {/* Filters */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Filter className="w-5 h-5 text-white" />
            <h2 className="text-white text-2xl font-semibold">Filter Churches</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Search Filter */}
            <div>
              <label htmlFor="search" className="block text-white/90 text-sm mb-2 flex items-center gap-2">
                <Search className="w-4 h-4" />
                Search
              </label>
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, pastor, or ACS coordinator..."
                className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
              />
            </div>

            {/* State Filter */}
            <div>
              <label
                htmlFor="state"
                className="block text-white/90 text-sm mb-2 flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                State
              </label>
              <select
                id="state"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:outline-none focus:border-white/40 transition-colors"
              >
                {states.map((state) => (
                  <option key={state} value={state} className="bg-[#F44314] text-white">
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6">
            <p className="text-white/80">
              Showing{' '}
              <span className="font-semibold text-white">{filteredChurches.length}</span> church
              {filteredChurches.length !== 1 ? 'es' : ''}
              {selectedState !== 'All States' && ` in ${selectedState}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
        </div>

        {/* Churches Grid */}
        {filteredChurches.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChurches.map((church) => (
              <ChurchCard key={church._id} church={church} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-12 max-w-md mx-auto">
              <p className="text-white text-lg mb-2">No churches found</p>
              <p className="text-white/70 text-sm">
                Try adjusting your filters to find churches in other states or with different search
                terms.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
