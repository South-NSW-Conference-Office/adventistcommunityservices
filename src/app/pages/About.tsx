import { Heart, Users, Globe, Award } from 'lucide-react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

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

export function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F44314] via-[#F97023] to-[#F98344]">
      {/* Hero Image Section */}
      <div className="relative h-[500px] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1576897202707-f397683935d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXN0cmFsaWElMjBjb21tdW5pdHklMjBoZWxwaW5nJTIwaGFuZHMlMjB0b2dldGhlcnxlbnwxfHx8fDE3NjYzNzI0NTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Community helping together"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 via-30% via-transparent via-70% to-[#F44314]"></div>
        
        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 pb-12">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-white/90 text-sm tracking-wider uppercase mb-4">About Us</p>
            <h1 className="text-white text-5xl md:text-6xl font-bold mb-6 leading-tight">
              What Is Adventist<br />
              Community Services?
            </h1>
            <div className="max-w-3xl">
              <p className="text-white/90 text-lg leading-relaxed">
                Adventist Community Services (ACS) is one of Australia's leading humanitarian organisations, providing 
                compassionate assistance to people experiencing hardship and disadvantage across the nation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* What Is ACS Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="max-w-4xl">
          <p className="text-white/80 mb-6 leading-relaxed">
            As the official humanitarian arm of the Seventh-day Adventist Church in Australia, we operate community centres 
            and programs in cities and towns throughout the country. Our services include emergency relief, food banks, 
            clothing assistance, budgeting support, and personal care programs.
          </p>
          <p className="text-white/80 leading-relaxed">
            We believe everyone deserves dignity, respect, and practical support when they need it most. Through our network 
            of dedicated staff and volunteers, we serve thousands of Australians each year, offering hope and help to build 
            stronger, more resilient communities.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="grid grid-cols-2 gap-3 h-full">
            {/* Large image - top left */}
            <div className="col-span-1 row-span-2">
              <img 
                src="https://images.unsplash.com/photo-1664799024654-9bc64fd66af1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXN0cmFsaWElMjBvdXRiYWNrJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc2NjE5Njk2N3ww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Australian outback"
                className="rounded-2xl shadow-lg w-full h-full object-cover"
              />
            </div>
            
            {/* Small image - top right */}
            <div className="col-span-1">
              <img 
                src="https://images.unsplash.com/photo-1443048361775-c3bab8add48e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzeWRuZXklMjBhdXN0cmFsaWElMjBjaXR5c2NhcGV8ZW58MXx8fHwxNzY2MTk2OTY3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Sydney cityscape"
                className="rounded-2xl shadow-lg w-full h-full object-cover"
              />
            </div>
            
            {/* Medium image - middle right */}
            <div className="col-span-1">
              <img 
                src="https://images.unsplash.com/photo-1510508050928-0d01634906dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXN0cmFsaWElMjBiZWFjaCUyMGNvYXN0YWx8ZW58MXx8fHwxNzY2MTk2OTY3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Australian beach"
                className="rounded-2xl shadow-lg w-full h-full object-cover"
              />
            </div>
            
            {/* Wide image - bottom spanning both columns */}
            <div className="col-span-2">
              <img 
                src="https://images.unsplash.com/photo-1743130940758-622b8e6b4140?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXN0cmFsaWElMjBjb21tdW5pdHklMjB2b2x1bnRlZXJzfGVufDF8fHx8MTc2NjE5Njk2Nnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Community volunteers"
                className="rounded-2xl shadow-lg w-full h-48 object-cover"
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-white text-3xl font-bold mb-4">Our Story</h3>
            <p className="text-white/80 mb-4">
              For decades, Australia's Adventist Community Service has been a beacon of hope in communities across the nation. 
              What started as a small volunteer effort has grown into a comprehensive network of services reaching thousands of Australians each year.
            </p>
            <p className="text-white/80 mb-4">
              Our dedicated team of staff and volunteers work tirelessly to provide food, clothing, emergency relief, and emotional support 
              to those facing hardship. We believe in addressing both immediate needs and empowering long-term positive change.
            </p>
            <p className="text-white/80 mb-12">
              Every day, we witness the transformative power of community support and the resilience of the human spirit.
            </p>

            {/* Mission Section - moved here */}
            <h3 className="text-white text-3xl font-bold mb-4">Our Mission</h3>
            <p className="text-white/80">
              Australia's Adventist Community Service exists to demonstrate God's love through practical assistance to people in need, 
              regardless of race, religion, gender or nationality.
            </p>
          </div>
        </div>
      </div>

      {/* Values Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#F44314] to-[#F97023] rounded-full mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Compassion</h3>
            <p className="text-white/70 text-sm">
              We serve with genuine care and empathy for every individual
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#F44314] to-[#F97023] rounded-full mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Community</h3>
            <p className="text-white/70 text-sm">
              Building stronger communities through connection and support
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#F44314] to-[#F97023] rounded-full mb-4">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Inclusivity</h3>
            <p className="text-white/70 text-sm">
              Welcoming everyone with dignity and respect
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#F44314] to-[#F97023] rounded-full mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Excellence</h3>
            <p className="text-white/70 text-sm">
              Delivering quality services with integrity and professionalism
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-6 pb-32">
        <h2 className="text-white text-4xl font-bold text-center mb-4">Meet Our Team</h2>
        <p className="text-white/70 text-center max-w-2xl mx-auto mb-12">
          Our passionate team of professionals and volunteers are committed to making a difference in communities across Australia.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <img 
              src="https://images.unsplash.com/photo-1759709042164-0dd78a39028b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXN0cmFsaWElMjBoZWxwaW5nJTIwaGFuZHM8ZW58MXx8fHwxNzY2MTk2MTgzfDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Team member"
              className="w-48 h-48 rounded-full object-cover mx-auto mb-4 shadow-lg"
            />
            <h3 className="text-white font-semibold text-xl mb-1">National Director</h3>
            <p className="text-white/70 text-sm mb-2">Leadership Team</p>
            <p className="text-white/60 text-sm">
              Guiding our vision and mission across Australia
            </p>
          </div>
          <div className="text-center">
            <img 
              src="https://images.unsplash.com/photo-1638769314338-9ba8e1e69465?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXN0cmFsaWElMjBjaGFyaXR5JTIwd2FybXxlbnwxfHx8fDE3NjYxOTU4MzV8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Team member"
              className="w-48 h-48 rounded-full object-cover mx-auto mb-4 shadow-lg"
            />
            <h3 className="text-white font-semibold text-xl mb-1">Program Coordinators</h3>
            <p className="text-white/70 text-sm mb-2">Service Delivery</p>
            <p className="text-white/60 text-sm">
              Managing daily operations and community outreach
            </p>
          </div>
          <div className="text-center">
            <img 
              src="https://images.unsplash.com/photo-1586210477035-c8d790403e35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXN0cmFsaWElMjBjaHVyY2glMjBtaXNzaW9ufGVufDF8fHx8MTc2NjE5NjE4NHww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Team member"
              className="w-48 h-48 rounded-full object-cover mx-auto mb-4 shadow-lg"
            />
            <h3 className="text-white font-semibold text-xl mb-1">Volunteer Team</h3>
            <p className="text-white/70 text-sm mb-2">Community Support</p>
            <p className="text-white/60 text-sm">
              The heart of our service delivery
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-white text-4xl font-bold text-center mb-4">Hear from Our Volunteers</h2>
        <p className="text-white/70 text-center max-w-2xl mx-auto mb-12">
          Read about the experiences of our dedicated volunteers and how they are making a difference in their communities.
        </p>
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
      </div>
    </div>
  );
}