import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Phone, Mail, Globe, Clock,
  Users, ArrowLeft, RefreshCw, Calendar,
  Building2, Car, Utensils, Monitor,
  Accessibility, Heart, User,
} from 'lucide-react';
import { usePublicChurchDetail } from '../hooks/useChurches';
import type {
  Church,
  ChurchLeader,
  ChurchServiceTime,
} from '../types/church.types';
import { JSX } from 'react';

// =============================================================================
// Pure UI constants — no business logic
// =============================================================================

const DEFAULT_CHURCH_IMAGE =
  'https://images.unsplash.com/photo-1438032005730-c779502df39b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';

const CARD_STYLES = 'bg-white border border-gray-200 shadow-sm rounded-xl p-4';

// =============================================================================
// Pure UI helpers (no data derivation)
// =============================================================================

function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

// =============================================================================
// Small UI components
// =============================================================================

interface InfoCardProps {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}
function InfoCard({ icon: Icon, label, children }: InfoCardProps): JSX.Element {
  return (
    <div className={CARD_STYLES}>
      <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-2">
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
  const timeDisplay = service.day
    ? `${service.day} ${service.time ?? 'Contact for time'}`
    : service.time ?? 'Contact for time';
  return (
    <InfoCard icon={icon} label={label}>
      <p className="text-gray-900 text-lg font-semibold">{timeDisplay}</p>
      {service.description && (
        <p className="text-gray-600 text-sm mt-1">{service.description}</p>
      )}
    </InfoCard>
  );
}

interface LeadershipCardProps {
  title:      string;
  leader:     ChurchLeader;
  icon:       React.ElementType;
  highlight?: boolean;
}
function LeadershipCard({ title, leader, icon: Icon, highlight = false }: LeadershipCardProps): JSX.Element {
  return (
    <div className={CARD_STYLES}>
      <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-2">
        <Icon className={`w-4 h-4 ${highlight ? 'text-orange-500' : ''}`} />
        <span>{title}</span>
      </div>
      <p className="text-gray-900 font-medium mb-1">{leader.name}</p>
      {leader.title && <p className="text-gray-500 text-sm mb-2">{leader.title}</p>}
      <div className="space-y-1">
        {leader.phone && (
          <a href={`tel:${leader.phone}`}
            className="flex items-center gap-2 text-gray-500 text-sm hover:text-[#F44314] transition-colors">
            <Phone className="w-3 h-3" />{leader.phone}
          </a>
        )}
        {leader.email && (
          <a href={`mailto:${leader.email}`}
            className="flex items-center gap-2 text-gray-500 text-sm hover:text-[#F44314] transition-colors">
            <Mail className="w-3 h-3" />
            <span className="truncate">{leader.email}</span>
          </a>
        )}
      </div>
    </div>
  );
}

interface ContactItemProps {
  icon:      React.ElementType;
  label:     string;
  value:     string;
  href?:     string;
  external?: boolean;
}
function ContactItem({ icon: Icon, label, value, href, external }: ContactItemProps): JSX.Element {
  const content = href ? (
    <a href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="text-[#F44314] hover:text-[#d93a10] transition-colors break-all">
      {value}
    </a>
  ) : (
    <p className="text-gray-900">{value}</p>
  );
  return (
    <div>
      <div className="flex items-center gap-2 text-gray-500 mb-1">
        <Icon className="w-4 h-4" />
        <span className="text-sm">{label}</span>
      </div>
      {content}
    </div>
  );
}

interface StatItemProps { count: number; singular: string; plural: string }
function StatItem({ count, singular, plural }: StatItemProps): JSX.Element {
  return (
    <div className="text-center">
      <p className="text-gray-900 text-3xl font-bold">{count}</p>
      <p className="text-gray-500 text-sm">{pluralize(count, singular, plural)}</p>
    </div>
  );
}

interface PageStateProps {
  message:      string;
  showRefresh?: boolean;
  onRefresh?:   () => void;
}
function PageState({ message, showRefresh, onRefresh }: PageStateProps): JSX.Element {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-12 max-w-md text-center">
        <p className="text-gray-900 text-xl mb-4">{message}</p>
        <div className="flex flex-col gap-3">
          {showRefresh && onRefresh && (
            <button onClick={onRefresh}
              className="inline-flex items-center justify-center gap-2 bg-[#F44314] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#d93a10] transition-colors">
              <RefreshCw className="w-5 h-5" /> Try Again
            </button>
          )}
          <Link to="/churches"
            className="inline-flex items-center justify-center gap-2 text-gray-600 hover:text-[#F44314] transition-colors">
            <ArrowLeft className="w-5 h-5" /> Back to Churches
          </Link>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// PAGE — renders server-provided fields only, zero data derivation
// =============================================================================

export function ChurchDetails(): JSX.Element {
  const { id } = useParams();
  const navigate = useNavigate();
  const { church, loading, error, refetch } = usePublicChurchDetail(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
      </div>
    );
  }
  if (error)   return <PageState message={error} showRefresh onRefresh={refetch} />;
  if (!church) return <PageState message="Church not found" />;

  // All display values come pre-computed from the backend
  const c = church as Church;
  const { sections, stats, contact, leadership, services, facilities, outreach } = c;

  const imageUrl     = c.primaryImage?.url ?? DEFAULT_CHURCH_IMAGE;
  const conferenceName = c.conference?.name ?? 'Conference';

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative h-[500px] overflow-hidden">
        <img src={imageUrl} alt={c.name ?? 'Church'} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 via-30% via-transparent via-70% to-white" />

        <div className="absolute top-24 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-6">
            <button onClick={() => navigate('/churches')}
              className="flex items-center gap-2 text-gray-700 hover:text-[#F44314] transition-colors bg-white border border-gray-200 shadow-sm px-4 py-2 rounded-full">
              <ArrowLeft className="w-5 h-5" /> Back to Churches
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 pb-12">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-white text-5xl font-bold mb-4">{c.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {/* locationShort is computed by the backend */}
                <span>{c.locationShort}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                <span>{conferenceName}</span>
              </div>
              {stats.teamCount > 0 && (
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{stats.teamCount} {pluralize(stats.teamCount, 'Team', 'Teams')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-12">

          {/* Main column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Service Times — only if backend says this section has data */}
            {sections.hasServiceTimes && (
              <div>
                <h2 className="text-gray-900 text-3xl font-semibold mb-4">Service Times</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {services.sabbathSchool && <ServiceTimeCard icon={Clock}    label="Sabbath School"  service={services.sabbathSchool} />}
                  {services.worship       && <ServiceTimeCard icon={Clock}    label="Worship Service" service={services.worship} />}
                  {services.prayerMeeting && <ServiceTimeCard icon={Calendar} label="Prayer Meeting"  service={services.prayerMeeting} />}
                  {services.vespers       && <ServiceTimeCard icon={Clock}    label="Vespers"         service={services.vespers} />}
                </div>
                {services.special.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h3 className="text-gray-900 text-xl font-semibold mb-3">Special Services</h3>
                    {services.special.map((s, i) => (
                      <div key={i} className={CARD_STYLES}>
                        <p className="text-gray-900 font-medium">{s.name}</p>
                        {s.schedule    && <p className="text-gray-600 text-sm">{s.schedule}</p>}
                        {s.description && <p className="text-gray-500 text-sm mt-1">{s.description}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Facilities */}
            {sections.hasFacilities && (
              <div>
                <h2 className="text-gray-900 text-3xl font-semibold mb-4">Our Facilities</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {facilities.sanctuary && (
                    <InfoCard icon={Building2} label="Sanctuary">
                      {facilities.sanctuary.capacity && (
                        <p className="text-gray-900 text-lg font-semibold">{facilities.sanctuary.capacity} seats</p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {facilities.sanctuary.hasAV && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                            <Monitor className="w-3 h-3" /> A/V Equipped
                          </span>
                        )}
                        {facilities.sanctuary.hasAccessibility && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                            <Accessibility className="w-3 h-3" /> Accessible
                          </span>
                        )}
                      </div>
                    </InfoCard>
                  )}
                  {facilities.classrooms.length > 0 && (
                    <InfoCard icon={Users} label="Classrooms">
                      <p className="text-gray-900 text-lg font-semibold">{facilities.classrooms.length} rooms available</p>
                    </InfoCard>
                  )}
                  {facilities.kitchen?.available && (
                    <InfoCard icon={Utensils} label="Kitchen">
                      <p className="text-gray-900 text-lg font-semibold">Available</p>
                      {facilities.kitchen.capacity && (
                        <p className="text-gray-600 text-sm">Capacity: {facilities.kitchen.capacity}</p>
                      )}
                    </InfoCard>
                  )}
                  {facilities.parking && (facilities.parking.spaces || facilities.parking.handicapSpaces) && (
                    <InfoCard icon={Car} label="Parking">
                      {facilities.parking.spaces && (
                        <p className="text-gray-900 text-lg font-semibold">{facilities.parking.spaces} spaces</p>
                      )}
                      {facilities.parking.handicapSpaces && (
                        <p className="text-gray-600 text-sm">{facilities.parking.handicapSpaces} handicap spaces</p>
                      )}
                    </InfoCard>
                  )}
                </div>
                {facilities.other.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {facilities.other.map((f, i) => (
                      <span key={i} className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 border border-gray-200">{f}</span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Leadership */}
            {sections.hasLeadership && (
              <div>
                <h2 className="text-gray-900 text-3xl font-semibold mb-4">Leadership Team</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {leadership.associatePastors.map((p, i) => (
                    <LeadershipCard key={i} title={i === 0 ? 'Pastor' : 'Associate Pastor'} leader={p} icon={User} />
                  ))}
                  {leadership.firstElder     && <LeadershipCard title="First Elder"    leader={leadership.firstElder}     icon={User} />}
                  {leadership.acsCoordinator && <LeadershipCard title="ACS Coordinator" leader={leadership.acsCoordinator} icon={Heart} highlight />}
                  {leadership.clerk          && <LeadershipCard title="Church Clerk"    leader={leadership.clerk}          icon={User} />}
                  {leadership.treasurer      && <LeadershipCard title="Treasurer"       leader={leadership.treasurer}      icon={User} />}
                </div>
              </div>
            )}

            {/* Outreach */}
            {sections.hasOutreach && (
              <div>
                <h2 className="text-gray-900 text-3xl font-semibold mb-4">Community Outreach</h2>
                {outreach.primaryFocus.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-gray-600 text-lg font-medium mb-3">Focus Areas</h3>
                    <div className="flex flex-wrap gap-2">
                      {/* label is already resolved by the backend — no mapping here */}
                      {outreach.primaryFocus.map((f, i) => (
                        <span key={i} className="px-4 py-2 rounded-full text-sm bg-orange-100 text-orange-700 border border-orange-200">
                          {f.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {outreach.serviceArea && (
                  <div className={CARD_STYLES}>
                    <h3 className="text-gray-600 text-lg font-medium mb-2">Service Area</h3>
                    {outreach.serviceArea.radius && (
                      <p className="text-gray-700">Serving within {outreach.serviceArea.radius} miles</p>
                    )}
                    {outreach.serviceArea.communities && outreach.serviceArea.communities.length > 0 && (
                      <p className="text-gray-600 mt-1">Communities: {outreach.serviceArea.communities.join(', ')}</p>
                    )}
                    {outreach.serviceArea.specialPopulations && outreach.serviceArea.specialPopulations.length > 0 && (
                      <p className="text-gray-600 mt-1">Special focus: {outreach.serviceArea.specialPopulations.join(', ')}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Contact — backend provides phoneDisplay and websiteDisplay */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="text-gray-900 text-xl font-semibold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <ContactItem icon={MapPin} label="Address" value={c.formattedAddress} />
                  <ContactItem
                    icon={Phone}
                    label="Phone"
                    value={contact.phoneDisplay}
                    href={contact.phone ? `tel:${contact.phone}` : undefined}
                  />
                  {contact.email && (
                    <ContactItem icon={Mail} label="Email" value={contact.email} href={`mailto:${contact.email}`} />
                  )}
                  {contact.websiteDisplay && (
                    <ContactItem icon={Globe} label="Website" value={contact.websiteDisplay} href={contact.websiteDisplay} external />
                  )}
                </div>
              </div>

              {/* Stats */}
              {(stats.teamCount > 0 || stats.serviceCount > 0) && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-gray-900 text-xl font-semibold mb-4">At a Glance</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {stats.teamCount    > 0 && <StatItem count={stats.teamCount}    singular="Team"    plural="Teams" />}
                    {stats.serviceCount > 0 && <StatItem count={stats.serviceCount} singular="Service" plural="Services" />}
                  </div>
                </div>
              )}

              {/* Actions — directionsUrl is computed by the backend */}
              <div className="space-y-3">
                {contact.phone && (
                  <a href={`tel:${contact.phone}`}
                    className="w-full block bg-[#F44314] text-white text-center py-4 rounded-xl font-semibold hover:bg-[#d93a10] transition-colors">
                    Call Now
                  </a>
                )}
                {contact.websiteDisplay && (
                  <a href={contact.websiteDisplay} target="_blank" rel="noopener noreferrer"
                    className="w-full block bg-white border border-gray-200 text-gray-700 text-center py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                    Visit Website
                  </a>
                )}
                {c.directionsUrl && (
                  <a href={c.directionsUrl} target="_blank" rel="noopener noreferrer"
                    className="w-full block bg-white border border-gray-200 text-gray-700 text-center py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
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
