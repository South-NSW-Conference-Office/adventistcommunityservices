import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Users,
  ArrowLeft,
  RefreshCw,
  Calendar,
  Building2,
  Car,
  Utensils,
  Monitor,
  Accessibility,
  Heart,
  User,
  ExternalLink,
  Navigation,
  ChevronRight,
} from 'lucide-react';
import { useChurchDetail } from '../hooks/useChurches';
import type {
  ChurchLeader,
  ChurchLocation,
  ChurchServiceTime,
} from '../types/church.types';
import { JSX, useEffect, useState } from 'react';
import { motion } from 'motion/react';

const DEFAULT_CHURCH_IMAGE =
  'https://images.unsplash.com/photo-1438032005730-c779502df39b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';

const OUTREACH_LABELS: Record<string, string> = {
  food_assistance: 'Food Assistance',
  clothing: 'Clothing',
  health_services: 'Health Services',
  education: 'Education',
  disaster_relief: 'Disaster Relief',
  community_development: 'Community Development',
  family_services: 'Family Services',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatAddress(location: ChurchLocation | undefined): string {
  if (!location?.address) return 'Address not available';
  const { street, city, state, postalCode } = location.address;
  const parts = [street, city, state, postalCode].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : 'Address not available';
}

function formatLocationShort(location: ChurchLocation | undefined): string {
  if (!location?.address) return 'Location TBA';
  const { city, state } = location.address;
  return [city, state].filter(Boolean).join(', ') || 'Location TBA';
}

function getDirectionsUrl(location: ChurchLocation | undefined, address: string): string | null {
  if (location?.coordinates) {
    return `https://www.google.com/maps/dir/?api=1&destination=${location.coordinates.latitude},${location.coordinates.longitude}`;
  }
  if (address && address !== 'Address not available') {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  }
  return null;
}

function getWebsiteUrl(website: string): string {
  return website.startsWith('http') ? website : `https://${website}`;
}

function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

// ---------------------------------------------------------------------------
// Shared animation variants
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ServiceTimeRow({ icon: Icon, label, service }: { icon: React.ElementType; label: string; service: ChurchServiceTime }): JSX.Element {
  const timeDisplay = service.day ? `${service.day} ${service.time || ''}`.trim() : service.time || 'Contact for time';
  return (
    <div className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-0">
      <div className="w-10 h-10 rounded-xl bg-[#FFF1EE] flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-[#F44314]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-[#1F2937] text-lg font-semibold">{timeDisplay}</p>
        {service.description && <p className="text-gray-500 text-sm mt-0.5">{service.description}</p>}
      </div>
    </div>
  );
}

function LeaderCard({ title, leader, icon: Icon, highlight = false }: { title: string; leader: ChurchLeader; icon: React.ElementType; highlight?: boolean }): JSX.Element {
  return (
    <div className="group relative bg-white rounded-2xl p-5 border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300">
      {highlight && <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-[#F44314] to-[#F97023] rounded-b" />}
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${highlight ? 'bg-[#F44314]' : 'bg-gray-100'}`}>
          <Icon className={`w-5 h-5 ${highlight ? 'text-white' : 'text-gray-600'}`} />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{title}</p>
          <p className="text-[#1F2937] font-semibold">{leader.name}</p>
        </div>
      </div>
      {leader.title && <p className="text-gray-500 text-sm mb-3">{leader.title}</p>}
      <div className="space-y-1.5">
        {leader.phone && (
          <a href={`tel:${leader.phone}`} className="flex items-center gap-2 text-gray-500 text-sm hover:text-[#F44314] transition-colors">
            <Phone className="w-3.5 h-3.5" />
            {leader.phone}
          </a>
        )}
        {leader.email && (
          <a href={`mailto:${leader.email}`} className="flex items-center gap-2 text-gray-500 text-sm hover:text-[#F44314] transition-colors">
            <Mail className="w-3.5 h-3.5" />
            <span className="truncate">{leader.email}</span>
          </a>
        )}
      </div>
    </div>
  );
}

function SectionHeading({ children, subtitle }: { children: React.ReactNode; subtitle?: string }): JSX.Element {
  return (
    <div className="mb-6">
      <h2 className="text-[#1F2937] text-2xl font-bold tracking-tight">{children}</h2>
      {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
    </div>
  );
}

function FacilityChip({ icon: Icon, label, detail }: { icon: React.ElementType; label: string; detail?: string }): JSX.Element {
  return (
    <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
      <Icon className="w-4 h-4 text-[#F44314]" />
      <div>
        <p className="text-[#1F2937] text-sm font-semibold">{label}</p>
        {detail && <p className="text-gray-400 text-xs">{detail}</p>}
      </div>
    </div>
  );
}

function PageState({ message, showRefresh, onRefresh }: { message: string; showRefresh?: boolean; onRefresh?: () => void }): JSX.Element {
  return (
    <div className="min-h-screen bg-[#F8F7F5] flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl p-12 max-w-md text-center shadow-sm border border-gray-100">
        <p className="text-[#1F2937] text-xl font-semibold mb-4">{message}</p>
        <div className="flex flex-col gap-3">
          {showRefresh && onRefresh && (
            <button
              onClick={onRefresh}
              className="inline-flex items-center justify-center gap-2 bg-[#F44314] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#d93a10] transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
          )}
          <Link to="/fellowship" className="inline-flex items-center justify-center gap-2 text-gray-500 hover:text-[#F44314] transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Fellowship
          </Link>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ChurchDetails(): JSX.Element {
  const { id } = useParams();
  const navigate = useNavigate();
  const { church, loading, error, refetch } = useChurchDetail(id);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F7F5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#F44314] border-t-transparent" />
          <p className="text-gray-400 text-sm">Loading church details...</p>
        </div>
      </div>
    );
  }

  if (error) return <PageState message={error} showRefresh onRefresh={refetch} />;
  if (!church) return <PageState message="Church not found" />;

  const imageUrl = church.primaryImage?.url || DEFAULT_CHURCH_IMAGE;
  const address = formatAddress(church.location);
  const locationShort = formatLocationShort(church.location);
  const phone = church.contact?.phone || 'Contact for details';
  const email = church.contact?.email;
  const website = church.contact?.website;
  const directionsUrl = getDirectionsUrl(church.location, address);
  const conferenceName =
    church.conference?.name?.replace(/\s*Conference$/i, '') || 'Region';

  // Service times
  const sabbathSchool = church.services?.sabbathSchool;
  const worship = church.services?.worship;
  const prayerMeeting = church.services?.prayerMeeting;
  const vespers = church.services?.vespers;
  const specialServices = church.services?.special || [];

  // Facilities
  const sanctuary = church.facilities?.sanctuary;
  const classrooms = church.facilities?.classrooms || [];
  const kitchen = church.facilities?.kitchen;
  const parking = church.facilities?.parking;
  const otherFacilities = church.facilities?.other || [];

  // Leadership
  const pastors = church.leadership?.associatePastors || [];
  const firstElder = church.leadership?.firstElder;
  const acsCoordinator = church.leadership?.acsCoordinator;
  const clerk = church.leadership?.clerk;
  const treasurer = church.leadership?.treasurer;

  // Outreach
  const outreachFocus = church.outreach?.primaryFocus || [];
  const serviceArea = church.outreach?.serviceArea;

  // Stats
  const teamCount = church.stats?.teamCount || 0;
  const serviceCount = church.stats?.serviceCount || 0;

  const hasServiceTimes = sabbathSchool || worship || prayerMeeting || vespers || specialServices.length > 0;
  const hasFacilities = sanctuary || classrooms.length > 0 || kitchen?.available || parking;
  const hasLeadership = pastors.length > 0 || firstElder || acsCoordinator || clerk || treasurer;
  const hasOutreach = outreachFocus.length > 0 || serviceArea;

  return (
    <div className="min-h-screen bg-[#F8F7F5]">
      {/* Floating back button on scroll */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: scrolled ? 1 : 0, y: scrolled ? 0 : -20 }}
        className="fixed top-20 left-6 z-50 pointer-events-auto"
        style={{ pointerEvents: scrolled ? 'auto' : 'none' }}
      >
        <button
          onClick={() => navigate('/fellowship')}
          className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-full shadow-lg border border-gray-200 hover:bg-white transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </motion.div>

      {/* ================================================================== */}
      {/* HERO                                                               */}
      {/* ================================================================== */}
      <div className="relative">
        {/* Image */}
        <div className="relative h-[420px] md:h-[520px] overflow-hidden">
          <img
            src={imageUrl}
            alt={church.name || 'Church'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

          {/* Back button in hero */}
          <div className="absolute top-24 left-0 right-0">
            <div className="max-w-6xl mx-auto px-6">
              <button
                onClick={() => navigate('/fellowship')}
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Fellowship
              </button>
            </div>
          </div>

          {/* Hero content */}
          <div className="absolute bottom-0 left-0 right-0 pb-10">
            <div className="max-w-6xl mx-auto px-6">
              <motion.div initial="hidden" animate="visible" className="space-y-4">
                {/* Breadcrumb */}
                <motion.div variants={fadeUp} custom={0} className="flex items-center gap-2 text-white/50 text-xs font-medium">
                  <Link to="/fellowship" className="hover:text-white/70 transition-colors">Fellowship</Link>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-white/70">{church.name}</span>
                </motion.div>

                <motion.h1 variants={fadeUp} custom={1} className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] max-w-3xl">
                  {church.name}
                </motion.h1>

                <motion.div variants={fadeUp} custom={2} className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{locationShort}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <Building2 className="w-4 h-4" />
                    <span>{conferenceName}</span>
                  </div>
                  {teamCount > 0 && (
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <Users className="w-4 h-4" />
                      <span>{teamCount} {pluralize(teamCount, 'Team', 'Teams')}</span>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Action bar — overlaps hero bottom */}
        <div className="max-w-6xl mx-auto px-6 -mt-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 flex flex-wrap items-center gap-3"
          >
            {phone !== 'Contact for details' && (
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center gap-2 bg-[#F44314] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#d93a10] transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
            )}
            {directionsUrl && (
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-100 text-[#1F2937] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                <Navigation className="w-4 h-4" />
                Get Directions
              </a>
            )}
            {website && (
              <a
                href={getWebsiteUrl(website)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-100 text-[#1F2937] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                <Globe className="w-4 h-4" />
                Website
              </a>
            )}

            {/* Address — right side */}
            <div className="ml-auto hidden md:flex items-center gap-2 text-gray-500 text-sm">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>{address}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* CONTENT                                                            */}
      {/* ================================================================== */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* ============================================================ */}
          {/* Main content — 2 cols                                        */}
          {/* ============================================================ */}
          <div className="lg:col-span-2 space-y-12">
            {/* Service Times */}
            {hasServiceTimes && (
              <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
                <motion.div variants={fadeUp} custom={0}>
                  <SectionHeading subtitle="When to visit">Service Times</SectionHeading>
                </motion.div>
                <motion.div variants={fadeUp} custom={1} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="divide-y divide-gray-50 px-6">
                    {sabbathSchool && <ServiceTimeRow icon={Clock} label="Sabbath School" service={sabbathSchool} />}
                    {worship && <ServiceTimeRow icon={Clock} label="Worship Service" service={worship} />}
                    {prayerMeeting && <ServiceTimeRow icon={Calendar} label="Prayer Meeting" service={prayerMeeting} />}
                    {vespers && <ServiceTimeRow icon={Clock} label="Vespers" service={vespers} />}
                  </div>
                </motion.div>

                {specialServices.length > 0 && (
                  <motion.div variants={fadeUp} custom={2} className="mt-4 space-y-2">
                    {specialServices.map((service, index) => (
                      <div key={index} className="bg-white rounded-xl border border-gray-100 px-5 py-3">
                        <p className="text-[#1F2937] font-semibold text-sm">{service.name}</p>
                        {service.schedule && <p className="text-gray-500 text-xs mt-0.5">{service.schedule}</p>}
                        {service.description && <p className="text-gray-400 text-xs mt-0.5">{service.description}</p>}
                      </div>
                    ))}
                  </motion.div>
                )}
              </motion.section>
            )}

            {/* Facilities */}
            {hasFacilities && (
              <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
                <motion.div variants={fadeUp} custom={0}>
                  <SectionHeading subtitle="What we have">Our Facilities</SectionHeading>
                </motion.div>
                <motion.div variants={fadeUp} custom={1} className="grid sm:grid-cols-2 gap-3">
                  {sanctuary && (
                    <FacilityChip
                      icon={Building2}
                      label="Sanctuary"
                      detail={[
                        sanctuary.capacity ? `${sanctuary.capacity} seats` : null,
                        sanctuary.hasAV ? 'A/V' : null,
                        sanctuary.hasAccessibility ? 'Accessible' : null,
                      ].filter(Boolean).join(' · ') || undefined}
                    />
                  )}
                  {classrooms.length > 0 && (
                    <FacilityChip icon={Users} label="Classrooms" detail={`${classrooms.length} available`} />
                  )}
                  {kitchen?.available && (
                    <FacilityChip icon={Utensils} label="Kitchen" detail={kitchen.capacity ? `Capacity: ${kitchen.capacity}` : 'Available'} />
                  )}
                  {parking && (parking.spaces || parking.handicapSpaces) && (
                    <FacilityChip
                      icon={Car}
                      label="Parking"
                      detail={[
                        parking.spaces ? `${parking.spaces} spaces` : null,
                        parking.handicapSpaces ? `${parking.handicapSpaces} accessible` : null,
                      ].filter(Boolean).join(' · ') || undefined}
                    />
                  )}
                  {otherFacilities.map((f, i) => (
                    <FacilityChip key={i} icon={Building2} label={f} />
                  ))}
                </motion.div>
              </motion.section>
            )}

            {/* Leadership */}
            {hasLeadership && (
              <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
                <motion.div variants={fadeUp} custom={0}>
                  <SectionHeading subtitle="Who to connect with">Leadership Team</SectionHeading>
                </motion.div>
                <motion.div variants={fadeUp} custom={1} className="grid sm:grid-cols-2 gap-4">
                  {pastors.map((pastor, index) => (
                    <LeaderCard key={index} title={index === 0 ? 'Pastor' : 'Associate Pastor'} leader={pastor} icon={User} />
                  ))}
                  {firstElder && <LeaderCard title="First Elder" leader={firstElder} icon={User} />}
                  {acsCoordinator && <LeaderCard title="ACS Coordinator" leader={acsCoordinator} icon={Heart} highlight />}
                  {clerk && <LeaderCard title="Church Clerk" leader={clerk} icon={User} />}
                  {treasurer && <LeaderCard title="Treasurer" leader={treasurer} icon={User} />}
                </motion.div>
              </motion.section>
            )}

            {/* Outreach */}
            {hasOutreach && (
              <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
                <motion.div variants={fadeUp} custom={0}>
                  <SectionHeading subtitle="How we serve">Community Outreach</SectionHeading>
                </motion.div>

                {outreachFocus.length > 0 && (
                  <motion.div variants={fadeUp} custom={1} className="flex flex-wrap gap-2 mb-4">
                    {outreachFocus.map((focus, index) => {
                      const label = typeof focus === 'string' ? (OUTREACH_LABELS[focus] || focus) : focus.label;
                      return (
                        <span
                          key={index}
                          className="px-4 py-2 rounded-full text-sm font-medium bg-[#FFF1EE] text-[#F44314] border border-[#F4431420]"
                        >
                          {label}
                        </span>
                      );
                    })}
                  </motion.div>
                )}

                {serviceArea && (
                  <motion.div variants={fadeUp} custom={2} className="bg-white rounded-2xl border border-gray-100 p-5">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-2">Service Area</p>
                    {serviceArea.radius && (
                      <p className="text-[#1F2937] font-semibold">Within {serviceArea.radius} miles</p>
                    )}
                    {serviceArea.communities && serviceArea.communities.length > 0 && (
                      <p className="text-gray-500 text-sm mt-1">{serviceArea.communities.join(', ')}</p>
                    )}
                    {serviceArea.specialPopulations && serviceArea.specialPopulations.length > 0 && (
                      <p className="text-gray-500 text-sm mt-1">
                        Focus: {serviceArea.specialPopulations.join(', ')}
                      </p>
                    )}
                  </motion.div>
                )}
              </motion.section>
            )}
          </div>

          {/* ============================================================ */}
          {/* Sidebar                                                      */}
          {/* ============================================================ */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-5">
              {/* Contact card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="bg-gradient-to-br from-[#F44314] to-[#F97023] p-5">
                  <h3 className="text-white text-lg font-bold">Get in Touch</h3>
                  <p className="text-white/70 text-sm mt-0.5">We'd love to hear from you</p>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">Address</p>
                    <p className="text-[#1F2937] text-sm leading-relaxed">{address}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">Phone</p>
                    {phone !== 'Contact for details' ? (
                      <a href={`tel:${phone}`} className="text-[#F44314] text-sm font-medium hover:underline">{phone}</a>
                    ) : (
                      <p className="text-gray-500 text-sm">{phone}</p>
                    )}
                  </div>
                  {email && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">Email</p>
                      <a href={`mailto:${email}`} className="text-[#F44314] text-sm font-medium hover:underline break-all">{email}</a>
                    </div>
                  )}
                  {website && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">Website</p>
                      <a
                        href={getWebsiteUrl(website)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#F44314] text-sm font-medium hover:underline break-all flex items-center gap-1"
                      >
                        {website}
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Stats */}
              {(teamCount > 0 || serviceCount > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                >
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-4">At a Glance</p>
                  <div className="grid grid-cols-2 gap-4">
                    {teamCount > 0 && (
                      <div className="text-center">
                        <p className="text-[#F44314] text-3xl font-bold">{teamCount}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{pluralize(teamCount, 'Team', 'Teams')}</p>
                      </div>
                    )}
                    {serviceCount > 0 && (
                      <div className="text-center">
                        <p className="text-[#F44314] text-3xl font-bold">{serviceCount}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{pluralize(serviceCount, 'Service', 'Services')}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Map + Directions */}
              {(address !== 'Address not available' || church.location?.coordinates) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <div className="aspect-[4/3] w-full">
                    <iframe
                      title={`Map of ${church.name}`}
                      className="w-full h-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      src={
                        church.location?.coordinates
                          ? `https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${church.location.coordinates.latitude},${church.location.coordinates.longitude}&zoom=15`
                          : `https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(address)}&zoom=15`
                      }
                    />
                  </div>
                  {directionsUrl && (
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-[#1F2937] group hover:bg-[#111827] transition-colors"
                    >
                      <div>
                        <p className="text-white font-semibold text-sm">Get Directions</p>
                        <p className="text-gray-400 text-xs mt-0.5">Open in Maps</p>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <Navigation className="w-4 h-4 text-white" />
                      </div>
                    </a>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* FOOTER CTA                                                        */}
      {/* ================================================================== */}
      <div className="bg-white border-t border-gray-100 py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-[#1F2937] text-2xl font-bold mb-3">Come Visit Us</h2>
          <p className="text-gray-500 mb-6">
            Everyone is welcome — no membership required. Come for a meal,
            meet kind people, and find a place you belong.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {phone !== 'Contact for details' && (
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center gap-2 bg-[#F44314] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#d93a10] transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call Us
              </a>
            )}
            {directionsUrl && (
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-100 text-[#1F2937] px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                <Navigation className="w-4 h-4" />
                Directions
              </a>
            )}
            <Link
              to="/fellowship"
              className="inline-flex items-center gap-2 bg-gray-100 text-[#1F2937] px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Browse More Churches
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
