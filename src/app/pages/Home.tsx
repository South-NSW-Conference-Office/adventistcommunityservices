import { HeroSection } from '../components/HeroSection';
import { ServiceCard } from '../components/ServiceCard';
import { TeamCard } from '../components/TeamCard';
import { Skeleton } from '../components/ui/skeleton';
import { ClipboardCheck, Users, Heart } from 'lucide-react';
import {
  useCMSPage,
  ServicePreview,
  ProcessStep,
} from '../hooks/useCMSContent';
import { useServices } from '../hooks/useServices';
import { useTeams } from '../hooks/useTeams';
import { EditableText, EditableRichText } from '../components/editable';
import { Link } from 'react-router-dom';

const ICON_MAP = { ClipboardCheck, Users, Heart } as const;

const STATIC_SERVICES: ServicePreview[] = [
  { id: 1, name: 'Food Bank Services', descriptionShort: 'Access nutritious food and essential supplies through our community food programs.', location: 'Sydney, NSW', capacity: 200, image: 'https://images.unsplash.com/photo-1759709042164-0dd78a39028b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXN0cmFsaWElMjBjb21tdW5pdHklMjBoZWxwfGVufDF8fHx8MTc2NjE5NTgzNHww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 2, name: 'Clothing Assistance', descriptionShort: 'Find quality clothing and household items at affordable prices through our op shops.', location: 'Melbourne, VIC', capacity: 150, image: 'https://images.unsplash.com/photo-1711395588577-ed596848b04f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXN0cmFsaWElMjB2b2x1bnRlZXIlMjBvdXRiYWNrfGVufDF8fHx8MTc2NjE5NTgzNHww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 3, name: 'Counseling & Support', descriptionShort: 'Confidential counseling and emotional support for individuals and families.', location: 'Brisbane, QLD', capacity: 50, image: 'https://images.unsplash.com/photo-1759709042164-0dd78a39028b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzeWRuZXklMjBjb21tdW5pdHklMjBzZXJ2aWNlfGVufDF8fHx8MTc2NjE5NTgzNXww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 4, name: 'Emergency Relief', descriptionShort: 'Immediate assistance during crisis situations including natural disasters and hardships.', location: 'Perth, WA', capacity: 100, image: 'https://images.unsplash.com/photo-1638769314338-9ba8e1e69465?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXN0cmFsaWElMjBjaGFyaXR5JTIwd2FybXxlbnwxfHx8fDE3NjYxOTU4MzV8MA&ixlib=rb-4.1.0&q=80&w=1080' },
];

const STATIC_STEPS: ProcessStep[] = [
  { number: '01', icon: 'ClipboardCheck', title: 'Register', description: 'Register your local community and set up your team profile. It only takes a few minutes to get started.' },
  { number: '02', icon: 'Users', title: 'Build Your Team', description: 'Add team members, assign roles, and describe the services your team provides to the community.' },
  { number: '03', icon: 'Heart', title: 'Start Serving', description: 'Your team and services go live on the platform. People in your area can now find and contact you for help.' },
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
    process: {
      label: getBlock('process-steps', 'section_label') || 'List Your Team',
      title: getBlock('process-steps', 'section_title') || 'Get Your Team on the Platform',
      description: getBlock('process-steps', 'section_description') || 'Three simple steps to showcase your community service team and reach people who need help.',
      steps: getJSONBlock<ProcessStep[]>('process-steps', 'steps_data', STATIC_STEPS),
      ctaButton: getBlock('process-steps', 'cta_button') || 'Register Your Team',
    },
  };

  return (
    <div>
      <HeroSection />

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

      {/* Featured Teams — warm grey background */}
      <section className="bg-[#F8F7F5] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-[#F44314] text-sm font-semibold tracking-wider uppercase mb-2">COMMUNITY TEAMS</p>
            <h2 className="text-[#1F2937] text-4xl font-bold mb-4">Newest Teams on the Platform</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Local teams making a difference in their communities. Each team is run by volunteers who care about serving their neighbours.
            </p>
          </div>

          {teamsLoading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F44314]"></div>
            </div>
          )}

          {!teamsLoading && teams.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.slice(0, 6).map((team) => (
                <TeamCard key={team._id} team={team} />
              ))}
            </div>
          )}

          {!teamsLoading && teams.length === 0 && (
            <div className="grid md:grid-cols-3 gap-6">
              {['Your team could be here', 'List your services', 'Reach your community'].map((msg, i) => (
                <div key={i} className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-400 font-medium">{msg}</p>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/teams" className="text-[#F44314] font-semibold hover:underline">
              View all teams →
            </Link>
          </div>
        </div>
      </section>


    </div>
  );
}
