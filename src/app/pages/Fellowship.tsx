import { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, UtensilsCrossed, Heart, Users, Clock, Loader2 } from 'lucide-react';

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

const OUTREACH_LABELS: Record<string, string> = {
  food_assistance: 'Food Assistance',
  clothing: 'Clothing',
  health_services: 'Health Services',
  education: 'Education',
  disaster_relief: 'Disaster Response',
  community_development: 'Community Development',
  family_services: 'Family Services',
};

export function Fellowship(): JSX.Element {
  const [conferences, setConferences] = useState<ConferenceInfo[]>([]);
  const [churches, setChurches] = useState<FellowshipChurch[]>([]);
  const [activeConference, setActiveConference] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [mealsOnly, setMealsOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch from backend API (MongoDB)
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

  const mealsCount = churches.filter(c => c.hasMeals).length;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#FFF7ED] to-[#FFF1E6] pt-20 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#F44314] text-sm font-semibold tracking-wider uppercase mb-4">Fellowship</p>
          <h1 className="text-[#1F2937] text-4xl md:text-5xl font-bold mb-4">
            Find Friends, Fellowship and Faith
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
            Come for a meal, meet some kind neighbours, and find a place that you belong. 
            No membership or admission fees required — just come as you are.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-white rounded-full px-5 py-2 shadow-sm">
              <Users className="w-4 h-4 text-[#F44314]" />
              <span className="text-sm font-medium">{churches.length} Communities</span>
            </div>
            {mealsCount > 0 && (
              <div className="flex items-center gap-2 bg-white rounded-full px-5 py-2 shadow-sm">
                <UtensilsCrossed className="w-4 h-4 text-[#F44314]" />
                <span className="text-sm font-medium">{mealsCount} with Weekly Meals</span>
              </div>
            )}
            <div className="flex items-center gap-2 bg-white rounded-full px-5 py-2 shadow-sm">
              <Heart className="w-4 h-4 text-[#F44314]" />
              <span className="text-sm font-medium">Everyone Welcome</span>
            </div>
          </div>
        </div>
      </div>

      {/* Conference Tabs */}
      <div className="max-w-7xl mx-auto px-6 -mt-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-2 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveConference('all')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeConference === 'all'
                ? 'bg-[#F44314] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Regions ({churches.length})
          </button>
          {conferences.map(conf => (
            <button
              key={conf.id}
              onClick={() => setActiveConference(conf.id)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                activeConference === conf.id
                  ? 'bg-[#F44314] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {conf.name} ({conf.churchCount})
            </button>
          ))}
        </div>
      </div>

      {/* Meals Callout */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="bg-[#F44314] text-white rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <UtensilsCrossed className="w-8 h-8 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-lg">Looking for a Free Community Meal?</h3>
              <p className="text-white/80 text-sm">
                {mealsCount > 0
                  ? `${mealsCount} communities serve free weekly meals — everyone is welcome, no questions asked.`
                  : 'We\'re collecting meal data from churches — check back soon for updates.'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setMealsOnly(!mealsOnly)}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors flex-shrink-0 ${
              mealsOnly 
                ? 'bg-white text-[#F44314]' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            {mealsOnly ? '✓ Showing Meal Communities' : 'Show Communities with Meals'}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by community name, city, or address..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#F44314] transition-colors"
          />
        </div>
        <p className="text-sm text-gray-500 mt-3">
          Showing <span className="font-semibold text-[#F44314]">{filtered.length}</span> communit{filtered.length !== 1 ? 'ies' : 'y'}
          {mealsOnly && ' with weekly meals'}
          {activeConference !== 'all' && ` in ${conferences.find(c => c.id === activeConference)?.name || ''}`}
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#F44314] animate-spin" />
        </div>
      )}

      {/* Communities Grid */}
      {!loading && (
        <div className="max-w-7xl mx-auto px-6 pb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(community => (
              <div key={community.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-[#1F2937]">{community.name}</h3>
                    <span className="text-xs text-gray-400 font-medium">{community.conferenceCode}</span>
                  </div>
                  {community.hasMeals && (
                    <span className="flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      <UtensilsCrossed className="w-3 h-3" />
                      Meals
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                  <MapPin className="w-4 h-4" />
                  {community.city}, {community.state}
                </div>

                {community.address && (
                  <p className="text-xs text-gray-400 mb-3 ml-5">{community.address}</p>
                )}

                {community.hasMeals && community.mealDay && (
                  <div className="flex items-center gap-1 text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2 mb-3">
                    <Clock className="w-4 h-4" />
                    Free meal: {community.mealDay}
                  </div>
                )}

                {community.worshipTime && (
                  <div className="text-sm text-gray-500 mb-3">
                    🕐 Worship: {community.worshipTime} {community.sabbathSchoolTime && `• Study: ${community.sabbathSchoolTime}`}
                  </div>
                )}

                {community.outreachFocus.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {community.outreachFocus.map(f => (
                      <span key={f} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {OUTREACH_LABELS[f] || f}
                      </span>
                    ))}
                  </div>
                )}

                {(community.teamCount > 0 || community.serviceCount > 0) && (
                  <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400">
                    {community.teamCount > 0 && (
                      <span><Users className="w-3 h-3 inline mr-1" />{community.teamCount} team{community.teamCount !== 1 ? 's' : ''}</span>
                    )}
                    {community.serviceCount > 0 && (
                      <span>{community.serviceCount} service{community.serviceCount !== 1 ? 's' : ''}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No communities found matching your search.</p>
              <button 
                onClick={() => { setSearch(''); setActiveConference('all'); setMealsOnly(false); }}
                className="mt-4 text-[#F44314] font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* CTA */}
      <div className="bg-[#FFF7ED] py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#1F2937] mb-4">
            Want to List Your Community?
          </h2>
          <p className="text-gray-600 mb-6">
            If your Adventist community runs services, meals, or programs that welcome the public, 
            we want to feature you. Get in touch and we&apos;ll add you to the directory.
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
