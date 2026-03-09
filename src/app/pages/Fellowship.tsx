import { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, UtensilsCrossed, Heart, Users, Clock } from 'lucide-react';

// Rotating default images for communities that have no photo
const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1438032005730-c779502df39b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1609234656388-0ff363383899?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1559027615-cd4628902d4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
];

const INITIAL_COUNT = 12;
const LOAD_MORE_COUNT = 12;

interface ChurchData {
  id: string;
  name: string;
  conference: string;
  city: string;
  state: string;
  address: string | null;
  postcode: string | null;
  worshipTime: string;
  sabbathSchoolTime: string;
  pastorName: string | null;
  hasKitchen: boolean | null;
  hasMeals: boolean | null;
  mealDay: string | null;
  outreachFocus: string[];
  teamCount: number;
  serviceCount: number;
  website: string | null;
  phone: string | null;
  isActive: boolean;
}

interface FellowshipChurch {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string | null;
  conference: string;
  conferenceCode: string;
  conferenceId: string;
  hasKitchen: boolean;
  hasMeals: boolean;
  mealDay: string | null;
  worshipTime: string | null;
  sabbathSchoolTime: string | null;
  outreachFocus: string[];
  teamCount: number;
  serviceCount: number;
}

interface ConferenceInfo {
  id: string;
  name: string;
  code: string;
  churchCount: number;
}

const CONFERENCE_NAMES: Record<string, string> = {
  SNSW: 'South NSW',
  NNSW: 'North NSW',
  VIC: 'Victoria',
  SQ: 'South Queensland',
  NQ: 'North Queensland',
  SA: 'South Australia',
  WA: 'Western Australia',
  TAS: 'Tasmania',
};

function mapChurchData(raw: ChurchData[]): { churches: FellowshipChurch[]; conferences: ConferenceInfo[] } {
  const confCounts: Record<string, number> = {};
  const churches: FellowshipChurch[] = raw
    .filter(c => c.isActive)
    .map(c => {
      confCounts[c.conference] = (confCounts[c.conference] || 0) + 1;
      return {
        id: c.id,
        name: c.name,
        city: c.city,
        state: c.state,
        address: c.address,
        conference: CONFERENCE_NAMES[c.conference] || c.conference,
        conferenceCode: c.conference,
        conferenceId: c.conference.toLowerCase(),
        hasKitchen: c.hasKitchen === true,
        hasMeals: c.hasMeals === true,
        mealDay: c.mealDay,
        worshipTime: c.worshipTime,
        sabbathSchoolTime: c.sabbathSchoolTime,
        outreachFocus: c.outreachFocus,
        teamCount: c.teamCount,
        serviceCount: c.serviceCount,
      };
    });

  const conferences: ConferenceInfo[] = Object.entries(confCounts).map(([code, count]) => ({
    id: code.toLowerCase(),
    name: CONFERENCE_NAMES[code] || code,
    code,
    churchCount: count,
  }));

  return { churches, conferences };
}

function getStateBadgeColor(state?: string | null): string {
  switch (state?.toUpperCase()) {
    case 'ACT': return 'bg-blue-500/20 text-blue-200';
    case 'VIC': return 'bg-purple-500/20 text-purple-200';
    default:    return 'bg-white/20 text-white';
  }
}

interface CommunityCardProps {
  community: FellowshipChurch;
  imageIndex: number;
}

function CommunityCard({ community, imageIndex }: CommunityCardProps): JSX.Element {
  const imageUrl = DEFAULT_IMAGES[imageIndex % DEFAULT_IMAGES.length];

  return (
    <div className="h-full hover:-translate-y-1 transition-transform duration-200">
      {/* Outer card — gray bezel */}
      <div className="rounded-3xl transition-all duration-300 h-full p-3 group" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.2) 100%)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.04), 0 4px 24px rgba(0,0,0,0.08)' }}>
        {/* Inner image with text overlay */}
        <div className="relative rounded-2xl overflow-hidden h-full min-h-[280px]">
          {/* Background image */}
          <img
            src={imageUrl}
            alt={community.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Gradient overlay — bottom-heavy */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

          {/* State badge — top right */}
          {community.state && (
            <div className="absolute top-3 right-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${getStateBadgeColor(community.state)}`}>
                {community.state}
              </span>
            </div>
          )}

          {/* Meals badge — top left */}
          {community.hasMeals && (
            <div className="absolute top-3 left-3">
              <span className="flex items-center gap-1 bg-green-500/80 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                <UtensilsCrossed className="w-3 h-3" />
                Free Meals
              </span>
            </div>
          )}

          {/* Content overlay — bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white text-lg font-bold leading-snug mb-0.5">{community.name}</h3>

            <p className="text-white/70 text-xs flex items-center gap-1 mb-2">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              {community.city}, {community.state}
            </p>

            {/* Quick info */}
            <div className="space-y-1 mb-3">
              {community.hasMeals && community.mealDay && (
                <div className="flex items-center gap-1.5 text-white/80 text-xs">
                  <Clock className="w-3 h-3 flex-shrink-0 text-green-300" />
                  <span>Free meal: <span className="text-white font-medium">{community.mealDay}</span></span>
                </div>
              )}
              {community.worshipTime && (
                <div className="flex items-center gap-1.5 text-white/70 text-xs">
                  <span>🕐</span>
                  <span>Worship: <span className="text-white/90">{community.worshipTime}</span>
                    {community.sabbathSchoolTime && (
                      <span className="text-white/50"> · Study: {community.sabbathSchoolTime}</span>
                    )}
                  </span>
                </div>
              )}
              {!community.worshipTime && !community.hasMeals && (
                <p className="text-white/40 text-xs italic">Contact for service times</p>
              )}
            </div>

            {/* Bottom bar */}
            <div className="flex items-center justify-between">
              {(community.teamCount > 0 || community.serviceCount > 0) && (
                <span className="text-white/50 text-xs">
                  {community.teamCount > 0 && `${community.teamCount} team${community.teamCount !== 1 ? 's' : ''}`}
                  {community.teamCount > 0 && community.serviceCount > 0 && ' · '}
                  {community.serviceCount > 0 && `${community.serviceCount} service${community.serviceCount !== 1 ? 's' : ''}`}
                </span>
              )}
              <span className="ml-auto text-[#1F2937] text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.8)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)' }}>
                {community.conference}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Fellowship(): JSX.Element {
  const [conferences, setConferences] = useState<ConferenceInfo[]>([]);
  const [churches, setChurches] = useState<FellowshipChurch[]>([]);
  const [activeConference, setActiveConference] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [mealsOnly, setMealsOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  useEffect(() => {
    async function fetchData() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${apiUrl}/api/public/fellowship`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.churches) {
            setChurches(data.churches);
            setConferences(data.conferences || []);
            return;
          }
        }
      } catch {
        // API unavailable
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleFilterChange = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setVisibleCount(INITIAL_COUNT);
  };

  const filtered = useMemo(() => {
    return churches.filter(c => {
      if (activeConference !== 'all' && c.conferenceId !== activeConference) return false;
      if (mealsOnly && !c.hasMeals) return false;
      if (search) {
        const q = search.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) || (c.address && c.address.toLowerCase().includes(q));
      }
      return true;
    }).sort((a, b) => {
      if (a.hasMeals && !b.hasMeals) return -1;
      if (!a.hasMeals && b.hasMeals) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [churches, activeConference, search, mealsOnly]);

  const visibleCommunities = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;
  const mealsCount = churches.filter(c => c.hasMeals).length;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero — video background matching site style */}
      <div className="relative h-[460px] md:h-[520px] overflow-hidden">
        <iframe
          src="https://www.youtube-nocookie.com/embed/Mzwy_gkPjbw?autoplay=1&mute=1&loop=1&playlist=Mzwy_gkPjbw&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&start=50"
          allow="autoplay; encrypted-media"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ width: 'max(100%, 177.78vh)', height: 'max(100%, 56.25vw)' }}
          title="ACS background video"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
        <div className="relative h-full flex items-end pb-10">
          <div className="max-w-4xl mx-auto px-6 text-center w-full">
            <p className="text-white/80 text-sm font-semibold tracking-wider uppercase mb-4">Fellowship</p>
            <h1 className="text-white text-5xl md:text-6xl font-bold mb-4 leading-tight">
              Find Friends, Fellowship and Faith
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              Come for a meal, meet kind neighbours, and find a place you belong.
              No membership or admission fees — just come as you are.
            </p>
            {/* Search in hero */}
            <div className="max-w-xl mx-auto">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.2) 100%)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 4px 24px rgba(0,0,0,0.08)' }}>
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setVisibleCount(INITIAL_COUNT); }}
                  placeholder="Search communities, cities, or addresses..."
                  className="flex-1 bg-transparent outline-none text-gray-900 text-sm placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-[#F8F7F5] border-b border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4 text-[#F44314]" />
            <span><span className="font-semibold text-[#1F2937]">{churches.length}</span> Communities</span>
          </div>
          {mealsCount > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <UtensilsCrossed className="w-4 h-4 text-[#F44314]" />
              <span><span className="font-semibold text-[#1F2937]">{mealsCount}</span> with Weekly Meals</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Heart className="w-4 h-4 text-[#F44314]" />
            <span className="font-semibold text-[#1F2937]">Everyone Welcome</span>
          </div>
        </div>
      </div>

      <div className="bg-white py-10">
        <div className="max-w-7xl mx-auto px-6">

          {/* Compact filter bar */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-gray-500 text-xs font-medium uppercase tracking-wide">Filter by</span>

            {/* Conference tabs */}
            <button
              onClick={() => handleFilterChange(setActiveConference)('all')}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                activeConference === 'all'
                  ? 'bg-[#F44314] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Regions
            </button>
            {conferences.map(conf => (
              <button
                key={conf.id}
                onClick={() => handleFilterChange(setActiveConference)(conf.id)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  activeConference === conf.id
                    ? 'bg-[#F44314] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {conf.name}
              </button>
            ))}

            {/* Meals toggle */}
            <button
              onClick={() => { setMealsOnly(!mealsOnly); setVisibleCount(INITIAL_COUNT); }}
              className={`ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors border ${
                mealsOnly
                  ? 'bg-green-50 border-green-300 text-green-700'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-green-300'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              {mealsOnly ? '✓ Meals only' : 'With meals'}
            </button>

            {(search || activeConference !== 'all' || mealsOnly) && (
              <button
                onClick={() => { setSearch(''); setActiveConference('all'); setMealsOnly(false); setVisibleCount(INITIAL_COUNT); }}
                className="text-[#F44314] text-xs font-semibold hover:underline"
              >
                Clear filters
              </button>
            )}

            <span className="text-gray-400 text-xs">
              {filtered.length} communit{filtered.length !== 1 ? 'ies' : 'y'}
              {mealsOnly && ' with meals'}
              {activeConference !== 'all' && ` in ${conferences.find(c => c.id === activeConference)?.name || ''}`}
              {search && ` matching "${search}"`}
            </span>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F44314]" />
            </div>
          )}

          {/* Community Grid */}
          {!loading && visibleCommunities.length > 0 && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleCommunities.map((community, index) => (
                  <CommunityCard key={community.id} community={community} imageIndex={index} />
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="mt-10 text-center">
                  <button
                    onClick={() => setVisibleCount(prev => prev + LOAD_MORE_COUNT)}
                    className="inline-flex items-center gap-2 bg-[#F44314] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#d93a10] transition-colors shadow-sm"
                  >
                    View More Communities
                    <span className="text-white/70 text-sm">
                      ({filtered.length - visibleCount} remaining)
                    </span>
                  </button>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-[#F8F7F5] border border-gray-200 rounded-2xl p-12 max-w-lg mx-auto">
                <p className="text-[#1F2937] text-xl font-semibold mb-2">No communities found</p>
                <p className="text-gray-500 mb-6">
                  {churches.length === 0
                    ? 'No communities have been listed yet. Check back soon.'
                    : 'Try adjusting your filters or search term.'}
                </p>
                {(search || activeConference !== 'all' || mealsOnly) && (
                  <button
                    onClick={() => { setSearch(''); setActiveConference('all'); setMealsOnly(false); }}
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

      {/* CTA */}
      <div className="bg-[#FFF7ED] py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
            Want to List Your Community?
          </h2>
          <p className="text-gray-600 mb-6">
            If your Adventist community runs services, meals, or programs that welcome the public,
            we want to feature you. Get in touch and we'll add you to the directory.
          </p>
          <a
            href="/contact"
            className="inline-block bg-[#F44314] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#d93a11] transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  );
}
