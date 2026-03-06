import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { HeroSection } from '../components/HeroSection';
import { InteractiveConferenceMap } from '../components/InteractiveConferenceMap';
import { ServiceCard } from '../components/ServiceCard';
import { TeamCard } from '../components/TeamCard';
import { Skeleton } from '../components/ui/skeleton';
import { Users } from 'lucide-react';
import {
  useCMSPage,
  ServicePreview,
} from '../hooks/useCMSContent';
import { useServices } from '../hooks/useServices';
import { useTeams } from '../hooks/useTeams';
import { EditableText, EditableRichText } from '../components/editable';
import { Link } from 'react-router-dom';

const STATIC_SERVICES: ServicePreview[] = [
  { id: 1, name: 'Food Support', descriptionShort: 'Free nutritious food and essential supplies when you need them most.', location: 'Sydney, NSW', capacity: 200, image: 'https://images.unsplash.com/photo-1759709042164-0dd78a39028b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXN0cmFsaWElMjBjb21tdW5pdHklMjBoZWxwfGVufDF8fHx8MTc2NjE5NTgzNHww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 2, name: 'Op Shops', descriptionShort: 'Quality clothing and household items at prices that help, not hurt.', location: 'Melbourne, VIC', capacity: 150, image: 'https://images.unsplash.com/photo-1711395588577-ed596848b04f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXN0cmFsaWElMjB2b2x1bnRlZXIlMjBvdXRiYWNrfGVufDF8fHx8MTc2NjE5NTgzNHww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 3, name: 'Counselling & Support', descriptionShort: 'Someone to talk to, completely confidential. For individuals and families.', location: 'Brisbane, QLD', capacity: 50, image: 'https://images.unsplash.com/photo-1759709042164-0dd78a39028b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzeWRuZXklMjBjb21tdW5pdHklMjBzZXJ2aWNlfGVufDF8fHx8MTc2NjE5NTgzNXww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 4, name: 'Emergency Help', descriptionShort: 'Immediate assistance when disaster strikes. We respond fast, locally.', location: 'Perth, WA', capacity: 100, image: 'https://images.unsplash.com/photo-1638769314338-9ba8e1e69465?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXN0cmFsaWElMjBjaGFyaXR5JTIwd2FybXxlbnwxfHx8fDE3NjYxOTU4MzV8MA&ixlib=rb-4.1.0&q=80&w=1080' },
];

function ServiceCardSkeleton(): JSX.Element {
  return (
    <div className="animate-pulse">
      <Skeleton className="h-56 bg-gray-200 rounded-2xl mb-4" />
      <Skeleton className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
      <Skeleton className="h-4 bg-gray-200 rounded w-full mb-2" />
      <Skeleton className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
  );
}

function parseStaticLocation(location: string): { suburb: string; state: string } {
  const [suburb = '', state = ''] = location.split(', ');
  return { suburb, state };
}

export function Home(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const { getBlock, getJSONBlock, isSectionEnabled } = useCMSPage('home');
  const { services, loading: servicesLoading } = useServices();
  const { teams, loading: teamsLoading } = useTeams();

  const cms = {
    services: {
      label: getBlock('services-preview', 'section_label') || 'Our Services',
      title: getBlock('services-preview', 'section_title') || 'Available Community Services',
      description: getBlock('services-preview', 'section_description') || 'Explore community support programs across Australia. Each service is run by a local team of dedicated volunteers.',
      data: getJSONBlock<ServicePreview[]>('services-preview', 'services_data', STATIC_SERVICES),
    },
  };

  return (
    <div>
      {/* Conference Map Hero — full bleed, nav overlays on top */}
      {/* Conference Map Hero — full bleed, nav overlays on top */}
      <section className="relative bg-[#F8F7F5] md:min-h-screen flex items-start md:items-center justify-center pb-6 md:pb-0">
        <div className="w-full mt-24 md:mt-0 md:pt-20 flex flex-col-reverse md:flex-row items-center gap-4 md:gap-6 justify-end pr-4 pl-6 md:pl-[15%]">
          {/* Copy — left column on desktop, below map on mobile */}
          <div className="md:w-[480px] text-center md:text-left shrink-0 px-4 md:px-0">
            <p className="text-[#F44314] font-semibold text-base uppercase tracking-widest mb-4">
              Here to Serve
            </p>
            <h1 className="text-[#1F2937] text-3xl md:text-5xl font-bold mb-4 leading-tight whitespace-nowrap">
              Adventist<br />Community Services
            </h1>
            <p className="text-gray-600 text-base md:text-lg mb-6">
              Select your region to find local services
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2 flex flex-row items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-xl min-w-0">
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-400 text-sm min-w-0"
                />
              </div>
              <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-xl min-w-0">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Postcode"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-400 text-sm min-w-0"
                />
              </div>
              <button className="bg-[#F44314] text-white px-4 py-2.5 rounded-xl hover:bg-[#d93a10] transition-colors font-semibold shadow-sm text-sm flex-shrink-0">
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* Category badges */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {['Op Shops', 'Food Pantry', 'Soup Kitchen', 'Disaster Response', 'Health', 'Counseling', 'Shelter', 'Education'].map((cat) => (
                <a
                  key={cat}
                  href={`/services?type=${cat.toLowerCase().replace(/ /g, '_')}`}
                  className="px-2 py-0.5 rounded-full bg-white/80 border border-gray-200 text-gray-500 text-[10px] font-medium hover:border-[#F44314] hover:text-[#F44314] transition-colors"
                >
                  {cat}
                </a>
              ))}
            </div>
          </div>
          {/* Map — takes the rest */}
          <div className="flex-1 w-full min-w-0">
            <InteractiveConferenceMap />
          </div>
        </div>
      </section>

      {/* Services Section — white background */}
      {isSectionEnabled('services-preview') && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <EditableText
                pageId="home"
                sectionId="services-preview"
                blockKey="section_label"
                content={cms.services.label}
                fallback="Our Services"
                className="text-[#F44314] text-sm font-semibold tracking-wider uppercase mb-2"
                as="p"
              />
              <EditableText
                pageId="home"
                sectionId="services-preview"
                blockKey="section_title"
                content={cms.services.title}
                fallback="Available Community Services"
                className="text-[#1F2937] text-4xl font-bold mb-4"
                as="h2"
              />
              <EditableRichText
                pageId="home"
                sectionId="services-preview"
                blockKey="section_description"
                content={cms.services.description}
                fallback="Explore community support programs across Australia."
                className="text-gray-600 max-w-2xl mx-auto"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {servicesLoading &&
                Array.from({ length: 4 }).map((_, i) => <ServiceCardSkeleton key={i} />)}

              {!servicesLoading && services.length > 0 &&
                services.slice(0, 4).map((service) => (
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

              {!servicesLoading && services.length === 0 &&
                cms.services.data.map((service) => {
                  const { suburb, state } = parseStaticLocation(service.location);
                  return (
                    <ServiceCard
                      key={service.id}
                      name={service.name}
                      descriptionShort={service.descriptionShort}
                      locations={[{ address: { suburb, state } }]}
                      capacity={{ maxParticipants: service.capacity }}
                      primaryImage={{ url: service.image }}
                    />
                  );
                })}
            </div>

            <div className="text-center mt-10">
              <Link to="/services" className="text-[#F44314] font-semibold hover:underline">
                View all services →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Get Involved — warm grey background */}
      <section className="bg-[#F8F7F5] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-[#F44314] text-sm font-semibold tracking-wider uppercase mb-2">GET INVOLVED</p>
            <h2 className="text-[#1F2937] text-4xl font-bold mb-4">Be Part of the Solution</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Whether you need help or want to help others, there's a place for you in our community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Need Help */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#F44314]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#F44314]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 className="text-[#1F2937] text-2xl font-bold mb-4">Need Support?</h3>
              <p className="text-gray-600 mb-6">
                Our services are here for you. No judgment, just genuine care and practical help when you need it most.
              </p>
              <Link 
                to="/services" 
                className="inline-block bg-[#F44314] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#d93a10] transition-colors"
              >
                Find Services
              </Link>
            </div>

            {/* Want to Help */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#F44314]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#F44314]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-6h3v6h2v-6h2l2.54-7.63A1.5 1.5 0 0 0 12.11 3H11.9c-.41 0-.8.17-1.08.46L8.5 6H4c-1.11 0-2 .89-2 2s.89 2 2 2h3l1.8-2.4L10 11H8v7c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-7h-4.5L14 8.5z"/>
                </svg>
              </div>
              <h3 className="text-[#1F2937] text-2xl font-bold mb-4">Want to Volunteer?</h3>
              <p className="text-gray-600 mb-6">
                Join hundreds of volunteers making a real difference in Australian communities. We provide training and support.
              </p>
              <Link 
                to="/contact" 
                className="inline-block bg-white border-2 border-[#F44314] text-[#F44314] px-8 py-3 rounded-xl font-semibold hover:bg-[#F44314] hover:text-white transition-colors"
              >
                Get Involved
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
