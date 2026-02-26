import { useState, useMemo } from 'react';
import { TeamCard } from '../components/TeamCard';
import { Filter, RefreshCw, Search, Building2 } from 'lucide-react';
import { useTeams } from '../hooks/useTeams';
import { useCMSPage } from '../hooks/useCMSContent';

function HeroSection({ label, title, subtitle }: { label: string; title: string; subtitle?: string }): JSX.Element {
  return (
    <div className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-white/30"></div>
          <div className="absolute top-1/3 left-1/3 w-3 h-3 rounded-full bg-white/20"></div>
        </div>
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-32 text-center">
        <p className="text-white/90 text-sm tracking-wider uppercase mb-4">{label}</p>
        <h1 className="text-white text-5xl md:text-6xl font-bold mb-6 leading-tight">{title}</h1>
        {subtitle && (
          <p
            className="text-white/90 text-lg leading-relaxed max-w-3xl mx-auto"
            dangerouslySetInnerHTML={{ __html: subtitle }}
          />
        )}
      </div>
    </div>
  );
}

function StatusCard({ children, fullWidth = false }: { children: React.ReactNode; fullWidth?: boolean }): JSX.Element {
  const card = (
    <div className="text-center py-16">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-12 max-w-md mx-auto">
        {children}
      </div>
    </div>
  );

  if (fullWidth) {
    return <div className="max-w-7xl mx-auto px-6 pb-24">{card}</div>;
  }

  return card;
}

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
    'Browse community service teams by location and church. Each team shows their member count, services offered, and contact information to help you connect and get involved.';

  const { teams, loading, error, refetch } = useTeams();
  const [selectedChurch, setSelectedChurch] = useState('All Churches');
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

      const churchMatch = selectedChurch === 'All Churches' || churchName === selectedChurch;
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
      churches: ['All Churches', ...Array.from(churchSet).sort()],
      categories: ['All Categories', ...Array.from(categorySet).sort()],
      filteredTeams: filtered,
    };
  }, [teams, selectedChurch, selectedCategory, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F44314] via-[#F97023] to-[#F98344]">
        <HeroSection label={heroLabel} title={heroTitle} />
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F44314] via-[#F97023] to-[#F98344]">
        <HeroSection label={heroLabel} title={heroTitle} />
        <StatusCard fullWidth>
          <p className="text-white text-lg mb-4">{error}</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 bg-white text-[#F44314] px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
        </StatusCard>
      </div>
    );
  }

  const resultsText = buildResultsText(filteredTeams.length, selectedChurch, selectedCategory, searchQuery);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F44314] via-[#F97023] to-[#F98344]">
      <HeroSection label={heroLabel} title={heroTitle} subtitle={heroSubtitle} />

      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Filter className="w-5 h-5 text-white" />
            <h2 className="text-white text-2xl font-semibold">Filter Teams</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
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
                placeholder="Search by name, leader, or description..."
                className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="church" className="block text-white/90 text-sm mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Church
              </label>
              <select
                id="church"
                value={selectedChurch}
                onChange={(e) => setSelectedChurch(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:outline-none focus:border-white/40 transition-colors"
              >
                {churches.map((church) => (
                  <option key={church} value={church} className="bg-[#F44314] text-white">
                    {church}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="category" className="block text-white/90 text-sm mb-2">
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:outline-none focus:border-white/40 transition-colors"
              >
                {categories.map((category) => (
                  <option key={category} value={category} className="bg-[#F44314] text-white">
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-white/80">{resultsText}</p>
          </div>
        </div>

        {filteredTeams.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team) => (
              <TeamCard key={team._id} team={team} />
            ))}
          </div>
        ) : (
          <StatusCard>
            <p className="text-white text-lg mb-2">No teams found</p>
            <p className="text-white/70 text-sm">
              Try adjusting your filters to find teams in other churches or with different categories.
            </p>
          </StatusCard>
        )}
      </div>
    </div>
  );
}

function buildResultsText(count: number, church: string, category: string, query: string): JSX.Element {
  const parts: string[] = [];
  if (church !== 'All Churches') parts.push(`at ${church}`);
  if (category !== 'All Categories') parts.push(`in ${category}`);
  if (query) parts.push(`matching "${query}"`);

  return (
    <>
      Showing <span className="font-semibold text-white">{count}</span> team{count !== 1 ? 's' : ''}
      {parts.length > 0 && ` ${parts.join(' ')}`}
    </>
  );
}
