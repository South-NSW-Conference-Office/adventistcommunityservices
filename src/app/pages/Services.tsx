import { useState, useMemo } from 'react';
import { ServiceCard } from '../components/ServiceCard';
import { MapPin, Search, RefreshCw } from 'lucide-react';
import { useServices } from '../hooks/useServices';
import { useCMSPage } from '../hooks/useCMSContent';

// Service type categories for the directory
const SERVICE_TYPES = [
  'Op Shop',
  'Food Pantry',
  'Soup Kitchen',
  'Disaster Response',
  'Health Program',
  'Youth Outreach',
  'Emergency Shelter',
  'Counseling',
  'Education',
  'Community Garden'
];

interface ServiceLocation {
  label?: string;
  address?: {
    suburb?: string;
    state?: string;
  };
}

function getLocationString(locations: ServiceLocation[] | undefined): string {
  if (!locations || locations.length === 0) return '';
  const loc = locations[0];
  if (loc.address) {
    const { suburb, state } = loc.address;
    if (suburb && state) return `${suburb}, ${state}`;
    return state || '';
  }
  return loc.label || '';
}

function getTeamName(service: any): string {
  if (service.teamId?.name) return service.teamId.name;
  if (service.churchId?.name) return service.churchId.name;
  return 'Unknown Team';
}

interface HeroSectionProps {
  label: string;
  title: string;
  subtitle?: string;
  showFullDecorations?: boolean;
}

function HeroSection({ label, title, subtitle, showFullDecorations = false }: HeroSectionProps): JSX.Element {
  return (
    <div className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-white/10 blur-3xl"></div>
          {showFullDecorations && (
            <>
              <div className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-white/30"></div>
              <div className="absolute top-1/3 left-1/3 w-3 h-3 rounded-full bg-white/20"></div>
            </>
          )}
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

interface StatusCardProps {
  children: React.ReactNode;
}

function StatusCard({ children }: StatusCardProps): JSX.Element {
  return (
    <div className="max-w-7xl mx-auto px-6 pb-24">
      <div className="text-center py-16">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-12 max-w-md mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Services(): JSX.Element {
  const { getBlock } = useCMSPage('services');
  const { services, loading, error, refetch } = useServices();
  const [searchQuery, setSearchQuery] = useState('');

  const heroLabel = getBlock('hero', 'section_label') || 'Services Directory';
  const heroTitle = getBlock('hero', 'title') || 'Find a Service';
  const heroSubtitle =
    getBlock('hero', 'subtitle') ||
    'Browse community services by type or search for specific services. Each service type shows how many teams offer it across Australia.';

  // Calculate service type counts and filter services
  const { serviceTypeCounts, filteredServices } = useMemo(() => {
    const typeCounts: Record<string, number> = {};
    const searchLower = searchQuery.toLowerCase();

    // Initialize all service types to 0
    SERVICE_TYPES.forEach(type => {
      typeCounts[type] = 0;
    });

    // Count services by type and filter by search
    services.forEach(service => {
      const serviceType = service.category || service.type;
      if (serviceType && SERVICE_TYPES.includes(serviceType)) {
        typeCounts[serviceType]++;
      }
    });

    // Filter services by search query
    const filtered = services.filter(service => {
      if (!searchQuery) return true;
      
      const teamName = getTeamName(service);
      return (
        service.name.toLowerCase().includes(searchLower) ||
        (service.descriptionShort && service.descriptionShort.toLowerCase().includes(searchLower)) ||
        teamName.toLowerCase().includes(searchLower) ||
        (service.category && service.category.toLowerCase().includes(searchLower)) ||
        (service.type && service.type.toLowerCase().includes(searchLower))
      );
    });

    return { serviceTypeCounts: typeCounts, filteredServices: filtered };
  }, [services, searchQuery]);

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
        <StatusCard>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F44314] via-[#F97023] to-[#F98344]">
      <HeroSection label={heroLabel} title={heroTitle} subtitle={heroSubtitle} showFullDecorations />

      <div className="max-w-7xl mx-auto px-6 pb-24">
        {/* Search Bar */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Search className="w-5 h-5 text-white" />
            <h2 className="text-white text-2xl font-semibold">Search Services</h2>
          </div>
          
          <div className="max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services, teams, or categories..."
              className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
            />
          </div>
        </div>

        {/* Service Type Cards */}
        <div className="mb-16">
          <h2 className="text-white text-2xl font-semibold mb-6">Browse by Service Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {SERVICE_TYPES.map((serviceType) => (
              <div
                key={serviceType}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-all cursor-pointer"
              >
                <h3 className="text-white font-semibold mb-2">{serviceType}</h3>
                <p className="text-white/80 text-sm">
                  {serviceTypeCounts[serviceType]} {serviceTypeCounts[serviceType] === 1 ? 'team' : 'teams'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* All Services List */}
        <div>
          <h2 className="text-white text-2xl font-semibold mb-6">
            All Services {searchQuery && `(${filteredServices.length} results)`}
          </h2>
          
          {filteredServices.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <div key={service._id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:bg-white/20 transition-all">
                  <ServiceCard
                    id={service._id}
                    name={service.name}
                    descriptionShort={service.descriptionShort}
                    locations={service.locations}
                    capacity={service.capacity}
                    primaryImage={service.primaryImage}
                  />
                  <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <span>Provided by</span>
                      <span className="font-semibold text-white">{getTeamName(service)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <StatusCard>
              <p className="text-white text-lg mb-2">
                {searchQuery ? 'No services match your search' : 'No services available'}
              </p>
              <p className="text-white/70 text-sm">
                {searchQuery 
                  ? 'Try different search terms to find more services.' 
                  : 'Check back soon as more teams add their services to the platform.'}
              </p>
            </StatusCard>
          )}
        </div>
      </div>
    </div>
  );
}


