import { useState, useMemo } from 'react';
import { TeamCard } from '../components/TeamCard';
import { RefreshCw, Search, MapPin } from 'lucide-react';
import { useTeams } from '../hooks/useTeams';
import { useCMSPage } from '../hooks/useCMSContent';

function getTeamChurchName(team: { churchId?: { name?: string } | string }): string | null {
  if (typeof team.churchId === 'object' && team.churchId?.name) {
    return team.churchId.name;
  }
  return null;
}

function getTeamLeaderName(team: { leaderId?: { name?: string } | string }): string | null {
  if (typeof team.leaderId === 'object' && team.leaderId?.name) {
    return team.leaderId.name;
  }
  return null;
}

export function Teams(): JSX.Element {
  const { getBlock } = useCMSPage('teams');

  const heroLabel = getBlock('hero', 'section_label') || 'Teams Directory';
  const heroTitle = getBlock('hero', 'title') || 'Community Service Teams';
  const heroSubtitle =
    getBlock('hero', 'subtitle') ||
    'Browse community service teams by location. Every team is run by local volunteers ready to serve.';

  const { teams, loading, error, refetch } = useTeams();
  const [selectedChurch, setSelectedChurch] = useState('All Locations');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');

  const { churches, categories, filteredTeams } = useMemo(() => {
    const churchSet = new Set<string>();
    const categorySet = new Set<string>();
    const searchLower = searchQuery.toLowerCase();

    const filtered = teams.filter((team) => {
      const churchName = getTeamChurchName(team);
      const teamCategory = team.category || team.type;
      const leaderName = getTeamLeaderName(team);

      if (churchName) churchSet.add(churchName);
      if (teamCategory) categorySet.add(teamCategory);

      const churchMatch = selectedChurch === 'All Locations' || churchName === selectedChurch;
      const categoryMatch = selectedCategory === 'All Categories' || teamCategory === selectedCategory;
      const searchMatch =
        !searchQuery ||
        team.name.toLowerCase().includes(searchLower) ||
        (teamCategory && teamCategory.toLowerCase().includes(searchLower)) ||
        (team.description && team.description.toLowerCase().includes(searchLower)) ||
        (leaderName && leaderName.toLowerCase().includes(searchLower));

      return churchMatch && categoryMatch && searchMatch;
    });

    return {
      churches: ['All Locations', ...Array.from(churchSet).sort()],
      categories: ['All Categories', ...Array.from(categorySet).sort()],
      filteredTeams: filtered,
    };
  }, [teams, selectedChurch, selectedCategory, searchQuery]);

  return (
    <div>
      {/* Hero — video background */}
      <div className="relative h-[420px] md:h-[500px] overflow-hidden">
        <iframe
          src="https://www.youtube-nocookie.com/embed/Mzwy_gkPjbw?autoplay=1&mute=1&loop=1&playlist=Mzwy_gkPjbw&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&start=70"
          allow="autoplay; encrypted-media"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ width: 'max(100%, 177.78vh)', height: 'max(100%, 56.25vw)' }}
          title="ACS background video"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
        <div className="relative h-full flex items-end pb-12">
          <div className="max-w-4xl mx-auto px-6 text-center w-full">
            <p className="text-white/80 text-sm font-semibold tracking-wider uppercase mb-4">{heroLabel}</p>
            <h1 className="text-white text-5xl md:text-6xl font-bold mb-6 leading-tight">{heroTitle}</h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">{heroSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Filters + Content */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Filter Bar — compact inline */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-gray-400 text-xs font-medium uppercase tracking-wide">Filter by</span>

              {/* Search */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus-within:border-[#F44314] transition-colors">
                <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search teams..."
                  className="bg-transparent outline-none text-gray-900 text-sm placeholder-gray-400 w-36"
                />
              </div>

              {/* Location */}
              <select
                value={selectedChurch}
                onChange={(e) => setSelectedChurch(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 text-sm focus:outline-none focus:border-[#F44314] transition-colors cursor-pointer"
              >
                {churches.map((church) => (
                  <option key={church} value={church}>{church}</option>
                ))}
              </select>

              {/* Category */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 text-sm focus:outline-none focus:border-[#F44314] transition-colors cursor-pointer"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {/* Clear */}
              {(searchQuery || selectedChurch !== 'All Locations' || selectedCategory !== 'All Categories') && (
                <button
                  onClick={() => { setSearchQuery(''); setSelectedChurch('All Locations'); setSelectedCategory('All Categories'); }}
                  className="text-[#F44314] text-xs font-semibold hover:underline"
                >
                  Clear
                </button>
              )}

              <span className="text-gray-400 text-xs ml-auto">
                {filteredTeams.length} team{filteredTeams.length !== 1 ? 's' : ''}
                {selectedChurch !== 'All Locations' && ` · ${selectedChurch}`}
                {selectedCategory !== 'All Categories' && ` · ${selectedCategory}`}
                {searchQuery && ` matching "${searchQuery}"`}
              </span>
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
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 max-w-lg mx-auto">
                <p className="text-[#1F2937] text-xl font-semibold mb-4">Community service teams are being registered</p>
                <p className="text-gray-600 mb-6">
                  Teams across Australia are setting up their profiles. Check back soon to see services available in your area, 
                  or contact us directly if you need immediate assistance.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => refetch()}
                    className="inline-flex items-center gap-2 bg-[#F44314] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#d93a10] transition-colors"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Check Again
                  </button>
                  <a
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-white border-2 border-[#F44314] text-[#F44314] px-6 py-3 rounded-xl font-semibold hover:bg-[#F44314] hover:text-white transition-colors"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Teams Grid */}
          {!loading && !error && filteredTeams.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeams.map((team) => (
                <TeamCard key={team._id} team={team} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredTeams.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-[#F8F7F5] border border-gray-200 rounded-2xl p-12 max-w-lg mx-auto">
                <p className="text-[#1F2937] text-xl font-semibold mb-4">Community service teams are being registered</p>
                <p className="text-gray-600 mb-6">
                  {teams.length === 0
                    ? "Teams across Australia are setting up their services. Check back soon, or contact us if you need help now!"
                    : "Try adjusting your search to find teams in other locations. We're here to help connect you with the right support."}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="/contact"
                    className="bg-[#F44314] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#d93a10] transition-colors inline-block"
                  >
                    Contact Us
                  </a>
                  <a
                    href="/services"
                    className="bg-white border-2 border-[#F44314] text-[#F44314] px-8 py-3 rounded-xl font-semibold hover:bg-[#F44314] hover:text-white transition-colors inline-block"
                  >
                    View All Services
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
