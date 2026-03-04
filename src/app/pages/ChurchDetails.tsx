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
} from 'lucide-react';
import { useChurchDetail } from '../hooks/useChurches';
import type {
  ChurchLeader,
  ChurchLocation,
  ChurchServiceTime,
  OutreachFocusType,
} from '../types/church.types';
import { JSX } from 'react';

const DEFAULT_CHURCH_IMAGE =
  'https://images.unsplash.com/photo-1438032005730-c779502df39b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';

const GRADIENT_BG = 'min-h-screen bg-gradient-to-br from-[#F44314] via-[#F97023] to-[#F98344]';
const CARD_STYLES = 'bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4';

const OUTREACH_LABELS: Record<OutreachFocusType, string> = {
  food_assistance: 'Food Assistance',
  clothing: 'Clothing',
  health_services: 'Health Services',
  education: 'Education',
  disaster_relief: 'Disaster Relief',
  community_development: 'Community Development',
  family_services: 'Family Services',
};

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

function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

function getWebsiteUrl(website: string): string {
  const url = website.startsWith('http') ? website : `https://${website}`;
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '#';
    }
    return parsed.toString();
  } catch {
    return '#';
  }
}

interface InfoCardProps {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}

function InfoCard({ icon: Icon, label, children }: InfoCardProps): JSX.Element {
  return (
    <div className={CARD_STYLES}>
      <div className="flex items-center gap-2 text-white/90 text-sm font-medium mb-2">
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </div>
      {children}
    </div>
  );
}

interface ServiceTimeCardProps {
  icon: React.ElementType;
  label: string;
  service: ChurchServiceTime;
}

function ServiceTimeCard({ icon, label, service }: ServiceTimeCardProps): JSX.Element {
  const timeDisplay = service.day ? `${service.day} ${service.time || 'Contact for time'}` : service.time || 'Contact for time';
  return (
    <InfoCard icon={icon} label={label}>
      <p className="text-white text-lg font-semibold">{timeDisplay}</p>
      {service.description && <p className="text-white/70 text-sm mt-1">{service.description}</p>}
    </InfoCard>
  );
}

interface LeadershipCardProps {
  title: string;
  leader: ChurchLeader;
  icon: React.ElementType;
  highlight?: boolean;
}

function LeadershipCard({ title, leader, icon: Icon, highlight = false }: LeadershipCardProps): JSX.Element {
  return (
    <div className={CARD_STYLES}>
      <div className="flex items-center gap-2 text-white/90 text-sm font-medium mb-2">
        <Icon className={`w-4 h-4 ${highlight ? 'text-orange-400' : ''}`} />
        <span>{title}</span>
      </div>
      <p className="text-white font-medium mb-2">{leader.name}</p>
      {leader.title && <p className="text-white/60 text-sm mb-2">{leader.title}</p>}
      <div className="space-y-1">
        {leader.phone && (
          <a
            href={`tel:${leader.phone}`}
            className="flex items-center gap-2 text-white/70 text-sm hover:text-white transition-colors"
          >
            <Phone className="w-3 h-3" />
            {leader.phone}
          </a>
        )}
        {leader.email && (
          <a
            href={`mailto:${leader.email}`}
            className="flex items-center gap-2 text-white/70 text-sm hover:text-white transition-colors"
          >
            <Mail className="w-3 h-3" />
            <span className="truncate">{leader.email}</span>
          </a>
        )}
      </div>
    </div>
  );
}

interface PageStateProps {
  message: string;
  showRefresh?: boolean;
  onRefresh?: () => void;
}

function PageState({ message, showRefresh, onRefresh }: PageStateProps): JSX.Element {
  return (
    <div className={`${GRADIENT_BG} flex items-center justify-center px-6`}>
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-12 max-w-md text-center">
        <p className="text-white text-xl mb-4">{message}</p>
        <div className="flex flex-col gap-3">
          {showRefresh && onRefresh && (
            <button
              onClick={onRefresh}
              className="inline-flex items-center justify-center gap-2 bg-white text-[#F44314] px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
          )}
          <Link
            to="/churches"
            className="inline-flex items-center justify-center gap-2 text-white/90 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Churches
          </Link>
        </div>
      </div>
    </div>
  );
}

interface ContactItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}

function ContactItem({ icon: Icon, label, value, href, external }: ContactItemProps): JSX.Element {
  const content = href ? (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="text-white hover:text-white/80 transition-colors break-all"
    >
      {value}
    </a>
  ) : (
    <p className="text-white">{value}</p>
  );

  return (
    <div>
      <div className="flex items-center gap-2 text-white/70 mb-2">
        <Icon className="w-4 h-4" />
        <span className="text-sm">{label}</span>
      </div>
      {content}
    </div>
  );
}

interface StatItemProps {
  count: number;
  singular: string;
  plural: string;
}

function StatItem({ count, singular, plural }: StatItemProps): JSX.Element {
  return (
    <div className="text-center">
      <p className="text-white text-3xl font-bold">{count}</p>
      <p className="text-white/70 text-sm">{pluralize(count, singular, plural)}</p>
    </div>
  );
}

export function ChurchDetails(): JSX.Element {
  const { id } = useParams();
  const navigate = useNavigate();
  const { church, loading, error, refetch } = useChurchDetail(id);

  if (loading) {
    return (
      <div className={`${GRADIENT_BG} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return <PageState message={error} showRefresh onRefresh={refetch} />;
  }

  if (!church) {
    return <PageState message="Church not found" />;
  }

  const imageUrl = church.primaryImage?.url || DEFAULT_CHURCH_IMAGE;
  const address = formatAddress(church.location);
  const locationShort = formatLocationShort(church.location);
  const phone = church.contact?.phone || 'Contact for details';
  const email = church.contact?.email;
  const website = church.contact?.website;
  const conferenceName =
    typeof church.conferenceId === 'object' ? church.conferenceId.name : 'Conference';

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
  const teamCount = church.metadata?.teamCount || 0;
  const serviceCount = church.metadata?.serviceCount || 0;

  const hasServiceTimes = sabbathSchool || worship || prayerMeeting || vespers || specialServices.length > 0;
  const hasFacilities = sanctuary || classrooms.length > 0 || kitchen?.available || parking;
  const hasLeadership = pastors.length > 0 || firstElder || acsCoordinator || clerk || treasurer;
  const hasOutreach = outreachFocus.length > 0 || serviceArea;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F44314] via-[#F97023] to-[#F98344]">
      {/* Hero Image Section */}
      <div className="relative h-[500px] overflow-hidden">
        <img src={imageUrl} alt={church.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 via-30% via-transparent via-70% to-[#F44314]"></div>

        {/* Back Button */}
        <div className="absolute top-24 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-6">
            <button
              onClick={() => navigate('/churches')}
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Churches
            </button>
          </div>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 pb-12">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-white text-5xl font-bold mb-4">{church.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{locationShort}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                <span>{conferenceName}</span>
              </div>
              {teamCount > 0 && (
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{teamCount} {pluralize(teamCount, 'Team', 'Teams')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Times */}
            {hasServiceTimes && (
              <div>
                <h2 className="text-white text-3xl font-semibold mb-4">Service Times</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {sabbathSchool && <ServiceTimeCard icon={Clock} label="Sabbath School" service={sabbathSchool} />}
                  {worship && <ServiceTimeCard icon={Clock} label="Worship Service" service={worship} />}
                  {prayerMeeting && <ServiceTimeCard icon={Calendar} label="Prayer Meeting" service={prayerMeeting} />}
                  {vespers && <ServiceTimeCard icon={Clock} label="Vespers" service={vespers} />}
                </div>
                {specialServices.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-white text-xl font-semibold mb-3">Special Services</h3>
                    <div className="space-y-2">
                      {specialServices.map((service, index) => (
                        <div key={index} className={CARD_STYLES}>
                          <p className="text-white font-medium">{service.name}</p>
                          {service.schedule && <p className="text-white/70 text-sm">{service.schedule}</p>}
                          {service.description && <p className="text-white/60 text-sm mt-1">{service.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Facilities */}
            {hasFacilities && (
              <div>
                <h2 className="text-white text-3xl font-semibold mb-4">Our Facilities</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {sanctuary && (
                    <InfoCard icon={Building2} label="Sanctuary">
                      {sanctuary.capacity && (
                        <p className="text-white text-lg font-semibold">{sanctuary.capacity} seats</p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {sanctuary.hasAV && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-200">
                            <Monitor className="w-3 h-3" /> A/V Equipped
                          </span>
                        )}
                        {sanctuary.hasAccessibility && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-200">
                            <Accessibility className="w-3 h-3" /> Accessible
                          </span>
                        )}
                      </div>
                    </InfoCard>
                  )}
                  {classrooms.length > 0 && (
                    <InfoCard icon={Users} label="Classrooms">
                      <p className="text-white text-lg font-semibold">{classrooms.length} rooms available</p>
                    </InfoCard>
                  )}
                  {kitchen?.available && (
                    <InfoCard icon={Utensils} label="Kitchen">
                      <p className="text-white text-lg font-semibold">Available</p>
                      {kitchen.capacity && <p className="text-white/70 text-sm">Capacity: {kitchen.capacity}</p>}
                    </InfoCard>
                  )}
                  {parking && (parking.spaces || parking.handicapSpaces) && (
                    <InfoCard icon={Car} label="Parking">
                      {parking.spaces && <p className="text-white text-lg font-semibold">{parking.spaces} spaces</p>}
                      {parking.handicapSpaces && (
                        <p className="text-white/70 text-sm">{parking.handicapSpaces} handicap spaces</p>
                      )}
                    </InfoCard>
                  )}
                </div>
                {otherFacilities.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {otherFacilities.map((facility, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-sm bg-white/10 text-white/90 border border-white/20"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Leadership */}
            {hasLeadership && (
              <div>
                <h2 className="text-white text-3xl font-semibold mb-4">Leadership Team</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {pastors.map((pastor, index) => (
                    <LeadershipCard
                      key={index}
                      title={index === 0 ? 'Pastor' : 'Associate Pastor'}
                      leader={pastor}
                      icon={User}
                    />
                  ))}
                  {firstElder && <LeadershipCard title="First Elder" leader={firstElder} icon={User} />}
                  {acsCoordinator && (
                    <LeadershipCard title="ACS Coordinator" leader={acsCoordinator} icon={Heart} highlight />
                  )}
                  {clerk && <LeadershipCard title="Church Clerk" leader={clerk} icon={User} />}
                  {treasurer && <LeadershipCard title="Treasurer" leader={treasurer} icon={User} />}
                </div>
              </div>
            )}

            {/* Outreach */}
            {hasOutreach && (
              <div>
                <h2 className="text-white text-3xl font-semibold mb-4">Community Outreach</h2>
                {outreachFocus.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-white/90 text-lg font-medium mb-3">Focus Areas</h3>
                    <div className="flex flex-wrap gap-2">
                      {outreachFocus.map((focus, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 rounded-full text-sm bg-orange-500/20 text-orange-200 border border-orange-500/30"
                        >
                          {OUTREACH_LABELS[focus] || focus}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {serviceArea && (
                  <div className={CARD_STYLES}>
                    <h3 className="text-white/90 text-lg font-medium mb-2">Service Area</h3>
                    {serviceArea.radius && <p className="text-white/70">Serving within {serviceArea.radius} miles</p>}
                    {serviceArea.communities && serviceArea.communities.length > 0 && (
                      <p className="text-white/70 mt-1">Communities: {serviceArea.communities.join(', ')}</p>
                    )}
                    {serviceArea.specialPopulations && serviceArea.specialPopulations.length > 0 && (
                      <p className="text-white/70 mt-1">Special focus: {serviceArea.specialPopulations.join(', ')}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Contact Information */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <h3 className="text-white text-xl font-semibold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <ContactItem icon={MapPin} label="Address" value={address} />
                  <ContactItem
                    icon={Phone}
                    label="Phone"
                    value={phone}
                    href={phone !== 'Contact for details' ? `tel:${phone}` : undefined}
                  />
                  {email && <ContactItem icon={Mail} label="Email" value={email} href={`mailto:${email}`} />}
                  {website && (
                    <ContactItem icon={Globe} label="Website" value={website} href={getWebsiteUrl(website)} external />
                  )}
                </div>
              </div>

              {/* Statistics */}
              {(teamCount > 0 || serviceCount > 0) && (
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <h3 className="text-white text-xl font-semibold mb-4">At a Glance</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {teamCount > 0 && <StatItem count={teamCount} singular="Team" plural="Teams" />}
                    {serviceCount > 0 && <StatItem count={serviceCount} singular="Service" plural="Services" />}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {phone !== 'Contact for details' && (
                  <a
                    href={`tel:${phone}`}
                    className="w-full block bg-white text-[#F44314] text-center py-4 rounded-xl font-semibold hover:bg-white/90 transition-colors"
                  >
                    Call Now
                  </a>
                )}
                {website && (
                  <a
                    href={getWebsiteUrl(website)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block bg-white/10 backdrop-blur-sm border border-white/20 text-white text-center py-4 rounded-xl font-semibold hover:bg-white/20 transition-colors"
                  >
                    Visit Website
                  </a>
                )}
                {church.location?.coordinates && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${church.location.coordinates.latitude},${church.location.coordinates.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block bg-white/10 backdrop-blur-sm border border-white/20 text-white text-center py-4 rounded-xl font-semibold hover:bg-white/20 transition-colors"
                  >
                    Get Directions
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
