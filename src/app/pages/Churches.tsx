import { useState, useMemo } from 'react';
import { ChurchCard } from '../components/ChurchCard';
import { MapPin, Filter, RefreshCw, Search } from 'lucide-react';
import { useChurches } from '../hooks/useChurches';
import { useCMSPage } from '../hooks/useCMSContent';

function DecorativeCircles({ showSmallCircles = false }: { showSmallCircles?: boolean }): JSX.Element {
  return (
    <div className="absolute inset-0">
      <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-gray-50 blur-3xl" />
      {showSmallCircles && (
        <>
          <div className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-white/30" />
          <div className="absolute top-1/3 left-1/3 w-3 h-3 rounded-full bg-white/20" />
        </>
      )}
    </div>
  );
}

interface HeroSectionProps {
  label: string;
  title: string;
  subtitle?: string;
  showSmallCircles?: boolean;
}

function HeroSection({ label, title, subtitle, showSmallCircles = false }: HeroSectionProps): JSX.Element {
  return (
    <div className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <DecorativeCircles showSmallCircles={showSmallCircles} />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-32 text-center">
        <p className="text-[#F44314] text-sm font-semibold tracking-wider uppercase mb-4">{label}</p>
        <h1 className="text-[#1F2937] text-5xl md:text-6xl font-bold mb-6 leading-tight">{title}</h1>
        {subtitle && (
          <p
            className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto"
            dangerouslySetInnerHTML={{ __html: subtitle }}
          />
        )}
      </div>
    </div>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F44314] via-[#F97023] to-[#F98344]">
      {children}
    </div>
  );
}

function StatusCard({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="text-center py-16">
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-12 max-w-md mx-auto">
        {children}
      </div>
    </div>
  );
}

export function Churches(): JSX.Element {
  const { getBlock } = useCMSPage('churches');
  const { churches, loading, error, refetch } = useChurches();
  const [selectedState, setSelectedState] = useState('All States');
  const [searchQuery, setSearchQuery] = useState('');

  const heroLabel = getBlock('hero', 'section_label') || 'Our Churches';
  const heroTitle = getBlock('hero', 'title') || 'Find Your Local Church';
  const heroSubtitle =
    getBlock('hero', 'subtitle') ||
    'Connect with Seventh-day Adventist churches across South NSW. Find pastors, ACS coordinators, and community service leaders near you.';

  const states = useMemo(() => {
    const uniqueStates = churches
      .map((church) => church.location?.address?.state)
      .filter((state): state is string => Boolean(state));
    return ['All States', ...Array.from(new Set(uniqueStates)).sort()];
  }, [churches]);

  const filteredChurches = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();

    return churches.filter((church) => {
      const stateMatch =
        selectedState === 'All States' || church.location?.address?.state === selectedState;

      if (!stateMatch) return false;
      if (!searchQuery) return true;

      const nameMatch = church.name.toLowerCase().includes(searchLower);
      const pastorMatch = church.leadership?.associatePastors?.some((p) =>
        p.name.toLowerCase().includes(searchLower)
      );
      const coordinatorMatch = church.leadership?.acsCoordinator?.name
        ?.toLowerCase()
        .includes(searchLower);

      return nameMatch || pastorMatch || coordinatorMatch;
    });
  }, [churches, selectedState, searchQuery]);

  if (loading) {
    return (
      <PageWrapper>
        <HeroSection label={heroLabel} title={heroTitle} />
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <HeroSection label={heroLabel} title={heroTitle} />
        <div className="max-w-7xl mx-auto px-6 pb-24">
          <StatusCard>
            <p className="text-[#1F2937] text-lg mb-4">{error}</p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 bg-white text-[#F44314] px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
          </StatusCard>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <HeroSection label={heroLabel} title={heroTitle} subtitle={heroSubtitle} showSmallCircles />

      {/* Churches Section */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        {/* Filters */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Filter className="w-5 h-5 text-[#F44314]" />
            <h2 className="text-[#1F2937] text-2xl font-semibold">Filter Churches</h2>
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
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F44314] transition-colors"
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
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 shadow-sm text-gray-900 focus:outline-none focus:border-[#F44314] transition-colors"
              >
                {states.map((state) => (
                  <option key={state} value={state} className="bg-white text-gray-900">
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
              <span className="font-semibold text-[#F44314]">{filteredChurches.length}</span> church
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
          <StatusCard>
            <p className="text-[#1F2937] text-lg mb-2">No churches found</p>
            <p className="text-gray-600 text-sm">
              Try adjusting your filters to find churches in other states or with different search
              terms.
            </p>
          </StatusCard>
        )}
      </div>
    </PageWrapper>
  );
}
