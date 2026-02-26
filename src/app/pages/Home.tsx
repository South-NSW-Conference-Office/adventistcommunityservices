import { HeroSection } from '../components/HeroSection';
import { ServiceCard } from '../components/ServiceCard';
import { TeamCard } from '../components/TeamCard';
import { Skeleton } from '../components/ui/skeleton';
import { ClipboardCheck, GraduationCap, Heart } from 'lucide-react';
import {
  useCMSPage,
  ServicePreview,
  ProcessStep,
} from '../hooks/useCMSContent';
import { useServices } from '../hooks/useServices';
import { useTeams } from '../hooks/useTeams';
import { EditableText, EditableRichText } from '../components/editable';

const ICON_MAP = { ClipboardCheck, GraduationCap, Heart } as const;

const STATIC_DATA = {
  services: [
    { id: 1, name: 'Food Bank Services', descriptionShort: 'Access nutritious food and essential supplies through our community food programs. We provide weekly food parcels and emergency relief packages.', location: 'Sydney, NSW', capacity: 200, image: 'https://images.unsplash.com/photo-1759709042164-0dd78a39028b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXN0cmFsaWElMjBjb21tdW5pdHklMjBoZWxwfGVufDF8fHx8MTc2NjE5NTgzNHww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 2, name: 'Clothing Assistance', descriptionShort: 'Find quality clothing and household items at affordable prices. Donations accepted and distributed to those in need across the community.', location: 'Melbourne, VIC', capacity: 150, image: 'https://images.unsplash.com/photo-1711395588577-ed596848b04f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXN0cmFsaWElMjB2b2x1bnRlZXIlMjBvdXRiYWNrfGVufDF8fHx8MTc2NjE5NTgzNHww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 3, name: 'Counseling & Support', descriptionShort: 'Professional counseling services and emotional support for individuals and families facing challenging times. Confidential and compassionate care.', location: 'Brisbane, QLD', capacity: 50, image: 'https://images.unsplash.com/photo-1759709042164-0dd78a39028b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzeWRuZXklMjBjb21tdW5pdHklMjBzZXJ2aWNlfGVufDF8fHx8MTc2NjE5NTgzNXww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 4, name: 'Emergency Relief', descriptionShort: 'Immediate assistance during crisis situations including natural disasters, homelessness, and unexpected hardships. Available 24/7 support.', location: 'Perth, WA', capacity: 100, image: 'https://images.unsplash.com/photo-1638769314338-9ba8e1e69465?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXN0cmFsaWElMjBjaGFyaXR5JTIwd2FybXxlbnwxfHx8fDE3NjYxOTU4MzV8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  ] as ServicePreview[],

  steps: [
    { number: '01', icon: 'ClipboardCheck', title: 'Register Your Church', description: 'Start by registering your church with Adventist Community Services. Complete the simple online registration form with your church details and contact information.' },
    { number: '02', icon: 'GraduationCap', title: 'Create Your Team', description: 'Set up your community service team profile. Add team members, select a team leader, and define your mission and service areas.' },
    { number: '03', icon: 'Heart', title: 'Add Your Services', description: 'List the community services your team provides. Add service details, capacity, location, and contact information to help people find and access your services.' },
  ] as ProcessStep[],

};

const SKELETON_COUNT = 4;

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
      description: getBlock('services-preview', 'section_description') || 'Explore our range of community support programs designed to help those in need across Australia.',
      data: getJSONBlock<ServicePreview[]>('services-preview', 'services_data', STATIC_DATA.services),
    },
    teams: {
      label: getBlock('featured-teams', 'section_label') || 'COMMUNITY TEAMS',
      title: getBlock('featured-teams', 'section_title') || 'Newest Teams on the Platform',
      description: getBlock('featured-teams', 'section_description') || 'Meet the latest community service teams to join our platform. Connect with teams near you and discover how you can get involved.',
    },
    process: {
      label: getBlock('process-steps', 'section_label') || 'Getting Started',
      title: getBlock('process-steps', 'section_title') || 'How to List Your Team',
      description: getBlock('process-steps', 'section_description') || 'Join Adventist Community Services in just three simple steps and start listing your team today.',
      steps: getJSONBlock<ProcessStep[]>('process-steps', 'steps_data', STATIC_DATA.steps),
      ctaButton: getBlock('process-steps', 'cta_button') || 'Get Started Today',
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
                fallback="Explore our range of community support programs designed to help those in need across Australia."
                className="text-gray-600 max-w-2xl mx-auto"
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
          </div>
        </section>
      )}

      {/* Featured Teams Section — warm grey background */}
      {isSectionEnabled('featured-teams') && (
        <section className="bg-[#F8F7F5] py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <EditableText
                pageId="home"
                sectionId="featured-teams"
                blockKey="section_label"
                content={cms.teams.label}
                fallback="COMMUNITY TEAMS"
                className="text-[#F44314] text-sm font-semibold tracking-wider uppercase mb-2"
                as="p"
              />
              <EditableText
                pageId="home"
                sectionId="featured-teams"
                blockKey="section_title"
                content={cms.teams.title}
                fallback="Newest Teams on the Platform"
                className="text-[#1F2937] text-4xl font-bold mb-4"
                as="h2"
              />
              <EditableRichText
                pageId="home"
                sectionId="featured-teams"
                blockKey="section_description"
                content={cms.teams.description}
                fallback="Meet the latest community service teams to join our platform. Connect with teams near you and discover how you can get involved."
                className="text-gray-600 max-w-2xl mx-auto"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamsLoading &&
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <Skeleton className="h-80 bg-gray-200 rounded-2xl mb-4" />
                  </div>
                ))}

              {!teamsLoading && teams.length > 0 &&
                teams.slice(0, 3).map((team) => (
                  <TeamCard key={team._id} team={team} />
                ))}

              {!teamsLoading && teams.length === 0 &&
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
                    <div className="text-[#1F2937] text-xl font-semibold mb-4">Be the first to list your team</div>
                    <p className="text-gray-600 mb-6">Help your community discover the services your team provides.</p>
                    <button className="bg-[#F44314] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#d93a10] transition-colors">
                      Get Started
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Three Step Process — white background */}
      {isSectionEnabled('process-steps') && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <EditableText
                pageId="home"
                sectionId="process-steps"
                blockKey="section_label"
                content={cms.process.label}
                fallback="Getting Started"
                className="text-[#F44314] text-sm font-semibold tracking-wider uppercase mb-2"
                as="p"
              />
              <EditableText
                pageId="home"
                sectionId="process-steps"
                blockKey="section_title"
                content={cms.process.title}
                fallback="How to Get Involved"
                className="text-[#1F2937] text-4xl font-bold mb-4"
                as="h2"
              />
              <EditableRichText
                pageId="home"
                sectionId="process-steps"
                blockKey="section_description"
                content={cms.process.description}
                fallback="Join Adventist Community Services in just three simple steps and start making a difference today."
                className="text-gray-600 max-w-2xl mx-auto"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {cms.process.steps.map((step, index) => {
                const IconComponent = ICON_MAP[step.icon as keyof typeof ICON_MAP] || Heart;
                return (
                  <div key={index} className="relative text-center">
                    <div className="mb-6 flex justify-center">
                      <div className="w-24 h-24 rounded-full bg-[#FFF1EE] flex items-center justify-center border border-[#F44314]/20">
                        <IconComponent className="w-12 h-12 text-[#F44314]" />
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 md:right-[-2rem] text-gray-100 text-8xl font-bold select-none">
                      {step.number}
                    </div>
                    <h3 className="text-[#1F2937] text-2xl font-semibold mb-4">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <button className="bg-[#F44314] text-white font-semibold py-4 px-12 rounded-lg hover:bg-[#d93a10] transition-colors shadow-sm">
                {cms.process.ctaButton}
              </button>
            </div>
          </div>
        </section>
      )}


    </div>
  );
}
