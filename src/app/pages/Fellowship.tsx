import { useState, useMemo } from 'react';
import { Search, MapPin, UtensilsCrossed, Heart, Users, Clock } from 'lucide-react';

// Every Adventist church community in SNSW + NNSW — public-facing, no auth needed
const COMMUNITIES = [
  // SNSW Conference
  { name: 'Canberra National', city: 'Canberra City', state: 'ACT', conference: 'SNSW', meals: true, mealDay: 'Saturday lunch', members: 156, services: ['Food Pantry', 'Community Garden'] },
  { name: 'Canberra Calvary', city: 'Canberra', state: 'ACT', conference: 'SNSW', meals: false, members: 85, services: ['Bible Study'] },
  { name: 'Wagga Wagga', city: 'Wagga Wagga', state: 'NSW', conference: 'SNSW', meals: true, mealDay: 'Saturday lunch', members: 72, services: ['Op Shop', 'Food Pantry'] },
  { name: 'Albury', city: 'Albury', state: 'NSW', conference: 'SNSW', meals: true, mealDay: 'Saturday lunch', members: 65, services: ['Community Meals'] },
  { name: 'Griffith', city: 'Griffith', state: 'NSW', conference: 'SNSW', meals: false, members: 45, services: [] },
  { name: 'Tumut', city: 'Tumut', state: 'NSW', conference: 'SNSW', meals: false, members: 28, services: ['Community Outreach'] },
  { name: 'Tumbarumba', city: 'Tumbarumba', state: 'NSW', conference: 'SNSW', meals: false, members: 15, services: [] },
  { name: 'Young', city: 'Young', state: 'NSW', conference: 'SNSW', meals: false, members: 30, services: [] },
  { name: 'Bega', city: 'Bega', state: 'NSW', conference: 'SNSW', meals: true, mealDay: 'Saturday lunch', members: 40, services: ['Food Pantry'] },
  { name: 'Nowra', city: 'Nowra', state: 'NSW', conference: 'SNSW', meals: false, members: 55, services: ['Op Shop'] },
  { name: 'Wollongong', city: 'Wollongong', state: 'NSW', conference: 'SNSW', meals: true, mealDay: 'Saturday lunch', members: 120, services: ['Food Pantry', 'Counselling'] },
  { name: 'Campbelltown', city: 'Campbelltown', state: 'NSW', conference: 'SNSW', meals: false, members: 95, services: ['Youth Programs'] },
  { name: 'Liverpool', city: 'Liverpool', state: 'NSW', conference: 'SNSW', meals: true, mealDay: 'Saturday lunch', members: 110, services: ['Food Pantry', 'Community Meals'] },
  { name: 'Hurstville', city: 'Hurstville', state: 'NSW', conference: 'SNSW', meals: false, members: 130, services: ['Health Programs'] },
  { name: 'Bathurst', city: 'Bathurst', state: 'NSW', conference: 'SNSW', meals: false, members: 35, services: [] },
  { name: 'Orange', city: 'Orange', state: 'NSW', conference: 'SNSW', meals: false, members: 40, services: ['Op Shop'] },
  { name: 'Dubbo', city: 'Dubbo', state: 'NSW', conference: 'SNSW', meals: true, mealDay: 'Saturday lunch', members: 50, services: ['Food Pantry'] },
  // NNSW Conference
  { name: 'Newcastle', city: 'Newcastle', state: 'NSW', conference: 'NNSW', meals: true, mealDay: 'Saturday lunch', members: 140, services: ['Food Pantry', 'Counselling'] },
  { name: 'Maitland', city: 'Maitland', state: 'NSW', conference: 'NNSW', meals: false, members: 60, services: ['Disaster Response'] },
  { name: 'Port Macquarie', city: 'Port Macquarie', state: 'NSW', conference: 'NNSW', meals: true, mealDay: 'Saturday lunch', members: 75, services: ['Food Pantry', 'Disaster Response'] },
  { name: 'Coffs Harbour', city: 'Coffs Harbour', state: 'NSW', conference: 'NNSW', meals: true, mealDay: 'Saturday lunch', members: 90, services: ['Op Shop', 'Food Pantry'] },
  { name: 'Tamworth', city: 'Tamworth', state: 'NSW', conference: 'NNSW', meals: false, members: 55, services: ['Food Pantry'] },
  { name: 'Armidale', city: 'Armidale', state: 'NSW', conference: 'NNSW', meals: false, members: 30, services: [] },
  { name: 'Lismore', city: 'Lismore', state: 'NSW', conference: 'NNSW', meals: true, mealDay: 'Saturday lunch', members: 65, services: ['Disaster Response', 'Food Pantry'] },
  { name: 'Tweed Heads', city: 'Tweed Heads', state: 'NSW', conference: 'NNSW', meals: false, members: 50, services: ['Op Shop'] },
  { name: 'Kingscliff', city: 'Kingscliff', state: 'NSW', conference: 'NNSW', meals: false, members: 45, services: ['Op Shop'] },
  { name: 'Toronto', city: 'Toronto', state: 'NSW', conference: 'NNSW', meals: false, members: 70, services: ['Community Garden'] },
  { name: 'Avondale', city: 'Cooranbong', state: 'NSW', conference: 'NNSW', meals: true, mealDay: 'Saturday lunch', members: 350, services: ['Health Programs', 'Food Pantry', 'Youth Programs'] },
];

export function Fellowship(): JSX.Element {
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('All');
  const [mealsOnly, setMealsOnly] = useState(false);

  const states = useMemo(() => {
    const unique = [...new Set(COMMUNITIES.map(c => c.state))].sort();
    return ['All', ...unique];
  }, []);

  const filtered = useMemo(() => {
    return COMMUNITIES.filter(c => {
      if (stateFilter !== 'All' && c.state !== stateFilter) return false;
      if (mealsOnly && !c.meals) return false;
      if (search) {
        const q = search.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q);
      }
      return true;
    }).sort((a, b) => {
      // Meals first, then alphabetical
      if (a.meals && !b.meals) return -1;
      if (!a.meals && b.meals) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [search, stateFilter, mealsOnly]);

  const mealsCount = COMMUNITIES.filter(c => c.meals).length;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#FFF7ED] to-[#FFF1E6] py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#F44314] text-sm font-semibold tracking-wider uppercase mb-4">Fellowship</p>
          <h1 className="text-[#1F2937] text-4xl md:text-5xl font-bold mb-4">
            Find Friendship, Faith & Fellowship
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
            Every Adventist community welcomes you with open arms. Come for a visit, stay for a meal, 
            and find a place to belong. No membership required — just show up.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 bg-white rounded-full px-5 py-2 shadow-sm">
              <Users className="w-4 h-4 text-[#F44314]" />
              <span className="text-sm font-medium">{COMMUNITIES.length} Communities</span>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-full px-5 py-2 shadow-sm">
              <UtensilsCrossed className="w-4 h-4 text-[#F44314]" />
              <span className="text-sm font-medium">{mealsCount} with Weekly Meals</span>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-full px-5 py-2 shadow-sm">
              <Heart className="w-4 h-4 text-[#F44314]" />
              <span className="text-sm font-medium">Everyone Welcome</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Meals Callout */}
      <div className="max-w-7xl mx-auto px-6 -mt-6">
        <div className="bg-[#F44314] text-white rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <UtensilsCrossed className="w-8 h-8 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-lg">Looking for a Free Community Meal?</h3>
              <p className="text-white/80 text-sm">
                {mealsCount} communities serve free weekly meals — everyone is welcome, no questions asked.
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

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by community name or city..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#F44314] transition-colors"
            />
          </div>
          <select
            value={stateFilter}
            onChange={e => setStateFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#F44314] bg-white"
          >
            {states.map(s => (
              <option key={s} value={s}>{s === 'All' ? 'All States' : s}</option>
            ))}
          </select>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          Showing <span className="font-semibold text-[#F44314]">{filtered.length}</span> communit{filtered.length !== 1 ? 'ies' : 'y'}
          {mealsOnly && ' with weekly meals'}
        </p>
      </div>

      {/* Communities Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(community => (
            <div key={community.name} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-[#1F2937]">{community.name}</h3>
                {community.meals && (
                  <span className="flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                    <UtensilsCrossed className="w-3 h-3" />
                    Meals
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                <MapPin className="w-4 h-4" />
                {community.city}, {community.state}
              </div>

              {community.meals && community.mealDay && (
                <div className="flex items-center gap-1 text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2 mb-3">
                  <Clock className="w-4 h-4" />
                  Free meal: {community.mealDay}
                </div>
              )}

              {community.services.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {community.services.map(s => (
                    <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {s}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">
                  <Users className="w-3 h-3 inline mr-1" />
                  Community of ~{community.members}
                </span>
                <span className="text-[#F44314] text-sm font-medium hover:underline cursor-pointer">
                  Visit →
                </span>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No communities found matching your search.</p>
            <button 
              onClick={() => { setSearch(''); setStateFilter('All'); setMealsOnly(false); }}
              className="mt-4 text-[#F44314] font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

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
