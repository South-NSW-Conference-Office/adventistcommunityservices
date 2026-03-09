import { useState, useMemo } from 'react';
import { ServiceCard } from '../components/ServiceCard';
import { Search, RefreshCw, ShoppingBag, Apple, UtensilsCrossed, AlertTriangle, HeartPulse, Users, Home, Brain, BookOpen, Flower2 } from 'lucide-react';
import { useServices } from '../hooks/useServices';
import { useCMSPage } from '../hooks/useCMSContent';

const SERVICE_TYPES = [
  { value: 'op_shop', name: 'Op Shop', icon: ShoppingBag },
  { value: 'food_pantry', name: 'Food Pantry', icon: Apple },
  { value: 'soup_kitchen', name: 'Soup Kitchen', icon: UtensilsCrossed },
  { value: 'disaster_response', name: 'Disaster Response', icon: AlertTriangle },
  { value: 'health_program', name: 'Health Program', icon: HeartPulse },
  { value: 'youth_outreach', name: 'Youth Outreach', icon: Users },
  { value: 'emergency_shelter', name: 'Emergency Shelter', icon: Home },
  { value: 'counseling_service', name: 'Counseling', icon: Brain },
  { value: 'education_program', name: 'Education', icon: BookOpen },
  { value: 'community_garden', name: 'Community Garden', icon: Flower2 },
];

function getTeamName(service: any): string {
  if (service.teamId?.name) return service.teamId.name;
  if (service.churchId?.name) return service.churchId.name;
  return '';
}

export function Services(): JSX.Element {
  const { getBlock } = useCMSPage('services');
  const { services, loading, error, refetch } = useServices();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const heroLabel = getBlock('hero', 'section_label') || 'Services Directory';
  const heroTitle = getBlock('hero', 'title') || 'Find a Service';
  const heroSubtitle =
    getBlock('hero', 'subtitle') ||
    'Find the help you need close to home. Our services are run by caring volunteers who are here to support you.';

  const { serviceTypeCounts, filteredServices } = useMemo(() => {
    const typeCounts: Record<string, number> = {};
    const searchLower = searchQuery.toLowerCase();

    SERVICE_TYPES.forEach(type => { typeCounts[type.value] = 0; });

    services.forEach(service => {
      const sType = service.type;
      if (sType && typeCounts[sType] !== undefined) {
        typeCounts[sType]++;
      }
    });

    const filtered = services.filter(service => {
      const typeMatch = !selectedType || service.type === selectedType;
      const searchMatch = !searchQuery ||
        service.name.toLowerCase().includes(searchLower) ||
        (service.descriptionShort && service.descriptionShort.toLowerCase().includes(searchLower)) ||
        getTeamName(service).toLowerCase().includes(searchLower);
      return typeMatch && searchMatch;
    });

    return { serviceTypeCounts: typeCounts, filteredServices: filtered };
  }, [services, searchQuery, selectedType]);

  return (
    <div>
      {/* Hero */}
      <div className="relative h-[420px] md:h-[500px] overflow-hidden">
        {/* YouTube video background */}
        <iframe
          src="https://www.youtube-nocookie.com/embed/Mzwy_gkPjbw?autoplay=1&mute=1&loop=1&playlist=Mzwy_gkPjbw&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&start=30"
          allow="autoplay; encrypted-media"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ width: 'max(100%, 177.78vh)', height: 'max(100%, 56.25vw)' }}
          title="ACS background video"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />

        <div className="relative h-full flex items-end pb-12">
        <div className="max-w-4xl mx-auto px-6 text-center w-full">
          <p className="text-white/80 text-sm font-semibold tracking-wider uppercase mb-4">{heroLabel}</p>
          <h1 className="text-white text-5xl md:text-6xl font-bold mb-6 leading-tight">{heroTitle}</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">{heroSubtitle}</p>

          {/* Search */}
          <div className="mt-10 max-w-xl mx-auto">
            <div className="flex items-center gap-3 px-5 py-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.2) 100%)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 4px 24px rgba(0,0,0,0.08)' }}>
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What do you need help with today?"
                className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Service Type Cards */}
      <div className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-[#1F2937] text-2xl font-bold mb-8">Browse by Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {SERVICE_TYPES.map((st) => {
              const Icon = st.icon;
              const isSelected = selectedType === st.value;
              return (
                <button
                  key={st.value}
                  onClick={() => setSelectedType(isSelected ? null : st.value)}
                  className={`rounded-2xl p-5 text-center transition-all ${isSelected ? 'ring-2 ring-[#F44314]' : ''}`}
                  style={{ background: isSelected ? 'linear-gradient(135deg, rgba(244,67,20,0.15) 0%, rgba(244,67,20,0.05) 100%)' : 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.2) 100%)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: isSelected ? '1px solid rgba(244,67,20,0.4)' : '1px solid rgba(255,255,255,0.6)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.04), 0 4px 24px rgba(0,0,0,0.06)' }}
                >
                  <Icon className={`w-7 h-7 mx-auto mb-3 ${isSelected ? 'text-[#F44314]' : 'text-gray-400'}`} />
                  <h3 className={`font-semibold text-sm mb-1 ${isSelected ? 'text-[#F44314]' : 'text-[#1F2937]'}`}>{st.name}</h3>
                  <p className="text-gray-500 text-xs">
                    {serviceTypeCounts[st.value]} {serviceTypeCounts[st.value] === 1 ? 'team' : 'teams'}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* All Services */}
      <div className="bg-[#F8F7F5] py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[#1F2937] text-2xl font-bold">
              {selectedType
                ? `${SERVICE_TYPES.find(s => s.value === selectedType)?.name} Services`
                : 'All Services'}
            </h2>
            <p className="text-gray-500 text-sm">{filteredServices.length} result{filteredServices.length !== 1 ? 's' : ''}</p>
          </div>

          {loading && (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F44314]"></div>
            </div>
          )}

          {error && (
            <div className="text-center py-16">
              <p className="text-gray-700 mb-4">{error}</p>
              <button
                onClick={() => refetch()}
                className="inline-flex items-center gap-2 bg-[#F44314] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#d93a10]"
              >
                <RefreshCw className="w-5 h-5" /> Try Again
              </button>
            </div>
          )}

          {!loading && !error && filteredServices.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => {
                const teamName = getTeamName(service);
                return (
                  <ServiceCard
                    key={service._id}
                    id={service._id}
                    name={service.name}
                    descriptionShort={service.descriptionShort}
                    locations={service.locations}
                    capacity={service.capacity}
                    primaryImage={service.primaryImage}
                    teamName={teamName}
                  />
                );
              })}
            </div>
          )}

          {!loading && !error && filteredServices.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[#1F2937] text-xl font-semibold mb-2">
                {searchQuery || selectedType ? 'No services found' : 'Services coming soon'}
              </p>
              <p className="text-gray-500 mb-6">
                {searchQuery || selectedType
                  ? 'Try different search terms or browse all categories. We might still be able to help!'
                  : 'Our teams are setting up their services. Please check back soon or contact us directly for immediate help.'}
              </p>
              {(searchQuery || selectedType) && (
                <button
                  onClick={() => { setSearchQuery(''); setSelectedType(null); }}
                  className="text-[#F44314] font-semibold hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
