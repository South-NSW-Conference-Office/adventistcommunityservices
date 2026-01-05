import { useState, useMemo } from 'react';
import { ServiceCard } from '../components/ServiceCard';
import { MapPin, Filter, RefreshCw } from 'lucide-react';
import { useServices } from '../hooks/useServices';

export function Services() {
  const { services, loading, error, refetch } = useServices();
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedChurch, setSelectedChurch] = useState('All Churches');

  // Derive unique locations and churches from fetched data
  const { locations, churches } = useMemo(() => {
    const locationSet = new Set<string>();
    const churchSet = new Set<string>();

    services.forEach((service) => {
      // Extract location from locations array
      if (service.locations && service.locations.length > 0) {
        const loc = service.locations[0];
        if (loc.address) {
          const { suburb, state } = loc.address;
          if (suburb && state) {
            locationSet.add(`${suburb}, ${state}`);
          } else if (state) {
            locationSet.add(state);
          }
        } else if (loc.label) {
          locationSet.add(loc.label);
        }
      }

      // Extract church name
      if (service.churchId?.name) {
        churchSet.add(service.churchId.name);
      }
    });

    return {
      locations: ['All Locations', ...Array.from(locationSet).sort()],
      churches: ['All Churches', ...Array.from(churchSet).sort()],
    };
  }, [services]);

  // Filter services based on selected filters
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      // Location filter
      let locationMatch = selectedLocation === 'All Locations';
      if (!locationMatch && service.locations && service.locations.length > 0) {
        const loc = service.locations[0];
        if (loc.address) {
          const { suburb, state } = loc.address;
          const locationStr =
            suburb && state ? `${suburb}, ${state}` : suburb || state || '';
          locationMatch = locationStr === selectedLocation;
        } else if (loc.label) {
          locationMatch = loc.label === selectedLocation;
        }
      }

      // Church filter
      const churchMatch =
        selectedChurch === 'All Churches' ||
        service.churchId?.name === selectedChurch;

      return locationMatch && churchMatch;
    });
  }, [services, selectedLocation, selectedChurch]);

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
            <p className="text-white/90 text-sm tracking-wider uppercase mb-4">Our Services</p>
            <h1 className="text-white text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Find Support In Your Community
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
            <p className="text-white/90 text-sm tracking-wider uppercase mb-4">Our Services</p>
            <h1 className="text-white text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Find Support In Your Community
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
          <p className="text-white/90 text-sm tracking-wider uppercase mb-4">Our Services</p>
          <h1 className="text-white text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Find Support In Your Community
          </h1>
          <p className="text-white/90 text-lg leading-relaxed max-w-3xl mx-auto">
            Discover the range of community services available across Australia. Filter by location
            or church to find support near you.
          </p>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        {/* Filters */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Filter className="w-5 h-5 text-white" />
            <h2 className="text-white text-2xl font-semibold">Filter Services</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Location Filter */}
            <div>
              <label
                htmlFor="location"
                className="block text-white/90 text-sm mb-2 flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                Location
              </label>
              <select
                id="location"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:outline-none focus:border-white/40 transition-colors"
              >
                {locations.map((location) => (
                  <option key={location} value={location} className="bg-[#F44314] text-white">
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Church Filter */}
            <div>
              <label htmlFor="church" className="block text-white/90 text-sm mb-2">
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
          </div>

          {/* Results Count */}
          <div className="mt-6">
            <p className="text-white/80">
              Showing{' '}
              <span className="font-semibold text-white">{filteredServices.length}</span> service
              {filteredServices.length !== 1 ? 's' : ''}
              {selectedLocation !== 'All Locations' && ` in ${selectedLocation}`}
              {selectedChurch !== 'All Churches' && ` at ${selectedChurch}`}
            </p>
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service._id}
                id={service._id}
                name={service.name}
                descriptionShort={service.descriptionShort}
                locations={service.locations}
                capacity={service.capacity}
                primaryImage={service.primaryImage}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-12 max-w-md mx-auto">
              <p className="text-white text-lg mb-2">No services found</p>
              <p className="text-white/70 text-sm">
                Try adjusting your filters to find more services in other locations or churches.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
