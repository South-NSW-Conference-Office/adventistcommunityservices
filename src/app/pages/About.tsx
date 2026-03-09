import { Heart, Users, Globe, Award } from 'lucide-react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import {
  useCMSPage,
  Testimonial,
  ValueItem,
  TeamMember,
  CMSImage,
} from '../hooks/useCMSContent';
import { EditableText, EditableRichText, EditableImage } from '../components/editable';

const VALUE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart,
  Users,
  Globe,
  Award,
};

const STATIC_DATA = {
  testimonials: [
    { id: 1, name: "Sarah Mitchell", location: "Sydney, NSW", review: "Volunteering with ACS has been one of the most rewarding experiences of my life. The team is incredibly supportive, and knowing that I'm making a real difference in people's lives keeps me coming back every week.", image: "https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NjI3Nzk2Mnww&ixlib=rb-4.1.0&q=80&w=1080" },
    { id: 2, name: "David Chen", location: "Melbourne, VIC", review: "The food bank program is amazing! I've been volunteering for 6 months and have met so many wonderful people. It's heartwarming to see the impact we make together.", image: "https://images.unsplash.com/photo-1738566061505-556830f8b8f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBhc2lhbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NjM3MDQ5Nnww&ixlib=rb-4.1.0&q=80&w=1080" },
    { id: 3, name: "Emma Thompson", location: "Brisbane, QLD", review: "I started volunteering after retiring, and it's given me a new sense of purpose. The orientation was thorough, and everyone made me feel welcome from day one.", image: "https://images.unsplash.com/photo-1758686254563-5c5ab338c8b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXR1cmUlMjB3b21hbiUyMHNtaWxpbmclMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjYzNzA0OTh8MA&ixlib=rb-4.1.0&q=80&w=1080" },
    { id: 4, name: "Michael Roberts", location: "Perth, WA", review: "As a corporate volunteer, I appreciate how flexible and organized ACS is. They make it easy to give back to the community even with a busy schedule.", image: "https://images.unsplash.com/photo-1737574821698-862e77f044c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzc21hbiUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NjM3MDQ5N3ww&ixlib=rb-4.1.0&q=80&w=1080" },
    { id: 5, name: "Lisa Anderson", location: "Adelaide, SA", review: "The emergency relief program has shown me the true meaning of community care. Every shift reminds me why this work is so important. Highly recommend volunteering here!", image: "https://images.unsplash.com/photo-1555396768-2a77b9e979c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHZvbHVudGVlciUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NjM0OTA0OHww&ixlib=rb-4.1.0&q=80&w=1080" },
    { id: 6, name: "James Wilson", location: "Canberra, ACT", review: "Being part of the clothing assistance team has been incredible. The organization is professional, the mission is clear, and the impact is visible.", image: "https://images.unsplash.com/photo-1758639842438-718755aa57e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NjI4Nzg5NXww&ixlib=rb-4.1.0&q=80&w=1080" },
    { id: 7, name: "Rachel Green", location: "Hobart, TAS", review: "I love how ACS values each volunteer's unique skills and interests. They matched me with a role that perfectly fits my schedule and passion for helping others.", image: "https://images.unsplash.com/photo-1760551937527-2bc6cfe45180?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGNhc3VhbCUyMHBvcnRyYWl0JTIwc21pbGV8ZW58MXx8fHwxNzY2MzcwNDk4fDA&ixlib=rb-4.1.0&q=80&w=1080" },
    { id: 8, name: "Thomas Brown", location: "Darwin, NT", review: "The training and support provided by ACS is exceptional. I felt prepared and confident to start volunteering from the very beginning.", image: "https://images.unsplash.com/photo-1640653583383-72b60809f273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBmcmllbmRseSUyMHBvcnRyYWl0JTIwc21pbGV8ZW58MXx8fHwxNzY2MzcwNDk4fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  ] as Testimonial[],
  values: [
    { icon: 'Heart', title: 'Compassion', description: 'We serve with genuine care and empathy for every individual' },
    { icon: 'Users', title: 'Community', description: 'Building stronger communities through connection and support' },
    { icon: 'Globe', title: 'Inclusivity', description: 'Welcoming everyone with dignity and respect' },
    { icon: 'Award', title: 'Excellence', description: 'Delivering quality services with integrity and professionalism' },
  ] as ValueItem[],
  teamMembers: [
    { image: '/images/team/steve-teale.jpg', title: 'North NSW Director — Steve Teale', department: 'North NSW Conference', description: 'Leading Adventist Community Services across the North NSW region' },
    { image: '/images/team/kyle-morrison.jpg', title: 'South NSW Director — Kyle Morrison', department: 'South NSW Conference', description: 'Leading Adventist Community Services across the South NSW region' },
  ] as TeamMember[],
  storyImages: [
    { url: '/images/team/stormco-group.jpg', alt: 'StormCo volunteer team on site' },
    { url: '/images/team/stormco-leaders.jpg', alt: 'StormCo leadership team' },
    { url: '/images/team/stormco-truck.jpg', alt: 'Adventist Community Services disaster response team with vehicle' },
  ] as CMSImage[],
};

const STORY_IMAGE_GRID = [
  { className: 'col-span-1 row-span-2', heightClass: 'h-full' },
  { className: 'col-span-1', heightClass: 'h-full' },
  { className: 'col-span-1', heightClass: 'h-full' },
  { className: 'col-span-2', heightClass: 'h-48' },
];

interface TestimonialCardProps {
  testimonial: Testimonial;
}

function TestimonialCard({ testimonial }: TestimonialCardProps): JSX.Element {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all duration-300 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
        />
        <div>
          <h4 className="text-[#1F2937] font-semibold">{testimonial.name}</h4>
          <p className="text-gray-500 text-sm">{testimonial.location}</p>
        </div>
      </div>
      <div className="mb-4">
        <svg className="w-10 h-10 text-[#F44314]/30" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>
      <p className="text-gray-700 leading-relaxed">{testimonial.review}</p>
    </div>
  );
}

export function About(): JSX.Element {
  const { getBlock, getJSONBlock, isSectionEnabled } = useCMSPage('about');

  const cms = {
    hero: {
      label: getBlock('hero', 'section_label') || 'About Us',
      title: getBlock('hero', 'title') || 'What Is Adventist Community Services?',
      subtitle: getBlock('hero', 'subtitle') || "Adventist Community Services (ACS) is one of Australia's leading humanitarian organisations, providing compassionate service to communities across the nation.",
      image: getBlock('hero', 'background_image') || 'https://images.unsplash.com/photo-1576897202707-f397683935d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXN0cmFsaWElMjBjb21tdW5pdHklMjBoZWxwaW5nJTIwaGFuZHMlMjB0b2dldGhlcnxlbnwxfHx8fDE3NjYzNzI0NTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    whatIsAcs: {
      paragraph1: getBlock('what-is-acs', 'paragraph_1') || 'As the official humanitarian arm of the Seventh-day Adventist Church in Australia, we operate community centres and programs in cities and towns throughout the country. Our services include emergency relief, food banks, clothing assistance, budgeting support, and personal care programs.',
      paragraph2: getBlock('what-is-acs', 'paragraph_2') || 'We believe everyone deserves dignity, respect, and access to quality community services. Through our network of dedicated staff and volunteers, we serve thousands of Australians each year, building stronger, more resilient communities.',
    },
    story: {
      title: getBlock('our-story', 'title') || 'Our Story',
      paragraph1: getBlock('our-story', 'paragraph_1') || "For decades, Australia's Adventist Community Service has been a beacon of hope in communities across the nation. What started as a small volunteer effort has grown into a comprehensive network of services reaching thousands of Australians each year.",
      paragraph2: getBlock('our-story', 'paragraph_2') || 'Our dedicated team of staff and volunteers work tirelessly to provide food, clothing, emergency relief, and emotional support to communities across Australia. We believe in practical service that empowers long-term positive change.',
      paragraph3: getBlock('our-story', 'paragraph_3') || 'Every day, we witness the transformative power of community support and the resilience of the human spirit.',
      images: getJSONBlock<CMSImage[]>('our-story', 'images_data', STATIC_DATA.storyImages),
    },
    mission: {
      title: getBlock('mission', 'title') || 'Our Mission',
      content: getBlock('mission', 'content') || "Australia's Adventist Community Service exists to demonstrate God's love through practical service to all people, regardless of race, religion, gender or nationality.",
    },
    values: {
      title: getBlock('values', 'section_title') || 'Our Values',
      description: getBlock('values', 'section_description') || 'The principles that guide everything we do.',
      data: getJSONBlock<ValueItem[]>('values', 'values_data', STATIC_DATA.values),
    },
    team: {
      title: getBlock('team', 'section_title') || 'Meet Our Team',
      description: getBlock('team', 'section_description') || 'Our passionate team of professionals and volunteers are committed to making a difference in communities across Australia.',
      members: getJSONBlock<TeamMember[]>('team', 'team_data', STATIC_DATA.teamMembers),
    },
    testimonials: {
      title: getBlock('testimonials', 'section_title') || 'Hear from Our Volunteers',
      description: getBlock('testimonials', 'section_description') || 'Read about the experiences of our dedicated volunteers and how they are making a difference in their communities.',
      data: getJSONBlock<Testimonial[]>('testimonials', 'testimonials_data', STATIC_DATA.testimonials),
    },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image Section */}
      {isSectionEnabled('hero') && (
        <div className="relative h-[500px] overflow-hidden">
          <EditableImage
            pageId="about"
            sectionId="hero"
            blockKey="background_image"
            src={cms.hero.image}
            alt="Community helping together"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/60" />
          <div className="absolute bottom-0 left-0 right-0 pb-12">
            <div className="max-w-7xl mx-auto px-6">
              <EditableText
                pageId="about"
                sectionId="hero"
                blockKey="section_label"
                content={cms.hero.label}
                fallback="About Us"
                className="text-white/90 text-sm tracking-wider uppercase mb-4"
                as="p"
              />
              <EditableText
                pageId="about"
                sectionId="hero"
                blockKey="title"
                content={cms.hero.title}
                fallback="What Is Adventist Community Services?"
                className="text-white text-5xl md:text-6xl font-bold mb-6 leading-tight"
                as="h1"
              />
              <div className="max-w-3xl">
                <EditableRichText
                  pageId="about"
                  sectionId="hero"
                  blockKey="subtitle"
                  content={cms.hero.subtitle}
                  fallback="Adventist Community Services (ACS) is one of Australia's leading humanitarian organisations, providing compassionate service to communities across the nation."
                  className="text-white/90 text-lg leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* What Is ACS Section */}
      {isSectionEnabled('what-is-acs') && (
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="max-w-4xl">
            <EditableRichText
              pageId="about"
              sectionId="what-is-acs"
              blockKey="paragraph_1"
              content={cms.whatIsAcs.paragraph1}
              fallback="As the official humanitarian arm of the Seventh-day Adventist Church in Australia, we operate community centres and programs in cities and towns throughout the country. Our services include emergency relief, food banks, clothing assistance, budgeting support, and personal care programs."
              className="text-gray-700 mb-6 leading-relaxed"
            />
            <EditableRichText
              pageId="about"
              sectionId="what-is-acs"
              blockKey="paragraph_2"
              content={cms.whatIsAcs.paragraph2}
              fallback="We believe everyone deserves dignity, respect, and access to quality community services. Through our network of dedicated staff and volunteers, we serve thousands of Australians each year, building stronger, more resilient communities."
              className="text-gray-700 leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* Story Section */}
      {isSectionEnabled('our-story') && (
        <div className="max-w-7xl mx-auto px-6 pb-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="grid grid-cols-2 gap-3 h-full">
              {STORY_IMAGE_GRID.map((layout, index) => {
                const image = cms.story.images[index];
                if (!image) return null;
                return (
                  <div key={index} className={layout.className}>
                    <img
                      src={image.url}
                      alt={image.alt}
                      className={`rounded-2xl shadow-lg w-full ${layout.heightClass} object-cover`}
                    />
                  </div>
                );
              })}
            </div>

            <div>
              <EditableText
                pageId="about"
                sectionId="our-story"
                blockKey="title"
                content={cms.story.title}
                fallback="Our Story"
                className="text-[#1F2937] text-3xl font-bold mb-4"
                as="h3"
              />
              <EditableRichText
                pageId="about"
                sectionId="our-story"
                blockKey="paragraph_1"
                content={cms.story.paragraph1}
                fallback="For decades, Australia's Adventist Community Service has been a beacon of hope in communities across the nation. What started as a small volunteer effort has grown into a comprehensive network of services reaching thousands of Australians each year."
                className="text-gray-700 mb-4"
              />
              <EditableRichText
                pageId="about"
                sectionId="our-story"
                blockKey="paragraph_2"
                content={cms.story.paragraph2}
                fallback="Our dedicated team of staff and volunteers work tirelessly to provide food, clothing, emergency relief, and emotional support to communities across Australia. We believe in practical service that empowers long-term positive change."
                className="text-gray-700 mb-4"
              />
              <EditableRichText
                pageId="about"
                sectionId="our-story"
                blockKey="paragraph_3"
                content={cms.story.paragraph3}
                fallback="Every day, we witness the transformative power of community support and the resilience of the human spirit."
                className="text-gray-700 mb-12"
              />

              {isSectionEnabled('mission') && (
                <>
                  <EditableText
                    pageId="about"
                    sectionId="mission"
                    blockKey="title"
                    content={cms.mission.title}
                    fallback="Our Mission"
                    className="text-[#1F2937] text-3xl font-bold mb-4"
                    as="h3"
                  />
                  <EditableRichText
                    pageId="about"
                    sectionId="mission"
                    blockKey="content"
                    content={cms.mission.content}
                    fallback="Australia's Adventist Community Service exists to demonstrate God's love through practical service to all people, regardless of race, religion, gender or nationality."
                    className="text-gray-700"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Values Grid */}
      {isSectionEnabled('values') && (
        <div className="max-w-7xl mx-auto px-6 pb-24">
          <EditableText
            pageId="about"
            sectionId="values"
            blockKey="section_title"
            content={cms.values.title}
            fallback="Our Values"
            className="text-[#1F2937] text-4xl font-bold text-center mb-4"
            as="h2"
          />
          <EditableRichText
            pageId="about"
            sectionId="values"
            blockKey="section_description"
            content={cms.values.description}
            fallback="The principles that guide everything we do."
            className="text-gray-600 text-center max-w-2xl mx-auto mb-12"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {cms.values.data.map((value, index) => {
              const IconComponent = VALUE_ICONS[value.icon] || Heart;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F44314]/10 rounded-full mb-4">
                    <IconComponent className="w-8 h-8 text-[#F44314]" />
                  </div>
                  <h3 className="text-[#1F2937] font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-500 text-sm">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Team Section */}
      {isSectionEnabled('team') && (
        <div className="max-w-7xl mx-auto px-6 pb-32">
          <EditableText
            pageId="about"
            sectionId="team"
            blockKey="section_title"
            content={cms.team.title}
            fallback="Meet Our Team"
            className="text-[#1F2937] text-4xl font-bold text-center mb-4"
            as="h2"
          />
          <EditableRichText
            pageId="about"
            sectionId="team"
            blockKey="section_description"
            content={cms.team.description}
            fallback="Our passionate team of professionals and volunteers are committed to making a difference in communities across Australia."
            className="text-gray-600 text-center max-w-2xl mx-auto mb-12"
          />
          <div className="grid md:grid-cols-3 gap-8">
            {cms.team.members.map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.image}
                  alt={member.title}
                  className="w-48 h-48 rounded-full object-cover mx-auto mb-4 shadow-lg"
                />
                <h3 className="text-[#1F2937] font-semibold text-xl mb-1">{member.title}</h3>
                <p className="text-gray-500 text-sm mb-2">{member.department}</p>
                <p className="text-gray-500 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Testimonials Section */}
      {isSectionEnabled('testimonials') && (
        <div className="max-w-7xl mx-auto px-6 pb-24">
          <EditableText
            pageId="about"
            sectionId="testimonials"
            blockKey="section_title"
            content={cms.testimonials.title}
            fallback="Hear from Our Volunteers"
            className="text-[#1F2937] text-4xl font-bold text-center mb-4"
            as="h2"
          />
          <EditableRichText
            pageId="about"
            sectionId="testimonials"
            blockKey="section_description"
            content={cms.testimonials.description}
            fallback="Read about the experiences of our dedicated volunteers and how they are making a difference in their communities."
            className="text-gray-600 text-center max-w-2xl mx-auto mb-12"
          />
          <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
            <Masonry gutter="24px">
              {cms.testimonials.data.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </Masonry>
          </ResponsiveMasonry>
        </div>
      )}
    </div>
  );
}
