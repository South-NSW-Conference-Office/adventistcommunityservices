import { HeroSection } from '../components/HeroSection';
import { ServiceCard } from '../components/ServiceCard';
import { Skeleton } from '../components/ui/skeleton';
import { ClipboardCheck, GraduationCap, Heart } from 'lucide-react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import {
  useCMSPage,
  ServicePreview,
  Testimonial,
  ProcessStep,
  CMSImage,
} from '../hooks/useCMSContent';
import { useServices } from '../hooks/useServices';
import { useTestimonies } from '../hooks/useTestimonies';
import { EditableText, EditableRichText } from '../components/editable';

const ICON_MAP = { ClipboardCheck, GraduationCap, Heart } as const;

const STATIC_DATA = {
  services: [
    { id: 1, name: 'Food Bank Services', descriptionShort: 'Access nutritious food and essential supplies through our community food programs. We provide weekly food parcels and emergency relief packages.', location: 'Sydney, NSW', capacity: 200, image: 'https://images.unsplash.com/photo-1759709042164-0dd78a39028b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXN0cmFsaWElMjBjb21tdW5pdHklMjBoZWxwfGVufDF8fHx8MTc2NjE5NTgzNHww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 2, name: 'Clothing Assistance', descriptionShort: 'Find quality clothing and household items at affordable prices. Donations accepted and distributed to those in need across the community.', location: 'Melbourne, VIC', capacity: 150, image: 'https://images.unsplash.com/photo-1711395588577-ed596848b04f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXN0cmFsaWElMjB2b2x1bnRlZXIlMjBvdXRiYWNrfGVufDF8fHx8MTc2NjE5NTgzNHww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 3, name: 'Counseling & Support', descriptionShort: 'Professional counseling services and emotional support for individuals and families facing challenging times. Confidential and compassionate care.', location: 'Brisbane, QLD', capacity: 50, image: 'https://images.unsplash.com/photo-1759709042164-0dd78a39028b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzeWRuZXklMjBjb21tdW5pdHklMjBzZXJ2aWNlfGVufDF8fHx8MTc2NjE5NTgzNXww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 4, name: 'Emergency Relief', descriptionShort: 'Immediate assistance during crisis situations including natural disasters, homelessness, and unexpected hardships. Available 24/7 support.', location: 'Perth, WA', capacity: 100, image: 'https://images.unsplash.com/photo-1638769314338-9ba8e1e69465?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXN0cmFsaWElMjBjaGFyaXR5JTIwd2FybXxlbnwxfHx8fDE3NjYxOTU4MzV8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  ] as ServicePreview[],
  testimonials: [
    { id: 1, name: 'Sarah Mitchell', location: 'Sydney, NSW', review: "Volunteering with ACS has been one of the most rewarding experiences of my life. The team is incredibly supportive, and knowing that I'm making a real difference in people's lives keeps me coming back every week.", image: 'https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NjI3Nzk2Mnww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 2, name: 'David Chen', location: 'Melbourne, VIC', review: "The food bank program is amazing! I've been volunteering for 6 months and have met so many wonderful people. It's heartwarming to see the impact we make together.", image: 'https://images.unsplash.com/photo-1738566061505-556830f8b8f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBhc2lhbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NjM3MDQ5Nnww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 3, name: 'Emma Thompson', location: 'Brisbane, QLD', review: "I started volunteering after retiring, and it's given me a new sense of purpose. The orientation was thorough, and everyone made me feel welcome from day one.", image: 'https://images.unsplash.com/photo-1758686254563-5c5ab338c8b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXR1cmUlMjB3b21hbiUyMHNtaWxpbmclMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjYzNzA0OTh8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 4, name: 'Michael Roberts', location: 'Perth, WA', review: 'As a corporate volunteer, I appreciate how flexible and organized ACS is. They make it easy to give back to the community even with a busy schedule.', image: 'https://images.unsplash.com/photo-1737574821698-862e77f044c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzc21hbiUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NjM3MDQ5N3ww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 5, name: 'Lisa Anderson', location: 'Adelaide, SA', review: 'The emergency relief program has shown me the true meaning of community care. Every shift reminds me why this work is so important. Highly recommend volunteering here!', image: 'https://images.unsplash.com/photo-1555396768-2a77b9e979c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHZvbHVudGVlciUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NjM0OTA0OHww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 6, name: 'James Wilson', location: 'Canberra, ACT', review: 'Being part of the clothing assistance team has been incredible. The organization is professional, the mission is clear, and the impact is visible.', image: 'https://images.unsplash.com/photo-1758639842438-718755aa57e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NjI4Nzg5NXww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 7, name: 'Rachel Green', location: 'Hobart, TAS', review: "I love how ACS values each volunteer's unique skills and interests. They matched me with a role that perfectly fits my schedule and passion for helping others.", image: 'https://images.unsplash.com/photo-1760551937527-2bc6cfe45180?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGNhc3VhbCUyMHBvcnRyYWl0JTIwc21pbGV8ZW58MXx8fHwxNzY2MzcwNDk4fDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 8, name: 'Thomas Brown', location: 'Darwin, NT', review: 'The training and support provided by ACS is exceptional. I felt prepared and confident to start volunteering from the very beginning.', image: 'https://images.unsplash.com/photo-1640653583383-72b60809f273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBmcmllbmRseSUyMHBvcnRyYWl0JTIwc21pbGV8ZW58MXx8fHwxNzY2MzcwNDk4fDA&ixlib=rb-4.1.0&q=80&w=1080' },
  ] as Testimonial[],
  steps: [
    { number: '01', icon: 'ClipboardCheck', title: 'Apply Online', description: 'Fill out our simple online application form with your details, interests, and availability. Tell us about yourself and which programs interest you most.' },
    { number: '02', icon: 'GraduationCap', title: 'Attend Orientation', description: "Join our comprehensive orientation and training session where you'll learn about our mission, values, safety procedures, and the specific role you'll be filling." },
    { number: '03', icon: 'Heart', title: 'Start Serving', description: "Begin your volunteer journey and make a real impact in your community. You'll be supported by our experienced team every step of the way." },
  ] as ProcessStep[],
  volunteerImages: [
    { url: 'https://images.unsplash.com/photo-1710092784814-4a6f158913b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2x1bnRlZXJzJTIwZm9vZCUyMGJhbmslMjBoZWxwaW5nfGVufDF8fHx8MTc2NjM3MDE3Nnww&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Food Bank Volunteers', caption: 'Help distribute food and essential supplies to families in need across our community' },
    { url: 'https://images.unsplash.com/photo-1722336762551-831c0bcc2b59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjB2b2x1bnRlZXJzJTIwcGFja2luZyUyMGNsb3RoZXN8ZW58MXx8fHwxNzY2MzcwMTc2fDA&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Clothing Assistance', caption: 'Sort and organize clothing donations for those in our community' },
    { url: 'https://images.unsplash.com/photo-1758599668125-e154250f24bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2x1bnRlZXJzJTIwdGVhbXdvcmslMjBjb21tdW5pdHl8ZW58MXx8fHwxNzY2MzcwMTc3fDA&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Teamwork', caption: 'Join our team in organizing community events and fundraising activities' },
    { url: 'https://images.unsplash.com/photo-1657558638549-9fd140b1ab5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2x1bnRlZXJzJTIwaGVscGluZyUyMGVsZGVybHl8ZW58MXx8fHwxNzY2MzcwMTc3fDA&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Community Support', caption: 'Provide compassionate support and companionship to elderly members of our community' },
  ] as CMSImage[],
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

interface ImageCardProps {
  image: CMSImage | undefined;
  className?: string;
  textSize?: 'sm' | 'base';
}

function ImageCard({ image, className = '', textSize = 'base' }: ImageCardProps): JSX.Element {
  const textClass = textSize === 'sm' ? 'text-sm' : '';
  const paddingClass = textSize === 'sm' ? 'p-4' : 'p-6';

  return (
    <div className={`relative group rounded-2xl overflow-hidden shadow-md cursor-pointer ${className}`}>
      <img
        src={image?.url}
        alt={image?.alt}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className={`absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center ${paddingClass}`}>
        <p className={`text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${textClass}`}>
          {image?.caption}
        </p>
      </div>
    </div>
  );
}

export function Home(): JSX.Element {
  const { getBlock, getJSONBlock, isSectionEnabled } = useCMSPage('home');
  const { services, loading: servicesLoading } = useServices();
  const { testimonies: apiTestimonies } = useTestimonies();

  const cmsTestimonies = getJSONBlock<Testimonial[]>('testimonials', 'testimonials_data', STATIC_DATA.testimonials);
  const testimoniesData: Testimonial[] = apiTestimonies.length > 0
    ? apiTestimonies.map((t, index) => ({
        id: index + 1,
        name: t.name,
        location: t.location,
        review: t.review,
        image: t.image.url,
      }))
    : cmsTestimonies;

  const cms = {
    services: {
      label: getBlock('services-preview', 'section_label') || 'Our Services',
      title: getBlock('services-preview', 'section_title') || 'Available Community Services',
      description: getBlock('services-preview', 'section_description') || 'Explore our range of community support programs designed to help those in need across Australia.',
      data: getJSONBlock<ServicePreview[]>('services-preview', 'services_data', STATIC_DATA.services),
    },
    volunteer: {
      label: getBlock('volunteer-cta', 'section_label') || 'Join Our Team',
      title: getBlock('volunteer-cta', 'section_title') || 'Become a Volunteer',
      paragraphs: [
        getBlock('volunteer-cta', 'paragraph_1') || 'Make a lasting impact in your community by joining our team of dedicated volunteers. Whether you have a few hours a week or can commit to regular service, your contribution matters.',
        getBlock('volunteer-cta', 'paragraph_2') || "We offer a variety of volunteer opportunities across Australia, from food distribution and clothing assistance to counseling support and emergency relief. No matter your skills or interests, there's a place for you in our community.",
        getBlock('volunteer-cta', 'paragraph_3') || 'Our volunteers are the heart of everything we do. Join us in bringing hope, support, and practical assistance to those who need it most.',
      ],
      ctaPrimary: getBlock('volunteer-cta', 'cta_primary') || 'Apply to Volunteer',
      ctaSecondary: getBlock('volunteer-cta', 'cta_secondary') || 'Learn More About Our Programs',
      images: getJSONBlock<CMSImage[]>('volunteer-cta', 'images_data', STATIC_DATA.volunteerImages),
    },
    process: {
      label: getBlock('process-steps', 'section_label') || 'Getting Started',
      title: getBlock('process-steps', 'section_title') || 'How to Get Involved',
      description: getBlock('process-steps', 'section_description') || 'Join Adventist Community Services in just three simple steps and start making a difference today.',
      steps: getJSONBlock<ProcessStep[]>('process-steps', 'steps_data', STATIC_DATA.steps),
      ctaButton: getBlock('process-steps', 'cta_button') || 'Get Started Today',
    },
    testimonials: {
      label: getBlock('testimonials', 'section_label') || 'Testimonials',
      title: getBlock('testimonials', 'section_title') || 'What Others Have to Say',
      description: getBlock('testimonials', 'section_description') || 'Hear from our wonderful volunteers about their experiences making a difference in the community.',
      data: testimoniesData,
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

      {/* Volunteer Section — warm grey background */}
      {isSectionEnabled('volunteer-cta') && (
        <section className="bg-[#F8F7F5] py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Image Grid */}
              <div className="order-2 md:order-1">
                <div className="grid grid-cols-2 gap-4 h-[600px]">
                  <ImageCard image={cms.volunteer.images[0]} className="row-span-2" />
                  <ImageCard image={cms.volunteer.images[1]} textSize="sm" />
                  <ImageCard image={cms.volunteer.images[2]} textSize="sm" />
                  <ImageCard image={cms.volunteer.images[3]} className="col-span-2" />
                </div>
              </div>

              {/* Content */}
              <div className="order-1 md:order-2">
                <EditableText
                  pageId="home"
                  sectionId="volunteer-cta"
                  blockKey="section_label"
                  content={cms.volunteer.label}
                  fallback="Join Our Team"
                  className="text-[#F44314] text-sm font-semibold tracking-wider uppercase mb-2"
                  as="p"
                />
                <EditableText
                  pageId="home"
                  sectionId="volunteer-cta"
                  blockKey="section_title"
                  content={cms.volunteer.title}
                  fallback="Become a Volunteer"
                  className="text-[#1F2937] text-4xl font-bold mb-4"
                  as="h2"
                />
                {cms.volunteer.paragraphs.map((paragraph, index) => (
                  <EditableRichText
                    key={index}
                    pageId="home"
                    sectionId="volunteer-cta"
                    blockKey={`paragraph_${index + 1}`}
                    content={paragraph}
                    fallback={paragraph}
                    className={`text-gray-600 ${index < 2 ? 'mb-6' : 'mb-8'}`}
                  />
                ))}

                <div className="space-y-4">
                  <button className="w-full bg-[#F44314] text-white font-semibold py-4 px-8 rounded-lg hover:bg-[#d93a10] transition-colors shadow-sm">
                    {cms.volunteer.ctaPrimary}
                  </button>
                  <button className="w-full bg-white border border-gray-300 text-[#1F2937] font-semibold py-4 px-8 rounded-lg hover:bg-gray-50 transition-colors">
                    {cms.volunteer.ctaSecondary}
                  </button>
                </div>
              </div>
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

      {/* Testimonials — warm grey background */}
      {isSectionEnabled('testimonials') && (
        <section className="bg-[#F8F7F5] py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <EditableText
                pageId="home"
                sectionId="testimonials"
                blockKey="section_label"
                content={cms.testimonials.label}
                fallback="Testimonials"
                className="text-[#F44314] text-sm font-semibold tracking-wider uppercase mb-2"
                as="p"
              />
              <EditableText
                pageId="home"
                sectionId="testimonials"
                blockKey="section_title"
                content={cms.testimonials.title}
                fallback="What Others Have to Say"
                className="text-[#1F2937] text-4xl font-bold mb-4"
                as="h2"
              />
              <EditableRichText
                pageId="home"
                sectionId="testimonials"
                blockKey="section_description"
                content={cms.testimonials.description}
                fallback="Hear from our wonderful volunteers about their experiences making a difference in the community."
                className="text-gray-600 max-w-2xl mx-auto"
              />
            </div>

            <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
              <Masonry gutter="24px">
                {cms.testimonials.data.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-100"
                      />
                      <div>
                        <h4 className="text-[#1F2937] font-semibold">{testimonial.name}</h4>
                        <p className="text-gray-500 text-sm">{testimonial.location}</p>
                      </div>
                    </div>
                    <div className="mb-3">
                      <svg className="w-8 h-8 text-[#F44314]/20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {testimonial.review}
                    </p>
                  </div>
                ))}
              </Masonry>
            </ResponsiveMasonry>
          </div>
        </section>
      )}
    </div>
  );
}
