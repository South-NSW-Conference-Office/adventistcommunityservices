import { HeroSection } from '../components/HeroSection';
import { ServiceCard } from '../components/ServiceCard';
import { ClipboardCheck, GraduationCap, Heart } from 'lucide-react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

const services = [
  {
    id: 1,
    name: 'Food Bank Services',
    descriptionShort: 'Access nutritious food and essential supplies through our community food programs. We provide weekly food parcels and emergency relief packages.',
    locations: [{ address: { suburb: 'Sydney', state: 'NSW' } }],
    capacity: { maxParticipants: 200 },
    primaryImage: { url: 'https://images.unsplash.com/photo-1759709042164-0dd78a39028b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXN0cmFsaWElMjBjb21tdW5pdHklMjBoZWxwfGVufDF8fHx8MTc2NjE5NTgzNHww&ixlib=rb-4.1.0&q=80&w=1080' },
  },
  {
    id: 2,
    name: 'Clothing Assistance',
    descriptionShort: 'Find quality clothing and household items at affordable prices. Donations accepted and distributed to those in need across the community.',
    locations: [{ address: { suburb: 'Melbourne', state: 'VIC' } }],
    capacity: { maxParticipants: 150 },
    primaryImage: { url: 'https://images.unsplash.com/photo-1711395588577-ed596848b04f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXN0cmFsaWElMjB2b2x1bnRlZXIlMjBvdXRiYWNrfGVufDF8fHx8MTc2NjE5NTgzNHww&ixlib=rb-4.1.0&q=80&w=1080' },
  },
  {
    id: 3,
    name: 'Counseling & Support',
    descriptionShort: 'Professional counseling services and emotional support for individuals and families facing challenging times. Confidential and compassionate care.',
    locations: [{ address: { suburb: 'Brisbane', state: 'QLD' } }],
    capacity: { maxParticipants: 50 },
    primaryImage: { url: 'https://images.unsplash.com/photo-1759709042164-0dd78a39028b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzeWRuZXklMjBjb21tdW5pdHklMjBzZXJ2aWNlfGVufDF8fHx8MTc2NjE5NTgzNXww&ixlib=rb-4.1.0&q=80&w=1080' },
  },
  {
    id: 4,
    name: 'Emergency Relief',
    descriptionShort: 'Immediate assistance during crisis situations including natural disasters, homelessness, and unexpected hardships. Available 24/7 support.',
    locations: [{ address: { suburb: 'Perth', state: 'WA' } }],
    capacity: { maxParticipants: 100 },
    primaryImage: { url: 'https://images.unsplash.com/photo-1638769314338-9ba8e1e69465?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXN0cmFsaWElMjBjaGFyaXR5JTIwd2FybXxlbnwxfHx8fDE3NjYxOTU4MzV8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  },
];

const testimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    location: "Sydney, NSW",
    review: "Volunteering with ACS has been one of the most rewarding experiences of my life. The team is incredibly supportive, and knowing that I'm making a real difference in people's lives keeps me coming back every week.",
    image: "https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NjI3Nzk2Mnww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 2,
    name: "David Chen",
    location: "Melbourne, VIC",
    review: "The food bank program is amazing! I've been volunteering for 6 months and have met so many wonderful people. It's heartwarming to see the impact we make together.",
    image: "https://images.unsplash.com/photo-1738566061505-556830f8b8f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBhc2lhbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NjM3MDQ5Nnww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 3,
    name: "Emma Thompson",
    location: "Brisbane, QLD",
    review: "I started volunteering after retiring, and it's given me a new sense of purpose. The orientation was thorough, and everyone made me feel welcome from day one.",
    image: "https://images.unsplash.com/photo-1758686254563-5c5ab338c8b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXR1cmUlMjB3b21hbiUyMHNtaWxpbmclMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjYzNzA0OTh8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 4,
    name: "Michael Roberts",
    location: "Perth, WA",
    review: "As a corporate volunteer, I appreciate how flexible and organized ACS is. They make it easy to give back to the community even with a busy schedule.",
    image: "https://images.unsplash.com/photo-1737574821698-862e77f044c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzc21hbiUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NjM3MDQ5N3ww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 5,
    name: "Lisa Anderson",
    location: "Adelaide, SA",
    review: "The emergency relief program has shown me the true meaning of community care. Every shift reminds me why this work is so important. Highly recommend volunteering here!",
    image: "https://images.unsplash.com/photo-1555396768-2a77b9e979c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHZvbHVudGVlciUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NjM0OTA0OHww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 6,
    name: "James Wilson",
    location: "Canberra, ACT",
    review: "Being part of the clothing assistance team has been incredible. The organization is professional, the mission is clear, and the impact is visible.",
    image: "https://images.unsplash.com/photo-1758639842438-718755aa57e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NjI4Nzg5NXww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 7,
    name: "Rachel Green",
    location: "Hobart, TAS",
    review: "I love how ACS values each volunteer's unique skills and interests. They matched me with a role that perfectly fits my schedule and passion for helping others.",
    image: "https://images.unsplash.com/photo-1760551937527-2bc6cfe45180?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGNhc3VhbCUyMHBvcnRyYWl0JTIwc21pbGV8ZW58MXx8fHwxNzY2MzcwNDk4fDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 8,
    name: "Thomas Brown",
    location: "Darwin, NT",
    review: "The training and support provided by ACS is exceptional. I felt prepared and confident to start volunteering from the very beginning.",
    image: "https://images.unsplash.com/photo-1640653583383-72b60809f273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBmcmllbmRseSUyMHBvcnRyYWl0JTIwc21pbGV8ZW58MXx8fHwxNzY2MzcwNDk4fDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
];

export function Home() {
  return (
    <div>
      <HeroSection />
      
      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-white/70 text-sm tracking-wider uppercase mb-2">Our Services</p>
          <h2 className="text-white text-4xl font-bold mb-4">Available Community Services</h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Explore our range of community support programs designed to help those in need across Australia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              name={service.name}
              descriptionShort={service.descriptionShort}
              locations={service.locations}
              capacity={service.capacity}
              primaryImage={service.primaryImage}
            />
          ))}
        </div>
      </section>

      {/* Volunteer Application Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image Grid */}
          <div className="order-2 md:order-1">
            <div className="grid grid-cols-2 gap-4 h-[600px]">
              {/* Large image - top left */}
              <div className="relative group row-span-2 rounded-2xl overflow-hidden shadow-lg cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1710092784814-4a6f158913b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2x1bnRlZXJzJTIwZm9vZCUyMGJhbmslMjBoZWxwaW5nfGVufDF8fHx8MTc2NjM3MDE3Nnww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Food Bank Volunteers"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center p-6">
                  <p className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Help distribute food and essential supplies to families in need across our community
                  </p>
                </div>
              </div>

              {/* Top right image */}
              <div className="relative group rounded-2xl overflow-hidden shadow-lg cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1722336762551-831c0bcc2b59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjB2b2x1bnRlZXJzJTIwcGFja2luZyUyMGNsb3RoZXN8ZW58MXx8fHwxNzY2MzcwMTc2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Clothing Assistance"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center p-4">
                  <p className="text-white text-center text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Sort and organize clothing donations for those in our community
                  </p>
                </div>
              </div>

              {/* Middle right image */}
              <div className="relative group rounded-2xl overflow-hidden shadow-lg cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1758599668125-e154250f24bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2x1bnRlZXJzJTIwdGVhbXdvcmslMjBjb21tdW5pdHl8ZW58MXx8fHwxNzY2MzcwMTc3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Teamwork"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center p-4">
                  <p className="text-white text-center text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Join our team in organizing community events and fundraising activities
                  </p>
                </div>
              </div>

              {/* Bottom right image */}
              <div className="relative group col-span-2 rounded-2xl overflow-hidden shadow-lg cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1657558638549-9fd140b1ab5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2x1bnRlZXJzJTIwaGVscGluZyUyMGVsZGVybHl8ZW58MXx8fHwxNzY2MzcwMTc3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Community Support"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center p-6">
                  <p className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Provide compassionate support and companionship to elderly members of our community
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 md:order-2">
            <p className="text-white/70 text-sm tracking-wider uppercase mb-2">Join Our Team</p>
            <h2 className="text-white text-4xl font-bold mb-4">Become a Volunteer</h2>
            <p className="text-white/80 mb-6">
              Make a lasting impact in your community by joining our team of dedicated volunteers. Whether you have a few hours a week or can commit to regular service, your contribution matters.
            </p>
            <p className="text-white/80 mb-6">
              We offer a variety of volunteer opportunities across Australia, from food distribution and clothing assistance to counseling support and emergency relief. No matter your skills or interests, there's a place for you in our community.
            </p>
            <p className="text-white/80 mb-8">
              Our volunteers are the heart of everything we do. Join us in bringing hope, support, and practical assistance to those who need it most.
            </p>

            <div className="space-y-4">
              <button className="w-full bg-white text-[#F44314] font-semibold py-4 px-8 rounded-lg hover:bg-white/90 transition-colors shadow-lg">
                Apply to Volunteer
              </button>
              <button className="w-full bg-white/10 border border-white/20 text-white font-semibold py-4 px-8 rounded-lg hover:bg-white/20 transition-colors">
                Learn More About Our Programs
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Three Step Process Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <p className="text-white/70 text-sm tracking-wider uppercase mb-2">Getting Started</p>
          <h2 className="text-white text-4xl font-bold mb-4">How to Work With Us</h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Join Adventist Community Services in just three simple steps and start making a difference today.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="relative text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
                <ClipboardCheck className="w-12 h-12 text-white" />
              </div>
            </div>
            <div className="absolute top-0 right-0 md:right-[-2rem] text-white/20 text-8xl font-bold">
              01
            </div>
            <h3 className="text-white text-2xl font-semibold mb-4">Apply Online</h3>
            <p className="text-white/70">
              Fill out our simple online application form with your details, interests, and availability. Tell us about yourself and which programs interest you most.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
                <GraduationCap className="w-12 h-12 text-white" />
              </div>
            </div>
            <div className="absolute top-0 right-0 md:right-[-2rem] text-white/20 text-8xl font-bold">
              02
            </div>
            <h3 className="text-white text-2xl font-semibold mb-4">Attend Orientation</h3>
            <p className="text-white/70">
              Join our comprehensive orientation and training session where you'll learn about our mission, values, safety procedures, and the specific role you'll be filling.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
                <Heart className="w-12 h-12 text-white" />
              </div>
            </div>
            <div className="absolute top-0 right-0 md:right-[-2rem] text-white/20 text-8xl font-bold">
              03
            </div>
            <h3 className="text-white text-2xl font-semibold mb-4">Start Serving</h3>
            <p className="text-white/70">
              Begin your volunteer journey and make a real impact in your community. You'll be supported by our experienced team every step of the way.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <button className="bg-white text-[#F44314] font-semibold py-4 px-12 rounded-lg hover:bg-white/90 transition-colors shadow-lg">
            Get Started Today
          </button>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <p className="text-white/70 text-sm tracking-wider uppercase mb-2">Testimonials</p>
          <h2 className="text-white text-4xl font-bold mb-4">What Others Have to Say</h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Hear from our wonderful volunteers about their experiences making a difference in the community.
          </p>
        </div>

        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
          <Masonry gutter="24px">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 shadow-lg relative overflow-hidden group"
              >
                {/* Glare effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div 
                    className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                      width: '50%',
                    }}
                  />
                </div>
                
                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <img 
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
                  />
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-white/60 text-sm">{testimonial.location}</p>
                  </div>
                </div>
                <div className="mb-4 relative z-10">
                  <svg className="w-10 h-10 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-white/90 leading-relaxed relative z-10">
                  {testimonial.review}
                </p>
              </div>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </section>
    </div>
  );
}