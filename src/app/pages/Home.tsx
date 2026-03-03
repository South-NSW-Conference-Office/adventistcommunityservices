import { HeroSection } from '../components/HeroSection';
import { ServiceCard } from '../components/ServiceCard';
import { Skeleton } from '../components/ui/skeleton';
import {
  useCMSPage,
  ServicePreview,
} from '../hooks/useCMSContent';
import { useServices } from '../hooks/useServices';
import { EditableText, EditableRichText } from '../components/editable';

const STATIC_DATA = {
  services: [
    { id: 1, name: 'Food Bank Services', descriptionShort: 'Access nutritious food and essential supplies through our community food programs. We provide weekly food parcels and emergency relief packages.', location: 'Sydney, NSW', capacity: 200, image: 'https://images.unsplash.com/photo-1759709042164-0dd78a39028b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXN0cmFsaWElMjBjb21tdW5pdHklMjBoZWxwfGVufDF8fHx8MTc2NjE5NTgzNHww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 2, name: 'Clothing Assistance', descriptionShort: 'Find quality clothing and household items at affordable prices. Donations accepted and distributed to those in need across the community.', location: 'Melbourne, VIC', capacity: 150, image: 'https://images.unsplash.com/photo-1711395588577-ed596848b04f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXN0cmFsaWElMjB2b2x1bnRlZXIlMjBvdXRiYWNrfGVufDF8fHx8MTc2NjE5NTgzNHww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 3, name: 'Counseling & Support', descriptionShort: 'Professional counseling services and emotional support for individuals and families facing challenging times. Confidential and compassionate care.', location: 'Brisbane, QLD', capacity: 50, image: 'https://images.unsplash.com/photo-1759709042164-0dd78a39028b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzeWRuZXklMjBjb21tdW5pdHklMjBzZXJ2aWNlfGVufDF8fHx8MTc2NjE5NTgzNXww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 4, name: 'Emergency Relief', descriptionShort: 'Immediate assistance during crisis situations including natural disasters, homelessness, and unexpected hardships. Available 24/7 support.', location: 'Perth, WA', capacity: 100, image: 'https://images.unsplash.com/photo-1638769314338-9ba8e1e69465?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXN0cmFsaWElMjBjaGFyaXR5JTIwd2FybXxlbnwxfHx8fDE3NjYxOTU4MzV8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  ] as ServicePreview[],
};

const SKELETON_COUNT = 4;

function ServiceCardSkeleton(): JSX.Element {
  return (
    <div className="animate-pulse">
      <Skeleton className="h-56 bg-white/10 rounded-2xl mb-4" />
      <Skeleton className="h-6 bg-white/10 rounded w-3/4 mb-2" />
      <Skeleton className="h-4 bg-white/10 rounded w-full mb-2" />
      <Skeleton className="h-4 bg-white/10 rounded w-2/3" />
    </div>
  );
}

function parseStaticLocation(location: string): { suburb: string; state: string } {
  const [suburb = '', state = ''] = location.split(', ');
  return { suburb, state };
}


export function Home(): JSX.Element {
  const { getBlock, getJSONBlock, isSectionEnabled } = useCMSPage('home');
  const { services, loading: servicesLoading } = useServices();

  const cms = {
    services: {
      label: getBlock('services-preview', 'section_label') || 'Our Services',
      title: getBlock('services-preview', 'section_title') || 'Available Community Services',
      description: getBlock('services-preview', 'section_description') || 'Explore our range of community support programs designed to help those in need across Australia.',
      data: getJSONBlock<ServicePreview[]>('services-preview', 'services_data', STATIC_DATA.services),
    },
  };

  return (
    <div>
      <HeroSection />

      {/* Services Section */}
      {isSectionEnabled('services-preview') && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <EditableText
              pageId="home"
              sectionId="services-preview"
              blockKey="section_label"
              content={cms.services.label}
              fallback="Our Services"
              className="text-white/70 text-sm tracking-wider uppercase mb-2"
              as="p"
            />
            <EditableText
              pageId="home"
              sectionId="services-preview"
              blockKey="section_title"
              content={cms.services.title}
              fallback="Available Community Services"
              className="text-white text-4xl font-bold mb-4"
              as="h2"
            />
            <EditableRichText
              pageId="home"
              sectionId="services-preview"
              blockKey="section_description"
              content={cms.services.description}
              fallback="Explore our range of community support programs designed to help those in need across Australia."
              className="text-white/80 max-w-2xl mx-auto"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {servicesLoading &&
              Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                <ServiceCardSkeleton key={index} />
              ))}

            {!servicesLoading &&
              services.length > 0 &&
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

            {!servicesLoading &&
              services.length === 0 &&
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
        </section>
      )}

    </div>
  );
}
